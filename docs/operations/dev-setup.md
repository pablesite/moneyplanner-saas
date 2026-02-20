# Development Setup

## Objective
Boot a reproducible local environment (`core` + `saas`) and run quality checks in Docker.

## Requirements
1. Docker Desktop running.
2. Git with submodule support.

## Repository Structure
1. `core/`: OSS base product (submodule)
2. `backend/`: SaaS backend
3. `frontend/`: SaaS frontend

## Initial Setup
1. Clone and init submodules:
```bash
git clone <REPO_URL>
cd moneyplanner
git submodule update --init --recursive
```
2. Ensure minimal env files exist:
- `core/backend/.env`
- `backend/.env`
- `frontend/.env`
3. Security baseline for backend secrets:
- In production (`DJANGO_DEBUG=0`), use strong values (>= 32 chars) for `DJANGO_SECRET_KEY`.
- Define `JWT_SIGNING_KEY` explicitly instead of relying on implicit defaults.
- If account linking is enabled, set a strong `CORE_LINKING_SHARED_SECRET` (>= 32 chars).

## Daily Operations
Use:
1. `docs/operations/runbook.md`
2. `docs/architecture/core-saas-boundaries.md`
3. `docs/frontend/frontend-css-workflow.md`
4. `docs/frontend/frontend-ux-iteration-playbook.md`

## Quality Checks (Docker Only)
1. SaaS backend:
```bash
docker compose exec saas_backend ruff check .
docker compose exec saas_backend ruff format --check .
docker compose exec saas_backend mypy .
```
2. Core backend:
```bash
cd core
docker compose exec backend ruff check .
docker compose exec backend ruff format --check .
docker compose exec backend mypy .
```
3. SaaS frontend:
```bash
docker compose exec saas_frontend npm run lint
docker compose exec saas_frontend npm run format:check
docker compose exec saas_frontend npm run typecheck
```
4. Core frontend:
```bash
cd core
docker compose exec frontend npm run lint
docker compose exec frontend npm run format:check
docker compose exec frontend npm run typecheck
```

## Test Commands
1. SaaS backend:
```bash
docker compose exec saas_backend python manage.py test memberships
```
2. SaaS frontend E2E:
```bash
docker compose exec saas_frontend npm run test:e2e -- --project=chromium
```
3. Core frontend E2E:
```bash
cd core
docker compose exec frontend npm run test:e2e -- --project=chromium
```

## References
1. `docs/operations/runbook.md`
2. `docs/architecture/architecture.md`
3. `docs/architecture/product-architecture.md`
4. `AGENTS.md`
