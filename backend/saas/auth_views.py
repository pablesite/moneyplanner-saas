from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from memberships.models import SaasCoreAccountLink
from memberships.subscription_services import get_or_create_subscription

from .auth_serializers import (
    CoreAccountLinkSerializer,
    CoreAccountLinkWriteSerializer,
    SaasCurrentUserSerializer,
    SaasRegisterSerializer,
    SaasSubscriptionSerializer,
)
from .auth_services import create_saas_user, unlink_core_account, upsert_core_account_link


class SaasTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]


class SaasTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


class SaasRegisterAPIView(APIView):
    permission_classes = [AllowAny]

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
        link = upsert_core_account_link(user=request.user, **serializer.validated_data)
        return Response(CoreAccountLinkSerializer(link).data, status=status.HTTP_200_OK)

    def delete(self, request):
        disabled = self._assert_enabled()
        if disabled is not None:
            return disabled

        unlink_core_account(user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SaasSubscriptionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscription = get_or_create_subscription(user=request.user)
        return Response(SaasSubscriptionSerializer(subscription).data)
