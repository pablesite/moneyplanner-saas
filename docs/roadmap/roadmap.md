# Global Product Roadmap

## Objective
Track high-level product milestones from completed work to upcoming priorities.

## Global Status
The project has moved from technical foundation into product growth and production-readiness.

## Milestones
### Milestone 01 (Completed)
Initial repository and first net-worth module release.

### Milestone 02 (Completed)
Split into two lines: `core` (OSS) and `saas` (premium/private).

### Milestone 03 (Completed)
Improved collaboration and operational workflows with Codex and documentation.

### Milestone 04 (Completed)
Refactor + quality hardening + testing strategy execution.

Current validated baseline:
1. Backend coverage: SaaS 93%, Core 86%.
2. Frontend coverage: SaaS 88.29%, Core 84.73%.
3. Critical module coverage target reached (`memberships/services` 100%).
4. Repo foundation completed (public `core`, release policy, submodule wiring).

Reference:
- `docs/roadmap/roadmap-milestone-04-refactor.md`
- `docs/roadmap/release-summary-v2.md`

### Milestone 05 (Completed)
Separated identity strategy for `core` and `saas`.

### Milestone 05B (Completed)
SaaS multi-role authorization (RBAC).

### Milestone 06 (Completed)
Net-worth module UX and analytics improvements.

Summary:
1. App shell, navigation, account menu, and settings UX were reworked for clarity and consistency.
2. `Inicio`, `Perfil`, and `Patrimonio` flows were streamlined with cleaner information hierarchy.
3. Net-worth analytics UX was upgraded (score model, color levels, composition-focused visualization).

Reference:
- `docs/roadmap/roadmap-milestone-06-net-worth-ux-analytics.md`
- `docs/roadmap/release-summary-milestone-06-net-worth-ux-analytics.md`

### Milestone 07
General dashboards foundation:
1. Net worth (`Patrimonio`)
2. Budget (`Presupuesto`)
3. Monthly/Yearly result (`Resultado mensual/anual`)
4. Investment portfolio (`Cartera de Inversion`)
5. Simulators (`Simuladores`)

### Milestone 08 (Completed)
Data input module update:
1. (New) Annual income (`Ingresos anuales`)
2. (New) Annual expenses (`Gastos anuales`)
3. Assets (`Activos`)
4. Liabilities (`Pasivos`)
5. (New) Liability interest (`Interes de la deuda`)
6. First delivery: new `Introduccion de datos` view as second sidebar option (`Guia` -> `Introduccion de datos` -> dashboards, starting with `Patrimonio`)

Reference:
- `docs/roadmap/roadmap-milestone-08-data-input-module.md`
- `docs/roadmap/release-summary-milestone-08-data-input-module.md`

### Milestone 09 (Completed with caveat)
Phase 1: Debt (`Fase 1: Deuda`) - diagnostic score defined and delivered in SaaS frontend.

Caveat:
1. Pending parity work: full transfer of Milestone 09 phase-detail UX/scoring to `core` frontend.

Objective:
1. Eliminate bad debt with high interest and no asset backing.

Inputs:
1. Liabilities (`Pasivos`)

Dashboard:
1. Net worth (`Patrimonio`) - liabilities KPIs update.

KPIs:
1. Unbacked debt (`Deuda sin respaldo`)
2. Max liability APR/TAE
3. Related debt-risk indicators
4. Debt service ratio (`% cuota/ingresos`) based on manual monthly payment per liability (temporary).

Reference:
- `docs/roadmap/roadmap-milestone-09-phase-1-debt-guide-detail.md`

### Milestone 10 (Completed)
Budget dashboard (`Dashboard Presupuesto`).

Objective:
1. Visualize annual budget plan (`Ingresos` / `Gastos`) and compare against executed evolution.

UX direction:
1. Same dashboard style and sidebar access pattern as `Patrimonio`.
2. `Ingresos` section first, then `Gastos`.
3. Category-level planned detail (from `Introduccion de datos`) plus executed evolution bars (dependent on future accounting module).

Reference:
- `docs/roadmap/roadmap-milestone-10-budget-dashboard.md`
- `docs/roadmap/release-summary-milestone-10-budget-dashboard.md`

### Milestone 11 (Completed)
Phase 2: Cash flow (`Fase 2: Flujo de caja`) - score defined and delivered in SaaS/Core frontend guide phase detail.

Objective:
1. Keep positive cash flow with stable monthly surplus.

Inputs:
1. Income (`Ingresos`)
2. Expenses (`Gastos`)

Dashboard:
1. Budget (`Presupuesto`)

