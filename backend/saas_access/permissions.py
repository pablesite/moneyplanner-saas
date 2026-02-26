from __future__ import annotations

from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

from .models import SaasAccessProfile
from .rbac_services import get_or_create_access_profile
from .subscription_services import has_premium_access


class RbacPermissionDenied(PermissionDenied):
    default_code = "permission_denied"


class SubscriptionBlocked(PermissionDenied):
    default_code = "subscription_blocked"


def _get_user_role(*, user) -> str:
    profile = get_or_create_access_profile(user=user)
    return profile.role


class IsSaasAdmin(BasePermission):
    message = "No tienes permisos de administracion."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if user is None or not user.is_authenticated:
            return False

        if _get_user_role(user=user) != SaasAccessProfile.Role.ADMIN:
            raise RbacPermissionDenied(self.message)
        return True


class HasPremiumAccess(BasePermission):
    message = "Tu suscripcion no permite acceder a funcionalidades premium."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if user is None or not user.is_authenticated:
            return False

        role = _get_user_role(user=user)
        if role not in {SaasAccessProfile.Role.ADMIN, SaasAccessProfile.Role.MEMBER}:
            raise RbacPermissionDenied("No tienes un rol SaaS valido para esta accion.")

        if not has_premium_access(user=user):
            raise SubscriptionBlocked(self.message)
        return True

