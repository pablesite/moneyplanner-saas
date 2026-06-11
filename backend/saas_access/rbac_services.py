from __future__ import annotations

from typing import Any, cast

from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError as DRFValidationError

from saas.core_admin_client import list_core_admin_users
from saas.auth_audit import log_auth_event

from .core_bootstrap import ensure_primary_family_member_in_core_for_saas_user
from .models import SaasAccessProfile, SaasCoreAccountLink


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


def list_admin_users_with_roles() -> tuple[
    list[Any], dict[int, str], dict[int, SaasCoreAccountLink]
]:
    user_model = get_user_model()
    users = list(user_model.objects.all().order_by("id"))
    roles = SaasAccessProfile.objects.filter(user_id__in=[u.id for u in users]).values_list(
        "user_id", "role"
    )
    links = {
        link.user_id: link
        for link in SaasCoreAccountLink.objects.filter(user_id__in=[u.id for u in users])
    }
    return users, dict(roles), links


def list_core_users_with_saas_links(
    *,
    role_by_user_id: dict[int, str] | None = None,
    link_by_user_id: dict[int, SaasCoreAccountLink] | None = None,
) -> list[dict[str, object]]:
    users, resolved_role_by_user_id, resolved_link_by_user_id = list_admin_users_with_roles()
    role_by_user_id = role_by_user_id or resolved_role_by_user_id
    link_by_user_id = link_by_user_id or resolved_link_by_user_id

    saas_by_id: dict[int, Any] = {user.id: user for user in users}
    saas_user_by_core_ref = {
        link.core_user_ref: saas_by_id[link.user_id]
        for link in link_by_user_id.values()
        if link.user_id in saas_by_id
    }
    core_users = list_core_admin_users()
    enriched: list[dict[str, object]] = []

    for core_user in core_users:
        # Cross-reference Core identities with SaaS users via manual links or bootstrap identities.
        external_identities = cast(
            list[dict[str, object]],
            core_user.get("external_identities") or [],
        )
        linked_saas_user: Any | None = None
        connection_kind = "unlinked"

        core_ref = f"core_user:{core_user['id']}"
        manual_match = saas_user_by_core_ref.get(core_ref)
        if manual_match is not None:
            linked_saas_user = manual_match
            connection_kind = "manual_link"
        else:
            for identity in external_identities:
                external_user_id = str(identity.get("external_user_id", "")).strip()
                if not external_user_id.isdigit():
                    continue
                bootstrap_match = saas_by_id.get(int(external_user_id))
                if bootstrap_match is not None:
                    linked_saas_user = bootstrap_match
                    connection_kind = "bootstrap"
                    break

        enriched.append(
            {
                **core_user,
                "connection_kind": connection_kind,
                "linked_saas_user": (
                    None
                    if linked_saas_user is None
                    else {
                        "id": linked_saas_user.id,
                        "username": linked_saas_user.username,
                        "email": linked_saas_user.email,
                        "is_active": linked_saas_user.is_active,
                        "role": role_by_user_id.get(
                            linked_saas_user.id,
                            get_or_create_access_profile(user=linked_saas_user).role,
                        ),
                    }
                ),
            }
        )

    return enriched


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
