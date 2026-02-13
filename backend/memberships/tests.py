from unittest.mock import patch

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import FamilyMember, Ownership, OwnershipSplit


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
