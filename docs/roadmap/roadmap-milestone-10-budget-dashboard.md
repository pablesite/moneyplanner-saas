# Milestone 10 Roadmap: Budget Dashboard (`Dashboard Presupuesto`)

## Objective
Define and deliver the `Presupuesto` dashboard with a UX style consistent with `Patrimonio`, focused on comparing planned annual budget (`Introduccion de datos`) versus executed results (future `Modulo Contabilidad`).

## Scope
1. Add `Presupuesto` dashboard route/page accessible from the sidebar (same dashboard navigation family as `Patrimonio`).
2. Reuse the visual language of `Patrimonio` where appropriate (page shell, header/KPI area, chart cards, empty/loading/error states).
3. Structure the dashboard in two main sections:
   - `Ingresos` (first)
   - `Gastos` (second)
4. In each section, show category-level planned values from annual balance data (`Introduccion de datos`).
5. Define comparison visuals for planned vs executed evolution using bars (executed data sourced from future accounting module).
6. Support progressive delivery so the dashboard can ship before accounting execution data is available.

## Out Of Scope
1. Accounting module implementation (`Modulo Contabilidad`, Milestone 14).
2. Final accounting posting workflow / journal UX.
3. Advanced forecasting or predictive analytics.
4. Transfer management between family accounts (Milestone 17 scope).
5. Full monthly/yearly result dashboard (`Resultado mensual/anual`, Milestone 17).

## Product Intent
1. The dashboard must feel like the budget equivalent of `Patrimonio`: same navigation affordance, same clarity, same high-level summary + drilldown composition.
2. The dashboard should answer two questions quickly:
   - `Que esperaba ingresar/gastar este ano?`
   - `Como va la ejecucion real frente a ese presupuesto?`
3. The UX must remain useful even before accounting data exists (show planned baseline and clear "execution pending" messaging).

## Data Sources (Planned vs Executed)
### Planned (available now from Milestone 08)
1. Annual income categories and totals (`Ingresos anuales`).
2. Annual expense categories and totals (`Gastos anuales`).
3. Fiscal year context already used in data input flows.

### Executed (future dependency: Milestone 14)
1. Accounting movements/check-ins aggregated by:
   - fiscal year
   - month (or period)
   - category/subcategory
   - type (`income` / `expense`)
2. Read model for dashboard consumption (aggregated API/view), not raw ledger-only access.

## Functional Requirements
1. `Presupuesto` must be reachable from the sidebar as a dashboard entry, aligned with the same app shell/navigation used by `Patrimonio`.
2. The page must show a fiscal-year context (selected year and/or year selector, depending on current dashboard conventions).
3. The top summary area must present budget KPIs (at minimum):
   - planned income total
   - planned expense total
   - planned annual surplus/deficit
   - execution coverage/state (when accounting data is unavailable or partial)
4. The dashboard body must render `Ingresos` first and `Gastos` below.
5. Each section must include category-level planned budget detail based on `Introduccion de datos` annual balance inputs.
6. Each category row/card must be prepared to compare:
   - planned amount
   - executed amount (when available)
   - variance (absolute and/or percentage)
7. Each section must include bar-based evolution visuals for executed values over time (monthly progression), compared against budget expectation.
8. If executed data is unavailable (before Milestone 14), the UI must:
   - keep planned categories visible
   - display clear placeholder messaging for execution bars/comparisons
   - avoid showing misleading zeros as if they were real execution values
9. Empty states must be explicit when planned income/expense data has not been loaded yet in `Introduccion de datos`.
10. The layout must remain readable on mobile and desktop, following existing dashboard responsiveness patterns.

## UX / Information Architecture
### Navigation
1. Sidebar entry under dashboards, with parity to how `Patrimonio` is exposed.
2. Route naming should remain consistent with current dashboard naming conventions.

### Page Composition (same style direction as `Patrimonio`)
1. Header/title + short contextual subtitle.
2. KPI summary strip/cards.
3. `Ingresos` section:
   - category budget detail
   - executed evolution bars
   - comparison/variance cues
4. `Gastos` section:
   - category budget detail
   - executed evolution bars
   - comparison/variance cues
5. Optional cross-section comparison card (follow-up if useful): net budget status (`superavit` / `deficit`) as planned vs executed.

