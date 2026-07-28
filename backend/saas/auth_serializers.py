from __future__ import annotations

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from saas_access.models import SaasAccessProfile, SaasCoreAccountLink, SaasSubscription


def validate_user_password(*, password: str, username: str, email: str = "") -> None:
    candidate = get_user_model()(username=username, email=email)
    try:
        validate_password(password, candidate)
    except DjangoValidationError as exc:
        raise serializers.ValidationError(list(exc.messages)) from exc


class SaasRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=8, write_only=True, trim_whitespace=False)
    email = serializers.EmailField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        try:
            validate_user_password(
                password=attrs["password"],
                username=attrs["username"],
                email=attrs.get("email", ""),
            )
        except serializers.ValidationError as exc:
            raise serializers.ValidationError({"password": exc.detail}) from exc
        return attrs


class SaasTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        profile = getattr(user, "saas_access_profile", None)
        token["must_change_password"] = bool(profile is not None and profile.must_change_password)
        return token


class CoreAccountLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaasCoreAccountLink
        fields = ["core_user_ref", "core_username", "core_email", "is_active", "linked_at"]


class CoreAccountLinkWriteSerializer(serializers.Serializer):
    core_user_ref = serializers.CharField(max_length=128)
    core_username = serializers.CharField(
        max_length=150, required=False, allow_blank=True, default=""
    )
    core_email = serializers.EmailField(required=False, allow_blank=True, default="")


class CoreAccountLinkFromTokenSerializer(serializers.Serializer):
    link_token = serializers.CharField()


class SaasCurrentUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)
    role = serializers.ChoiceField(choices=SaasAccessProfile.Role.choices)
    must_change_password = serializers.BooleanField()
    subscription_status = serializers.ChoiceField(choices=SaasSubscription.Status.choices)
    premium_enabled = serializers.BooleanField()
    account_link = CoreAccountLinkSerializer(allow_null=True)


class SaasPasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(min_length=8, write_only=True, trim_whitespace=False)


class SaasInternalSessionSerializer(serializers.Serializer):
    token = serializers.CharField(trim_whitespace=False)


class SaasSubscriptionSerializer(serializers.ModelSerializer):
    premium_enabled = serializers.SerializerMethodField()

    class Meta:
        model = SaasSubscription
        fields = ["status", "started_at", "updated_at", "premium_enabled"]

    def get_premium_enabled(self, obj: SaasSubscription) -> bool:
        return obj.is_premium_enabled()
