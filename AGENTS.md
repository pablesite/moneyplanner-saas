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
1. SaaS backend: `python manage.py test memberships` (suite in `backend/memberships/tests.py`).
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
6. Current release roadmap: `docs/roadmap/roadmap-milestone-04-refactor.md`

