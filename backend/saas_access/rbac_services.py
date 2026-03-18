from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError as DRFValidationError

from saas.auth_audit import log_auth_event

from .core_bootstrap import ensure_primary_family_member_in_core_for_saas_user
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


def list_admin_users_with_roles() -> tuple[list[object], dict[int, str]]:
    user_model = get_user_model()
    users = list(user_model.objects.all().order_by("id"))
    roles = SaasAccessProfile.objects.filter(user_id__in=[u.id for u in users]).values_list(
        "user_id", "role"
    )
    return users, dict(roles)


@transaction.atomic
def create_admin_user(
    *,
    actor_user,
    username: str,
    password: str,
    email: str,
    role: str,
    is_active: bool,
) -> tuple[object, str]:
    user = get_user_model().objects.create_user(
        username=username,
        password=password,
        email=email,
        is_active=is_active,
    )
    profile = assign_role(user=user, role=role)
    if profile.role == SaasAccessProfile.Role.MEMBER:
        ensure_primary_family_member_in_core_for_saas_user(user=user)

    log_auth_event(
        event="saas_admin_user_create",
        outcome="success",
        user_id=actor_user.id,
        target_user_id=user.id,
        target_role=profile.role,
        target_is_active=user.is_active,
    )
    return user, profile.role


@transaction.atomic
def update_admin_user_role(*, actor_user, user_id: int, role: str) -> tuple[object, str]:
    user = get_object_or_404(get_user_model(), id=user_id)
    before = get_or_create_access_profile(user=user).role
    profile = assign_role(user=user, role=role)
    if profile.role == SaasAccessProfile.Role.MEMBER:
        ensure_primary_family_member_in_core_for_saas_user(user=user)

    log_auth_event(
        event="saas_admin_role_change",
        outcome="success",
        user_id=actor_user.id,
        target_user_id=user.id,
        role_before=before,
        role_after=profile.role,
    )
    return user, profile.role


@transaction.atomic
def update_admin_user_status(*, actor_user, user_id: int, is_active: bool) -> tuple[object, str]:
    user = get_object_or_404(get_user_model(), id=user_id)
    profile = get_or_create_access_profile(user=user)
    if user.is_active and not is_active and profile.role == SaasAccessProfile.Role.ADMIN:
        ensure_user_can_lose_admin_role(user=user)

    before = user.is_active
    user.is_active = is_active
    user.save(update_fields=["is_active"])

    log_auth_event(
        event="saas_admin_status_change",
        outcome="success",
        user_id=actor_user.id,
        target_user_id=user.id,
        is_active_before=before,
        is_active_after=user.is_active,
    )
    return user, profile.role


@transaction.atomic
def delete_admin_user(*, actor_user, user_id: int) -> None:
    user = get_object_or_404(get_user_model(), id=user_id)
    profile = get_or_create_access_profile(user=user)

    if profile.role == SaasAccessProfile.Role.ADMIN and user.is_active:
        ensure_user_can_lose_admin_role(user=user)

    target_username = user.username
    target_role = profile.role
    target_is_active = user.is_active
    user.delete()

    log_auth_event(
        event="saas_admin_user_delete",
        outcome="success",
        user_id=actor_user.id,
        target_user_id=user_id,
        target_username=target_username,
        target_role=target_role,
        target_is_active=target_is_active,
    )
