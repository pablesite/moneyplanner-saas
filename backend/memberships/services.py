from __future__ import annotations

from decimal import Decimal

from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import FamilyMember, Ownership, OwnershipLink, OwnershipSplit


def ensure_individual_ownership_for_member(*, user, member: FamilyMember) -> Ownership:
    return Ownership.objects.get_or_create(
        user=user,
        kind=Ownership.Kind.INDIVIDUAL,
        member=member,
    )[0]


def assert_member_belongs_to_user(*, user, member: FamilyMember | None) -> None:
    if member is None or user is None:
        return
    if member.user_id != user.id:
        raise DRFValidationError({"member": "El miembro no pertenece a este usuario."})


def validate_ownership_payload(*, user, kind, member, splits) -> None:
    if kind == Ownership.Kind.INDIVIDUAL:
        if member is None:
            raise DRFValidationError({"member": "Obligatorio para titularidad individual."})
        if splits:
            raise DRFValidationError({"splits": "No se permiten splits en titularidad individual."})
        return

    if kind != Ownership.Kind.SHARED:
        raise DRFValidationError({"kind": "Tipo de titularidad invalido."})

    if member is not None:
        raise DRFValidationError({"member": "Debe ser null en titularidad compartida."})
    if not splits:
        raise DRFValidationError(
            {"splits": "Obligatorio indicar splits en titularidad compartida."}
        )

    member_ids = [split["member_id"] for split in splits]

    if len(member_ids) != len(set(member_ids)):
        raise DRFValidationError({"splits": "No puede haber miembros duplicados en splits."})

    members = FamilyMember.objects.filter(id__in=member_ids)
    if members.count() != len(member_ids):
        raise DRFValidationError({"splits": "Algun member_id no existe."})

    if user is not None and members.exclude(user=user).exists():
        raise DRFValidationError({"splits": "Los miembros deben pertenecer a este usuario."})

    if members.exclude(role=FamilyMember.Role.ADULT).exists():
        raise DRFValidationError({"splits": "Solo se permiten adultos en compartidos."})

    total = sum(Decimal(str(split["percent"])) for split in splits)
    if total != Decimal("100"):
        raise DRFValidationError(
            {"splits": f"La suma de porcentajes debe ser 100. Ahora es {total}."}
        )


def save_ownership(*, user, instance: Ownership | None, validated_data: dict) -> Ownership:
    splits = validated_data.pop("splits", None)

    if instance is None:
        create_splits = splits or []
        ownership = Ownership.objects.create(user=user, **validated_data)
        if ownership.kind == Ownership.Kind.SHARED:
            OwnershipSplit.objects.bulk_create(
                [
                    OwnershipSplit(
                        ownership=ownership,
                        member_id=split["member_id"],
                        percent=split["percent"],
                    )
                    for split in create_splits
                ]
            )
        return ownership

    for key, value in validated_data.items():
        setattr(instance, key, value)
    instance.save()

    if splits is not None:
        instance.splits.all().delete()
        if instance.kind == Ownership.Kind.SHARED:
            OwnershipSplit.objects.bulk_create(
                [
                    OwnershipSplit(
                        ownership=instance,
                        member_id=split["member_id"],
                        percent=split["percent"],
                    )
                    for split in splits
                ]
            )

    return instance


def get_ownership_for_user(*, user, ownership_id: int) -> Ownership:
    try:
        return Ownership.objects.get(id=ownership_id, user=user)
    except Ownership.DoesNotExist as err:
        raise DRFValidationError(
            {"ownership_id": "La titularidad no existe para este usuario."}
        ) from err


def sync_ownership_link(
    *, user, target_type: str, target_id: int, ownership: Ownership | None
) -> dict[str, object]:
    if ownership is None:
        OwnershipLink.objects.filter(
            user=user,
            target_type=target_type,
            target_id=target_id,
        ).delete()
        return {"ok": True, "ownership_id": None}

    link, _created = OwnershipLink.objects.update_or_create(
        user=user,
        target_type=target_type,
        target_id=target_id,
        defaults={"ownership": ownership},
    )
    return {"ok": True, "ownership_id": link.ownership_id}


def ownership_is_in_use(ownership: Ownership) -> bool:
    return OwnershipLink.objects.filter(ownership=ownership).exists()


def member_is_in_use(member: FamilyMember) -> bool:
    shared_ownership_ids = Ownership.objects.filter(
        user=member.user,
        kind=Ownership.Kind.SHARED,
        splits__member=member,
    ).values_list("id", flat=True)

    individual_ids = Ownership.objects.filter(
        user=member.user,
        kind=Ownership.Kind.INDIVIDUAL,
        member=member,
    ).values_list("id", flat=True)

    candidate_ids = set(shared_ownership_ids) | set(individual_ids)
    if not candidate_ids:
        return False

    return any(
        ownership_is_in_use(o)
        for o in Ownership.objects.filter(id__in=candidate_ids).only(
            "id", "user_id", "kind", "member_id"
        )
    )


def assert_member_can_be_deleted(member: FamilyMember) -> None:
    if Ownership.objects.filter(
        user=member.user, kind=Ownership.Kind.SHARED, splits__member=member
    ).exists():
        raise DRFValidationError(
            {
                "detail": "Este miembro aparece en una titularidad compartida. Elimina/ajusta esa titularidad antes."
            }
        )

    if member_is_in_use(member):
        raise DRFValidationError(
            {"detail": "No se puede eliminar este miembro porque esta en uso."}
        )


def assert_ownership_can_be_updated(ownership: Ownership) -> None:
    if ownership.kind == Ownership.Kind.INDIVIDUAL:
        raise DRFValidationError({"detail": "La titularidad individual no se puede editar."})

    if ownership_is_in_use(ownership):
        raise DRFValidationError(
            {"detail": "Esta titularidad ya esta en uso. Crea una nueva en lugar de editarla."}
        )


def assert_ownership_can_be_deleted(ownership: Ownership) -> None:
    if ownership.kind == Ownership.Kind.INDIVIDUAL:
        raise DRFValidationError({"detail": "La titularidad individual no se puede eliminar."})

    if ownership_is_in_use(ownership):
        raise DRFValidationError(
            {"detail": "Esta titularidad ya esta en uso. No se puede eliminar."}
        )
