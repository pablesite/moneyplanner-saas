from __future__ import annotations

from rest_framework.permissions import BasePermission

from .subscription_services import has_premium_access


class HasPremiumAccess(BasePermission):
    message = "Tu suscripcion no permite acceder a funcionalidades premium."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if user is None or not user.is_authenticated:
            return False
        return has_premium_access(user=user)
