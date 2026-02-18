# Release Summary Milestone 05B (SaaS RBAC + Cross-Stack Access)

## Date
2026-02-17

## Milestone Scope
- Multi-role SaaS RBAC implemented (`saas_admin`, `saas_member`) in backend and frontend.
- SaaS admin endpoints operational with fine-grained permissions and audit events.
- SaaS UX adapted by role (protected admin route and conditional visibility).
- SaaS -> Core interoperability enabled:
  - SaaS users can consume Core API with valid SaaS JWT.
  - Secure external identity mapping avoids `user_id` collisions.
- Functional onboarding:
  - New `saas_member` users automatically create their primary family member (`adult`) with individual ownership.

## Closed Deliverables By Phase
1. Phase 5B.0:
- Role/capability matrix and RBAC contract documented.

2. Phase 5B.1:
- `SaasAccessProfile` model plus RBAC services (`assign_role`, last-admin guards).

3. Phase 5B.2:
- SaaS admin API:
  - `GET/POST /api/admin/users/`
  - `PATCH /api/admin/users/{id}/role/`
  - `PATCH /api/admin/users/{id}/status/`
  - `DELETE /api/admin/users/{id}/`
- Stable errors: `permission_denied`, `subscription_blocked`.

4. Phase 5B.3:
- `frontend`:
  - `AdminUsersView` view.
  - `requiresSaasAdmin` guard.
  - Conditional role-based UX from `SaaS Account`.

5. Phase 5B.3B:
- `core` accepts SaaS JWT when `AUTH_ACCEPT_SAAS_TOKENS=1`.
- `ExternalIdentity` model maps `provider + external_user_id -> core user`.
- Core local user auto-provisioning on first SaaS access.

6. Phase 5B.4:
- Structured admin auditing:
  - `saas_admin_user_create`
  - `saas_admin_role_change`
  - `saas_admin_status_change`
  - `saas_admin_user_delete`
- RBAC snapshot in `/api/auth/ops/metrics/`.
- Runbook updated with RBAC troubleshooting.

7. Phase 5B.5:
- Backend/frontend tests reinforced.
- Quality matrix executed in containers.

## Validation Evidence
- Backend SaaS:
  - `docker compose exec saas_backend python manage.py test memberships`
  - `docker compose exec saas_backend ruff check .`
  - `docker compose exec saas_backend mypy .`
- Frontend SaaS:
  - Focused RBAC tests (`guard`, `AccountView`, `AdminUsersView`) in container.
  - `docker compose exec saas_frontend npm run typecheck`
- Backend Core:
  - `docker compose exec backend python manage.py test accounts` (in `core/`).
  - Real smoke: SaaS token against Core `GET /api/auth/settings/` -> `200`.

## Residual Risks / Technical Debt
- Baseline quality failures still exist outside 5B functional scope:
  - Frontend `lint` issues from complexity rules in legacy e2e specs.
  - Backend `format --check` issues in pre-existing historical files.
- Recommendation:
  - Create a quality-hardening task to normalize those files and leave local CI `lint/format` fully green.

## Final Status
- Milestone 05B: functionally completed.
- 05B DoD: satisfied.

