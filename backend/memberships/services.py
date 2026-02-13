from __future__ import annotations

from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import FamilyMember, Ownership


def ensure_individual_ownership_for_member(*, user, member: FamilyMember) -> Ownership:
    return Ownership.objects.get_or_create(
        user=user,
        kind=Ownership.Kind.INDIVIDUAL,
        member=member,
    )[0]


def ownership_is_in_use(ownership: Ownership) -> bool:
    """
    Placeholder for premium usage checks.

    Phase 1 extracts the check into a single service so callers stop
    duplicating business rules in view/serializer layers.
    """
    return False


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
        for o in Ownership.objects.filter(id__in=candidate_ids).only("id", "user_id", "kind", "member_id")
    )


def assert_member_can_be_deleted(member: FamilyMember) -> None:
    if Ownership.objects.filter(user=member.user, kind=Ownership.Kind.SHARED, splits__member=member).exists():
        raise DRFValidationError(
            {"detail": "Este miembro aparece en una titularidad compartida. Elimina/ajusta esa titularidad antes."}
        )

    if member_is_in_use(member):
        raise DRFValidationError({"detail": "No se puede eliminar este miembro porque esta en uso."})


def assert_ownership_can_be_updated(ownership: Ownership) -> None:
    if ownership.kind == Ownership.Kind.INDIVIDUAL:
        raise DRFValidationError({"detail": "La titularidad individual no se puede editar."})

    if ownership_is_in_use(ownership):
        raise DRFValidationError({"detail": "Esta titularidad ya esta en uso. Crea una nueva en lugar de editarla."})


def assert_ownership_can_be_deleted(ownership: Ownership) -> None:
    if ownership.kind == Ownership.Kind.INDIVIDUAL:
        raise DRFValidationError({"detail": "La titularidad individual no se puede eliminar."})

    if ownership_is_in_use(ownership):
        raise DRFValidationError({"detail": "Esta titularidad ya esta en uso. No se puede eliminar."})
