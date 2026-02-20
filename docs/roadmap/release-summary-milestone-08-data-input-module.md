# Release Summary Milestone 08 (Data Input Module)

## Date
2026-02-20

## Milestone Scope
- Unified `Introduccion de datos` flow for annual income, annual expenses, assets, and liabilities.
- Liability interest support required by debt diagnostics (`annual_interest_tae` by category rules).
- Fiscal-year aware annual income/expense capture and grouped read views.
- Core/SaaS parity for input stores, taxonomy wiring, and UX-level editing workflows.

## Closed Deliverables
1. Navigation and entry view:
- `Introduccion de datos` available in Core and SaaS.
- Sidebar order updated to place data input right after `Guia`.

2. Backend foundation:
- Core budget APIs for annual income and annual expense:
  - `/api/budget/annual-income/`
  - `/api/budget/annual-income/totals/`
  - `/api/budget/annual-expense/`
  - `/api/budget/annual-expense/totals/`
- Validation and tests for taxonomy/category consistency and payload constraints.

3. Frontend input flows:
- Create/list/edit/delete support for annual income and annual expenses.
- Grouped display by category/subcategory and fiscal-year switching.
- Owner handling for SaaS including filters and shared ownership labels.
- Empty/error/loading states and inline feedback behavior aligned across stacks.

4. Net-worth integration:
- Assets/liabilities flows integrated in the same data-input module.
- Liability interest fields available and constrained for relevant categories.
- Net-worth compatibility maintained after schema and UI updates.

5. Quality and documentation:
- Docker-based quality gates executed for touched backend/frontend stacks.
- Milestone roadmap and taxonomy-related docs updated.

## Validation Evidence
- SaaS backend:
  - `docker compose exec saas_backend ruff check .`
  - `docker compose exec saas_backend ruff format --check .`
  - `docker compose exec saas_backend mypy .`
  - `docker compose exec saas_backend python manage.py test memberships`

- Core backend:
  - `cd core; docker compose exec backend ruff check .`
  - `cd core; docker compose exec backend ruff format --check .`
  - `cd core; docker compose exec backend mypy .`
  - `cd core; docker compose exec backend python manage.py test`

- SaaS frontend:
  - `docker compose exec saas_frontend npm run lint`
  - `docker compose exec saas_frontend npm run format:check`
  - `docker compose exec saas_frontend npm run typecheck`

- Core frontend:
  - `cd core; docker compose exec frontend npm run lint`
  - `cd core; docker compose exec frontend npm run format:check`
  - `cd core; docker compose exec frontend npm run typecheck`

## Residual Risks / Follow-Ups
- Cross-cutting tags for transversal expense typologies (e.g., insurance, fixed/variable, deductible) are deferred to a future milestone.
- Debt score logic remains explicitly out of scope and continues in Milestone 09.

## Final Status
- Milestone 08: completed.
- Deliverables accepted and documented.
