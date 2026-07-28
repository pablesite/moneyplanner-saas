from __future__ import annotations

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication

from saas_access.rbac_services import get_or_create_access_profile


class SaasJWTAuthentication(JWTAuthentication):
    password_change_allowed_paths = {
        "/api/auth/me/",
        "/api/auth/password/change/",
        "/api/auth/logout/",
    }

    def authenticate(self, request):
        result = super().authenticate(request)
        if result is None:
            return None
        user, token = result
        profile = get_or_create_access_profile(user=user)
        if profile.must_change_password and request.path not in self.password_change_allowed_paths:
            raise AuthenticationFailed(
                "Debes cambiar tu contraseña temporal antes de continuar.",
                code="password_change_required",
            )
        return user, token
