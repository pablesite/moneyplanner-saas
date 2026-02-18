# Release Summary Milestone 05 (Roadmap 03)

## Date
2026-02-17

## Milestone Scope
- Separated identity architecture completed:
  - `core` standalone with local authentication.
  - `saas` with its own local authentication plus premium subscription.
- Optional linking implemented in two modes:
  - Direct (`/api/auth/core-link/`).
  - One-time temporary token (`/api/auth/core-link/from-token/`).
- Security and operations hardening:
  - Scope-based throttling.
  - `auth.audit` event logging.
  - Split operational metrics (`/api/auth/ops/metrics/`).

## Relevant Changes
- Core:
  - `GET /api/auth/mode/` with `exit_criteria` and `exit_ready`.
  - `GET /api/auth/link-token/` for temporary link token.
  - `GET /api/auth/ops/metrics/`.
  - Refresh rotation + blacklist + stronger password policy.
  - JWT with core-specific `ISSUER`/`AUDIENCE`.
- SaaS:
  - `POST /api/auth/register/`, `GET /api/auth/me/`, `GET /api/auth/subscription/`.
  - Premium gating by subscription status (`trial|active` allowed).
  - `POST/GET/DELETE /api/auth/core-link/`.
  - `POST /api/auth/core-link/from-token/` (one-time, anti-replay via `jti`).
  - `GET /api/auth/ops/metrics/`.
  - JWT with SaaS-specific `ISSUER`/`AUDIENCE`.

## Executed Smoke Tests (Phase 7)
Core:
1. Create local smoke user in core.
2. `POST /api/auth/token/` -> `200`.
3. `GET /api/auth/settings/` with bearer -> `200`.
4. `POST /api/auth/refresh/` -> `200`.
5. `GET /api/auth/mode/` -> `exit_ready=true`.
6. `GET /api/auth/ops/metrics/` -> `service=core`.

SaaS:
1. `POST /api/auth/register/` smoke user -> `201`.
2. `POST /api/auth/token/` -> `200`.
3. `GET /api/auth/me/` -> `200`.
4. `GET /api/auth/subscription/` -> `trial`, `premium_enabled=true`.
5. `GET /api/family-members/` with SaaS bearer -> `200`.
6. `POST /api/auth/refresh/` -> `200`.
7. `GET /api/auth/mode/` -> `exit_ready=true`.
8. `GET /api/auth/ops/metrics/` -> `service=saas`.

Identity separation (cross-validation):
1. Token issued by `core` against protected SaaS endpoint -> `401`.

## Executed Quality Validation
- `docker compose -f core/docker-compose.yml exec backend python manage.py test accounts`
- `docker compose exec saas_backend python manage.py test memberships`
- `docker compose -f core/docker-compose.yml exec backend ruff check accounts config/settings.py`
- `docker compose exec saas_backend ruff check memberships saas/*`
- `docker compose -f core/docker-compose.yml exec backend mypy accounts`
- `docker compose exec saas_backend mypy memberships saas`

## Closure Status
- Phase 7: completed.
- Milestone 05: functionally validated for separated `core`/`saas` identity.

## Residual Risks
- Local setup still uses short default `DJANGO_SECRET_KEY` (security warning); define a strong secret in `.env`.
- Future work (out of Milestone 05 scope): automate visual dashboards sourced from `/api/auth/ops/metrics/`.
