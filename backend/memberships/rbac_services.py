from __future__ import annotations

from django.db import transaction
from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import SaasAccessProfile


def get_or_create_access_profile(*, user) -> SaasAccessProfile:
    default_role = (
        SaasAccessProfile.Role.ADMIN if user.is_superuser else SaasAccessProfile.Role.MEMBER
    )
    return SaasAccessProfile.objects.get_or_create(user=user, defaults={"role": default_role})[0]


def has_admin_role(*, user) -> bool:
    profile = get_or_create_access_profile(user=user)
    return profile.role == SaasAccessProfile.Role.ADMIN


def _count_active_admins() -> int:
    return SaasAccessProfile.objects.filter(
        role=SaasAccessProfile.Role.ADMIN,
        user__is_active=True,
    ).count()


def ensure_user_can_lose_admin_role(*, user) -> None:
    profile = get_or_create_access_profile(user=user)
    if profile.role != SaasAccessProfile.Role.ADMIN:
        return
    if user.is_active and _count_active_admins() <= 1:
        raise DRFValidationError(
            {"role": "No se puede dejar la plataforma sin ningun saas_admin activo."}
        )


@transaction.atomic
def assign_role(*, user, role: str) -> SaasAccessProfile:
    profile = get_or_create_access_profile(user=user)
    if role not in SaasAccessProfile.Role.values:
        raise DRFValidationError({"role": "Rol de SaaS invalido."})
    if profile.role == role:
        return profile

    if profile.role == SaasAccessProfile.Role.ADMIN and role != SaasAccessProfile.Role.ADMIN:
        ensure_user_can_lose_admin_role(user=user)

    profile.role = role
    profile.save(update_fields=["role", "updated_at"])
    return profile
