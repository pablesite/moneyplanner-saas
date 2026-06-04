from __future__ import annotations

import json
from urllib import error, request

from django.conf import settings
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework_simplejwt.tokens import AccessToken


def _core_api_base_url() -> str:
    base_url = getattr(settings, "CORE_API_BASE_URL", "").strip().rstrip("/")
    if not base_url:
        raise DRFValidationError(
            {"detail": "CORE_API_BASE_URL no configurado para bootstrap de familia en Core."}
        )
    return base_url


def _core_bootstrap_timeout_seconds() -> float:
    value = getattr(settings, "CORE_BOOTSTRAP_TIMEOUT_SECONDS", 5)
    try:
        return float(value)
    except (TypeError, ValueError) as err:
        raise DRFValidationError({"detail": "CORE_BOOTSTRAP_TIMEOUT_SECONDS invalido."}) from err


def _auth_headers_for_user(*, user) -> dict[str, str]:
    token = str(AccessToken.for_user(user))
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    core_api_host_header = getattr(settings, "CORE_API_HOST_HEADER", "").strip()
    if core_api_host_header:
        headers["Host"] = core_api_host_header

    core_api_forwarded_proto = getattr(settings, "CORE_API_X_FORWARDED_PROTO", "").strip()
    if core_api_forwarded_proto:
        headers["X-Forwarded-Proto"] = core_api_forwarded_proto

    return headers


def _http_json_request(
    *, method: str, url: str, headers: dict[str, str], payload: dict | None
) -> tuple[int, object]:
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = request.Request(url=url, data=data, method=method, headers=headers)
    timeout = _core_bootstrap_timeout_seconds()
    try:
        with request.urlopen(req, timeout=timeout) as res:
            raw = res.read()
            body = raw.decode("utf-8") if raw else ""
            parsed = json.loads(body) if body else None
            return int(res.status), parsed
    except error.HTTPError as err:
        body = err.read().decode("utf-8", errors="ignore")
        details = None
        if body:
            try:
                details = json.loads(body)
            except json.JSONDecodeError:
                details = {"raw": body[:500]}
        raise DRFValidationError(
            {
                "detail": "Error al bootstrap de familia en Core.",
                "core_status": int(err.code),
                "core_response": details,
            }
        ) from err
    except error.URLError as err:
        raise DRFValidationError(
            {"detail": "No se pudo conectar con Core para bootstrap de familia."}
        ) from err


def ensure_primary_family_member_in_core_for_saas_user(*, user) -> None:
    base_url = _core_api_base_url()
    headers = _auth_headers_for_user(user=user)
    ensure_url = f"{base_url}/api/family-members/ensure-primary/"

    status_code, _response_data = _http_json_request(
        method="POST",
        url=ensure_url,
        headers=headers,
        payload={},
    )
    if status_code != 200:
        raise DRFValidationError(
            {"detail": "Respuesta inesperada asegurando miembro principal en Core."}
        )
