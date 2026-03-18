"""Compatibility wrapper for the canonical SaaS exception handler module."""

from .exception_handler import (  # noqa: F401
    FeatureDisabled,
    _extract_contract_details,
    _infer_error_code,
    _infer_message,
    _normalize_error_details,
    custom_exception_handler,
)
