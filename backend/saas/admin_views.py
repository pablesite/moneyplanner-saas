from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from saas_access.permissions import IsSaasAdmin
from saas_access.rbac_services import (
    create_admin_user,
    delete_admin_user,
    list_admin_users_with_roles,
    list_core_users_with_saas_links,
    update_admin_user_role,
    update_admin_user_status,
)

from .admin_serializers import (
    SaasAdminCoreUserSerializer,
    SaasAdminUserCreateSerializer,
    SaasAdminUserRoleSerializer,
    SaasAdminUserSerializer,
    SaasAdminUserStatusSerializer,
)


class SaasAdminUserListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    def get(self, request):
        # Keep SaaS and Core identities in one response for the unified admin view.
        users, role_by_user_id, link_by_user_id = list_admin_users_with_roles()
        saas_users = SaasAdminUserSerializer(
            users,
            many=True,
            context={"role_by_user_id": role_by_user_id, "link_by_user_id": link_by_user_id},
        )
        core_users = list_core_users_with_saas_links(
            role_by_user_id=role_by_user_id,
            link_by_user_id=link_by_user_id,
        )
        return Response(
            {
                "saas_users": saas_users.data,
                "core_users": SaasAdminCoreUserSerializer(core_users, many=True).data,
            }
        )

    def post(self, request):
        serializer = SaasAdminUserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, role = create_admin_user(
            actor_user=request.user,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
            email=serializer.validated_data.get("email", ""),
            role=serializer.validated_data["role"],
            is_active=serializer.validated_data.get("is_active", True),
        )
        out = SaasAdminUserSerializer(user, context={"role_by_user_id": {user.id: role}})
        return Response(out.data, status=status.HTTP_201_CREATED)


class SaasAdminUserRoleAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    def patch(self, request, user_id: int):
        serializer = SaasAdminUserRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, role = update_admin_user_role(
            actor_user=request.user,
            user_id=user_id,
            role=serializer.validated_data["role"],
        )
        out = SaasAdminUserSerializer(user, context={"role_by_user_id": {user.id: role}})
        return Response(out.data, status=status.HTTP_200_OK)


class SaasAdminUserStatusAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    def patch(self, request, user_id: int):
        serializer = SaasAdminUserStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, role = update_admin_user_status(
            actor_user=request.user,
            user_id=user_id,
            is_active=serializer.validated_data["is_active"],
        )
        out = SaasAdminUserSerializer(user, context={"role_by_user_id": {user.id: role}})
        return Response(out.data, status=status.HTTP_200_OK)


class SaasAdminUserDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated, IsSaasAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "saas_admin_api"

    def delete(self, request, user_id: int):
        delete_admin_user(actor_user=request.user, user_id=user_id)
        return Response(status=status.HTTP_204_NO_CONTENT)
