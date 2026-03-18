from unittest.mock import patch
from uuid import uuid4
from urllib import error

from django.contrib.auth import get_user_model
from django.core import signing
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.test import APITestCase

from saas_access import core_bootstrap
from saas_access.models import SaasCoreAccountLink
from saas_access.rbac_services import get_or_create_access_profile


class SaasBootstrapAndLinkApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="link_user",
            password="pass1234",
            email="link@example.com",
        )
        self.admin = get_user_model().objects.create_superuser(
            username="bootstrap_admin",
            email="bootstrap_admin@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=self.admin)

    def test_core_link_endpoint_returns_400_when_disabled(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/auth/core-link/",
            {"core_user_ref": "core-123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["code"], "feature_disabled")
        self.assertEqual(response.data["error"]["details"]["account_linking_enabled"], False)

    def test_core_link_get_returns_400_when_disabled(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/core-link/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["details"]["account_linking_enabled"], False)

    @override_settings(ACCOUNT_LINKING_ENABLED=True)
    def test_core_link_create_and_delete_when_enabled(self):
        self.client.force_authenticate(user=self.user)
        create_res = self.client.post(
            "/api/auth/core-link/",
            {
                "core_user_ref": "core-123",
                "core_username": "core_user",
                "core_email": "core@example.com",
            },
            format="json",
        )
        self.assertEqual(create_res.status_code, status.HTTP_200_OK)
        self.assertTrue(SaasCoreAccountLink.objects.filter(user=self.user).exists())

        get_res = self.client.get("/api/auth/core-link/")
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data["core_user_ref"], "core-123")

        delete_res = self.client.delete("/api/auth/core-link/")
        self.assertEqual(delete_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SaasCoreAccountLink.objects.filter(user=self.user).exists())

    @override_settings(ACCOUNT_LINKING_ENABLED=True)
    def test_core_link_delete_without_previous_link_is_noop(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/api/auth/core-link/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SaasCoreAccountLink.objects.filter(user=self.user).exists())

    @override_settings(ACCOUNT_LINKING_ENABLED=True)
    def test_core_link_rejects_core_user_ref_taken_by_other_user(self):
        other = get_user_model().objects.create_user(username="other", password="pass1234")
        SaasCoreAccountLink.objects.create(user=other, core_user_ref="core-taken")
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/auth/core-link/",
            {"core_user_ref": "core-taken"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("core_user_ref", response.data["error"]["details"])

    @override_settings(
        ACCOUNT_LINKING_ENABLED=True,
        CORE_LINKING_SHARED_SECRET="test-shared-secret-32-bytes-minimum",
        CORE_LINKING_TOKEN_MAX_AGE_SECONDS=300,
    )
    def test_core_link_from_token_creates_link(self):
        self.client.force_authenticate(user=self.user)
        token = signing.dumps(
            {
                "jti": str(uuid4()),
                "core_user_ref": "core_user:42",
                "core_username": "core_admin",
                "core_email": "core@example.com",
            },
            key="test-shared-secret-32-bytes-minimum",
            salt="core-link-token",
        )

        response = self.client.post(
            "/api/auth/core-link/from-token/",
            {"link_token": token},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["core_user_ref"], "core_user:42")
        self.assertTrue(SaasCoreAccountLink.objects.filter(user=self.user).exists())

    @override_settings(
        ACCOUNT_LINKING_ENABLED=True,
        CORE_LINKING_SHARED_SECRET="test-shared-secret-32-bytes-minimum",
        CORE_LINKING_TOKEN_MAX_AGE_SECONDS=300,
    )
    def test_core_link_from_token_rejects_replay(self):
        self.client.force_authenticate(user=self.user)
        token = signing.dumps(
            {
                "jti": str(uuid4()),
                "core_user_ref": "core_user:99",
                "core_username": "core_user",
                "core_email": "core99@example.com",
            },
            key="test-shared-secret-32-bytes-minimum",
            salt="core-link-token",
        )

        first = self.client.post(
            "/api/auth/core-link/from-token/",
            {"link_token": token},
            format="json",
        )
        second = self.client.post(
            "/api/auth/core-link/from-token/",
            {"link_token": token},
            format="json",
        )

        self.assertEqual(first.status_code, status.HTTP_200_OK)
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("link_token", second.data["error"]["details"])

    @override_settings(
        ACCOUNT_LINKING_ENABLED=True,
        CORE_LINKING_SHARED_SECRET="test-shared-secret-32-bytes-minimum",
        CORE_LINKING_TOKEN_MAX_AGE_SECONDS=300,
    )
    def test_core_link_from_token_rejects_invalid_signature(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/auth/core-link/from-token/",
            {"link_token": "not-a-valid-token"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("link_token", response.data["error"]["details"])

    @override_settings(
        ACCOUNT_LINKING_ENABLED=True,
        CORE_LINKING_SHARED_SECRET="test-shared-secret-32-bytes-minimum",
        CORE_LINKING_TOKEN_MAX_AGE_SECONDS=300,
    )
    def test_core_link_from_token_rejects_core_user_ref_taken_by_other_user(self):
        other = get_user_model().objects.create_user(username="other-token", password="pass1234")
        SaasCoreAccountLink.objects.create(user=other, core_user_ref="core_user:42")
        self.client.force_authenticate(user=self.user)
        token = signing.dumps(
            {
                "jti": str(uuid4()),
                "core_user_ref": "core_user:42",
                "core_username": "core_admin",
                "core_email": "core@example.com",
            },
            key="test-shared-secret-32-bytes-minimum",
            salt="core-link-token",
        )
        response = self.client.post(
            "/api/auth/core-link/from-token/",
            {"link_token": token},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("core_user_ref", response.data["error"]["details"])

    @override_settings(ACCOUNT_LINKING_ENABLED=True, CORE_LINKING_SHARED_SECRET="")
    def test_core_link_from_token_returns_400_when_secret_missing(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/auth/core-link/from-token/",
            {"link_token": "unused"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["details"]["core_linking_shared_secret"], False)

    def test_register_rolls_back_when_bootstrap_fails(self):
        with patch(
            "saas.auth_services.ensure_primary_family_member_in_core_for_saas_user",
            side_effect=DRFValidationError({"detail": "Core down"}),
        ):
            response = self.client.post(
                "/api/auth/register/",
                {
                    "username": "rollback_user",
                    "password": "pass12345",
                    "email": "rollback@example.com",
                },
                format="json",
            )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(get_user_model().objects.filter(username="rollback_user").exists())

    def test_admin_create_member_rolls_back_when_bootstrap_fails(self):
        self.client.force_authenticate(user=self.admin)
        with patch(
            "saas_access.rbac_services.ensure_primary_family_member_in_core_for_saas_user",
            side_effect=DRFValidationError({"detail": "Core down"}),
        ):
            response = self.client.post(
                "/api/admin/users/",
                {
                    "username": "rollback_admin_user",
                    "password": "pass12345",
                    "email": "rollback_admin@example.com",
                    "role": "saas_member",
                },
                format="json",
            )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(get_user_model().objects.filter(username="rollback_admin_user").exists())


class CoreBootstrapHelperTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="bootstrap-helper",
            password="pass1234",
            email="bootstrap-helper@example.com",
        )

    @override_settings(CORE_API_BASE_URL="http://core.example.com/")
    def test_core_api_base_url_strips_trailing_slash(self):
        self.assertEqual(core_bootstrap._core_api_base_url(), "http://core.example.com")

    @override_settings(CORE_API_BASE_URL="   ")
    def test_core_api_base_url_requires_config(self):
        with self.assertRaises(DRFValidationError):
            core_bootstrap._core_api_base_url()

    @override_settings(CORE_BOOTSTRAP_TIMEOUT_SECONDS="2.5")
    def test_core_bootstrap_timeout_casts_to_float(self):
        self.assertEqual(core_bootstrap._core_bootstrap_timeout_seconds(), 2.5)

    @override_settings(CORE_BOOTSTRAP_TIMEOUT_SECONDS="bad")
    def test_core_bootstrap_timeout_rejects_invalid_value(self):
        with self.assertRaises(DRFValidationError):
            core_bootstrap._core_bootstrap_timeout_seconds()

    @patch("saas_access.core_bootstrap.AccessToken.for_user", return_value="abc123")
    def test_auth_headers_for_user_builds_bearer_headers(self, _token):
        headers = core_bootstrap._auth_headers_for_user(user=self.user)
        self.assertEqual(headers["Authorization"], "Bearer abc123")
        self.assertEqual(headers["Accept"], "application/json")
        self.assertEqual(headers["Content-Type"], "application/json")

    @override_settings(CORE_BOOTSTRAP_TIMEOUT_SECONDS=3)
    @patch("saas_access.core_bootstrap.request.urlopen")
    def test_http_json_request_returns_status_and_parsed_body(self, urlopen):
        response = urlopen.return_value.__enter__.return_value
        response.status = 200
        response.read.return_value = b'{"ok": true}'
        status_code, payload = core_bootstrap._http_json_request(
            method="POST",
            url="http://core/api/test/",
            headers={"Authorization": "Bearer token"},
            payload={"a": 1},
        )
        self.assertEqual(status_code, 200)
        self.assertEqual(payload, {"ok": True})

    @override_settings(CORE_BOOTSTRAP_TIMEOUT_SECONDS=3)
    @patch("saas_access.core_bootstrap.request.urlopen")
    def test_http_json_request_returns_none_for_empty_body(self, urlopen):
        response = urlopen.return_value.__enter__.return_value
        response.status = 200
        response.read.return_value = b""
        status_code, payload = core_bootstrap._http_json_request(
            method="POST",
            url="http://core/api/test/",
            headers={"Authorization": "Bearer token"},
            payload=None,
        )
        self.assertEqual(status_code, 200)
        self.assertIsNone(payload)

    @patch("saas_access.core_bootstrap.request.urlopen")
    def test_http_json_request_handles_http_error_with_json_body(self, urlopen):
        http_error = error.HTTPError(
            url="http://core/api/test/",
            code=503,
            msg="down",
            hdrs=None,
            fp=None,
        )
        http_error.read = lambda: b'{"detail":"down"}'
        urlopen.side_effect = http_error
        with self.assertRaises(DRFValidationError) as ctx:
            core_bootstrap._http_json_request(
                method="POST",
                url="http://core/api/test/",
                headers={"Authorization": "Bearer token"},
                payload={},
            )
        self.assertEqual(str(ctx.exception.detail["core_status"]), "503")
        self.assertEqual(ctx.exception.detail["core_response"], {"detail": "down"})

    @patch("saas_access.core_bootstrap.request.urlopen")
    def test_http_json_request_handles_http_error_with_raw_body(self, urlopen):
        http_error = error.HTTPError(
            url="http://core/api/test/",
            code=500,
            msg="boom",
            hdrs=None,
            fp=None,
        )
        http_error.read = lambda: b"<html>boom</html>"
        urlopen.side_effect = http_error
        with self.assertRaises(DRFValidationError) as ctx:
            core_bootstrap._http_json_request(
                method="POST",
                url="http://core/api/test/",
                headers={"Authorization": "Bearer token"},
                payload={},
            )
        self.assertEqual(ctx.exception.detail["core_response"], {"raw": "<html>boom</html>"})

    @patch("saas_access.core_bootstrap.request.urlopen", side_effect=error.URLError("down"))
    def test_http_json_request_handles_connection_error(self, _urlopen):
        with self.assertRaises(DRFValidationError):
            core_bootstrap._http_json_request(
                method="POST",
                url="http://core/api/test/",
                headers={"Authorization": "Bearer token"},
                payload={},
            )

    @patch("saas_access.core_bootstrap._http_json_request", return_value=(200, {"ok": True}))
    @patch(
        "saas_access.core_bootstrap._auth_headers_for_user",
        return_value={"Authorization": "Bearer token"},
    )
    @patch("saas_access.core_bootstrap._core_api_base_url", return_value="http://core.example.com")
    def test_ensure_primary_family_member_calls_expected_endpoint(
        self, _base_url, _headers, http_request
    ):
        core_bootstrap.ensure_primary_family_member_in_core_for_saas_user(user=self.user)
        http_request.assert_called_once_with(
            method="POST",
            url="http://core.example.com/api/family-members/ensure-primary/",
            headers={"Authorization": "Bearer token"},
            payload={},
        )

    @patch("saas_access.core_bootstrap._http_json_request", return_value=(202, {"ok": True}))
    @patch(
        "saas_access.core_bootstrap._auth_headers_for_user",
        return_value={"Authorization": "Bearer token"},
    )
    @patch("saas_access.core_bootstrap._core_api_base_url", return_value="http://core.example.com")
    def test_ensure_primary_family_member_rejects_unexpected_status(
        self, _base_url, _headers, _http_request
    ):
        with self.assertRaises(DRFValidationError):
            core_bootstrap.ensure_primary_family_member_in_core_for_saas_user(user=self.user)
