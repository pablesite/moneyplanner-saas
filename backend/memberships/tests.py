from unittest.mock import patch

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import FamilyMember, Ownership, OwnershipLink, OwnershipSplit


class OwnershipUsageConstraintsTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="u1", password="pass1234")
        self.client.force_authenticate(user=self.user)

        self.m1 = FamilyMember.objects.create(user=self.user, name="Alice", role=FamilyMember.Role.ADULT, is_active=True)
        self.m2 = FamilyMember.objects.create(user=self.user, name="Bob", role=FamilyMember.Role.ADULT, is_active=True)

        self.shared = Ownership.objects.create(user=self.user, kind=Ownership.Kind.SHARED, member=None)
        OwnershipSplit.objects.create(ownership=self.shared, member=self.m1, percent="50.00")
        OwnershipSplit.objects.create(ownership=self.shared, member=self.m2, percent="50.00")

    @patch("memberships.services.ownership_is_in_use", return_value=True)
    def test_update_shared_ownership_blocked_when_in_use(self, _mock_in_use):
        response = self.client.patch(
            f"/api/ownerships/{self.shared.id}/",
            {"kind": "shared", "member": None, "splits": [{"member_id": self.m1.id, "percent": "100.00"}]},
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
        member = FamilyMember.objects.create(user=self.user, name="Carol", role=FamilyMember.Role.ADULT, is_active=True)
        Ownership.objects.create(user=self.user, kind=Ownership.Kind.INDIVIDUAL, member=member)

        response = self.client.delete(f"/api/family-members/{member.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("en uso", str(response.data).lower())


class OwnershipLinkTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="u2", password="pass1234")
        self.other = get_user_model().objects.create_user(username="u3", password="pass1234")
        self.client.force_authenticate(user=self.user)

        member = FamilyMember.objects.create(user=self.user, name="Alice", role=FamilyMember.Role.ADULT, is_active=True)
        self.own = Ownership.objects.create(user=self.user, kind=Ownership.Kind.INDIVIDUAL, member=member)
        other_member = FamilyMember.objects.create(
            user=self.other, name="Mallory", role=FamilyMember.Role.ADULT, is_active=True
        )
        self.other_own = Ownership.objects.create(user=self.other, kind=Ownership.Kind.INDIVIDUAL, member=other_member)

    def test_sync_create_update_and_remove_link(self):
        create_res = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "asset", "target_id": 10, "ownership_id": self.own.id},
            format="json",
        )
        self.assertEqual(create_res.status_code, status.HTTP_200_OK)
        self.assertTrue(OwnershipLink.objects.filter(user=self.user, target_type="asset", target_id=10).exists())

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
        self.assertFalse(OwnershipLink.objects.filter(user=self.user, target_type="asset", target_id=10).exists())

    def test_sync_rejects_foreign_ownership(self):
        response = self.client.post(
            "/api/ownership-links/sync/",
            {"target_type": "liability", "target_id": 20, "ownership_id": self.other_own.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("ownership_id", response.data)

    def test_delete_shared_ownership_blocked_when_linked_without_mock(self):
        m2 = FamilyMember.objects.create(user=self.user, name="Bob", role=FamilyMember.Role.ADULT, is_active=True)
        shared = Ownership.objects.create(user=self.user, kind=Ownership.Kind.SHARED, member=None)
        OwnershipSplit.objects.create(ownership=shared, member=self.own.member, percent="50.00")
        OwnershipSplit.objects.create(ownership=shared, member=m2, percent="50.00")
        OwnershipLink.objects.create(user=self.user, ownership=shared, target_type="asset", target_id=99)

        response = self.client.delete(f"/api/ownerships/{shared.id}/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("en uso", str(response.data).lower())


class DualApiFlowTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="u4", password="pass1234")
        self.other = get_user_model().objects.create_user(username="u5", password="pass1234")
        self.client.force_authenticate(user=self.user)

        m1 = FamilyMember.objects.create(user=self.user, name="Alice", role=FamilyMember.Role.ADULT, is_active=True)
        m2 = FamilyMember.objects.create(user=self.user, name="Bob", role=FamilyMember.Role.ADULT, is_active=True)

        self.shared = Ownership.objects.create(user=self.user, kind=Ownership.Kind.SHARED, member=None)
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
        OwnershipLink.objects.create(user=self.user, ownership=self.shared, target_type="asset", target_id=1)
        OwnershipLink.objects.create(user=self.other, ownership=self.other_individual, target_type="liability", target_id=2)

        res = self.client.get("/api/ownership-links/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["target_type"], "asset")
        self.assertEqual(res.data[0]["target_id"], 1)
        self.assertEqual(res.data[0]["ownership_id"], self.shared.id)
