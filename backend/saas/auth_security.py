from __future__ import annotations

import hashlib
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied

from saas_access.models import SaasLoginThrottleState


def ensure_trusted_browser_origin(request) -> None:
    origin = request.headers.get("Origin", "").rstrip("/")
    if not origin:
        return
    trusted = {
        value.rstrip("/")
        for value in (
            *getattr(settings, "CORS_ALLOWED_ORIGINS", []),
            *getattr(settings, "CSRF_TRUSTED_ORIGINS", []),
        )
    }
    if origin not in trusted:
        raise PermissionDenied("Origen de autenticación no permitido.")


def _username_hash(username: str) -> str:
    normalized = username.strip().casefold()
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def ensure_login_allowed(*, username: str) -> None:
    if not username or not get_user_model().objects.filter(username__iexact=username).exists():
        return
    state = SaasLoginThrottleState.objects.filter(username_hash=_username_hash(username)).first()
    if state is None or state.blocked_until is None:
        return
    now = timezone.now()
    if state.blocked_until <= now:
        state.delete()
        return
    # Match Django's unknown-user password hashing cost without exposing lockout state.
    get_user_model()().set_password("blocked-login-dummy")
    raise AuthenticationFailed("No active account found with the given credentials")


@transaction.atomic
def record_login_failure(*, username: str) -> None:
    if not username or not get_user_model().objects.filter(username__iexact=username).exists():
        return

    now = timezone.now()
    window = timedelta(seconds=int(getattr(settings, "AUTH_LOGIN_FAILURE_WINDOW_SECONDS", 900)))
    block_for = timedelta(seconds=int(getattr(settings, "AUTH_LOGIN_BLOCK_SECONDS", 900)))
    max_failures = int(getattr(settings, "AUTH_LOGIN_MAX_FAILURES", 5))
    key = _username_hash(username)
    state = SaasLoginThrottleState.objects.select_for_update().filter(username_hash=key).first()
    if state is None or state.first_failed_at + window <= now:
        SaasLoginThrottleState.objects.update_or_create(
            username_hash=key,
            defaults={
                "failed_attempts": 1,
                "first_failed_at": now,
                "blocked_until": None,
            },
        )
        return

    state.failed_attempts += 1
    if state.failed_attempts >= max_failures:
        state.blocked_until = now + block_for
    state.save(update_fields=["failed_attempts", "blocked_until", "updated_at"])


def clear_login_failures(*, username: str) -> None:
    if username:
        SaasLoginThrottleState.objects.filter(username_hash=_username_hash(username)).delete()
