from rest_framework import serializers

from .models import FamilyMember, Ownership, OwnershipLink, OwnershipSplit
from .services import (
    assert_member_belongs_to_user,
    get_ownership_for_user,
    ownership_is_in_use,
    save_ownership,
    validate_ownership_payload,
)


class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ["id", "name", "role", "is_active"]


class FamilyMemberMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ["id", "name", "role"]


class OwnershipSplitReadSerializer(serializers.ModelSerializer):
    member = FamilyMemberMiniSerializer(read_only=True)

    class Meta:
        model = OwnershipSplit
        fields = ["member", "percent"]


class OwnershipReadSerializer(serializers.ModelSerializer):
    member = FamilyMemberMiniSerializer(read_only=True)
    splits = OwnershipSplitReadSerializer(many=True, read_only=True)
    is_in_use = serializers.SerializerMethodField()

    class Meta:
        model = Ownership
        fields = ["id", "kind", "member", "splits", "is_in_use"]

    def get_is_in_use(self, obj):
        return ownership_is_in_use(obj)


class OwnershipSplitInputSerializer(serializers.Serializer):
    member_id = serializers.IntegerField()
    percent = serializers.DecimalField(max_digits=5, decimal_places=2)

    def validate_percent(self, value):
        if value <= 0:
            raise serializers.ValidationError("El porcentaje debe ser > 0.")
        if value > 100:
            raise serializers.ValidationError("El porcentaje no puede ser > 100.")
        return value


class OwnershipWriteSerializer(serializers.ModelSerializer):
    splits = OwnershipSplitInputSerializer(many=True, required=False)

    class Meta:
        model = Ownership
        fields = ["id", "kind", "member", "splits"]

    def _get_user(self):
        req = self.context.get("request")
        return getattr(req, "user", None)

    def validate_member(self, value):
        user = self._get_user()
        assert_member_belongs_to_user(user=user, member=value)
        return value

    def validate(self, attrs):
        user = self._get_user()

        kind = attrs.get("kind", getattr(self.instance, "kind", None))
        member = attrs.get("member", getattr(self.instance, "member", None))

        splits = attrs.get("splits", None)
        if splits is None and self.instance is not None:
            splits = [
                {"member_id": s.member_id, "percent": s.percent} for s in self.instance.splits.all()
            ]

        validate_ownership_payload(user=user, kind=kind, member=member, splits=splits)

        return attrs

    def create(self, validated_data):
        user = self._get_user()
        return save_ownership(user=user, instance=None, validated_data=validated_data)

    def update(self, instance, validated_data):
        user = self._get_user()
        return save_ownership(user=user, instance=instance, validated_data=validated_data)


class OwnershipLinkReadSerializer(serializers.ModelSerializer):
    ownership_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = OwnershipLink
        fields = ["id", "target_type", "target_id", "ownership_id", "updated_at"]


class OwnershipLinkSyncSerializer(serializers.Serializer):
    target_type = serializers.ChoiceField(choices=OwnershipLink.TargetType.choices)
    target_id = serializers.IntegerField(min_value=1)
    ownership_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, attrs):
        user = self.context["request"].user
        ownership_id = attrs.get("ownership_id", None)
        if ownership_id is None:
            attrs["ownership"] = None
            return attrs

        attrs["ownership"] = get_ownership_for_user(user=user, ownership_id=ownership_id)
        return attrs
