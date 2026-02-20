# Milestone 08 Roadmap: Data Input Module Update

## Objective
Build a unified data input module to register annual income, annual expenses, assets, liabilities, and liability interest, so downstream dashboards and phase diagnostics use consistent and auditable data.

## Scope
1. Annual income (`Ingresos anuales`) input flow.
2. Annual expenses (`Gastos anuales`) input flow.
3. Assets (`Activos`) input flow.
4. Liabilities (`Pasivos`) input flow.
5. Liability interest (`Interes de la deuda`) support in liabilities.

## First Increment (Priority)
1. Create a new `Introduccion de datos` view.
2. Expose the new view in the sidebar as the second navigation option.
3. Target sidebar order:
   - `Guia`
   - `Introduccion de datos`
   - Dashboards (starting with `Patrimonio`, then the rest)

## Out Of Scope
1. Debt diagnostic score logic (Milestone 09).
2. Budget dashboard analytics (Milestone 10/11).
3. Accounting temporality and recurring checks (Milestone 14).
4. Investment portfolio and simulators modules (Milestones 15/22).

## Functional Requirements
1. Create, edit, list, and archive records for each input domain.
2. Validate mandatory fields with clear error messages.
3. Normalize annual values to a shared internal contract for dashboard consumption.
4. Track creation/update timestamps for traceability.
5. Ensure liabilities include interest metadata required by debt KPIs.

## Data Contract (Minimum)
1. Income:
   - name/category
   - annual amount
   - optional notes
2. Expenses:
   - name/category
   - annual amount
   - optional notes
3. Assets:
   - name/category
   - current value
   - liquidity hint (optional, basic)
4. Liabilities:
   - name/category
   - outstanding balance
   - annual interest (`TAE` or equivalent)
   - optional asset backing flag

## Implementation Phases
### Phase A: Navigation and New Entry View (First delivery)
1. Add `Introduccion de datos` route/page.
2. Update sidebar order to `Guia` -> `Introduccion de datos` -> dashboards.
3. Keep existing dashboard links available after the new entry.

### Phase B: Domain and API Foundation
1. Define shared schemas/serializers and validation rules.
2. Add backend endpoints for CRUD operations.
3. Add tests for validation and happy-path CRUD.

### Phase C: Frontend Input Flows
1. Build forms and listing views for all input domains.
2. Add input masking/formatting for monetary and percentage values.
3. Add empty/error/loading states and inline validation feedback.

### Phase D: Integration and Read Models
1. Expose aggregated read model used by dashboards.
2. Ensure `Patrimonio` can consume updated liabilities + interest fields.
3. Add backward-compatible migration/update strategy for existing records.

### Phase E: Hardening and Release Readiness
1. Permission checks aligned with existing auth model.
2. QA pass for key journeys and regression smoke tests.
3. Documentation update and release notes.

## Acceptance Criteria
1. Sidebar shows `Introduccion de datos` as second option, right after `Guia`.
2. Dashboards remain reachable in sidebar after `Introduccion de datos`, with `Patrimonio` first.
3. Users can open `Introduccion de datos` without navigation regressions.
4. Users can create and edit annual income and annual expenses without API validation errors for valid payloads.
5. Users can create and edit assets and liabilities, including liability interest.
6. Liability records expose interest data in API responses.
7. Existing net-worth view remains functional after migration.
8. Quality gates pass in Docker for affected stacks.

## Validation Plan
1. SaaS backend (`backend/`):
   - `docker compose exec backend ruff check .`
   - `docker compose exec backend ruff format --check .`
   - `docker compose exec backend mypy .`
2. Core backend (`core/backend/`) when touched:
   - `docker compose exec backend ruff check .`
   - `docker compose exec backend ruff format --check .`
   - `docker compose exec backend mypy .`
3. SaaS frontend (`frontend/`):
   - `docker compose exec frontend npm run lint`
   - `docker compose exec frontend npm run format:check`
   - `docker compose exec frontend npm run typecheck`
4. Core frontend (`core/frontend/`) when touched:
   - `docker compose exec frontend npm run lint`
   - `docker compose exec frontend npm run format:check`
   - `docker compose exec frontend npm run typecheck`

## Risks and Mitigations
1. Risk: ambiguity between annual and monthly semantics.
   - Mitigation: enforce annual labels and contract naming in API/UI.
2. Risk: liabilities created without usable interest data.
   - Mitigation: make interest required (or explicitly nullable with reason).
3. Risk: coupling with existing `Patrimonio` view.
   - Mitigation: add compatibility adapter and regression tests.

## Dependencies
1. Existing auth and RBAC baseline from Milestones 05/05B.
2. Current net-worth data model and APIs from Milestone 06.
3. Shared design patterns for forms/tables in current frontend.

## Deliverables
1. Backend endpoints + validations + tests for milestone 8 entities.
2. Frontend forms and list views for all milestone 8 entities.
3. Updated integration contract for downstream dashboards.
4. Documentation updates in roadmap and runbook sections as needed.

## Current Progress
1. `Introduccion de datos` view is available in sidebar navigation for SaaS and Core frontends.
2. Annual income taxonomy (generic categories/subcategories) is defined and tested in both frontends.
3. Core backend annual-income API is implemented (`/api/core/annual-income/` and `/api/core/annual-income/totals/`) with taxonomy validation and tests.
4. Frontends still use temporary local persistence and can now migrate to core API without duplicating business rules in SaaS backend.
