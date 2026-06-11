# SaaS Architecture

## Objective

Describe the current architecture of the MoneyPlanner SaaS stack.

## Summary

1. The SaaS layer adds platform capabilities on top of `MoneyPlanner Core`.
2. Core product functionality lives in the `core/` submodule.
3. The SaaS stack is responsible for access, administration, subscription state, and cloud operation.

## SaaS Stack

1. `backend/`
   - Django backend for SaaS-specific platform features
   - authentication
   - RBAC
   - account state
   - SaaS administration
   - Core linking
2. `frontend/`
   - Vue frontend for SaaS-specific flows and managed access to Core-powered functionality

## Deployment Model

1. `core/backend` is deployed as the Core domain backend.
2. `backend/` is deployed as the SaaS backend.
3. `frontend/` is deployed as the SaaS frontend.
4. SaaS backend must be configured to reach Core through `CORE_API_BASE_URL`.

## Integration Model

1. SaaS does not reimplement Core domain logic in its backend.
2. SaaS frontend can consume Core-backed functionality while keeping SaaS-specific entry points, account flows, and its own UX decisions.
3. SaaS backend coordinates authentication, authorization, account state, and linking with Core.

## Related Documents

1. `../../core/README.md`
2. `../../core/docs/README.md`
3. `core-saas-boundaries.md`
4. `capabilities-matrix.md`
5. `../operations/dev-setup.md`
