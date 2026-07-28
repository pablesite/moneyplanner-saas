from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from saas_access.permissions import IsCoreSaasBridge, IsSaasAdmin
from saas_access.rbac_services import get_or_create_access_profile
from saas_access.subscription_services import get_or_create_subscription

from .auth_audit import log_auth_event
from .auth_security import (
    clear_login_failures,
    ensure_login_allowed,
    ensure_trusted_browser_origin,
    record_login_failure,
)
from .auth_link_views import (
    SaasCoreAccountLinkAPIView,
    SaasCoreAccountLinkFromTokenAPIView,
)
from .auth_serializers import (
    SaasCurrentUserSerializer,
    SaasInternalSessionSerializer,
    SaasPasswordChangeSerializer,
    SaasRegisterSerializer,
    SaasSubscriptionSerializer,
    SaasTokenObtainPairSerializer,
)
from .auth_services import (
    build_auth_mode_payload,
    build_auth_ops_metrics_payload,
    build_me_payload,
    change_current_user_password,
    register_saas_user,
)
from .exception_handler import RegistrationDisabled

__all__ = [
    "SaasCoreAccountLinkAPIView",
    "SaasCoreAccountLinkFromTokenAPIView",
    "SaasTokenObtainPairView",
    "SaasTokenRefreshView",
    "SaasRegisterAPIView",
    "SaasAuthModeAPIView",
    "SaasMeAPIView",
    "SaasPasswordChangeAPIView",
    "SaasLogoutAPIView",
    "SaasInternalSessionAPIView",
    "SaasSubscriptionAPIView",
    "SaasAuthOpsMetricsAPIView",
]


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        settings.AUTH_REFRESH_COOKIE_NAME,
        refresh_token,
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        path=settings.AUTH_REFRESH_COOKIE_PATH,
        secure=settings.AUTH_REFRESH_COOKIE_SECURE,
        httponly=True,
        samesite=settings.AUTH_REFRESH_COOKIE_SAMESITE,
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(
        settings.AUTH_REFRESH_COOKIE_NAME,
        path=settings.AUTH_REFRESH_COOKIE_PATH,
        samesite=settings.AUTH_REFRESH_COOKIE_SAMESITE,
    )


class SaasTokenObtainPairView(TokenObtainPairView):
    serializer_class = SaasTokenObtainPairSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"

    def post(self, request, *args, **kwargs):
        ensure_trusted_browser_origin(request)
        username = request.data.get("username", "")
        try:
            ensure_login_allowed(username=username)
        except AuthenticationFailed:
            log_auth_event(
                event="login",
                outcome="blocked",
                username=username,
                status_code=401,
            )
            raise
        try:
            response = super().post(request, *args, **kwargs)
        except Exception:
            record_login_failure(username=username)
            log_auth_event(event="login", outcome="failed", username=username, status_code=401)
            raise

        if response.status_code < 400:
            clear_login_failures(username=username)
            refresh = response.data.pop("refresh", None)
            if refresh:
                _set_refresh_cookie(response, refresh)
            log_auth_event(event="login", outcome="success", username=username)
        else:
            record_login_failure(username=username)
            log_auth_event(
                event="login",
                outcome="failed",
                username=username,
                status_code=response.status_code,
            )
        return response


class SaasTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_refresh"

    def post(self, request, *args, **kwargs):
        ensure_trusted_browser_origin(request)
        refresh = request.COOKIES.get(settings.AUTH_REFRESH_COOKIE_NAME)
        if not refresh:
            raise AuthenticationFailed("La sesión no se puede renovar.")
        data = request.data.copy()
        data["refresh"] = refresh
        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as exc:
            raise AuthenticationFailed("La sesión no se puede renovar.") from exc
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        next_refresh = response.data.pop("refresh", None)
        if next_refresh:
            _set_refresh_cookie(response, next_refresh)
        return response


class SaasRegisterAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_register"

    def post(self, request):
        ensure_trusted_browser_origin(request)
        if not settings.SAAS_PUBLIC_REGISTRATION_ENABLED:
            raise RegistrationDisabled(
                message="El registro publico esta deshabilitado para este despliegue.",
                details={"public_registration_enabled": False},
            )
        serializer = SaasRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = register_saas_user(**serializer.validated_data)
        return Response(
            {"id": user.id, "username": user.username, "email": user.email},
            status=status.HTTP_201_CREATED,
        )


class SaasAuthModeAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(build_auth_mode_payload())


class SaasMeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_me"

    def get(self, request):
        serializer = SaasCurrentUserSerializer(build_me_payload(user=request.user))
        return Response(serializer.data)


class SaasPasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_me"

    def post(self, request):
        serializer = SaasPasswordChangeSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = change_current_user_password(
                user=request.user,
                current_password=serializer.validated_data["current_password"],
                new_password=serializer.validated_data["new_password"],
            )
        except Exception:
            log_auth_event(
                event="password_change",
                outcome="failed",
                user_id=request.user.id,
                status_code=400,
            )
            raise
        refresh = RefreshToken.for_user(user)
        log_auth_event(
            event="password_change",
            outcome="success",
            user_id=user.id,
            must_change_password_cleared=True,
        )
        payload = SaasCurrentUserSerializer(build_me_payload(user=user)).data
        response = Response({**payload, "access": str(refresh.access_token)})
        _set_refresh_cookie(response, str(refresh))
        return response


class SaasLogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_refresh"

    def post(self, request):
        refresh = request.COOKIES.get(settings.AUTH_REFRESH_COOKIE_NAME)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                pass
        log_auth_event(event="logout", outcome="success", user_id=request.user.id)
        response = Response(status=status.HTTP_204_NO_CONTENT)
        _clear_refresh_cookie(response)
        return response


class SaasInternalSessionAPIView(APIView):
    permission_classes = [IsCoreSaasBridge]
    authentication_classes = []

    def post(self, request):
        serializer = SaasInternalSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        authentication = JWTAuthentication()
        try:
            token = authentication.get_validated_token(serializer.validated_data["token"])
            user = authentication.get_user(token)
        except Exception as exc:
            raise AuthenticationFailed("La sesión externa no es válida.") from exc
        profile = get_or_create_access_profile(user=user)
        return Response(
            {
                "user_id": user.id,
                "must_change_password": profile.must_change_password,
            }
        )


class SaasSubscriptionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_subscription"

    def get(self, request):
        subscription = get_or_create_subscription(user=request.user)
        return Response(SaasSubscriptionSerializer(subscription).data)


class SaasAuthOpsMetricsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_ops_metrics"

    def get(self, request):
        return Response(build_auth_ops_metrics_payload())
