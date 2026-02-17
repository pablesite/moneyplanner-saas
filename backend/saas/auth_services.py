from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core import signing
from rest_framework.exceptions import ValidationError as DRFValidationError

from memberships.models import SaasConsumedCoreLinkToken, SaasCoreAccountLink
from memberships.subscription_services import get_or_create_subscription


def create_saas_user(*, username: str, password: str, email: str) -> object:
    user_model = get_user_model()
    if user_model.objects.filter(username=username).exists():
        raise DRFValidationError({"username": "Este username ya existe."})
    if email and user_model.objects.filter(email=email).exists():
        raise DRFValidationError({"email": "Este email ya esta en uso."})
    user = user_model.objects.create_user(username=username, password=password, email=email)
    get_or_create_subscription(user=user)
    return user


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


def link_core_account_from_token(
    *,
    user,
    link_token: str,
    shared_secret: str,
    token_max_age_seconds: int,
) -> SaasCoreAccountLink:
    try:
        payload = signing.loads(
            link_token,
            key=shared_secret,
            salt="core-link-token",
            max_age=token_max_age_seconds,
        )
    except signing.SignatureExpired as err:
        raise DRFValidationError({"link_token": "Token de vinculacion expirado."}) from err
    except signing.BadSignature as err:
        raise DRFValidationError({"link_token": "Token de vinculacion invalido o expirado."}) from err

    jti = str(payload.get("jti", "")).strip()
    core_user_ref = str(payload.get("core_user_ref", "")).strip()
    core_username = str(payload.get("core_username", "")).strip()
    core_email = str(payload.get("core_email", "")).strip()

    if not jti or not core_user_ref:
        raise DRFValidationError({"link_token": "Payload incompleto en token de vinculacion."})

    if SaasConsumedCoreLinkToken.objects.filter(jti=jti).exists():
        raise DRFValidationError({"link_token": "Token de vinculacion ya utilizado."})

    link = upsert_core_account_link(
        user=user,
        core_user_ref=core_user_ref,
        core_username=core_username,
        core_email=core_email,
    )
    SaasConsumedCoreLinkToken.objects.create(user=user, jti=jti)
    return link
