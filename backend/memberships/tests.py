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

from .models import (
    FamilyMember,
    Ownership,
    OwnershipLink,
    OwnershipSplit,
    SaasAccessProfile,
    SaasCoreAccountLink,
    SaasSubscription,
)
from .rbac_services import assign_role, get_or_create_access_profile
from .services import sync_ownership_link, validate_ownership_payload


class OwnershipUsageConstraintsTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="u1", password="pass1234")
        self.client.force_authenticate(user=self.user)

        self.m1 = FamilyMember.objects.create(
            user=self.user, name="Alice", role=FamilyMember.Role.ADULT, is_active=True
        )
        self.m2 = FamilyMember.objects.create(
            user=self.user, name="Bob", role=FamilyMember.Role.ADULT, is_active=True
        )

        self.shared = Ownership.objects.create(
            user=self.user, kind=Ownership.Kind.SHARED, member=None
        )
        OwnershipSplit.objects.create(ownership=self.shared, member=self.m1, percent="50.00")
        OwnershipSplit.objects.create(ownership=self.shared, member=self.m2, percent="50.00")

    @patch("memberships.services.ownership_is_in_use", return_value=True)
    def test_update_shared_ownership_blocked_when_in_use(self, _mock_in_use):
        response = self.client.patch(
            f"/api/ownerships/{self.shared.id}/",
            {
                "kind": "shared",
                "member": None,
                "splits": [{"member_id": self.m1.id, "percent": "100.00"}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("en uso", str(response.data).lower())

    @patch("memberships.services.ownership_is_in_use", return_value=True)
    def test_delete_shared_ownership_blocked_when_in_use(self, _mock_in_use):
        response = self.client.delete(f"/api/ownerships/{self.shared.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("en uso", str(response.data).lower())

    @patch("memberships.services.member_is_in_use", return_value=True)
    def test_delete_member_blocked_when_in_use(self, _mock_member_in_use):
        member = FamilyMember.objects.create(
            user=self.user, name="Carol", role=FamilyMember.Role.ADULT, is_active=True
        )
        Ownership.objects.create(user=self.user, kind=Ownership.Kind.INDIVIDUAL, member=member)

        response = self.client.delete(f"/api/family-members/{member.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("en uso", str(response.data).lower())

    def test_update_individual_ownership_is_blocked(self):
        individual = Ownership.objects.create(
            user=self.user,
            kind=Ownership.Kind.INDIVIDUAL,
            member=self.m1,
        )
        response = self.client.patch(
            f"/api/ownerships/{individual.id}/",
            {"kind": "individual", "member": self.m2.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("no se puede editar", str(response.data).lower())

    def test_delete_individual_ownership_is_blocked(self):
        individual = Ownership.objects.create(
            user=self.user,
            kind=Ownership.Kind.INDIVIDUAL,
            member=self.m1,
        )
        response = self.client.delete(f"/api/ownerships/{individual.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("no se puede eliminar", str(response.data).lower())


class OwnershipLinkTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="u2", password="pass1234")
        self.other = get_user_model().objects.create_user(username="u3", password="pass1234")
        self.client.force_authenticate(user=self.user)

        member = FamilyMember.objects.create(
            user=self.user, name="Alice", role=FamilyMember.Role.ADULT, is_active=True
        )
        self.own = Ownership.objects.create(
            user=self.user, kind=Ownership.Kind.INDIVIDUAL, member=member
        )
        other_member = FamilyMember.objects.create(
            user=self.other, name="Mallory", role=FamilyMember.Role.ADULT, is_active=True
        )
        self.other_own = Ownership.objects.create(
            user=self.other, kind=Ownership.Kind.INDIVIDUAL, member=other_member
        )

    def test_sync_create_update_and_remove_link(self):
        create_res = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "asset", "target_id": 10, "ownership_id": self.own.id},
            format="json",
        )
        self.assertEqual(create_res.status_code, status.HTTP_200_OK)
        self.assertTrue(
            OwnershipLink.objects.filter(user=self.user, target_type="asset", target_id=10).exists()
        )

        update_res = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "asset", "target_id": 10, "ownership_id": self.own.id},
            format="json",
        )
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            OwnershipLink.objects.filter(user=self.user, target_type="asset", target_id=10).count(),
            1,
        )

        remove_res = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "asset", "target_id": 10, "ownership_id": None},
            format="json",
        )
        self.assertEqual(remove_res.status_code, status.HTTP_200_OK)
        self.assertFalse(
            OwnershipLink.objects.filter(user=self.user, target_type="asset", target_id=10).exists()
        )

    def test_sync_rejects_foreign_ownership(self):
        response = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "liability", "target_id": 20, "ownership_id": self.other_own.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        details = response.data.get("error", {}).get("details", response.data)
        self.assertIn("ownership_id", details)

    def test_delete_shared_ownership_blocked_when_linked_without_mock(self):
        m2 = FamilyMember.objects.create(
            user=self.user, name="Bob", role=FamilyMember.Role.ADULT, is_active=True
        )
        shared = Ownership.objects.create(user=self.user, kind=Ownership.Kind.SHARED, member=None)
        OwnershipSplit.objects.create(ownership=shared, member=self.own.member, percent="50.00")
        OwnershipSplit.objects.create(ownership=shared, member=m2, percent="50.00")
        OwnershipLink.objects.create(
            user=self.user, ownership=shared, target_type="asset", target_id=99
        )

        response = self.client.delete(f"/api/ownerships/{shared.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("en uso", str(response.data).lower())


class FamilyMemberLifecycleTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="u_members", password="pass1234")
        self.client.force_authenticate(user=self.user)

    def test_create_member_creates_individual_ownership(self):
        response = self.client.post(
            "/api/family-members/",
            {"name": "Eva", "role": FamilyMember.Role.ADULT, "is_active": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        member_id = response.data["id"]
        self.assertTrue(
            Ownership.objects.filter(
                user=self.user,
                kind=Ownership.Kind.INDIVIDUAL,
                member_id=member_id,
            ).exists()
        )

    def test_delete_member_removes_individual_ownership(self):
        member = FamilyMember.objects.create(
            user=self.user, name="Leo", role=FamilyMember.Role.ADULT, is_active=True
        )
        Ownership.objects.create(user=self.user, kind=Ownership.Kind.INDIVIDUAL, member=member)

        response = self.client.delete(f"/api/family-members/{member.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(FamilyMember.objects.filter(id=member.id).exists())
        self.assertFalse(
            Ownership.objects.filter(
                user=self.user,
                kind=Ownership.Kind.INDIVIDUAL,
                member_id=member.id,
            ).exists()
        )


class DualApiFlowTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="u4", password="pass1234")
        self.other = get_user_model().objects.create_user(username="u5", password="pass1234")
        self.client.force_authenticate(user=self.user)

        m1 = FamilyMember.objects.create(
            user=self.user, name="Alice", role=FamilyMember.Role.ADULT, is_active=True
        )
        m2 = FamilyMember.objects.create(
            user=self.user, name="Bob", role=FamilyMember.Role.ADULT, is_active=True
        )

        self.shared = Ownership.objects.create(
            user=self.user, kind=Ownership.Kind.SHARED, member=None
        )
        OwnershipSplit.objects.create(ownership=self.shared, member=m1, percent="60.00")
        OwnershipSplit.objects.create(ownership=self.shared, member=m2, percent="40.00")

        other_member = FamilyMember.objects.create(
            user=self.other, name="Mallory", role=FamilyMember.Role.ADULT, is_active=True
        )
        self.other_individual = Ownership.objects.create(
            user=self.other, kind=Ownership.Kind.INDIVIDUAL, member=other_member
        )

    def test_sync_link_toggles_is_in_use_on_ownership(self):
        before = self.client.get("/api/ownerships/")
        self.assertEqual(before.status_code, status.HTTP_200_OK)
        shared_before = next(o for o in before.data if o["id"] == self.shared.id)
        self.assertFalse(shared_before["is_in_use"])

        sync_res = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "asset", "target_id": 101, "ownership_id": self.shared.id},
            format="json",
        )
        self.assertEqual(sync_res.status_code, status.HTTP_200_OK)

        after_sync = self.client.get("/api/ownerships/")
        self.assertEqual(after_sync.status_code, status.HTTP_200_OK)
        shared_after_sync = next(o for o in after_sync.data if o["id"] == self.shared.id)
        self.assertTrue(shared_after_sync["is_in_use"])

        unsync_res = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "asset", "target_id": 101, "ownership_id": None},
            format="json",
        )
        self.assertEqual(unsync_res.status_code, status.HTTP_200_OK)

        after_unsync = self.client.get("/api/ownerships/")
        self.assertEqual(after_unsync.status_code, status.HTTP_200_OK)
        shared_after_unsync = next(o for o in after_unsync.data if o["id"] == self.shared.id)
        self.assertFalse(shared_after_unsync["is_in_use"])

    def test_list_links_is_scoped_per_user(self):
        OwnershipLink.objects.create(
            user=self.user, ownership=self.shared, target_type="asset", target_id=1
        )
        OwnershipLink.objects.create(
            user=self.other, ownership=self.other_individual, target_type="liability", target_id=2
        )

        res = self.client.get("/api/ownership-links/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["target_type"], "asset")
        self.assertEqual(res.data[0]["target_id"], 1)
        self.assertEqual(res.data[0]["ownership_id"], self.shared.id)


class OwnershipServicesUnitTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="u_services",
            password="pass1234",
        )
        self.adult = FamilyMember.objects.create(
            user=self.user,
            name="Adult",
            role=FamilyMember.Role.ADULT,
            is_active=True,
        )
        self.child = FamilyMember.objects.create(
            user=self.user,
            name="Child",
            role=FamilyMember.Role.CHILD,
            is_active=True,
        )

    def test_validate_ownership_payload_rejects_duplicate_split_members(self):
        with self.assertRaises(DRFValidationError) as err:
            validate_ownership_payload(
                user=self.user,
                kind=Ownership.Kind.SHARED,
                member=None,
                splits=[
                    {"member_id": self.adult.id, "percent": "60.00"},
                    {"member_id": self.adult.id, "percent": "40.00"},
                ],
            )

        self.assertIn("duplicados", str(err.exception).lower())

    def test_validate_ownership_payload_rejects_non_adult_split_member(self):
        with self.assertRaises(DRFValidationError) as err:
            validate_ownership_payload(
                user=self.user,
                kind=Ownership.Kind.SHARED,
                member=None,
                splits=[
                    {"member_id": self.adult.id, "percent": "50.00"},
                    {"member_id": self.child.id, "percent": "50.00"},
                ],
            )

        self.assertIn("adultos", str(err.exception).lower())

    def test_validate_ownership_payload_rejects_percent_sum_not_100(self):
        with self.assertRaises(DRFValidationError) as err:
            validate_ownership_payload(
                user=self.user,
                kind=Ownership.Kind.SHARED,
                member=None,
                splits=[
                    {"member_id": self.adult.id, "percent": "80.00"},
                ],
            )

        self.assertIn("debe ser 100", str(err.exception).lower())

    def test_sync_ownership_link_create_update_and_remove(self):
        ownership_1 = Ownership.objects.create(
            user=self.user,
            kind=Ownership.Kind.INDIVIDUAL,
            member=self.adult,
        )
        other_member = FamilyMember.objects.create(
            user=self.user,
            name="Other adult",
            role=FamilyMember.Role.ADULT,
            is_active=True,
        )
        ownership_2 = Ownership.objects.create(
            user=self.user,
            kind=Ownership.Kind.INDIVIDUAL,
            member=other_member,
        )

        create_result = sync_ownership_link(
            user=self.user,
            target_type=OwnershipLink.TargetType.ASSET,
            target_id=77,
            ownership=ownership_1,
        )
        self.assertEqual(create_result, {"ok": True, "ownership_id": ownership_1.id})
        self.assertEqual(
            OwnershipLink.objects.filter(
                user=self.user,
                target_type=OwnershipLink.TargetType.ASSET,
                target_id=77,
            ).count(),
            1,
        )

        update_result = sync_ownership_link(
            user=self.user,
            target_type=OwnershipLink.TargetType.ASSET,
            target_id=77,
            ownership=ownership_2,
        )
        self.assertEqual(update_result, {"ok": True, "ownership_id": ownership_2.id})
        self.assertEqual(
            OwnershipLink.objects.filter(
                user=self.user,
                target_type=OwnershipLink.TargetType.ASSET,
                target_id=77,
                ownership=ownership_2,
            ).count(),
            1,
        )

        remove_result = sync_ownership_link(
            user=self.user,
            target_type=OwnershipLink.TargetType.ASSET,
            target_id=77,
            ownership=None,
        )
        self.assertEqual(remove_result, {"ok": True, "ownership_id": None})
        self.assertFalse(
            OwnershipLink.objects.filter(
                user=self.user,
                target_type=OwnershipLink.TargetType.ASSET,
                target_id=77,
            ).exists()
        )


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
        self.assertTrue(get_user_model().objects.filter(username="new_user").exists())

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
        CORE_LINKING_SHARED_SECRET="test-shared-secret",
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
            key="test-shared-secret",
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
        CORE_LINKING_SHARED_SECRET="test-shared-secret",
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
            key="test-shared-secret",
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
        CORE_LINKING_SHARED_SECRET="test-shared-secret",
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
            key="test-shared-secret",
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


class SaasPremiumAccessPolicyTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="policy_user",
            password="pass1234",
            email="policy@example.com",
        )
        self.client.force_authenticate(user=self.user)

    def test_memberships_access_allowed_for_trial(self):
        response = self.client.get("/api/family-members/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_memberships_access_blocked_for_canceled(self):
        sub = SaasSubscription.objects.create(
            user=self.user, status=SaasSubscription.Status.CANCELED
        )
        response = self.client.get("/api/family-members/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        sub.refresh_from_db()
        self.assertEqual(sub.status, SaasSubscription.Status.CANCELED)

    def test_memberships_access_blocked_for_past_due(self):
        SaasSubscription.objects.create(user=self.user, status=SaasSubscription.Status.PAST_DUE)
        response = self.client.get("/api/family-members/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_memberships_access_allowed_for_active(self):
        SaasSubscription.objects.create(user=self.user, status=SaasSubscription.Status.ACTIVE)
        response = self.client.get("/api/family-members/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


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
