# Release Summary Core/SaaS V1

## Date
2026-02-13

## Milestone Scope
- Separation of responsibilities between `core` (base) and `saas` (premium) completed.
- Premium domain removed from `core`.
- Premium extension in `saas` delivered with real ownership links over base entities.
- Documentation and test hardening completed.

## Relevant Changes
- `core`:
  - Removed `members/ownership` models and endpoints.
  - Kept base net-worth flows (assets, liabilities, snapshots, summary).
- `saas`:
  - Service layer for `ownership` rules.
  - New `OwnershipLink` model to link premium ownership to base `asset/liability` entities.
  - SaaS endpoints:
    - `GET /api/ownership-links/`
    - `POST /api/ownership-links/sync/`
  - `is_in_use` computed with real links.
- SaaS frontend:
  - Net-worth store syncs ownership links through SaaS API.
  - Removed legacy calls that no longer exist in `core`.
  - Net-worth view aligned with base model + premium extension.

## Executed Validation
- `docker compose exec saas_backend python manage.py migrate`
- `docker compose exec saas_backend python manage.py check`
- `docker compose exec saas_backend python manage.py test memberships`
- `npm.cmd run build` in `frontend/`

## Closure Evidence
- Phase 1: completed.
- Phase 2: completed.
- Phase 3: completed.
- Phase 4: completed.
- Reference: `docs/roadmap/roadmap-milestone-02-core-saas.md`.

## Operations
- Rollout checklist: `docs/operations/release-checklist.md`.
- Mixed/legacy dataset recovery plan: `docs/operations/recovery-plan.md`.

## Residual Risks
- Integration tests beyond `memberships` still need to be expanded as more premium domains are added.
- Any future `core` contract change requires revalidation with the rollout checklist.

