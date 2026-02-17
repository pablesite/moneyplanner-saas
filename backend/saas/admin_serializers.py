from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers

from memberships.models import SaasAccessProfile
from memberships.rbac_services import get_or_create_access_profile


class SaasAdminUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "is_active", "role"]

    def get_role(self, obj) -> str:
        role_by_user_id = self.context.get("role_by_user_id", {})
        if obj.id in role_by_user_id:
            return role_by_user_id[obj.id]
        return get_or_create_access_profile(user=obj).role


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
