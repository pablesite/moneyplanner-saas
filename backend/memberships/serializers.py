from decimal import Decimal

from rest_framework import serializers

from .models import FamilyMember, Ownership, OwnershipSplit
from .services import ownership_is_in_use


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
        if value is None or user is None:
            return value
        if value.user_id != user.id:
            raise serializers.ValidationError("El miembro no pertenece a este usuario.")
        return value

    def validate(self, attrs):
        user = self._get_user()

        kind = attrs.get("kind", getattr(self.instance, "kind", None))
        member = attrs.get("member", getattr(self.instance, "member", None))

        splits = attrs.get("splits", None)
        if splits is None and self.instance is not None:
            splits = [{"member_id": s.member_id, "percent": s.percent} for s in self.instance.splits.all()]

        if kind == Ownership.Kind.INDIVIDUAL:
            if member is None:
                raise serializers.ValidationError({"member": "Obligatorio para titularidad individual."})
            if splits:
                raise serializers.ValidationError({"splits": "No se permiten splits en titularidad individual."})

        elif kind == Ownership.Kind.SHARED:
            if member is not None:
                raise serializers.ValidationError({"member": "Debe ser null en titularidad compartida."})
            if not splits:
                raise serializers.ValidationError({"splits": "Obligatorio indicar splits en titularidad compartida."})

            member_ids = [s["member_id"] for s in splits]

            if len(member_ids) != len(set(member_ids)):
                raise serializers.ValidationError({"splits": "No puede haber miembros duplicados en splits."})

            members = FamilyMember.objects.filter(id__in=member_ids)

            if members.count() != len(member_ids):
                raise serializers.ValidationError({"splits": "Algun member_id no existe."})

            if user is not None and members.exclude(user=user).exists():
                raise serializers.ValidationError({"splits": "Los miembros deben pertenecer a este usuario."})

            if members.exclude(role=FamilyMember.Role.ADULT).exists():
                raise serializers.ValidationError({"splits": "Solo se permiten adultos en compartidos."})

            total = sum(Decimal(str(s["percent"])) for s in splits)
            if total != Decimal("100"):
                raise serializers.ValidationError({"splits": f"La suma de porcentajes debe ser 100. Ahora es {total}."})

        else:
            raise serializers.ValidationError({"kind": "Tipo de titularidad invalido."})

        return attrs

    def create(self, validated_data):
        splits = validated_data.pop("splits", [])
        user = self._get_user()

        ownership = Ownership.objects.create(user=user, **validated_data)

        if ownership.kind == Ownership.Kind.SHARED:
            OwnershipSplit.objects.bulk_create(
                [
                    OwnershipSplit(
                        ownership=ownership,
                        member_id=s["member_id"],
                        percent=s["percent"],
                    )
                    for s in splits
                ]
            )

        return ownership

    def update(self, instance, validated_data):
        splits = validated_data.pop("splits", None)

        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()

        if splits is not None:
            instance.splits.all().delete()
            if instance.kind == Ownership.Kind.SHARED:
                OwnershipSplit.objects.bulk_create(
                    [
                        OwnershipSplit(
                            ownership=instance,
                            member_id=s["member_id"],
                            percent=s["percent"],
                        )
                        for s in splits
                    ]
                )

        return instance
