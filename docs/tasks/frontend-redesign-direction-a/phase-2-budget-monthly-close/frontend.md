# Fase 2 — Presupuesto + Cierre mensual con Design System "Direction A"

## Title

Portar `BudgetDashboardView` (modos `budget` y `monthly-close`) al sistema "Direction A"
preservando el 100% de la funcionalidad.

## Context

Vistas de referencia del handoff (`handoff/README.md` secciones "Presupuesto" y "Cierre mensual";
`handoff/direction-a-more.jsx` → `ABudgetView`, `AMonthlyCloseView`). Depende de la Fase 0 (tokens
`.dir-a`, fuentes y topbar) y reutiliza las primitivas creadas en la Fase 1 (`APageHead`,
`ASectHead`, `AContextBar`, `AKindChip`, `ARowMenu`) más `AStepper` (nueva, ver más abajo).

**Acoplamiento crítico:** `/presupuesto` (`BudgetView`, `mode='budget'`) y `/cierre-mensual`
(`MonthlyCloseView`, `mode='monthly-close'`) son **dos modos del mismo componente**
`src/views/BudgetDashboardView.vue` (vía `useBudgetDashboardPage`) y comparten los mismos
componentes de dominio y `dashboard.css`. Por eso **se portan juntos en una sola fase**: tocar uno
sin el otro rompería ficheros compartidos.

**Restricción dura:** no perder funcionalidad. **Solo se tocan `<template>` y CSS, nunca
composables/stores/api/lógica.** Cualquier control del prototipo sin estado equivalente se confirma
antes de inventar lógica; los datos mock se enlazan a datos reales del store.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope (solo `<template>` + CSS, sin cambiar bindings/lógica):
   - `frontend/src/views/BudgetDashboardView.vue` (483 líneas) en ambos modos.
   - Componentes de dominio: `BudgetHeroSection`, `BudgetAnnualSection`,
     `BudgetMonthlyCloseIncomeSection`, `BudgetMonthlyCloseExpenseSection`,
     `BudgetMonthlyCloseLiquiditySection`, `BudgetMonthlyCloseResultSection`.
   - Entradas anuales: `src/views/budget/BudgetAnnualEntriesContent.vue`,
     `BudgetAnnualEntriesSection.vue` (+ `src/styles/budget-annual-entries.css`).
   - `frontend/src/domains/budget/styles/dashboard.css` (2953 líneas) → reescribir hacia las clases
     del sistema (`.page`, `.page-head`, `.context-bar`, `.tabs`, `.kpis`, `.year-strip`, `.tbl`,
     `.phase-strip`), todo bajo `.dir-a`.
   - Nueva primitiva UI `AStepper` en `src/domains/ui/components/` (strip de pasos/fases,
     reutilizable también en Guía): props `steps`, `activeId`, `onChange`, `eyebrowPrefix`.
2. Out of scope:
   - Tocar lógica de `useBudgetDashboardPage`, `useBudgetAnnualEntriesPage` o sus stores/api.
   - Otras vistas (Movimientos, Guía) — fases posteriores.

## Plan

1. Diagnosis: mapear cada bloque del prototipo al estado/props ya existentes (es un componente con
   ~150 bindings; ver el `<script setup>` de `BudgetDashboardView.vue` y los props de
   `BudgetHeroSection`).
2. Change implementation por bloques:
   - **Presupuesto (`mode='budget'`):**
     - Page head: title "Presupuesto"; meta = FY + mes activo + EUR; actions = Sugerencias (ghost) +
       `+ Nueva partida`.
     - Context bar: Año fiscal (`fiscalYear` / `fiscalYearOptions`), Titularidad (`ownershipFilter` /
       `ownershipOptions`), Vista (Anual · Mensual · Ejecución).
     - Hero (2 col): balance previsto + tasa de ahorro + 3 KPIs (Ingresos YTD / Gastos YTD / Residual
       mes) usando `plannedBalanceTotal`, `incomeExecutionYtdTotals`, `expenseExecutionYtdTotals`;
       year-strip (12 barras income=`--pos`, expense=`--neg`) con mes activo marcado.
     - Tabs: Plan anual / Cierre mensual / Ejecución / Sugerencias.
     - Tablas Ingresos | Gastos con `ASectHead` + `.tbl` (Partida / Previsto / Ejecutado), desvío con
       color pos/neg, footer con totales.
   - **Cierre mensual (`mode='monthly-close'`):**
     - Page head: title `Cierre · {mes}`; meta FY · Borrador.
     - Context bar: selector de mes (`selectedExecutionMonth` / `updateSelectedExecutionMonth`) +
       Titularidad.
     - Stepper 4 pasos (`monthlyCloseFlowSteps`, `activeMonthlyCloseStep`,
       `setActiveMonthlyCloseStep`): Liquidez / Ingresos / Gastos / Resultado, clickables, con
       `AStepper`.
     - Hero: residual del mes en grande + 3 KPIs (Ingresos / Gastos / Tasa de ahorro) con comparativa
       vs previsto.
     - Contenido del paso activo: tabla de conciliación + chips `AKindChip` de estado.
3. Validation: checklist de NO pérdida + lint/format/typecheck + tests.

## Validation

List exact commands and expected outcomes.

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck` → sin errores
- Tests: suites del dominio budget si existen, en verde.
- Manual en `/presupuesto` y `/cierre-mensual` (checklist NO pérdida — ambos modos):
  - Modos de agrupación `incomeViewMode` / `expenseViewMode` (`updateIncomeViewMode` / `updateExpenseViewMode`).
  - Selector de mes `selectedExecutionMonth` (`updateSelectedExecutionMonth`).
  - Inline edit del ejecutado: `expenseAdjustAmounts` / `setExpenseAdjustAmount`,
    `incomeAdjustAmounts` / `setIncomeAdjustAmount`, `liquidityAdjustAmounts` / `setLiquidityAdjustAmount`.
  - Tab de sugerencias (`budgetSuggestions`, `incomeBudgetSuggestions`, `expenseBudgetSuggestions`).
  - Sparklines de evolución (`incomeEvolutionMonths` / `expenseEvolutionMonths`).
  - Flujo de cierre: pasos navegables, finalizar/reabrir/bloquear (`handleFinalizeClose`,
    `handleReopenClose`, `handleLockClose`), check-in de filas/grupos (income/expense/liquidity).
  - Aplicar distribución (`handleApplyDistribution`, `hasDistributionSuggestion`).
  - Alta/borrado de partidas anuales (`submitAnnualIncome/Expense`, `removeAnnualIncome/Expense`)
    con refresh encadenado.
  - Estados loading / empty / error (`isLoading`, `firstError`, `hasAnyPlannedData`).

## Required Documentation Updates

List every canonical doc that MUST be updated before closing this task.

- [ ] `docs/frontend/frontend-visual-contract.md` — primitiva `AStepper` y patrones tabla presupuesto/cierre
- [ ] `docs/frontend/frontend-visual-guide.md` — patrones de Presupuesto y Cierre mensual
- [ ] `docs/frontend/domain-map.md` — si cambian primitivas UI compartidas
- [ ] `docs/project-status.md` — actualizar estado de la tarea

## Risks

- Vista de altísima densidad de estado (~150 bindings) y CSS de 2953 líneas: alto riesgo de regresión
  al reescribir; mitigar con el checklist NO pérdida exhaustivo y porte por bloques.
- Acoplamiento `budget` / `monthly-close`: validar **ambos modos** tras cada cambio en ficheros compartidos.
- Controles del prototipo sin backing real: confirmar antes de inventar lógica; no simular datos.

## Completion Criteria

- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
