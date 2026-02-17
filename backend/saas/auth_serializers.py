from __future__ import annotations

from rest_framework import serializers

from memberships.models import SaasCoreAccountLink, SaasSubscription


class SaasRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=8, write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True, default="")


class CoreAccountLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaasCoreAccountLink
        fields = ["core_user_ref", "core_username", "core_email", "is_active", "linked_at"]


class CoreAccountLinkWriteSerializer(serializers.Serializer):
    core_user_ref = serializers.CharField(max_length=128)
    core_username = serializers.CharField(max_length=150, required=False, allow_blank=True, default="")
    core_email = serializers.EmailField(required=False, allow_blank=True, default="")


class CoreAccountLinkFromTokenSerializer(serializers.Serializer):
    link_token = serializers.CharField()


class SaasCurrentUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)
    subscription_status = serializers.ChoiceField(choices=SaasSubscription.Status.choices)
    premium_enabled = serializers.BooleanField()
    account_link = CoreAccountLinkSerializer(allow_null=True)


class SaasSubscriptionSerializer(serializers.ModelSerializer):
    premium_enabled = serializers.SerializerMethodField()

    class Meta:
        model = SaasSubscription
        fields = ["status", "started_at", "updated_at", "premium_enabled"]

    def get_premium_enabled(self, obj: SaasSubscription) -> bool:
        return obj.is_premium_enabled()
