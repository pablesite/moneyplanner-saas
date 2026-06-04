from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from saas_access.permissions import IsSaasAdmin
from saas_access.subscription_services import get_or_create_subscription

from .auth_audit import log_auth_event
from .auth_link_views import (
    SaasCoreAccountLinkAPIView,
    SaasCoreAccountLinkFromTokenAPIView,
)
from .auth_serializers import (
    SaasCurrentUserSerializer,
    SaasRegisterSerializer,
    SaasSubscriptionSerializer,
)
from .auth_services import (
    build_auth_mode_payload,
    build_auth_ops_metrics_payload,
    build_me_payload,
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
    "SaasSubscriptionAPIView",
    "SaasAuthOpsMetricsAPIView",
]


class SaasTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_login"

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        try:
            response = super().post(request, *args, **kwargs)
        except Exception:
            log_auth_event(event="login", outcome="failed", username=username, status_code=401)
            raise

        if response.status_code < 400:
            log_auth_event(event="login", outcome="success", username=username)
        else:
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


class SaasRegisterAPIView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_register"

    def post(self, request):
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
