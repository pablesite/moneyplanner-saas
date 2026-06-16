# Fase 4 — Guía (Home + detalle de fase) con Design System "Direction A"

## Title

Portar la Guía (`HomeView` + `GuidePhaseDetailView`) al sistema "Direction A" preservando el 100%
de la funcionalidad.

## Context

Vista de referencia del handoff (`handoff/README.md` sección "Guía";
`handoff/direction-a-more.jsx` → `AGuideView`). Depende de la Fase 0 (tokens/fuentes/topbar) y
reutiliza primitivas de fases anteriores, en especial `AStepper` (creada en la Fase 2) para el
strip de fases. Es la última vista del piloto de rediseño.

La Guía se compone de dos rutas: `/` (`HomeView`, mapa de fases, `useGuideHomeState`) y
`/guia/fases/:phaseId` (`GuidePhaseDetailView`, detalle, `useGuidePhaseDetail`). En el handoff es
"Guía · {fase}"; el strip de fases con grades A–E es el elemento central.

**Restricción dura:** no perder funcionalidad. **Solo se tocan `<template>` y CSS, nunca
composables/stores/api/lógica.** Los grades/scores se enlazan a los datos reales del store, nunca
se hardcodean.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope (solo `<template>` + CSS, sin cambiar bindings/lógica):
   - `frontend/src/views/HomeView.vue` (mapa de fases) y `frontend/src/views/GuidePhaseDetailView.vue`.
   - Componentes de dominio: `GuidePhaseProgress`, `GuidePhaseSummary`, `GuidePhaseDiagnostics`,
     `ScoreGradeBadge`, `ScoreGradeLabel`, `ScoreHealthBadge`, `ScoreMeterRow`.
   - Estilos: `src/styles/guide-home.css`, `src/styles/guide-detail.css`, `src/styles/guide-score.css`
     → reescribir hacia las clases del sistema (`.page`, `.page-head`, `.phase-strip`, `.kpis`,
     `.chip`), todo bajo `.dir-a`.
   - Grades A→E con la luminosidad/croma del sistema (hues 148→115→80→45→24 según
     `src/domains/guide/scoreVisuals.ts`); ajustar `scoreVisuals.ts` solo si produce estilos inline
     (preferible mover a clases/tokens, sin cambiar la lógica de cálculo).
2. Out of scope:
   - Tocar lógica de `useGuideHomeState`, `useGuidePhaseDetail`, `phaseDiagnostics.ts`, `phases.ts`.
   - Otras vistas (ya portadas en fases anteriores).

## Plan

1. Diagnosis: mapear el mapa de fases y el detalle al estado existente (`phaseState`,
   `phaseDisplayProgress`, `mostTensePhase`, `strongestPhase`, `scoreCards`, `summaryCards`,
   `cashFlow*`).
2. Change implementation por bloques:
   - **Home (mapa de fases):** page head "Guía"; intro con foco actual + KPIs Mayor tensión / Mejor
     posicionada; strip/grid de 5 fases con `AStepper` o `.phase-strip` (hairline coloreada arriba,
     eyebrow "Fase N", pastilla grade A–E, score en mono), cada fase clickable a su detalle.
   - **Detalle de fase:** page head `Guía · {nombre fase}` · meta `Fase N de 5 · {hint} ·
     Actualizado hoy`; strip de fases (`GuidePhaseProgress`); panel de score (2 col): score con
     color del grade + barra de progreso, y diagnóstico (`GuidePhaseSummary` +
     `GuidePhaseDiagnostics`).
   - Preservar estados de construcción (`!hasDiagnosticPhase`) y "fase inexistente" (`!phase`).
3. Validation: checklist de NO pérdida + lint/format/typecheck + tests del dominio guide.

## Validation

List exact commands and expected outcomes.

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck` → sin errores
- Tests: `frontend/src/domains/guide/__tests__` en verde.
- Manual en `/` y `/guia/fases/:phaseId` (checklist NO pérdida):
  - Mapa de fases con grades/scores reales; estado done/active; navegación a cada detalle.
  - KPIs Mayor tensión / Mejor posicionada (`mostTensePhase`, `strongestPhase`).
  - Detalle: score con color de grade, barra de progreso, diagnóstico por tipo de fase
    (deuda / cash-flow / fondo emergencia / salud patrimonial).
  - Selector de grupo de eventos extraordinarios (`extraordinaryEventGroupOptions`,
    `selectExtraordinaryEventGroup`).
  - Estados loading / error (`store.loading`, `store.error`) y estados de construcción / fase inexistente.

## Required Documentation Updates

List every canonical doc that MUST be updated before closing this task.

- [ ] `docs/frontend/frontend-visual-contract.md` — patrón strip de fases y pastillas grade A–E
- [ ] `docs/frontend/frontend-visual-guide.md` — patrón de la vista Guía
- [ ] `docs/project-status.md` — actualizar estado de la tarea; marcar el módulo de rediseño como completado si es la última fase

## Risks

- Grades con color: si `scoreVisuals.ts` genera estilos inline, mover a clases/tokens sin alterar la
  lógica de cálculo del grade.
- Dos rutas distintas comparten estilos de guía: validar Home y detalle tras cada cambio en CSS compartido.
- Datos mock del prototipo (scores 100/100): enlazar a datos reales del store, no hardcodear.

## Completion Criteria

- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
