# Release Summary Milestone 10 (Budget Dashboard)

## Date
2026-02-22

## Milestone Scope
- Deliver `Dashboard Presupuesto` in Core and SaaS frontends as the budget equivalent of `Patrimonio`.
- Use annual planned data from `Introduccion de datos` (`Ingresos anuales` / `Gastos anuales`).
- Keep executed comparisons as UI placeholders pending Milestone 14 (`Modulo Contabilidad`).

## Closed Deliverables
1. Budget dashboard navigation and routing:
- New `Presupuesto` route/page in SaaS and Core frontends.
- Sidebar entry added under dashboards, aligned with `Patrimonio`.

2. Planned budget baseline (Milestone 10 core scope):
- Top KPIs for planned income, planned expenses, and planned annual balance.
- `Ingresos` first and `Gastos` second, as separate dashboard sections.
- Category/subcategory planned-detail aggregation from annual balance inputs.

3. Executed-comparison placeholders (integration-ready):
- Monthly execution evolution panel (placeholder bars) in both sections.
- Category and subcategory execution placeholders (horizontal bars).
- Visual semantics prepared for budget execution status (`good / warn / danger`) by section type:
  - `Gastos`: green -> yellow -> red when approaching/exceeding budget
  - `Ingresos`: inverse logic (green when meeting/exceeding expected income)

4. UX refinements and consistency work:
- Budget dashboard styling aligned closer to `Guia` phase-detail visuals (cards, meters, hierarchy).
- Compact view by default with per-section `Ver detalle` toggle for category/subcategory drilldown.
- Per-section filter for `Todos / Recurrentes / Puntuales`.
- Global dashboard selectors:
  - `Titularidad`
  - `Ejercicio`

5. Ownership filtering behavior (annual budget consistency fix):
- `Introduccion de datos` annual-balance owner filters now show only people (not shared ownership labels).
- Person filter aggregates:
  - own individual records
  - proportional share of shared ownership records (`titularidades compartidas`)
- Shared-ownership allocation parsing hardened and backed by `store.ownerships` splits (with text fallback).

6. Documentation and roadmap:
- Milestone 10 roadmap detail document created.
- Global roadmap Milestone 10 entry documented and linked.

## Completion Review (Against Milestone 10 Acceptance Criteria)
1. Sidebar includes `Presupuesto` and navigation works in Core/SaaS: completed.
2. `Presupuesto` page follows the same shell/style direction as `Patrimonio`: completed (with extra alignment toward phase-detail UI).
3. `Ingresos` first and `Gastos` below: completed.
4. Category-level planned detail from annual input data: completed.
5. Top KPIs show planned totals and planned surplus/deficit: completed.
6. Executed comparison areas present and clearly pending accounting data: completed.
7. Empty/error/loading states are explicit: completed.
8. Frontend quality gates in Docker for affected stacks:
- `typecheck` passed in SaaS/Core.
- Targeted `eslint` checks for touched budget dashboard files passed.
- Global `lint` / `format:check` remain affected by pre-existing unrelated repo debt (documented caveat).

## Validation Evidence
- SaaS frontend:
  - `docker compose exec -T saas_frontend npm run typecheck`
  - `docker compose exec -T saas_frontend npx eslint src/views/BudgetDashboardView.vue --ext .vue`
  - `docker compose exec -T saas_frontend npx eslint src/views/DataInputView.vue --ext .vue`

- Core frontend:
  - `cd core; docker compose exec -T frontend npm run typecheck`
  - `cd core; docker compose exec -T frontend npx eslint src/views/BudgetDashboardView.vue --ext .vue`

- Targeted regression check:
  - `docker compose exec -T saas_frontend npx vitest run src/router.spec.ts`
  - `cd core; docker compose exec -T frontend npx vitest run src/router.spec.ts`

## Residual Risks / Follow-Ups
- Executed values (`Ejecutado`) and real variances remain pending Milestone 14 accounting read model integration by design.
- Budget dashboard ownership filter depends on `owner_name` labels and shared ownership metadata shape; future backend IDs for ownership references would be more robust.
- Global frontend `lint` / `format:check` are still noisy due pre-existing issues outside Milestone 10 scope.

## Final Status
- Milestone 10 (Budget dashboard planned baseline in Core/SaaS): completed.
- Accounting-based execution integration remains deferred to Milestone 14 (as scoped).
