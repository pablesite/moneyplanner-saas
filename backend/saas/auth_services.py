from __future__ import annotations

from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import signing
from django.db import transaction
from rest_framework.exceptions import ValidationError as DRFValidationError

from saas.auth_audit import log_auth_event
from saas.auth_serializers import CoreAccountLinkSerializer
from saas_access.core_bootstrap import ensure_primary_family_member_in_core_for_saas_user
from saas_access.models import (
    SaasAccessProfile,
    SaasConsumedCoreLinkToken,
    SaasCoreAccountLink,
    SaasSubscription,
)
from saas_access.rbac_services import get_or_create_access_profile
from saas_access.subscription_services import get_or_create_subscription


@transaction.atomic
def create_saas_user(*, username: str, password: str, email: str) -> object:
    user_model = get_user_model()
    if user_model.objects.filter(username=username).exists():
        raise DRFValidationError({"username": "Este username ya existe."})
    if email and user_model.objects.filter(email=email).exists():
        raise DRFValidationError({"email": "Este email ya esta en uso."})
    user = user_model.objects.create_user(username=username, password=password, email=email)
    get_or_create_subscription(user=user)
    profile = get_or_create_access_profile(user=user)
    if profile.role == "saas_member":
        ensure_primary_family_member_in_core_for_saas_user(user=user)
    return user


def register_saas_user(*, username: str, password: str, email: str) -> object:
    return create_saas_user(username=username, password=password, email=email)


def build_auth_mode_payload() -> dict[str, object]:
    transition_mode = str(getattr(settings, "AUTH_TRANSITION_MODE", "stable")).lower()
    session_compat = bool(getattr(settings, "AUTH_SESSION_COMPAT_ENABLED", True))
    exit_criteria = {
        "transition_mode_stable": transition_mode == "stable",
        "session_compat_enabled": session_compat,
        "saas_local_auth_enabled": bool(getattr(settings, "AUTH_MODE_SAAS_LOCAL", True)),
    }
    return {
        "auth_mode": "saas_local",
        "auth_mode_enabled": bool(getattr(settings, "AUTH_MODE_SAAS_LOCAL", True)),
        "account_linking_enabled": bool(getattr(settings, "ACCOUNT_LINKING_ENABLED", False)),
        "public_registration_enabled": bool(
            getattr(settings, "SAAS_PUBLIC_REGISTRATION_ENABLED", True)
        ),
        "transition_mode": transition_mode,
        "session_compat_enabled": session_compat,
        "exit_criteria": exit_criteria,
        "exit_ready": all(exit_criteria.values()),
    }


def build_me_payload(*, user) -> dict[str, object]:
    link = SaasCoreAccountLink.objects.filter(user=user).first()
    subscription = get_or_create_subscription(user=user)
    access_profile = get_or_create_access_profile(user=user)
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email or "",
        "role": access_profile.role,
        "subscription_status": subscription.status,
        "premium_enabled": subscription.is_premium_enabled(),
        "account_link": CoreAccountLinkSerializer(link).data if link else None,
    }


def upsert_core_account_link(
    *,
    user,
    core_user_ref: str,
    core_username: str = "",
    core_email: str = "",
) -> SaasCoreAccountLink:
    existing = (
        SaasCoreAccountLink.objects.filter(core_user_ref=core_user_ref).exclude(user=user).exists()
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


def link_core_account(
    *, user, core_user_ref: str, core_username: str = "", core_email: str = ""
) -> SaasCoreAccountLink:
    try:
        link = upsert_core_account_link(
            user=user,
            core_user_ref=core_user_ref,
            core_username=core_username,
            core_email=core_email,
        )
    except Exception:
        log_auth_event(
            event="core_account_link",
            outcome="failed",
            user_id=user.id,
            core_user_ref=core_user_ref,
        )
        raise

    log_auth_event(
        event="core_account_link",
        outcome="success",
        user_id=user.id,
        core_user_ref=link.core_user_ref,
    )
    return link


def unlink_core_account(*, user) -> None:
    SaasCoreAccountLink.objects.filter(user=user).delete()


def unlink_core_account_with_audit(*, user) -> bool:
    had_link = SaasCoreAccountLink.objects.filter(user=user).exists()
    unlink_core_account(user=user)
    log_auth_event(
        event="core_account_unlink",
        outcome="success",
        user_id=user.id,
        had_link=had_link,
    )
    return had_link


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
        raise DRFValidationError(
            {"link_token": "Token de vinculacion invalido o expirado."}
        ) from err

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


def link_core_account_by_token(
    *,
    user,
    link_token: str,
    shared_secret: str,
    token_max_age_seconds: int,
) -> SaasCoreAccountLink:
    try:
        link = link_core_account_from_token(
            user=user,
            link_token=link_token,
            shared_secret=shared_secret,
            token_max_age_seconds=token_max_age_seconds,
        )
    except Exception:
        log_auth_event(
            event="core_account_link_from_token",
            outcome="failed",
            user_id=user.id,
        )
        raise

    log_auth_event(
        event="core_account_link_from_token",
        outcome="success",
        user_id=user.id,
        core_user_ref=link.core_user_ref,
    )
    return link


def build_auth_ops_metrics_payload() -> dict[str, object]:
    user_model = get_user_model()
    outstanding_tokens_count = 0
    if apps.is_installed("rest_framework_simplejwt.token_blacklist"):
        outstanding_model = apps.get_model("token_blacklist", "OutstandingToken")
        if outstanding_model is not None:
            outstanding_tokens_count = outstanding_model.objects.count()

    return {
        "service": "saas",
        "users_total": user_model.objects.count(),
        "users_active": user_model.objects.filter(is_active=True).count(),
        "jwt_outstanding_tokens": outstanding_tokens_count,
        "subscriptions": {
            subscription_status: SaasSubscription.objects.filter(status=subscription_status).count()
            for subscription_status, _label in SaasSubscription.Status.choices
        },
        "core_links_total": SaasCoreAccountLink.objects.count(),
        "rbac": {
            "roles": {
                "saas_admin": SaasAccessProfile.objects.filter(
                    role=SaasAccessProfile.Role.ADMIN
                ).count(),
                "saas_member": SaasAccessProfile.objects.filter(
                    role=SaasAccessProfile.Role.MEMBER
                ).count(),
            },
            "active_users_by_role": {
                "saas_admin": SaasAccessProfile.objects.filter(
                    role=SaasAccessProfile.Role.ADMIN,
                    user__is_active=True,
                ).count(),
                "saas_member": SaasAccessProfile.objects.filter(
                    role=SaasAccessProfile.Role.MEMBER,
                    user__is_active=True,
                ).count(),
            },
        },
        "auth_mode": "saas_local",
    }
