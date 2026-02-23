# Milestone 11 Roadmap: Guide Phase 2 Cash Flow (`Fase 2: Flujo de caja`)

## Objective
Define and deliver the detailed `Guia` diagnostic for `Fase 2: Flujo de caja`, focused on operational cash-flow quality (`flujo operativo`) and avoiding distortion from extraordinary one-off events.

## Scope
1. Deliver Phase 2 detailed view in `Guia` for Core and SaaS frontends (same visual family as Phase 1 / Phase 4 detail).
2. Define a stable scoring model for Phase 2 based on recurring operating behavior.
3. Separate operational spending from savings/investment allocations inside expense taxonomy.
4. Keep extraordinary (`one_off`) flows visible as context, but not as the primary score driver.
5. Add informative savings-distribution KPIs by expense category.
6. Keep Home/Guide progress integration aligned with the shared Phase 2 score.

## Out Of Scope
1. New expense taxonomy categories (no `patrimonial` category in this milestone).
2. Accounting module integration (`Modulo Contabilidad`, Milestone 14).
3. Historical monthly volatility analysis from accounting transactions.
4. Backend scoring endpoint (score remains frontend/shared-domain computed).

## Product Intent
1. Phase 2 should answer: `Mi flujo operativo recurrente es sano?`
2. The score must not penalize normal wealth-building allocations (`Ahorro`, `Inversion financiera`, `Activos mobiliarios/inmobiliarios`) as if they were consumption.
3. Extraordinary events (e.g. selling/buying a home in the same year) should be visible but should not dominate the health signal.

## Phase 2 Diagnostic Model (Final)
### Operational Definitions
1. `Ingresos recurrentes`: annual income entries with `incomeType = recurrent`.
2. `Gasto operativo recurrente`: annual expense entries with:
   - `expenseType = recurrent`
   - `category = consumption_expenses`
3. `Flujo anual recurrente`: `ingresos recurrentes - gastos recurrentes totales` (summary/context).
4. `Flujo operativo anual`: `ingresos recurrentes - gasto operativo recurrente` (concept used in score interpretation).
5. `Flujo anual total`: total annual income minus total annual expense (context only).

### Score (Single Indicator)
1. Score Phase 2 (`Superavit operativo`, `0-100`) uses one KPI only:
   - `% gasto operativo recurrente / ingresos recurrentes`
2. Scoring direction:
   - inverse (lower is better)
3. Thresholds:
   - `50%` => top reference
   - `100%` => bad reference
4. Linear interpolation:
   - `score = linearScoreDecreasing(ratio, 0.5, 1.0)`

### Summary Cards (Top Metrics)
1. `Ingresos recurrentes anuales`
2. `Gastos recurrentes anuales`
3. `Flujo anual recurrente`
4. `Flujo anual total`
5. `Asignacion recurrente a ahorro`
6. `Asignacion recurrente a inversiones financieras`
7. `Asignacion recurrente a inversiones mobiliarias`
8. `Asignacion recurrente a inversiones inmobiliarias`

### Savings Distribution (Informative Section)
1. `% inversiones / ingresos recurrentes`
   - expense category `financial_investments`
2. `% activos mobiliarios / ingresos recurrentes`
   - expense category `tangible_assets`
3. `% activos inmobiliarios / ingresos recurrentes`
   - expense category `real_estate_assets`

## Functional Requirements
1. Phase 2 detail route in `Guia` must render a score panel (same card system used in Phase 1/4 detail).
2. The top score badge and meter must use the shared Phase 2 score from `computeGuidePhaseDiagnostics`.
3. The Phase 2 score card must expose a single scored KPI: `% gasto operativo / ingresos recurrentes`.
4. The Phase 2 detail must show an additional informative section for savings distribution (no score meters required).
5. Summary cards must include the 8 metrics listed above.
6. The view must continue to load annual income and annual expense data for Phase 2.
7. A warning message should appear when extraordinary volume is high (distortion warning), while keeping score operational.
8. Core/SaaS frontend parity must be maintained.

## UX / Information Architecture
### Primary Signal
1. One main indicator only (`Superavit operativo`) to reduce ambiguity.
2. Clear explanation that score uses operational recurring spending (category `Gastos`).

### Context and Transparency
1. Show recurrent and total flows together to make one-off distortion visible.
2. Show allocation totals to `Ahorro` and wealth-building categories as separate non-consumption buckets.
3. Keep a dedicated informative section for savings distribution instead of mixing those values into the score meter.

## Implementation Notes
1. Shared scoring logic remains in:
   - `frontend/src/domains/guide/phaseDiagnostics.ts`
   - `core/frontend/src/domains/guide/phaseDiagnostics.ts`
2. UI integration remains in:
   - `frontend/src/views/GuidePhaseDetailView.vue`
   - `core/frontend/src/views/GuidePhaseDetailView.vue`
3. Home/Guide progress continues consuming `phase2GlobalScore` from shared diagnostics.

## Acceptance Criteria (Milestone 11)
1. Phase 2 detail is available in `Guia` for Core and SaaS frontends.
2. Phase 2 score is computed from `% gasto operativo recurrente / ingresos recurrentes` only.
3. `Ahorro`, `Inversion financiera`, and `Activos mobiliarios/inmobiliarios` are not counted as operating spending.
4. Summary top metrics include recurrent/total flow and allocation totals by category (8 metrics).
5. Savings distribution section shows the 3 informative ratios over recurrent income.
6. Shared Phase 2 score updates Guide/Home progress in Core and SaaS.
7. Frontend typecheck and targeted unit tests pass in Docker for affected stacks.

## Validation Plan
1. SaaS frontend (`frontend/`):
   - `docker compose exec saas_frontend npm run typecheck`
   - `docker compose exec saas_frontend npm run test:unit -- src/domains/guide/__tests__/phaseDiagnostics.spec.ts`
2. Core frontend (`core/frontend/`):
   - `docker compose exec frontend npm run typecheck`
   - `docker compose exec frontend npm run test:unit -- src/domains/guide/__tests__/phaseDiagnostics.spec.ts`
3. Formatting checks (targeted files):
   - `docker compose exec saas_frontend npx prettier --check ...`
   - `docker compose exec frontend npx prettier --check ...`

## Risks and Mitigations
1. Risk: users expect `Gastos recurrentes` summary to match the score denominator.
   - Mitigation: explicit label `gasto operativo` in score KPI and explanatory copy.
2. Risk: category misuse in data entry (e.g., consumption logged as savings/investment) degrades signal quality.
   - Mitigation: keep score semantics explicit in UI and docs.
3. Risk: extraordinary-heavy years still confuse interpretation.
   - Mitigation: distortion warning + `flujo anual total` shown as context.

## Dependencies
1. Milestone 08 annual income/expense data input module.
2. Expense taxonomy categories:
   - `consumption_expenses`
   - `savings_allocation`
   - `financial_investments`
   - `tangible_assets`
   - `real_estate_assets`
3. Existing Guide phase-detail visual framework from Milestones 09 and 13.

## Deliverables
1. Phase 2 detailed diagnostic in Guide (Core + SaaS).
2. Shared Phase 2 scoring implementation and unit coverage.
3. Milestone 11 roadmap detail document (this file).
4. Milestone 11 release summary document.

## Final Status
1. Milestone 11 is closed for the Guide Phase 2 frontend scoring/detail scope (Core and SaaS).
2. Phase 2 now prioritizes operational cash-flow health and separates savings/investment distribution as informative context.
3. No new taxonomy (`patrimonial`) was introduced in this milestone by design.
