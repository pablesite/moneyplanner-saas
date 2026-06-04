from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.core import signing
from django.http import Http404
from django.test import SimpleTestCase
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.exceptions import ErrorDetail, ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework.test import APITestCase
from rest_framework.throttling import SimpleRateThrottle

from saas import auth_services, exception_handler, settings as saas_settings
from saas.auth_views import (
    SaasCoreAccountLinkAPIView,
    SaasCoreAccountLinkFromTokenAPIView,
    SaasMeAPIView,
    SaasRegisterAPIView,
    SaasSubscriptionAPIView,
    SaasTokenObtainPairView,
    SaasTokenRefreshView,
)
from saas_access.models import SaasAccessProfile, SaasCoreAccountLink, SaasSubscription


class SaasAuthApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="saas_user",
            password="pass1234",
            email="saas@example.com",
        )

    def test_login_returns_access_and_refresh_tokens(self):
        response = self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "pass1234"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_rejects_invalid_credentials(self):
        response = self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "invalid-pass"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["code"], "authentication_failed")
        self.assertIn("message", response.data)

    def test_login_rejects_inactive_user(self):
        self.user.is_active = False
        self.user.save(update_fields=["is_active"])
        response = self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "pass1234"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["code"], "authentication_failed")

    def test_refresh_returns_new_access_token(self):
        token_res = self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "pass1234"},
            format="json",
        )
        response = self.client.post(
            "/api/auth/refresh/",
            {"refresh": token_res.data["refresh"]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_refresh_rejects_invalid_token(self):
        response = self.client.post(
            "/api/auth/refresh/",
            {"refresh": "invalid-refresh-token"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["code"], "authentication_failed")

    def test_register_creates_user(self):
        with patch(
            "saas.auth_services.ensure_primary_family_member_in_core_for_saas_user"
        ) as bootstrap:
            response = self.client.post(
                "/api/auth/register/",
                {
                    "username": "new_user",
                    "password": "pass12345",
                    "email": "new_user@example.com",
                },
                format="json",
            )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_user = get_user_model().objects.get(username="new_user")
        self.assertTrue(created_user is not None)
        bootstrap.assert_called_once_with(user=created_user)

    def test_register_rejects_duplicate_username(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": self.user.username,
                "password": "pass12345",
                "email": "new_user@example.com",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")
        self.assertIn("username", response.data["details"])

    def test_register_rejects_duplicate_email(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "new_user",
                "password": "pass12345",
                "email": self.user.email,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")
        self.assertIn("email", response.data["details"])

    def test_register_rejects_short_password(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "new_user",
                "password": "short",
                "email": "new_user@example.com",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")
        self.assertIn("password", response.data["details"])

    @override_settings(SAAS_PUBLIC_REGISTRATION_ENABLED=False)
    def test_register_returns_controlled_error_when_public_registration_disabled(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "blocked_user",
                "password": "pass12345",
                "email": "blocked@example.com",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "registration_disabled")
        self.assertEqual(response.data["details"]["public_registration_enabled"], False)
        self.assertFalse(get_user_model().objects.filter(username="blocked_user").exists())

    def test_auth_mode_endpoint_reports_saas_local_mode(self):
        response = self.client.get("/api/auth/mode/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["auth_mode"], "saas_local")
        self.assertIn("account_linking_enabled", response.data)
        self.assertIn("public_registration_enabled", response.data)
        self.assertIn("exit_ready", response.data)

    def test_mode_endpoint_is_public(self):
        response = self.client.get("/api/auth/mode/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me_requires_authentication(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["code"], "authentication_failed")

    def test_me_returns_current_user_payload(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["subscription_status"], SaasSubscription.Status.TRIAL)
        self.assertTrue(response.data["premium_enabled"])
        self.assertIsNone(response.data["account_link"])

    def test_me_creates_profile_and_subscription_on_demand(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(SaasAccessProfile.objects.filter(user=self.user).exists())
        self.assertTrue(SaasSubscription.objects.filter(user=self.user).exists())

    def test_me_returns_account_link_when_present(self):
        SaasCoreAccountLink.objects.create(
            user=self.user,
            core_user_ref="core-123",
            core_username="core_user",
            core_email="core@example.com",
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["account_link"]["core_user_ref"], "core-123")

    def test_subscription_requires_authentication(self):
        response = self.client.get("/api/auth/subscription/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["code"], "authentication_failed")

    def test_subscription_endpoint_returns_default_trial(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/subscription/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], SaasSubscription.Status.TRIAL)
        self.assertTrue(response.data["premium_enabled"])

    def test_auth_ops_metrics_requires_auth(self):
        response = self.client.get("/api/auth/ops/metrics/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @override_settings(
        ACCOUNT_LINKING_ENABLED=True,
        CORE_LINKING_SHARED_SECRET="test-shared-secret-32-bytes-minimum",
        CORE_LINKING_TOKEN_MAX_AGE_SECONDS=300,
    )
    def test_session_compatibility_after_linking_from_token(self):
        token_res = self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "pass1234"},
            format="json",
        )
        self.assertEqual(token_res.status_code, status.HTTP_200_OK)
        access = token_res.data["access"]
        refresh = token_res.data["refresh"]

        me_before = self.client.get("/api/auth/me/", HTTP_AUTHORIZATION=f"Bearer {access}")
        self.assertEqual(me_before.status_code, status.HTTP_200_OK)

        token = signing.dumps(
            {
                "jti": str(uuid4()),
                "core_user_ref": "core_user:session",
                "core_username": "core_session_user",
                "core_email": "core-session@example.com",
            },
            key="test-shared-secret-32-bytes-minimum",
            salt="core-link-token",
        )
        link_res = self.client.post(
            "/api/auth/core-link/from-token/",
            {"link_token": token},
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {access}",
        )
        self.assertEqual(link_res.status_code, status.HTTP_200_OK)

        me_after = self.client.get("/api/auth/me/", HTTP_AUTHORIZATION=f"Bearer {access}")
        self.assertEqual(me_after.status_code, status.HTTP_200_OK)
        self.assertEqual(me_after.data["account_link"]["core_user_ref"], "core_user:session")

        refresh_res = self.client.post(
            "/api/auth/refresh/",
            {"refresh": refresh},
            format="json",
        )
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_res.data)


class SaasAuthThrottleScopeTests(APITestCase):
    def test_login_endpoint_declares_auth_login_throttle_scope(self):
        self.assertEqual(SaasTokenObtainPairView.throttle_scope, "auth_login")

    def test_refresh_endpoint_declares_auth_refresh_throttle_scope(self):
        self.assertEqual(SaasTokenRefreshView.throttle_scope, "auth_refresh")

    def test_register_endpoint_declares_auth_register_throttle_scope(self):
        self.assertEqual(SaasRegisterAPIView.throttle_scope, "auth_register")

    def test_me_endpoint_declares_auth_me_throttle_scope(self):
        self.assertEqual(SaasMeAPIView.throttle_scope, "auth_me")

    def test_subscription_endpoint_declares_auth_subscription_throttle_scope(self):
        self.assertEqual(SaasSubscriptionAPIView.throttle_scope, "auth_subscription")

    def test_core_link_endpoint_declares_auth_core_link_throttle_scope(self):
        self.assertEqual(SaasCoreAccountLinkAPIView.throttle_scope, "auth_core_link")

    def test_core_link_from_token_endpoint_declares_auth_core_link_token_throttle_scope(self):
        self.assertEqual(SaasCoreAccountLinkFromTokenAPIView.throttle_scope, "auth_core_link_token")


class SaasAuthErrorShapeContractTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="contract-user",
            password="pass1234",
            email="contract@example.com",
        )

    def assert_canonical_error(
        self,
        response,
        *,
        code: str,
        detail_keys: set[str] | None = None,
    ) -> None:
        self.assertEqual(set(response.data.keys()), {"code", "message", "details"})
        self.assertEqual(response.data["code"], code)
        self.assertIsInstance(response.data["message"], str)
        if detail_keys is None:
            self.assertIsNone(response.data["details"])
            return
        self.assertIsInstance(response.data["details"], dict)
        self.assertTrue(detail_keys.issubset(set(response.data["details"].keys())))

    def test_login_failure_returns_canonical_shape(self):
        response = self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "bad-pass"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assert_canonical_error(response, code="authentication_failed")

    def test_register_duplicate_email_returns_canonical_shape(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "contract-new-user",
                "password": "pass12345",
                "email": self.user.email,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assert_canonical_error(response, code="validation_error", detail_keys={"email"})

    @override_settings(SAAS_PUBLIC_REGISTRATION_ENABLED=False)
    def test_register_disabled_returns_canonical_shape(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "blocked-contract-user",
                "password": "pass12345",
                "email": "blocked-contract@example.com",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assert_canonical_error(
            response,
            code="registration_disabled",
            detail_keys={"public_registration_enabled"},
        )

    def test_unauthenticated_me_returns_canonical_shape(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assert_canonical_error(response, code="authentication_failed")

    def test_method_not_allowed_returns_canonical_shape(self):
        response = self.client.get("/api/auth/register/")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assert_canonical_error(response, code="method_not_allowed")

    @override_settings(
        ACCOUNT_LINKING_ENABLED=False,
        CORE_LINKING_SHARED_SECRET="test-shared-secret-32-bytes-minimum",
    )
    def test_feature_disabled_returns_canonical_shape(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/core-link/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assert_canonical_error(
            response,
            code="feature_disabled",
            detail_keys={"account_linking_enabled"},
        )

    def test_throttled_login_returns_canonical_shape(self):
        class ContractThrottle(SimpleRateThrottle):
            scope = "auth_login"
            rate = "1/min"

            def get_cache_key(self, request, view):
                return "contract-auth-login-throttle"

        with patch.object(SaasTokenObtainPairView, "throttle_classes", [ContractThrottle]):
            first = self.client.post(
                "/api/auth/token/",
                {"username": self.user.username, "password": "pass1234"},
                format="json",
            )
            second = self.client.post(
                "/api/auth/token/",
                {"username": self.user.username, "password": "pass1234"},
                format="json",
            )
        self.assertEqual(first.status_code, status.HTTP_200_OK)
        self.assertEqual(second.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertIn("Retry-After", second.headers)
        self.assert_canonical_error(second, code="throttled")


class SaasAuthServicesTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="service-user",
            password="pass1234",
            email="service@example.com",
        )

    def test_upsert_core_account_link_creates_new_link(self):
        link = auth_services.upsert_core_account_link(
            user=self.user,
            core_user_ref="core-new",
            core_username="core_user",
            core_email="core@example.com",
        )
        self.assertEqual(link.core_user_ref, "core-new")
        self.assertTrue(SaasCoreAccountLink.objects.filter(user=self.user).exists())

    def test_upsert_core_account_link_updates_existing_link(self):
        SaasCoreAccountLink.objects.create(user=self.user, core_user_ref="core-old")
        link = auth_services.upsert_core_account_link(
            user=self.user,
            core_user_ref="core-updated",
            core_username="updated_user",
            core_email="updated@example.com",
        )
        self.assertEqual(link.core_user_ref, "core-updated")
        self.assertEqual(link.core_username, "updated_user")

    def test_upsert_core_account_link_rejects_foreign_core_user_ref(self):
        other = get_user_model().objects.create_user(username="other-link", password="pass1234")
        SaasCoreAccountLink.objects.create(user=other, core_user_ref="core-taken-service")
        with self.assertRaises(DRFValidationError):
            auth_services.upsert_core_account_link(
                user=self.user,
                core_user_ref="core-taken-service",
            )

    def test_unlink_core_account_deletes_existing_link(self):
        SaasCoreAccountLink.objects.create(user=self.user, core_user_ref="core-delete-service")
        auth_services.unlink_core_account(user=self.user)
        self.assertFalse(SaasCoreAccountLink.objects.filter(user=self.user).exists())

    def test_register_saas_user_creates_subscription_and_profile(self):
        with patch(
            "saas.auth_services.ensure_primary_family_member_in_core_for_saas_user"
        ) as bootstrap:
            user = auth_services.register_saas_user(
                username="service-register",
                password="pass12345",
                email="register@example.com",
            )
        self.assertEqual(user.username, "service-register")
        self.assertTrue(SaasSubscription.objects.filter(user=user).exists())
        self.assertTrue(SaasAccessProfile.objects.filter(user=user).exists())
        bootstrap.assert_called_once_with(user=user)

    def test_register_saas_user_rolls_back_when_bootstrap_fails(self):
        with patch(
            "saas.auth_services.ensure_primary_family_member_in_core_for_saas_user",
            side_effect=DRFValidationError({"detail": "Core down"}),
        ):
            with self.assertRaises(DRFValidationError):
                auth_services.register_saas_user(
                    username="service-register-fail",
                    password="pass12345",
                    email="register-fail@example.com",
                )
        self.assertFalse(get_user_model().objects.filter(username="service-register-fail").exists())

    def test_build_me_payload_returns_expected_fields(self):
        payload = auth_services.build_me_payload(user=self.user)
        self.assertEqual(payload["username"], self.user.username)
        self.assertEqual(payload["subscription_status"], SaasSubscription.Status.TRIAL)
        self.assertIsNone(payload["account_link"])

    def test_build_me_payload_includes_link_when_present(self):
        SaasCoreAccountLink.objects.create(
            user=self.user,
            core_user_ref="core-payload",
            core_username="core_payload_user",
        )
        payload = auth_services.build_me_payload(user=self.user)
        self.assertEqual(payload["account_link"]["core_user_ref"], "core-payload")

    def test_build_auth_mode_payload_reflects_settings(self):
        with override_settings(
            AUTH_TRANSITION_MODE="stable",
            AUTH_SESSION_COMPAT_ENABLED=True,
            AUTH_MODE_SAAS_LOCAL=True,
            ACCOUNT_LINKING_ENABLED=True,
        ):
            payload = auth_services.build_auth_mode_payload()
        self.assertEqual(payload["auth_mode"], "saas_local")
        self.assertTrue(payload["account_linking_enabled"])
        self.assertTrue(payload["exit_ready"])

    def test_link_core_account_logs_success(self):
        with self.assertLogs("auth.audit", level="INFO") as logs:
            link = auth_services.link_core_account(user=self.user, core_user_ref="core-service")
        self.assertEqual(link.core_user_ref, "core-service")
        self.assertTrue(any('"event": "core_account_link"' in line for line in logs.output))

    def test_link_core_account_by_token_logs_success(self):
        token = signing.dumps(
            {
                "jti": str(uuid4()),
                "core_user_ref": "core-token-service",
                "core_username": "core_user",
                "core_email": "core@example.com",
            },
            key="secret",
            salt="core-link-token",
        )
        with self.assertLogs("auth.audit", level="INFO") as logs:
            link = auth_services.link_core_account_by_token(
                user=self.user,
                link_token=token,
                shared_secret="secret",
                token_max_age_seconds=300,
            )
        self.assertEqual(link.core_user_ref, "core-token-service")
        self.assertTrue(
            any('"event": "core_account_link_from_token"' in line for line in logs.output)
        )

    def test_unlink_core_account_with_audit_returns_had_link(self):
        SaasCoreAccountLink.objects.create(user=self.user, core_user_ref="core-unlink-audit")
        had_link = auth_services.unlink_core_account_with_audit(user=self.user)
        self.assertTrue(had_link)
        self.assertFalse(SaasCoreAccountLink.objects.filter(user=self.user).exists())

    @override_settings(CORE_LINKING_SHARED_SECRET="test-shared-secret-32-bytes-minimum")
    def test_link_core_account_from_token_rejects_expired_signature(self):
        token = signing.dumps(
            {
                "jti": str(uuid4()),
                "core_user_ref": "core-expired",
            },
            key="test-shared-secret-32-bytes-minimum",
            salt="core-link-token",
        )
        with patch(
            "saas.auth_services.signing.loads", side_effect=signing.SignatureExpired("expired")
        ):
            with self.assertRaises(DRFValidationError):
                auth_services.link_core_account_from_token(
                    user=self.user,
                    link_token=token,
                    shared_secret="test-shared-secret-32-bytes-minimum",
                    token_max_age_seconds=300,
                )

    def test_link_core_account_from_token_rejects_missing_payload_fields(self):
        token = signing.dumps(
            {"jti": "", "core_user_ref": ""}, key="secret", salt="core-link-token"
        )
        with self.assertRaises(DRFValidationError):
            auth_services.link_core_account_from_token(
                user=self.user,
                link_token=token,
                shared_secret="secret",
                token_max_age_seconds=300,
            )


class SaasExceptionHandlerTests(SimpleTestCase):
    def test_normalize_error_details_handles_nested_values(self):
        detail = {"field": [ErrorDetail("bad", "invalid")], "other": ErrorDetail("oops", "invalid")}
        normalized = exception_handler._normalize_error_details(detail)
        self.assertEqual(normalized, {"field": ["bad"], "other": "oops"})

    def test_infer_error_code_prefers_validation_error(self):
        code = exception_handler._infer_error_code(
            status.HTTP_400_BAD_REQUEST,
            DRFValidationError({"field": "bad"}),
        )
        self.assertEqual(code, "validation_error")

    def test_infer_error_code_prefers_permission_denied_default_code(self):
        exc = type("Exc", (), {"default_code": "permission_denied"})()
        code = exception_handler._infer_error_code(status.HTTP_403_FORBIDDEN, exc)
        self.assertEqual(code, "permission_denied")

    def test_infer_error_message_uses_detail_field(self):
        self.assertEqual(
            exception_handler._infer_message(
                status.HTTP_400_BAD_REQUEST, {"detail": "bad request"}
            ),
            "bad request",
        )

    def test_infer_error_message_falls_back_for_server_error(self):
        self.assertEqual(
            exception_handler._infer_message(
                status.HTTP_500_INTERNAL_SERVER_ERROR, {"field": "bad"}
            ),
            "Unexpected server error.",
        )

    def test_custom_exception_handler_returns_none_when_drf_handler_returns_none(self):
        with patch("saas.exception_handler.exception_handler", return_value=None):
            self.assertIsNone(exception_handler.custom_exception_handler(Exception("boom"), {}))

    def test_custom_exception_handler_wraps_validation_error(self):
        drf_response = Response({"field": [ErrorDetail("bad", "invalid")]}, status=400)
        with patch("saas.exception_handler.exception_handler", return_value=drf_response):
            response = exception_handler.custom_exception_handler(
                DRFValidationError({"field": ["bad"]}),
                {},
            )
        self.assertEqual(response.data["code"], "validation_error")
        self.assertIn("message", response.data)

    def test_custom_exception_handler_wraps_not_found(self):
        drf_response = Response({"detail": ErrorDetail("Not found.", "not_found")}, status=404)
        with patch("saas.exception_handler.exception_handler", return_value=drf_response):
            response = exception_handler.custom_exception_handler(Http404(), {})
        self.assertEqual(response.data["code"], "not_found")

    def test_infer_error_code_handles_unauthorized(self):
        code = exception_handler._infer_error_code(status.HTTP_401_UNAUTHORIZED, Exception("boom"))
        self.assertEqual(code, "authentication_failed")

    def test_infer_error_code_handles_forbidden(self):
        code = exception_handler._infer_error_code(status.HTTP_403_FORBIDDEN, Exception("boom"))
        self.assertEqual(code, "permission_denied")

    def test_infer_error_code_handles_server_error(self):
        code = exception_handler._infer_error_code(
            status.HTTP_500_INTERNAL_SERVER_ERROR, Exception("boom")
        )
        self.assertEqual(code, "internal_error")

    def test_infer_error_code_handles_method_not_allowed(self):
        code = exception_handler._infer_error_code(
            status.HTTP_405_METHOD_NOT_ALLOWED, Exception("boom")
        )
        self.assertEqual(code, "method_not_allowed")

    def test_infer_error_code_handles_throttled(self):
        code = exception_handler._infer_error_code(
            status.HTTP_429_TOO_MANY_REQUESTS, Exception("boom")
        )
        self.assertEqual(code, "throttled")

    def test_infer_error_message_returns_string_as_is(self):
        self.assertEqual(
            exception_handler._infer_message(status.HTTP_400_BAD_REQUEST, "plain"), "plain"
        )

    def test_infer_error_message_returns_generic_request_failed(self):
        self.assertEqual(
            exception_handler._infer_message(status.HTTP_400_BAD_REQUEST, {"field": "bad"}),
            "Request failed.",
        )

    def test_extract_contract_details_strips_transport_keys(self):
        details = exception_handler._extract_contract_details(
            {"detail": "bad", "code": "invalid", "field": ["oops"]}
        )
        self.assertEqual(details, {"field": ["oops"]})


class SaasSettingsHelperTests(SimpleTestCase):
    def test_env_bool_accepts_truthy_values(self):
        with patch.dict("os.environ", {"FLAG": "yes"}, clear=True):
            self.assertTrue(saas_settings.env_bool("FLAG"))

    def test_env_bool_rejects_unknown_values(self):
        with patch.dict("os.environ", {"FLAG": "off"}, clear=True):
            self.assertFalse(saas_settings.env_bool("FLAG"))

    def test_env_list_splits_and_trims_values(self):
        with patch.dict("os.environ", {"LIST": "a, b , ,c"}, clear=True):
            self.assertEqual(saas_settings.env_list("LIST"), ["a", "b", "c"])

    def test_validate_secret_allows_short_value_in_debug(self):
        with patch.object(saas_settings, "DEBUG", True):
            self.assertIsNone(saas_settings.validate_secret("SECRET", "short"))

    def test_validate_secret_rejects_insecure_value_in_production(self):
        with patch.object(saas_settings, "DEBUG", False):
            with self.assertRaises(Exception):
                saas_settings.validate_secret("SECRET", saas_settings.DEFAULT_DEV_SECRET_KEY)

    def test_validate_secret_rejects_short_value_in_production(self):
        with patch.object(saas_settings, "DEBUG", False):
            with self.assertRaises(Exception):
                saas_settings.validate_secret("SECRET", "too-short", min_length=32)
