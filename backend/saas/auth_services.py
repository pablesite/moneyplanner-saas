from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError as DRFValidationError

from memberships.models import SaasCoreAccountLink


def create_saas_user(*, username: str, password: str, email: str) -> object:
    user_model = get_user_model()
    if user_model.objects.filter(username=username).exists():
        raise DRFValidationError({"username": "Este username ya existe."})
    if email and user_model.objects.filter(email=email).exists():
        raise DRFValidationError({"email": "Este email ya esta en uso."})
    return user_model.objects.create_user(username=username, password=password, email=email)


def upsert_core_account_link(
    *,
    user,
    core_user_ref: str,
    core_username: str = "",
    core_email: str = "",
) -> SaasCoreAccountLink:
    existing = (
        SaasCoreAccountLink.objects.filter(core_user_ref=core_user_ref)
        .exclude(user=user)
        .exists()
    )
    if existing:
        raise DRFValidationError({"core_user_ref": "Este usuario core ya esta vinculado."})

    link, _created = SaasCoreAccountLink.objects.update_or_create(
        user=user,
        defaults={
            "core_user_ref": core_user_ref,
            "core_username": core_username,
            "core_email": core_email,
            "is_active": True,
        },
    )
    return link


def unlink_core_account(*, user) -> None:
    SaasCoreAccountLink.objects.filter(user=user).delete()
