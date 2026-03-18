from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .exception_handler import FeatureDisabled
from .auth_serializers import (
    CoreAccountLinkFromTokenSerializer,
    CoreAccountLinkSerializer,
    CoreAccountLinkWriteSerializer,
)
from .auth_services import (
    build_me_payload,
    link_core_account,
    link_core_account_by_token,
    unlink_core_account_with_audit,
)


class SaasCoreAccountLinkAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_core_link"

    def _assert_enabled(self):
        if not getattr(settings, "ACCOUNT_LINKING_ENABLED", False):
            raise FeatureDisabled(
                message="El account linking esta deshabilitado.",
                details={"account_linking_enabled": False},
            )

    def get(self, request):
        self._assert_enabled()
        payload = build_me_payload(user=request.user)["account_link"]
        if not payload:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(payload)

    def post(self, request):
        self._assert_enabled()
        serializer = CoreAccountLinkWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        link = link_core_account(user=request.user, **serializer.validated_data)
        return Response(CoreAccountLinkSerializer(link).data, status=status.HTTP_200_OK)

    def delete(self, request):
        self._assert_enabled()
        unlink_core_account_with_audit(user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SaasCoreAccountLinkFromTokenAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth_core_link_token"

    def _assert_enabled(self):
        if not getattr(settings, "ACCOUNT_LINKING_ENABLED", False):
            raise FeatureDisabled(
                message="El account linking esta deshabilitado.",
                details={"account_linking_enabled": False},
            )
        if not getattr(settings, "CORE_LINKING_SHARED_SECRET", ""):
            raise FeatureDisabled(
                message="Core linking token deshabilitado por configuracion.",
                details={"core_linking_shared_secret": False},
            )

    def post(self, request):
        self._assert_enabled()
        serializer = CoreAccountLinkFromTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        link = link_core_account_by_token(
            user=request.user,
            link_token=serializer.validated_data["link_token"],
            shared_secret=getattr(settings, "CORE_LINKING_SHARED_SECRET", ""),
            token_max_age_seconds=int(getattr(settings, "CORE_LINKING_TOKEN_MAX_AGE_SECONDS", 300)),
        )
        return Response(CoreAccountLinkSerializer(link).data, status=status.HTTP_200_OK)
