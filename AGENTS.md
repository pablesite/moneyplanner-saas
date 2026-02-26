# AGENTS.md

## Objective
This repository contains two stacks that are developed in parallel:
1. `core/` (OSS base)
2. `saas` (root stack: `backend/` + `frontend/`, with extra features)

## Standard Startup
To boot the full project, follow this order:
1. `cd core`
2. `docker compose up --build -d`
3. `cd ..`
4. `docker compose up --build -d`

## Standard Diagnostics
Base diagnostic commands:
1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`

Additional allowed commands when useful for root-cause analysis:
1. `docker compose ps -a`
2. `docker compose logs --tail 200 <service>`
3. Targeted HTTP checks (for example CORS preflight with `curl`)

## Operational Constraints
1. Do not delete database volumes.
2. Do not run destructive commands like `docker compose down -v` unless explicitly requested.
3. Changes can be made in both `core/` and `saas`.
4. Quality checks (lint/format/typecheck/tests) must run inside Docker containers (`docker compose exec ...`), not on host.
5. In PowerShell, do not chain commands with `&&`; use compatible sequencing (`;` and `$LASTEXITCODE` checks when needed).

## Agreed Workflow
1. Diagnose first.
2. Explain intended action and ask when a decision is needed.
3. Apply the agreed change.
4. Validate outcome.
5. Refactor following existing style and validate again.
6. Report final status.
7. Update `docs/` as needed.
8. Update version according to SemVer impact:
   - `MAJOR`: breaking change
   - `MINOR`: backward-compatible feature
   - `PATCH`: backward-compatible fix/docs/test/internal change
9. After validation, docs update, and version update, finish with a commit following https://www.conventionalcommits.org/en/v1.0.0/.

## Validation (Current State)
Official quality commands exist in both repos (`core` and `saas`) and are validated in CI.

Quality commands:
1. SaaS Backend (`backend/`):
   - `ruff check .`
   - `ruff format --check .`
   - `mypy .`
2. Core Backend (`core/backend/`):
   - `ruff check .`
   - `ruff format --check .`
   - `mypy .`
3. SaaS Frontend (`frontend/`):
   - `npm run lint`
   - `npm run format:check`
   - `npm run typecheck`
4. Core Frontend (`core/frontend/`):
   - `npm run lint`
   - `npm run format:check`
   - `npm run typecheck`

Current tests:
1. SaaS backend: `python manage.py test saas_access` (suite in `backend/saas_access/tests.py`).
2. Core backend: base `tests.py` files exist, functional coverage is still evolving by domain.

CI reference:
1. SaaS: `.github/workflows/quality-saas.yml`
2. Core: `core/.github/workflows/quality-core.yml`

## Recommended Documentation
1. Documentation index (entry point): `docs/README.md`
2. Operations and troubleshooting: `docs/operations/runbook.md`
3. Development setup: `docs/operations/dev-setup.md`
4. Platform architecture: `docs/architecture/architecture.md`
5. Product functional architecture: `docs/architecture/product-architecture.md`
6. Capabilities matrix (plans/features mapping): `docs/architecture/capabilities-matrix.md`
7. Global product roadmap: `docs/roadmap/roadmap.md`

## AppCapabilities Governance (Important)
Use these rules whenever introducing, moving, gating, or refactoring product features across `core` and `saas`.

### Source of truth and ownership
1. Treat `capabilities` as a versioned product contract, not as ad-hoc frontend flags.
2. Backend is the canonical source of effective capabilities for Cloud plans.
3. Frontend consumes capabilities and should not invent plan logic independently.
4. `docs/architecture/capabilities-matrix.md` is the planning/reference source and must be updated when packaging changes.

### Contract design rules
1. Separate commercial plan identity (`plan_code`) from technical capabilities (`capabilities`).
2. Prefer capability checks (feature-based) over direct `plan_code` checks in UI/business flows.
3. Keep a `capabilities_version` in the contract and evolve it intentionally.
4. Use compatibility fields only as migration bridges (for example `compat.isPremium`, `compat.people`, `compat.ownership`).
5. Do not use compatibility fields as the long-term source of truth.

### Implementation rules (backend/frontend)
1. Backend should resolve effective capabilities from `plan_code` + subscription status (`trial`, `active`, `past_due`, `canceled`) in one place.
2. Frontend should use helpers/wrappers for gating (for example `canUseGuide`, `canUseOwnership`) instead of scattered inline checks.
3. Avoid hardcoding product packaging in multiple views/components.
4. When moving a feature between plans, update the mapping first, then UI gating.

### Feature workflow rule (mandatory)
1. Every new feature must declare its capability before merge, or be explicitly marked as base/core (ungated).
2. If a feature is implemented but not yet sold/exposed, preserve the code and gate it via capabilities.
3. If a feature changes tier (for example `Pro` -> `Premium`), update:
   - `docs/architecture/capabilities-matrix.md`
   - affected backend capability mapping
   - affected frontend gating/routes/menus
   - roadmap/docs if product scope changed

### Granularity rules (to avoid capability sprawl)
1. Create a separate capability only if at least one of these is true:
   - it can be sold in a different tier
   - it can be rolled out independently
   - it has materially different permissions/risk
   - it needs explicit kill-switch control
2. Do not split capabilities too much when the subfeature is always bundled with its parent.
3. Prefer parent capability + internal implementation details when no independent gating is expected.
4. Example guideline:
   - Good split: `premium.ownership` vs `pro.guide_phase_hub` (different product tiers)
   - Maybe too specific (unless independently gated): `core.net_worth_snapshots` if snapshots are always part of `core.net_worth`

### Testing and drift prevention
1. Add/maintain backend tests that assert the capabilities payload shape for representative plans.
2. Add/maintain frontend tests (or parser/default tests) to tolerate missing/new flags safely.
3. If backend/frontend capability keys diverge, fix the contract before continuing feature work.
4. Prefer failing fast in development when a required capability key is missing.

