import os
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework.exceptions import ValidationError as DRFValidationError

from saas_access.models import SaasAccessProfile, SaasCoreAccountLink
from saas_access.permissions import (
    HasPremiumAccess,
    IsSaasAdmin,
    RbacPermissionDenied,
    SubscriptionBlocked,
    _get_user_role,
)
from saas_access.rbac_services import (
    assign_role,
    ensure_user_can_lose_admin_role,
    get_or_create_access_profile,
    has_admin_role,
)
from saas_access.subscription_services import get_or_create_subscription, has_premium_access
from saas_access.management.commands.seed import env_flag


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

    def test_has_admin_role_returns_false_for_member_without_profile(self):
        user = get_user_model().objects.create_user(
            username="member-no-profile", password="pass1234"
        )
        self.assertFalse(has_admin_role(user=user))

    def test_has_admin_role_returns_true_for_admin(self):
        user = get_user_model().objects.create_superuser(
            username="super-admin",
            email="super-admin@example.com",
            password="pass1234",
        )
        self.assertTrue(has_admin_role(user=user))

    def test_assign_role_is_idempotent_when_role_matches(self):
        user = get_user_model().objects.create_user(username="same-role", password="pass1234")
        profile = get_or_create_access_profile(user=user)
        updated = assign_role(user=user, role=SaasAccessProfile.Role.MEMBER)
        self.assertEqual(updated.pk, profile.pk)
        self.assertEqual(updated.role, SaasAccessProfile.Role.MEMBER)

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

    def test_assign_role_rejects_invalid_role(self):
        user = get_user_model().objects.create_user(username="invalid-role", password="pass1234")
        with self.assertRaises(DRFValidationError):
            assign_role(user=user, role="bad_role")

    def test_ensure_user_can_lose_admin_role_is_noop_for_member(self):
        user = get_user_model().objects.create_user(username="plain-member", password="pass1234")
        ensure_user_can_lose_admin_role(user=user)
        profile = get_or_create_access_profile(user=user)
        self.assertEqual(profile.role, SaasAccessProfile.Role.MEMBER)

    def test_ensure_user_can_lose_admin_role_allows_when_admin_inactive(self):
        admin = get_user_model().objects.create_superuser(
            username="inactive-admin",
            email="inactive-admin@example.com",
            password="pass1234",
        )
        admin.is_active = False
        admin.save(update_fields=["is_active"])
        get_or_create_access_profile(user=admin)
        ensure_user_can_lose_admin_role(user=admin)

    def test_seed_ensures_admin_has_admin_role(self):
        call_command("seed")
        admin = get_user_model().objects.get(username="admin")
        profile = get_or_create_access_profile(user=admin)
        self.assertEqual(profile.role, SaasAccessProfile.Role.ADMIN)


class SaasPermissionsAndSubscriptionTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.admin = get_user_model().objects.create_superuser(
            username="perm-admin",
            email="perm-admin@example.com",
            password="pass1234",
        )
        self.member = get_user_model().objects.create_user(
            username="perm-member",
            email="perm-member@example.com",
            password="pass1234",
        )
        self.stranger = get_user_model().objects.create_user(
            username="perm-stranger",
            email="perm-stranger@example.com",
            password="pass1234",
        )
        get_or_create_access_profile(user=self.admin)
        get_or_create_access_profile(user=self.member)

    def test_get_user_role_returns_member_role(self):
        self.assertEqual(_get_user_role(user=self.member), SaasAccessProfile.Role.MEMBER)

    def test_get_or_create_subscription_defaults_trial(self):
        subscription = get_or_create_subscription(user=self.member)
        self.assertEqual(subscription.status, "trial")

    def test_has_premium_access_is_true_for_trial(self):
        self.assertTrue(has_premium_access(user=self.member))

    def test_has_premium_access_is_false_for_past_due(self):
        subscription = get_or_create_subscription(user=self.member)
        subscription.status = "past_due"
        subscription.save(update_fields=["status"])
        self.assertFalse(has_premium_access(user=self.member))

    def test_is_saas_admin_denies_anonymous_user(self):
        request = self.factory.get("/api/admin/users/")
        request.user = type("Anonymous", (), {"is_authenticated": False})()
        self.assertFalse(IsSaasAdmin().has_permission(request, None))

    def test_is_saas_admin_allows_admin_user(self):
        request = self.factory.get("/api/admin/users/")
        request.user = self.admin
        self.assertTrue(IsSaasAdmin().has_permission(request, None))

    def test_is_saas_admin_rejects_member(self):
        request = self.factory.get("/api/admin/users/")
        request.user = self.member
        with self.assertRaisesMessage(
            RbacPermissionDenied, "No tienes permisos de administracion."
        ):
            IsSaasAdmin().has_permission(request, None)

    def test_has_premium_access_denies_anonymous_user(self):
        request = self.factory.get("/api/premium/")
        request.user = type("Anonymous", (), {"is_authenticated": False})()
        self.assertFalse(HasPremiumAccess().has_permission(request, None))

    def test_has_premium_access_allows_admin(self):
        request = self.factory.get("/api/premium/")
        request.user = self.admin
        self.assertTrue(HasPremiumAccess().has_permission(request, None))

    def test_has_premium_access_allows_member_with_trial(self):
        request = self.factory.get("/api/premium/")
        request.user = self.member
        self.assertTrue(HasPremiumAccess().has_permission(request, None))

    def test_has_premium_access_rejects_invalid_role(self):
        profile = get_or_create_access_profile(user=self.stranger)
        profile.role = "invalid-role"
        profile.save(update_fields=["role"])
        request = self.factory.get("/api/premium/")
        request.user = self.stranger
        with self.assertRaisesMessage(
            RbacPermissionDenied, "No tienes un rol SaaS valido para esta accion."
        ):
            HasPremiumAccess().has_permission(request, None)

    def test_has_premium_access_rejects_blocked_subscription(self):
        subscription = get_or_create_subscription(user=self.member)
        subscription.status = "canceled"
        subscription.save(update_fields=["status"])
        request = self.factory.get("/api/premium/")
        request.user = self.member
        with self.assertRaises(SubscriptionBlocked):
            HasPremiumAccess().has_permission(request, None)