KPIs:
1. Cash flow (`Flujo de caja`)
2. Savings-to-income ratio (`% ahorro/ingresos`)
3. Related cash-flow stability indicators
4. Savings distribution by category (`Distribucion del ahorro por categoria`) - informativo

Score definition (phase 2, `0-100`):
1. Gasto operativo = solo categoria `Gastos` (`consumption_expenses`).
2. Indicador unico Score Superavit operativo (`0-100`): `% gasto operativo recurrente / ingresos recurrentes` (inverso).
3. Umbrales del score (inverso): `50%` (top) -> `100%` (bad).
4. `% ahorro recurrente` se mantiene como concepto derivado (flujo operativo + categoria `Ahorro`), pero no puntua el score principal.
5. KPIs informativos de distribucion del ahorro: `% inversiones financieras`, `% activos mobiliarios`, `% activos inmobiliarios` sobre ingresos recurrentes.
6. Resumen inicial de fase 2 incluye: ingresos/gastos/flujo recurrente, flujo total y asignaciones recurrentes por ahorro + inversiones (financieras, mobiliarias, inmobiliarias).

### Milestone 12
Phase 3: Emergency fund (`Fase 3: Fondo de emergencia`) - diagnostic score pending definition.

Objective:
1. Build a financial safety buffer.

Inputs:
1. Assets - liquidity (`Activos - Liquidez`)

Dashboard:
1. Net worth (`Patrimonio`) - liquidity KPIs update.

KPIs:
1. Liquidity (`Liquidez`)
2. Available expense coverage in months (`Meses de gastos disponibles`)

### Milestone 13 (Completed)
Phase 4: Net-worth health (`Fase 4: Salud patrimonial`) - score defined and delivered in SaaS frontend.

Objective:
1. Balance assets and liabilities.

Inputs:
1. Assets (`Activos`)
2. Liabilities (`Pasivos`)

Dashboard:
1. Guide (`Guia`) - phase 4 detail view.

KPIs:
1. Score Respaldo patrimonial (`0-100`): deuda sin respaldo/activos (inverso) + activos iliquidos (inverso).
2. `% activos iliquidos` incluye: inmuebles + mobiliario + otros + inversiones iliquidas (`pension_plans`, `real_estate_crowd`, `crowdlending`, `investments:other`) + `cash:other` con `TAE > 0`.
3. Score Distribucion del riesgo (`0-100`): concentracion top activo (inverso) + diversificacion.
4. Score global fase 4 (`0-100`): `0.50 * Respaldo + 0.50 * Distribucion`.

Reference:
- `docs/roadmap/roadmap-milestone-13-guide-phase-detail.md`

Parity status:
1. Core frontend parity delivered (Guia phase detail UX/scoring for Fase 1 and Fase 4).

### Milestone 14
Accounting module (`Modulo Contabilidad`) - dashboard data-input update with temporality.

Objective:
1. Introduce temporal behavior in financial records.

Scope updates:
1. Income (`Ingresos`) - (New) one-off entries and monthly check-ins.
2. Expenses (`Gastos`) - (New) one-off entries and monthly check-ins.
3. Assets (`Activos`) - (New) depreciable furniture/equipment metadata and financial asset details (risk, volatility, yield, fees).
4. Liabilities (`Pasivos`).
5. Pending debt upgrade: amortization metadata to calculate liability monthly payment (`cuota mensual`)
   automatically (term/end date, schedule, and rate behavior).

### Milestone 15
Investment portfolio dashboard (`Dashboard Cartera Inversion`).

### Milestone 16
Phase 5: Financial independence (`Fase 5: Independencia financiera`) - diagnostic score pending definition.

Objective:
1. Increase productive assets.

Inputs:
1. Productive assets (`Activos productivos`)

Dashboard:
1. Investment portfolio (`Cartera de Inversion`)

KPIs:
1. ROI
2. CAGR
3. Related productive-asset indicators

### Milestone 17
Monthly/Yearly result dashboard (`Dashboard Resultado mensual/anual`).

Objective:
1. Review month-end and year-end outcomes.
2. Compare realized results vs budget.
3. Manage transfers to family accounts.

### Milestone 18
First production demo release.

### Milestone 19
Mobile strategy and implementation.

### Milestone 20
Landing + payment system for SaaS.

### Milestone 21
Explainability (`Explicabilidad`):
1. Concept information
2. Glossary
3. Chatbot

### Milestone 22
Simulators dashboard (`Dashboard Simuladores`) - likely SaaS-only.

### Milestone 23 (Continuous)
Iterative scaling: observability, performance, security, UX.
