"""Canonical DRF exception handler for the SaaS backend."""

from __future__ import annotations

from rest_framework import status
from rest_framework.exceptions import APIException, ErrorDetail, ValidationError
from rest_framework.views import exception_handler


class FeatureDisabled(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "feature_disabled"
    default_detail = "La funcionalidad solicitada esta deshabilitada."

    def __init__(self, *, message: str, details: dict[str, object] | None = None) -> None:
        super().__init__(detail=message)
        payload: dict[str, object] = {"detail": message}
        if details:
            payload.update(details)
        self.detail = payload


class RegistrationDisabled(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "registration_disabled"
    default_detail = "El registro publico esta deshabilitado."

    def __init__(self, *, message: str, details: dict[str, object] | None = None) -> None:
        super().__init__(detail=message)
        payload: dict[str, object] = {"detail": message}
        if details:
            payload.update(details)
        self.detail = payload


def _normalize_error_details(detail):
    if isinstance(detail, dict):
        return {key: _normalize_error_details(value) for key, value in detail.items()}
    if isinstance(detail, list):
        return [_normalize_error_details(value) for value in detail]
    if isinstance(detail, ErrorDetail):
        return str(detail)
    return detail


def _infer_error_code(status_code: int, exc) -> str:
    explicit_code = getattr(exc, "default_code", None)
    if explicit_code in {
        "feature_disabled",
        "permission_denied",
        "registration_disabled",
        "subscription_blocked",
    }:
        return explicit_code
    if isinstance(exc, ValidationError) or status_code == status.HTTP_400_BAD_REQUEST:
        return "validation_error"
    if status_code == status.HTTP_401_UNAUTHORIZED:
        return "authentication_failed"
    if status_code == status.HTTP_403_FORBIDDEN:
        return "permission_denied"
    if status_code == status.HTTP_404_NOT_FOUND:
        return "not_found"
    if status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
        return "method_not_allowed"
    if status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        return "throttled"
    if status_code >= status.HTTP_500_INTERNAL_SERVER_ERROR:
        return "internal_error"
    return "api_error"


def _infer_message(status_code: int, details) -> str:
    if isinstance(details, dict) and "detail" in details and isinstance(details["detail"], str):
        return details["detail"]
    if isinstance(details, str):
        return details
    if isinstance(details, list) and len(details) == 1 and isinstance(details[0], str):
        return details[0]
    if status_code >= status.HTTP_500_INTERNAL_SERVER_ERROR:
        return "Unexpected server error."
    return "Request failed."


def _extract_contract_details(details):
    if isinstance(details, dict):
        filtered = {key: value for key, value in details.items() if key not in {"detail", "code"}}
        return filtered or None
    return details


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None

    normalized_details = _normalize_error_details(response.data)
    response.data = {
        "code": _infer_error_code(response.status_code, exc),
        "message": _infer_message(response.status_code, normalized_details),
        "details": _extract_contract_details(normalized_details),
    }
    return response