class SeedCommandTests(TestCase):
    def test_env_flag_parses_truthy_values(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertTrue(env_flag(name="MISSING_FLAG", default="true"))

    def test_env_flag_parses_falsy_values(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertFalse(env_flag(name="MISSING_FLAG", default="0"))

    def test_seed_skips_when_disabled(self):
        with patch.dict(os.environ, {"SEED_CREATE_ADMIN": "0"}, clear=True):
            with patch("sys.stdout") as stdout:
                call_command("seed", stdout=stdout)
        self.assertFalse(get_user_model().objects.filter(username="admin").exists())

    def test_seed_aborts_when_username_empty(self):
        with patch.dict(
            os.environ,
            {"SEED_CREATE_ADMIN": "1", "SEED_ADMIN_USERNAME": "   "},
            clear=True,
        ):
            with patch("sys.stderr") as stderr:
                call_command("seed", stderr=stderr)
        self.assertFalse(get_user_model().objects.exists())

    def test_seed_updates_existing_user_flags(self):
        user = get_user_model().objects.create_user(
            username="admin",
            password="pass1234",
            email="old@example.com",
            is_staff=False,
            is_superuser=False,
        )
        with patch.dict(
            os.environ,
            {"SEED_CREATE_ADMIN": "1", "SEED_ADMIN_EMAIL": "new@example.com"},
            clear=True,
        ):
            call_command("seed")
        user.refresh_from_db()
        self.assertEqual(user.email, "new@example.com")
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_seed_force_password_resets_existing_password(self):
        get_user_model().objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="oldpass123",
        )
        with patch.dict(
            os.environ,
            {
                "SEED_CREATE_ADMIN": "1",
                "SEED_ADMIN_PASSWORD": "newpass123",
                "SEED_FORCE_ADMIN_PASSWORD": "1",
            },
            clear=True,
        ):
            call_command("seed")
        user = get_user_model().objects.get(username="admin")
        self.assertTrue(user.check_password("newpass123"))

    def test_seed_ensures_existing_admin_role(self):
        user = get_user_model().objects.create_user(
            username="admin",
            password="pass1234",
            email="admin@example.com",
            is_staff=True,
            is_superuser=True,
        )
        profile = get_or_create_access_profile(user=user)
        profile.role = SaasAccessProfile.Role.MEMBER
        profile.save(update_fields=["role"])
        with patch.dict(os.environ, {"SEED_CREATE_ADMIN": "1"}, clear=True):
            call_command("seed")
        profile = get_or_create_access_profile(user=user)
        self.assertEqual(profile.role, SaasAccessProfile.Role.ADMIN)


class SaasModelHelpersTests(TestCase):
    def test_core_account_link_str(self):
        user = get_user_model().objects.create_user(username="model-user", password="pass1234")
        link = SaasCoreAccountLink.objects.create(user=user, core_user_ref="core:1")
        self.assertEqual(str(link), f"{user.id} -> core:core:1")

    def test_subscription_premium_enabled_for_trial(self):
        user = get_user_model().objects.create_user(username="sub-trial", password="pass1234")
        subscription = get_or_create_subscription(user=user)
        self.assertTrue(subscription.is_premium_enabled())

    def test_subscription_premium_enabled_for_active(self):
        user = get_user_model().objects.create_user(username="sub-active", password="pass1234")
        subscription = get_or_create_subscription(user=user)
        subscription.status = "active"
        self.assertTrue(subscription.is_premium_enabled())

    def test_subscription_premium_disabled_for_canceled(self):
        user = get_user_model().objects.create_user(username="sub-canceled", password="pass1234")
        subscription = get_or_create_subscription(user=user)
        subscription.status = "canceled"
        self.assertFalse(subscription.is_premium_enabled())

    def test_access_profile_is_admin_for_admin_role(self):
        user = get_user_model().objects.create_user(username="profile-admin", password="pass1234")
        profile = get_or_create_access_profile(user=user)
        profile.role = SaasAccessProfile.Role.ADMIN
        self.assertTrue(profile.is_admin())

    def test_access_profile_is_admin_false_for_member_role(self):
        user = get_user_model().objects.create_user(username="profile-member", password="pass1234")
        profile = get_or_create_access_profile(user=user)
        self.assertFalse(profile.is_admin())
