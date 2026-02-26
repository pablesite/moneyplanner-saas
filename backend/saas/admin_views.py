from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from saas_access.core_bootstrap import ensure_primary_family_member_in_core_for_saas_user
from saas_access.models import SaasAccessProfile
from saas_access.permissions import IsSaasAdmin
from saas_access.rbac_services import (
    assign_role,
    ensure_user_can_lose_admin_role,
    get_or_create_access_profile,
)

from .admin_serializers import (
    SaasAdminUserCreateSerializer,
    SaasAdminUserRoleSerializer,
    SaasAdminUserSerializer,
    SaasAdminUserStatusSerializer,
)
from .auth_audit import log_auth_event


class SaasAdminUserListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    def get(self, request):
        user_model = get_user_model()
        users = list(user_model.objects.all().order_by("id"))
        roles = SaasAccessProfile.objects.filter(user_id__in=[u.id for u in users]).values_list(
            "user_id", "role"
        )
        role_by_user_id = dict(roles)
        serializer = SaasAdminUserSerializer(
            users,
            many=True,
            context={"role_by_user_id": role_by_user_id},
        )
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        serializer = SaasAdminUserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        user = get_user_model().objects.create_user(
            username=payload["username"],
            password=payload["password"],
            email=payload.get("email", ""),
            is_active=payload.get("is_active", True),
        )
        profile = assign_role(user=user, role=payload["role"])
        if profile.role == SaasAccessProfile.Role.MEMBER:
            ensure_primary_family_member_in_core_for_saas_user(user=user)
        out = SaasAdminUserSerializer(user, context={"role_by_user_id": {user.id: profile.role}})

        log_auth_event(
            event="saas_admin_user_create",
            outcome="success",
            user_id=request.user.id,
            target_user_id=user.id,
            target_role=profile.role,
            target_is_active=user.is_active,
        )
        return Response(out.data, status=status.HTTP_201_CREATED)


class SaasAdminUserRoleAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    @transaction.atomic
    def patch(self, request, user_id: int):
        serializer = SaasAdminUserRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(get_user_model(), id=user_id)

        before = get_or_create_access_profile(user=user).role
        profile = assign_role(user=user, role=serializer.validated_data["role"])
        if profile.role == SaasAccessProfile.Role.MEMBER:
            ensure_primary_family_member_in_core_for_saas_user(user=user)
        out = SaasAdminUserSerializer(user, context={"role_by_user_id": {user.id: profile.role}})

        log_auth_event(
            event="saas_admin_role_change",
            outcome="success",
            user_id=request.user.id,
            target_user_id=user.id,
            role_before=before,
            role_after=profile.role,
        )
        return Response(out.data, status=status.HTTP_200_OK)


class SaasAdminUserStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    @transaction.atomic
    def patch(self, request, user_id: int):
        serializer = SaasAdminUserStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(get_user_model(), id=user_id)

        is_active = serializer.validated_data["is_active"]
        profile = get_or_create_access_profile(user=user)
        if user.is_active and not is_active and profile.role == SaasAccessProfile.Role.ADMIN:
            ensure_user_can_lose_admin_role(user=user)

        before = user.is_active
        user.is_active = is_active
        user.save(update_fields=["is_active"])
        out = SaasAdminUserSerializer(user, context={"role_by_user_id": {user.id: profile.role}})

        log_auth_event(
            event="saas_admin_status_change",
            outcome="success",
            user_id=request.user.id,
            target_user_id=user.id,
            is_active_before=before,
            is_active_after=user.is_active,
        )
        return Response(out.data, status=status.HTTP_200_OK)


class SaasAdminUserDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    @transaction.atomic
    def delete(self, request, user_id: int):
        user = get_object_or_404(get_user_model(), id=user_id)
        profile = get_or_create_access_profile(user=user)

        if profile.role == SaasAccessProfile.Role.ADMIN and user.is_active:
            ensure_user_can_lose_admin_role(user=user)

        target_username = user.username
        target_role = profile.role
        target_is_active = user.is_active
        user.delete()

        log_auth_event(
            event="saas_admin_user_delete",
            outcome="success",
            user_id=request.user.id,
            target_user_id=user_id,
            target_username=target_username,
            target_role=target_role,
            target_is_active=target_is_active,
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
