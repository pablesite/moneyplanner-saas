from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.test import APITestCase

from saas_access.models import SaasAccessProfile, SaasCoreAccountLink, SaasSubscription
from saas_access.rbac_services import (
    create_admin_user,
    delete_admin_user,
    get_or_create_access_profile,
    list_admin_users_with_roles,
    update_admin_user_role,
    update_admin_user_status,
)


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
        self.assertEqual(response.data["code"], "permission_denied")

    def test_admin_users_list_returns_roles(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/admin/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        by_username = {item["username"]: item for item in response.data}
        self.assertEqual(by_username["rbac_admin"]["role"], SaasAccessProfile.Role.ADMIN)
        self.assertEqual(by_username["rbac_member_user"]["role"], SaasAccessProfile.Role.MEMBER)

    def test_admin_can_create_user_with_initial_admin_role(self):
        self.client.force_authenticate(user=self.admin)
        with patch(
            "saas_access.rbac_services.ensure_primary_family_member_in_core_for_saas_user"
        ) as bootstrap:
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
        bootstrap.assert_not_called()

    def test_admin_create_member_user_creates_primary_family_member(self):
        self.client.force_authenticate(user=self.admin)
        with patch(
            "saas_access.rbac_services.ensure_primary_family_member_in_core_for_saas_user"
        ) as bootstrap:
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
        bootstrap.assert_called_once_with(user=created)

    def test_admin_create_user_rejects_duplicate_username(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/admin/users/",
            {
                "username": self.member.username,
                "password": "pass12345",
                "email": "dup@example.com",
                "role": SaasAccessProfile.Role.MEMBER,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data["details"])

    def test_admin_create_user_rollback_when_bootstrap_fails(self):
        self.client.force_authenticate(user=self.admin)
        with patch(
            "saas_access.rbac_services.ensure_primary_family_member_in_core_for_saas_user",
            side_effect=DRFValidationError({"detail": "Core down"}),
        ):
            response = self.client.post(
                "/api/admin/users/",
                {
                    "username": "member_with_bootstrap_failure",
                    "password": "pass12345",
                    "email": "bootstrap@example.com",
                    "role": SaasAccessProfile.Role.MEMBER,
                    "is_active": True,
                },
                format="json",
            )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")
        self.assertFalse(
            get_user_model().objects.filter(username="member_with_bootstrap_failure").exists()
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

    def test_admin_role_change_allows_promotion_when_another_admin_exists(self):
        other_admin = get_user_model().objects.create_superuser(
            username="other_admin",
            email="other_admin@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=other_admin)
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/admin/users/{self.member.id}/role/",
            {"role": SaasAccessProfile.Role.ADMIN},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], SaasAccessProfile.Role.ADMIN)

    def test_admin_role_change_blocks_last_admin_downgrade(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/admin/users/{self.admin.id}/role/",
            {"role": SaasAccessProfile.Role.MEMBER},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")

    def test_admin_status_change_allows_member_deactivation(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/admin/users/{self.member.id}/status/",
            {"is_active": False},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertFalse(self.member.is_active)

    def test_admin_status_change_blocks_last_admin_deactivation(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/admin/users/{self.admin.id}/status/",
            {"is_active": False},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")

    def test_admin_delete_user_emits_audit_log(self):
        self.client.force_authenticate(user=self.admin)
        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.delete(f"/api/admin/users/{self.member.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(get_user_model().objects.filter(id=self.member.id).exists())
        self.assertTrue(any('"event": "saas_admin_user_delete"' in line for line in logs.output))

    def test_admin_delete_user_cascades_related_models(self):
        subscription = SaasSubscription.objects.create(user=self.member)
        profile = get_or_create_access_profile(user=self.member)
        link = SaasCoreAccountLink.objects.create(user=self.member, core_user_ref="core-delete")
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/admin/users/{self.member.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SaasSubscription.objects.filter(pk=subscription.pk).exists())
        self.assertFalse(SaasAccessProfile.objects.filter(pk=profile.pk).exists())
        self.assertFalse(SaasCoreAccountLink.objects.filter(pk=link.pk).exists())

    def test_admin_delete_blocks_last_active_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/admin/users/{self.admin.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")

    def test_auth_ops_metrics_requires_admin_role(self):
        self.client.force_authenticate(user=self.member)
        denied = self.client.get("/api/auth/ops/metrics/")
        self.assertEqual(denied.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(denied.data["code"], "permission_denied")

        self.client.force_authenticate(user=self.admin)
        allowed = self.client.get("/api/auth/ops/metrics/")
        self.assertEqual(allowed.status_code, status.HTTP_200_OK)
        self.assertIn("rbac", allowed.data)
        self.assertIn("roles", allowed.data["rbac"])


class SaasAdminErrorShapeContractTests(APITestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_superuser(
            username="contract-admin",
            email="contract-admin@example.com",
            password="pass1234",
        )
        self.member = get_user_model().objects.create_user(
            username="contract-member",
            email="contract-member@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=self.admin)
        get_or_create_access_profile(user=self.member)

    def assert_canonical_error(self, response, *, code: str) -> None:
        self.assertEqual(set(response.data.keys()), {"code", "message", "details"})
        self.assertEqual(response.data["code"], code)
        self.assertIsInstance(response.data["message"], str)

    def test_forbidden_admin_endpoint_returns_canonical_shape(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.get("/api/admin/users/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assert_canonical_error(response, code="permission_denied")

    def test_not_found_admin_endpoint_returns_canonical_shape(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            "/api/admin/users/999999/role/",
            {"role": SaasAccessProfile.Role.MEMBER},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assert_canonical_error(response, code="not_found")


class SaasAdminServicesTests(TestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_superuser(
            username="svc_admin",
            email="svc_admin@example.com",
            password="pass1234",
        )
        self.member = get_user_model().objects.create_user(
            username="svc_member",
            email="svc_member@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=self.admin)
        get_or_create_access_profile(user=self.member)

    def test_list_admin_users_with_roles_returns_role_map(self):
        users, role_map = list_admin_users_with_roles()
        self.assertEqual(len(users), 2)
        self.assertEqual(role_map[self.admin.id], SaasAccessProfile.Role.ADMIN)
        self.assertEqual(role_map[self.member.id], SaasAccessProfile.Role.MEMBER)

    def test_create_admin_user_returns_user_and_role(self):
        with patch(
            "saas_access.rbac_services.ensure_primary_family_member_in_core_for_saas_user"
        ) as bootstrap:
            user, role = create_admin_user(
                actor_user=self.admin,
                username="svc_created",
                password="pass12345",
                email="svc_created@example.com",
                role=SaasAccessProfile.Role.MEMBER,
                is_active=True,
            )
        self.assertEqual(role, SaasAccessProfile.Role.MEMBER)
        bootstrap.assert_called_once_with(user=user)

    def test_update_admin_user_role_returns_updated_role(self):
        user, role = update_admin_user_role(
            actor_user=self.admin,
            user_id=self.member.id,
            role=SaasAccessProfile.Role.ADMIN,
        )
        self.assertEqual(user.id, self.member.id)
        self.assertEqual(role, SaasAccessProfile.Role.ADMIN)

    def test_update_admin_user_status_returns_updated_state(self):
        user, role = update_admin_user_status(
            actor_user=self.admin,
            user_id=self.member.id,
            is_active=False,
        )
        self.assertEqual(role, SaasAccessProfile.Role.MEMBER)
        self.assertFalse(user.is_active)

    def test_delete_admin_user_removes_target(self):
        delete_admin_user(actor_user=self.admin, user_id=self.member.id)
        self.assertFalse(get_user_model().objects.filter(id=self.member.id).exists())