### Visual Semantics
1. Preserve color consistency between planned vs executed across both sections.
2. Use the same card/chart spacing rhythm and typography hierarchy already established in `Patrimonio`.
3. Use clear labels for `Previsto` vs `Ejecutado` vs `Desviacion`.
4. Avoid overloading first delivery with too many chart types; prioritize readable bar charts.

## Implementation Phases
### Phase A: Navigation + Budget Shell (First delivery)
1. Add `Presupuesto` route/page in frontend(s) with sidebar access.
2. Reuse dashboard shell/components from `Patrimonio` where possible.
3. Implement empty/loading/error states and fiscal-year context.
4. Add placeholder cards/sections for executed evolution (explicitly marked as pending accounting module).

### Phase B: Planned Budget Baseline (Milestone 10 core delivery)
1. Connect to annual income/expense data from `Introduccion de datos`.
2. Render planned totals and annual surplus/deficit.
3. Render category detail lists/tables/cards for `Ingresos` and `Gastos`.
4. Define comparison slots/fields for future executed values (without fake data).

### Phase C: Executed Comparison Integration (dependency on Milestone 14)
1. Consume accounting aggregated read model by year/month/category.
2. Render executed evolution bars in both sections.
3. Compute and display variance vs planned by category and totals.
4. Add execution completeness indicators (e.g., months with data, partial-year status).

### Phase D: Hardening and Cross-Module Consistency
1. Align labels/taxonomy mapping between data input categories and accounting categories.
2. Add regression tests for missing/partial execution data states.
3. Refine UX copy for planned-only vs planned+executed scenarios.

## Data Contract Requirements (for Milestone 14 integration)
1. Stable category identifiers shared between:
   - annual budget input (`Introduccion de datos`)
   - accounting execution aggregates
2. Aggregated execution endpoint/read model should expose:
   - `fiscal_year`
   - `period` (month)
   - `type` (`income`/`expense`)
   - `category` / `subcategory`
   - `executed_amount`
3. Optional but recommended:
   - completeness flags per month
   - source count / last updated timestamp

## Acceptance Criteria (Milestone 10)
1. Sidebar includes `Presupuesto` as a dashboard entry and navigation works without regressions.
2. `Presupuesto` page follows the same shell/style direction as `Patrimonio`.
3. Dashboard shows `Ingresos` section first and `Gastos` section below.
4. Category-level planned budget detail is shown from annual input data for both sections.
5. Top KPIs show planned totals and planned surplus/deficit.
6. Executed comparison areas are present and clearly marked as pending when accounting data is not yet implemented.
7. Empty/error/loading states are clear and non-misleading.
8. Frontend quality gates pass in Docker for affected stacks.

## Validation Plan
1. SaaS frontend (`frontend/`) when touched:
   - `docker compose exec frontend npm run lint`
   - `docker compose exec frontend npm run format:check`
   - `docker compose exec frontend npm run typecheck`
2. Core frontend (`core/frontend/`) when touched:
   - `docker compose exec frontend npm run lint`
   - `docker compose exec frontend npm run format:check`
   - `docker compose exec frontend npm run typecheck`

## Risks and Mitigations
1. Risk: category mismatch between annual budget inputs and future accounting execution categories.
   - Mitigation: define stable category IDs and mapping contract before Milestone 14 integration.
2. Risk: users interpret missing accounting data as zero execution.
   - Mitigation: explicit "pendiente de contabilidad" placeholders and completeness messaging.
3. Risk: UI becomes too dense if every category includes too much charting.
   - Mitigation: prioritize compact category detail + section-level evolution bars in first iteration.
4. Risk: budget dashboard duplicates future `Resultado mensual/anual` scope.
   - Mitigation: keep Milestone 10 focused on budget monitoring (planned vs execution progress), not final accounting close analysis.

## Dependencies
1. Milestone 08 (`Introduccion de datos`) annual income/expense data availability.
2. Existing dashboard/navigation patterns from `Patrimonio`.
3. Milestone 14 (`Modulo Contabilidad`) for executed evolution and variance completion.

## Deliverables
1. `Presupuesto` dashboard roadmap (this document).
2. Milestone 10 frontend delivery (planned budget dashboard with sidebar access and planned-data baseline).
3. Integration-ready placeholders/contracts for executed comparison bars pending accounting module.
