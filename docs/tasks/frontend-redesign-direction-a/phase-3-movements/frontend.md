# Fase 3 — Movimientos (AccountingMovementsView) con Design System "Direction A"

## Title

Portar `AccountingMovementsView` al sistema "Direction A" preservando el 100% de la funcionalidad.

## Context

Vista de referencia del handoff (`handoff/README.md` sección "Movimientos";
`handoff/direction-a-more.jsx` → `AMovementsView`). Depende de la Fase 0 (tokens/fuentes/topbar) y
reutiliza las primitivas de fases anteriores (`APageHead`, `ASectHead`, `AContextBar`, `AKindChip`,
`ARowMenu`). Los charts de evolución diaria ya se construyen con `NetWorthTimelineChart` /
`NetWorthDeltaChart` (Chart.js), que la Fase 1 dejó recoloreados a la paleta oklch — aquí solo se
reutilizan.

**Restricción dura:** no perder funcionalidad. **Solo se tocan `<template>` y CSS, nunca
composables/stores/api/lógica.** Cualquier control del prototipo sin estado equivalente se confirma
antes de inventar lógica.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope (solo `<template>` + CSS, sin cambiar bindings/lógica):
   - `frontend/src/views/AccountingMovementsView.vue` (261 líneas).
   - Componentes de dominio: `AccountingMovementsHero`, `AccountingAccountCatalog`,
     `AccountingMovementsAllTransactions`, `AccountingBalances`,
     `AccountingMovementsActivationModal`, `AccountingMovementsEditTransactionModal`,
     `AccountingMovementsQuickEntryModal`.
   - `frontend/src/domains/accounting/styles/movements.css` (1622 líneas) → reescribir hacia las
     clases del sistema (`.page`, `.page-head`, `.tabs`, `.filter-bar`, `.filter-ctrl`, `.tbl`,
     `.kpis`), todo bajo `.dir-a`.
   - Aplicar CSS del sistema (header DSL, `.sheet`, campos underline) a los 3 modales sobre
     `BaseModal` existente. NO reescribir su lógica.
2. Out of scope:
   - Tocar lógica de `useAccountingMovementsPage` o sus stores/api.
   - Reimplementar los charts (se reutilizan `NetWorthTimelineChart` / `NetWorthDeltaChart`).
   - Otras vistas (Guía) — fase posterior.

## Plan

1. Diagnosis: mapear cada bloque al estado de `useAccountingMovementsPage` (`page.*`).
2. Change implementation por bloques:
   - **Page head:** title "Movimientos"; meta = mes + asientos + partida doble; actions = Catálogo de
     cuentas + Importar bancario + `+ Asiento rápido` (`page.showQuickEntryModal`).
   - **Evolución diaria:** mantener toolbar de presets (`dailyTimelinePresetOptions`,
     `setDailyTimelinePreset`), caption de rango, expandir a modal con sliders de ventana
     (`updateDailyTimelineWindowStart/End`), reutilizando los charts recoloreados.
   - **Tabs** (`page.activeTab`): Cuentas / Todos los movimientos / Estadísticas con clase `.tab.on`.
   - **Tab Cuentas:** tabla (Cuenta + n asientos / Tipo chip / Cobros mes / Pagos mes / Saldo); click
     en fila expande inline los últimos movimientos; "Ver todos →" salta a la tab con filtro.
   - **Tab Todos los movimientos:** filter bar (búsqueda, `activityFilters.kind`,
     `activityFilters.categoryKey`, `activityFilters.subcategoryKey`, selector de período con popover
     presets + rango custom `todosDatePreset/From/To`); contador "X de Y · ±neto"; tabla (Fecha /
     Concepto / Tipo chip / Debe / Haber / Importe ±color / Saldo running / `ARowMenu`); empty state.
   - **Tab Estadísticas:** selector de año fiscal; KPI strip Activos/Pasivos contables; cashflow
     mensual (12 columnas, residual ±color); contrapartidas técnicas en `<details>` colapsable.
3. Validation: checklist de NO pérdida + lint/format/typecheck + tests.

## Validation

List exact commands and expected outcomes.

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck` → sin errores
- Tests: suites del dominio accounting si existen, en verde.
- Manual en `/movimientos` (checklist NO pérdida):
  - Deep-link por query params (`tab`, `date_from/to`, `kind`, `category_key`, `subcategory_key`)
    con el orden de `nextTick` preservado (kind → categoryKey → subcategoryKey).
  - Las 3 tabs y su contenido.
  - Filtros encadenados (kind condiciona category/subcategory).
  - Expansión inline de cuenta + "Ver todos →" con filtro aplicado.
  - Evolución diaria: presets, caption, modal expandido con sliders.
  - Modales: activación de cuenta, edición de asiento, asiento rápido (alta/edición/guardado).
  - Estados loading / empty / error de cada bloque.

## Required Documentation Updates

List every canonical doc that MUST be updated before closing this task.

- [ ] `docs/frontend/frontend-visual-contract.md` — patrón filter bar y tabla de movimientos
- [ ] `docs/frontend/frontend-visual-guide.md` — patrón de la vista Movimientos
- [ ] `docs/frontend/domain-map.md` — si cambian primitivas UI compartidas
- [ ] `docs/project-status.md` — actualizar estado de la tarea

## Risks

- Vista con deep-linking y watchers encadenados: validar el orden de aplicación de filtros tras el
  reescribir el template (no romper los `nextTick`).
- CSS extenso (1622 líneas): regresión al migrar; mitigar con porte por tab y checklist.
- Controles del prototipo sin backing real: confirmar antes de inventar lógica; no simular datos.

## Completion Criteria

- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
