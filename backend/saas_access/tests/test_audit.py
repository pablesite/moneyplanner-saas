from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.db import DatabaseError
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from saas_access.models import SaasAuthAuditEvent, SaasCoreAccountLink
from saas_access.rbac_services import get_or_create_access_profile


class SaasAuthAuditTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="audit_user",
            password="pass1234",
            email="audit@example.com",
        )
        self.admin = get_user_model().objects.create_superuser(
            username="audit_admin",
            email="audit_admin@example.com",
            password="pass1234",
        )
        self.member = get_user_model().objects.create_user(
            username="audit_member",
            email="audit_member@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=self.admin)
        get_or_create_access_profile(user=self.member)

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

    def test_login_failure_persists_audit_event(self):
        self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "invalid-pass"},
            format="json",
        )
        event = SaasAuthAuditEvent.objects.get(event="login", outcome="failed")
        self.assertIsNone(event.actor_user)

    def test_login_success_emits_audit_log(self):
        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.post(
                "/api/auth/token/",
                {"username": self.user.username, "password": "pass1234"},
                format="json",
            )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any('"event": "login"' in line for line in logs.output))
        self.assertTrue(any('"outcome": "success"' in line for line in logs.output))

    def test_login_success_persists_audit_event_without_password(self):
        self.client.post(
            "/api/auth/token/",
            {"username": self.user.username, "password": "pass1234"},
            format="json",
        )
        event = SaasAuthAuditEvent.objects.get(event="login", outcome="success")
        self.assertNotIn("password", event.metadata)
        self.assertEqual(event.metadata["username"], self.user.username)

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
    def test_link_failure_persists_audit_event(self):
        other = get_user_model().objects.create_user(username="other_u_db", password="pass1234")
        SaasCoreAccountLink.objects.create(user=other, core_user_ref="core-taken-db")
        self.client.force_authenticate(user=self.user)
        self.client.post(
            "/api/auth/core-link/",
            {"core_user_ref": "core-taken-db"},
            format="json",
        )
        event = SaasAuthAuditEvent.objects.get(event="core_account_link", outcome="failed")
        self.assertEqual(event.actor_user_id, self.user.id)

    @override_settings(ACCOUNT_LINKING_ENABLED=True)
    def test_unlink_emits_audit_log(self):
        self.client.force_authenticate(user=self.user)
        SaasCoreAccountLink.objects.create(user=self.user, core_user_ref="core-111")
        with self.assertLogs("auth.audit", level="INFO") as logs:
            response = self.client.delete("/api/auth/core-link/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(any('"event": "core_account_unlink"' in line for line in logs.output))
        self.assertTrue(any('"outcome": "success"' in line for line in logs.output))

    @override_settings(ACCOUNT_LINKING_ENABLED=True)
    def test_unlink_persists_had_link_metadata(self):
        self.client.force_authenticate(user=self.user)
        SaasCoreAccountLink.objects.create(user=self.user, core_user_ref="core-112")
        self.client.delete("/api/auth/core-link/")
        event = SaasAuthAuditEvent.objects.get(event="core_account_unlink", outcome="success")
        self.assertEqual(event.actor_user_id, self.user.id)
        self.assertEqual(event.metadata["had_link"], True)

    def test_admin_role_change_persists_audit_metadata(self):
        self.client.force_authenticate(user=self.admin)
        self.client.patch(
            f"/api/admin/users/{self.member.id}/role/",
            {"role": "saas_admin"},
            format="json",
        )
        event = SaasAuthAuditEvent.objects.get(event="saas_admin_role_change", outcome="success")
        self.assertEqual(event.metadata["target_user_id"], self.member.id)
        self.assertEqual(event.metadata["role_after"], "saas_admin")

    def test_admin_delete_persists_audit_metadata(self):
        self.client.force_authenticate(user=self.admin)
        self.client.delete(f"/api/admin/users/{self.member.id}/")
        event = SaasAuthAuditEvent.objects.get(event="saas_admin_user_delete", outcome="success")
        self.assertEqual(event.metadata["target_username"], "audit_member")
        self.assertEqual(event.metadata["target_role"], "saas_member")

    def test_log_auth_event_tolerates_database_errors(self):
        with patch("saas.auth_audit.SaasAuthAuditEvent.objects.create", side_effect=DatabaseError):
            with self.assertLogs("auth.audit", level="ERROR") as logs:
                self.client.post(
                    "/api/auth/token/",
                    {"username": self.user.username, "password": "invalid-pass"},
                    format="json",
                )
        self.assertTrue(any("Failed to persist auth audit event" in line for line in logs.output))
