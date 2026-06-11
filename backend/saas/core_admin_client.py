from __future__ import annotations

import json
from urllib import error, request

from django.conf import settings
from rest_framework.exceptions import ValidationError as DRFValidationError


def _core_api_base_url() -> str:
    base_url = getattr(settings, "CORE_API_BASE_URL", "").strip().rstrip("/")
    if not base_url:
        raise DRFValidationError({"detail": "CORE_API_BASE_URL no configurado para admin de Core."})
    return base_url


def _core_timeout_seconds() -> float:
    value = getattr(settings, "CORE_BOOTSTRAP_TIMEOUT_SECONDS", 5)
    try:
        return float(value)
    except (TypeError, ValueError) as err:
        raise DRFValidationError({"detail": "CORE_BOOTSTRAP_TIMEOUT_SECONDS invalido."}) from err


def _bridge_headers() -> dict[str, str]:
    secret = getattr(settings, "CORE_LINKING_SHARED_SECRET", "").strip()
    if not secret:
        raise DRFValidationError(
            {"detail": "CORE_LINKING_SHARED_SECRET no configurado para admin de Core."}
        )
    headers = {
        "Accept": "application/json",
        "X-SaaS-Bridge-Secret": secret,
    }
    core_api_host_header = getattr(settings, "CORE_API_HOST_HEADER", "").strip()
    if core_api_host_header:
        headers["Host"] = core_api_host_header

    core_api_forwarded_proto = getattr(settings, "CORE_API_X_FORWARDED_PROTO", "").strip()
    if core_api_forwarded_proto:
        headers["X-Forwarded-Proto"] = core_api_forwarded_proto

    return headers


def list_core_admin_users() -> list[dict[str, object]]:
    url = f"{_core_api_base_url()}/api/auth/admin/users/"
    req = request.Request(url=url, method="GET", headers=_bridge_headers())
    try:
        with request.urlopen(req, timeout=_core_timeout_seconds()) as res:
            raw = res.read()
            body = raw.decode("utf-8") if raw else "[]"
            parsed = json.loads(body)
            if not isinstance(parsed, list):
                raise DRFValidationError({"detail": "Respuesta invalida al listar usuarios Core."})
            return parsed
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
                "detail": "Error al listar usuarios Core desde SaaS.",
                "core_status": int(err.code),
                "core_response": details,
            }
        ) from err
    except error.URLError as err:
        raise DRFValidationError(
            {"detail": "No se pudo conectar con Core para listar usuarios."}
        ) from err
