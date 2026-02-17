from __future__ import annotations

from django.conf import settings
from django.contrib.auth import get_user_model
from django.apps import apps
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from memberships.models import SaasCoreAccountLink, SaasSubscription
from memberships.subscription_services import get_or_create_subscription

from .auth_serializers import (
    CoreAccountLinkSerializer,
    CoreAccountLinkWriteSerializer,
    SaasCurrentUserSerializer,
    SaasRegisterSerializer,
    SaasSubscriptionSerializer,
)
from .auth_services import create_saas_user, unlink_core_account, upsert_core_account_link
from .auth_audit import log_auth_event


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
        serializer = SaasRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = create_saas_user(**serializer.validated_data)
        return Response(
            {"id": user.id, "username": user.username, "email": user.email},
            status=status.HTTP_201_CREATED,
        )


class SaasAuthModeAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                "auth_mode": "saas_local",
                "auth_mode_enabled": bool(getattr(settings, "AUTH_MODE_SAAS_LOCAL", True)),
                "account_linking_enabled": bool(
                    getattr(settings, "ACCOUNT_LINKING_ENABLED", False)
                ),
            }
        )


class SaasMeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_me"

    def get(self, request):
        link = SaasCoreAccountLink.objects.filter(user=request.user).first()
        subscription = get_or_create_subscription(user=request.user)
        payload = {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email or "",
            "subscription_status": subscription.status,
            "premium_enabled": subscription.is_premium_enabled(),
            "account_link": CoreAccountLinkSerializer(link).data if link else None,
        }
        serializer = SaasCurrentUserSerializer(payload)
        return Response(serializer.data)


class SaasCoreAccountLinkAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_core_link"

    def _assert_enabled(self):
        if not getattr(settings, "ACCOUNT_LINKING_ENABLED", False):
            return Response(
                {
                    "error": {
                        "code": "feature_disabled",
                        "message": "El account linking esta deshabilitado.",
                        "details": {"account_linking_enabled": False},
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    def get(self, request):
        disabled = self._assert_enabled()
        if disabled is not None:
            return disabled

        link = SaasCoreAccountLink.objects.filter(user=request.user).first()
        if not link:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(CoreAccountLinkSerializer(link).data)

    def post(self, request):
        disabled = self._assert_enabled()
        if disabled is not None:
            return disabled

        serializer = CoreAccountLinkWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            link = upsert_core_account_link(user=request.user, **serializer.validated_data)
        except Exception:
            log_auth_event(
                event="core_account_link",
                outcome="failed",
                user_id=request.user.id,
                core_user_ref=serializer.validated_data.get("core_user_ref"),
            )
            raise

        log_auth_event(
            event="core_account_link",
            outcome="success",
            user_id=request.user.id,
            core_user_ref=link.core_user_ref,
        )
        return Response(CoreAccountLinkSerializer(link).data, status=status.HTTP_200_OK)

    def delete(self, request):
        disabled = self._assert_enabled()
        if disabled is not None:
            return disabled

        had_link = SaasCoreAccountLink.objects.filter(user=request.user).exists()
        unlink_core_account(user=request.user)
        log_auth_event(
            event="core_account_unlink",
            outcome="success",
            user_id=request.user.id,
            had_link=had_link,
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class SaasSubscriptionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_subscription"

    def get(self, request):
        subscription = get_or_create_subscription(user=request.user)
        return Response(SaasSubscriptionSerializer(subscription).data)


class SaasAuthOpsMetricsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_ops_metrics"

    def get(self, request):
        user_model = get_user_model()
        outstanding_tokens_count = 0
        if apps.is_installed("rest_framework_simplejwt.token_blacklist"):
            outstanding_model = apps.get_model("token_blacklist", "OutstandingToken")
            if outstanding_model is not None:
                outstanding_tokens_count = outstanding_model.objects.count()

        payload = {
            "service": "saas",
            "users_total": user_model.objects.count(),
            "users_active": user_model.objects.filter(is_active=True).count(),
            "jwt_outstanding_tokens": outstanding_tokens_count,
            "subscriptions": {
                status: SaasSubscription.objects.filter(status=status).count()
                for status, _label in SaasSubscription.Status.choices
            },
            "core_links_total": SaasCoreAccountLink.objects.count(),
            "auth_mode": "saas_local",
        }
        return Response(payload)
