from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.core import signing
from django.core.management import call_command
from django.test import TestCase
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.test import APITestCase
from saas.auth_views import SaasTokenObtainPairView

from memberships.models import FamilyMember, Ownership
from saas_access.models import SaasAccessProfile, SaasCoreAccountLink, SaasSubscription
from saas_access.rbac_services import assign_role, get_or_create_access_profile

class SaasAuthRoadmap03ApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="saas_user",
            password="pass1234",
            email="saas@example.com",
        )

    def test_register_creates_user(self):
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
        member = FamilyMember.objects.get(user=created_user)
        self.assertEqual(member.role, FamilyMember.Role.ADULT)
        self.assertTrue(
            Ownership.objects.filter(
                user=created_user,
                kind=Ownership.Kind.INDIVIDUAL,
                member=member,
            ).exists()
        )

    def test_auth_mode_endpoint_reports_saas_local_mode(self):
        response = self.client.get("/api/auth/mode/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["auth_mode"], "saas_local")
        self.assertIn("account_linking_enabled", response.data)
        self.assertIn("exit_ready", response.data)

    def test_me_returns_current_user_payload(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["subscription_status"], SaasSubscription.Status.TRIAL)
        self.assertTrue(response.data["premium_enabled"])
        self.assertIsNone(response.data["account_link"])

    def test_core_link_endpoint_returns_400_when_disabled(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/auth/core-link/",
            {"core_user_ref": "core-123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_subscription_endpoint_returns_default_trial(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/subscription/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], SaasSubscription.Status.TRIAL)
        self.assertTrue(response.data["premium_enabled"])

    def test_auth_ops_metrics_requires_auth(self):
        response = self.client.get("/api/auth/ops/metrics/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_auth_ops_metrics_returns_saas_snapshot(self):
        self.client.force_authenticate(user=self.user)
        assign_role(user=self.user, role=SaasAccessProfile.Role.ADMIN)
        response = self.client.get("/api/auth/ops/metrics/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["service"], "saas")
        self.assertEqual(response.data["auth_mode"], "saas_local")
        self.assertIn("subscriptions", response.data)
        self.assertIn("core_links_total", response.data)

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

        me_res = self.client.get("/api/auth/me/")
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data["account_link"]["core_user_ref"], "core-123")

        delete_res = self.client.delete("/api/auth/core-link/")
        self.assertEqual(delete_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SaasCoreAccountLink.objects.filter(user=self.user).exists())

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
        jti = str(uuid4())
        token = signing.dumps(
            {
                "jti": jti,
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
        details = second.data.get("error", {}).get("details", second.data)
        self.assertIn("link_token", details)

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


class SaasAuthAuditAndThrottleTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="audit_user",
            password="pass1234",
            email="audit@example.com",
        )

    def test_login_failure_emits_audit_log(self):
        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.post(
                "/api/auth/token/",
                {"username": self.user.username, "password": "invalid-pass"},
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(any('"event": "login"' in line for line in logs.output))
        self.assertTrue(any('"outcome": "failed"' in line for line in logs.output))

    @override_settings(ACCOUNT_LINKING_ENABLED=True)
    def test_link_failure_emits_audit_log(self):
        other = get_user_model().objects.create_user(username="other_u", password="pass1234")
        SaasCoreAccountLink.objects.create(user=other, core_user_ref="core-taken")
        self.client.force_authenticate(user=self.user)

        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.post(
                "/api/auth/core-link/",
                {"core_user_ref": "core-taken"},
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(any('"event": "core_account_link"' in line for line in logs.output))
        self.assertTrue(any('"outcome": "failed"' in line for line in logs.output))

    @override_settings(ACCOUNT_LINKING_ENABLED=True)
    def test_unlink_emits_audit_log(self):
        self.client.force_authenticate(user=self.user)
        SaasCoreAccountLink.objects.create(user=self.user, core_user_ref="core-111")

        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.delete("/api/auth/core-link/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(any('"event": "core_account_unlink"' in line for line in logs.output))
        self.assertTrue(any('"outcome": "success"' in line for line in logs.output))

    def test_login_endpoint_declares_auth_login_throttle_scope(self):
        self.assertEqual(SaasTokenObtainPairView.throttle_scope, "auth_login")


class SaasAdminUsersApiTests(APITestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_superuser(
            username="rbac_admin",
            email="rbac_admin@example.com",
            password="pass1234",
        )
        self.member = get_user_model().objects.create_user(
            username="rbac_member_user",
            email="rbac_member_user@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=self.admin)
        get_or_create_access_profile(user=self.member)

    def test_admin_users_list_requires_admin_role(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.get("/api/admin/users/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["error"]["code"], "permission_denied")

    def test_admin_users_list_returns_roles(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/admin/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        by_username = {item["username"]: item for item in response.data}
        self.assertEqual(by_username["rbac_admin"]["role"], SaasAccessProfile.Role.ADMIN)
        self.assertEqual(by_username["rbac_member_user"]["role"], SaasAccessProfile.Role.MEMBER)

    def test_admin_can_create_user_with_initial_role(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/admin/users/",
            {
                "username": "new_from_admin",
                "password": "pass12345",
                "email": "new_from_admin@example.com",
                "role": SaasAccessProfile.Role.ADMIN,
                "is_active": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created = get_user_model().objects.get(username="new_from_admin")
        profile = get_or_create_access_profile(user=created)
        self.assertEqual(profile.role, SaasAccessProfile.Role.ADMIN)
        self.assertFalse(FamilyMember.objects.filter(user=created).exists())

    def test_admin_create_member_user_creates_primary_family_member(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/admin/users/",
            {
                "username": "new_member_user",
                "password": "pass12345",
                "email": "new_member_user@example.com",
                "role": SaasAccessProfile.Role.MEMBER,
                "is_active": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created = get_user_model().objects.get(username="new_member_user")
        member = FamilyMember.objects.get(user=created)
        self.assertEqual(member.role, FamilyMember.Role.ADULT)
        self.assertTrue(
            Ownership.objects.filter(
                user=created,
                kind=Ownership.Kind.INDIVIDUAL,
                member=member,
            ).exists()
        )

    def test_admin_role_change_emits_audit_log(self):
        self.client.force_authenticate(user=self.admin)
        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.patch(
                f"/api/admin/users/{self.member.id}/role/",
                {"role": SaasAccessProfile.Role.ADMIN},
                format="json",
            )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any('"event": "saas_admin_role_change"' in line for line in logs.output))

    def test_admin_role_change_blocks_last_admin_downgrade(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/admin/users/{self.admin.id}/role/",
            {"role": SaasAccessProfile.Role.MEMBER},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["code"], "validation_error")

    def test_admin_status_change_blocks_last_admin_deactivation(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/admin/users/{self.admin.id}/status/",
            {"is_active": False},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["code"], "validation_error")

    def test_admin_delete_user_emits_audit_log(self):
        self.client.force_authenticate(user=self.admin)
        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.delete(f"/api/admin/users/{self.member.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(get_user_model().objects.filter(id=self.member.id).exists())
        self.assertTrue(any('"event": "saas_admin_user_delete"' in line for line in logs.output))

    def test_admin_delete_blocks_last_active_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/admin/users/{self.admin.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"]["code"], "validation_error")

    def test_auth_ops_metrics_requires_admin_role(self):
        self.client.force_authenticate(user=self.member)
        denied = self.client.get("/api/auth/ops/metrics/")
        self.assertEqual(denied.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(denied.data["error"]["code"], "permission_denied")

        self.client.force_authenticate(user=self.admin)
        allowed = self.client.get("/api/auth/ops/metrics/")
        self.assertEqual(allowed.status_code, status.HTTP_200_OK)
        self.assertIn("rbac", allowed.data)
        self.assertIn("roles", allowed.data["rbac"])


class SaasRbacServicesTests(TestCase):
    def test_get_or_create_access_profile_defaults_member(self):
        user = get_user_model().objects.create_user(username="rbac_member", password="pass1234")
        profile = get_or_create_access_profile(user=user)
        self.assertEqual(profile.role, SaasAccessProfile.Role.MEMBER)

    def test_get_or_create_access_profile_defaults_admin_for_superuser(self):
        user = get_user_model().objects.create_superuser(
            username="rbac_super",
            email="rbac_super@example.com",
            password="pass1234",
        )
        profile = get_or_create_access_profile(user=user)
        self.assertEqual(profile.role, SaasAccessProfile.Role.ADMIN)

    def test_assign_role_blocks_downgrade_of_last_active_admin(self):
        admin = get_user_model().objects.create_superuser(
            username="only_admin",
            email="only_admin@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=admin)

        with self.assertRaises(DRFValidationError):
            assign_role(user=admin, role=SaasAccessProfile.Role.MEMBER)

    def test_assign_role_allows_downgrade_when_other_admin_exists(self):
        first = get_user_model().objects.create_superuser(
            username="first_admin",
            email="first_admin@example.com",
            password="pass1234",
        )
        second = get_user_model().objects.create_superuser(
            username="second_admin",
            email="second_admin@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=first)
        get_or_create_access_profile(user=second)

        updated = assign_role(user=first, role=SaasAccessProfile.Role.MEMBER)
        self.assertEqual(updated.role, SaasAccessProfile.Role.MEMBER)

    def test_seed_ensures_admin_has_admin_role(self):
        call_command("seed")
        admin = get_user_model().objects.get(username="admin")
        profile = get_or_create_access_profile(user=admin)
        self.assertEqual(profile.role, SaasAccessProfile.Role.ADMIN)
