from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from saas.auth_serializers import CoreAccountLinkSerializer
from saas_access.models import SaasAccessProfile, SaasCoreAccountLink
from saas_access.rbac_services import get_or_create_access_profile


class SaasAdminUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    account_link = serializers.SerializerMethodField()
    core_user_origin = serializers.SerializerMethodField()
    core_connection = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "email",
            "is_active",
            "role",
            "account_link",
            "core_user_origin",
            "core_connection",
        ]

    def get_role(self, obj) -> str:
        role_by_user_id = self.context.get("role_by_user_id", {})
        if obj.id in role_by_user_id:
            return role_by_user_id[obj.id]
        return get_or_create_access_profile(user=obj).role

    def _get_account_link(self, obj) -> SaasCoreAccountLink | None:
        link_by_user_id = self.context.get("link_by_user_id", {})
        if obj.id in link_by_user_id:
            return link_by_user_id[obj.id]
        return SaasCoreAccountLink.objects.filter(user=obj).first()

    def get_account_link(self, obj):
        link = self._get_account_link(obj)
        if link is None:
            return None
        return CoreAccountLinkSerializer(link).data

    def get_core_user_origin(self, obj) -> str | None:
        link = self._get_account_link(obj)
        if link is None:
            return None
        if str(link.core_user_ref).startswith("core_user:"):
            return "core_native"
        return "manual_link"

    def get_core_connection(self, obj) -> dict[str, object] | None:
        link = self._get_account_link(obj)
        role = self.get_role(obj)
        if link is not None:
            origin = self.get_core_user_origin(obj) or "manual_link"
            return {
                "status": origin,
                "label": "Usuario Core" if origin == "core_native" else "Vinculo manual",
                "core_user_ref": link.core_user_ref,
                "core_username": link.core_username,
                "core_email": link.core_email,
                "is_manual": origin == "manual_link",
            }
        if role == SaasAccessProfile.Role.MEMBER:
            return {
                "status": "member_bootstrap",
                "label": "Provisionado en Core",
                "core_user_ref": f"external:{obj.id}",
                "core_username": f"external_user_{obj.id}",
                "core_email": "",
                "is_manual": False,
            }
        return None


class SaasAdminLinkedUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.CharField()
    is_active = serializers.BooleanField()
    role = serializers.ChoiceField(choices=SaasAccessProfile.Role.choices)


class SaasAdminCoreUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.CharField(allow_blank=True)
    is_active = serializers.BooleanField()
    is_staff = serializers.BooleanField()
    origin = serializers.ChoiceField(choices=["core_native", "saas_bootstrap"])
    external_identities = serializers.ListField(child=serializers.DictField(), default=list)
    connection_kind = serializers.ChoiceField(choices=["bootstrap", "manual_link", "unlinked"])
    linked_saas_user = SaasAdminLinkedUserSerializer(allow_null=True)


class SaasAdminUserCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=8, write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True, default="")
    role = serializers.ChoiceField(
        choices=SaasAccessProfile.Role.choices,
        required=False,
        default=SaasAccessProfile.Role.MEMBER,
    )
    is_active = serializers.BooleanField(required=False, default=True)

    def validate_username(self, value: str) -> str:
        if get_user_model().objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con ese username.")
        return value


class SaasAdminUserRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=SaasAccessProfile.Role.choices)


class SaasAdminUserStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()
