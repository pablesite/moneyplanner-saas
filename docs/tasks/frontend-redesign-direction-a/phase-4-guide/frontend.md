# Fase 4 — Guía (Home + detalle de fase) con Design System "Direction A"

> Aplicar la **metodología obligatoria** de `docs/tasks/frontend-redesign-direction-a/README.md`.
> **PRIORIDAD: fidelidad literal al prototipo (Regla 0)** — el resultado debe **coincidir** con
> `handoff/Moneyplanner Refinement.html` / el `.jsx`, no "ser equivalente". Reconstruir ≠ rediseñar.
> Además: separar lógica/presentación, contrato de composición primero, clasificar componentes,
> reconciliar funcionalidad, cero híbridos, gate de fidelidad visual. No injertar sobre el markup viejo.

## Title

Reimplementación visual íntegra de la Guía (`HomeView` + `GuidePhaseDetailView`) sobre "Direction A",
preservando la lógica y toda la funcionalidad. Cierra el módulo de rediseño.

## Context

Referencia: `handoff/README.md` sección "Guía"; `handoff/direction-a-more.jsx` → `AGuideView`.
Depende de la Fase 0 y reutiliza `AStepper` (creado en Fase 2) para el strip de fases. Dos rutas:
`/` (`HomeView`, mapa de fases, `useGuideHomeState`) y `/guia/fases/:phaseId`
(`GuidePhaseDetailView`, detalle, `useGuidePhaseDetail`).

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope: reconstrucción íntegra de la presentación de `HomeView.vue` y `GuidePhaseDetailView.vue`
   y de sus componentes (`GuidePhaseProgress`, `GuidePhaseSummary`, `GuidePhaseDiagnostics`,
   `ScoreGradeBadge`, `ScoreGradeLabel`, `ScoreHealthBadge`, `ScoreMeterRow`); reescritura de
   `styles/guide-home.css`, `guide-detail.css`, `guide-score.css` a clases del sistema.
2. Out of scope: cambiar comportamiento de `useGuideHomeState`/`useGuidePhaseDetail`/
   `phaseDiagnostics.ts`/`phases.ts`; otras vistas.

## Contrato de composición (de arriba abajo)

```
Home (/):
.page → APageHead "Guía" (intro: foco actual; KPIs Mayor tensión / Mejor posicionada)
      → strip/grid de 5 fases (AStepper o .phase-strip): hairline coloreada arriba, eyebrow "Fase N",
        pastilla grade A–E (hue por score), score en mono; cada fase clickable a su detalle

Detalle (/guia/fases/:phaseId):
.page → APageHead "Guía · {fase}" (meta "Fase N de 5 · {hint} · Actualizado hoy")
      → strip de fases (GuidePhaseProgress)
      → panel score 2col: score con color del grade + barra de progreso | diagnóstico (Summary + Diagnostics)
      → estados: "fase inexistente" (!phase) · "detalle en construcción" (!hasDiagnosticPhase) · loading/error
```

## Clasificación de componentes

| Componente | Cat. | Acción |
| ---------- | ---- | ------ |
| `GuidePhaseProgress` | B | Remaquetar a strip de fases Direction A (reusar `AStepper` si encaja). |
| `GuidePhaseSummary` | B | Remaquetar a panel de score (color del grade + barra de progreso). |
| `GuidePhaseDiagnostics` | B | Remaquetar a panel de diagnóstico + selector de grupo de eventos. |
| `ScoreGradeBadge`/`ScoreGradeLabel`/`ScoreHealthBadge`/`ScoreMeterRow` | B | Remaquetar a `.chip`/pastillas grade A–E con tokens. |
| `scoreVisuals.ts` | A/C | Conservar la lógica de cálculo del grade; si genera estilos inline, mover a clases/tokens sin tocar el cálculo. |

## Reconciliación de funcionalidad (anti pérdida)

Preservar: mapa de fases con grades/scores reales y estado done/active; navegación a cada detalle;
KPIs `mostTensePhase`/`strongestPhase`; detalle con score por color de grade y diagnóstico por tipo
de fase (deuda / cash-flow / fondo emergencia / salud patrimonial); selector de grupo de eventos
extraordinarios (`extraordinaryEventGroupOptions`/`selectExtraordinaryEventGroup`); estados
loading/error (`store.loading`/`store.error`), "fase inexistente" y "en construcción". **CONFIRMAR**
cualquier elemento del prototipo sin estado equivalente. Grades/scores siempre de datos reales, no
hardcodear.

## Plan

1. Contrato de composición (Home + detalle) + mapeo a estado existente.
2. Resolver puntos CONFIRMAR.
3. Reconstruir presentación de arriba abajo en ambas rutas; eliminar `ui-home-*`/`ui-pro-*`/`card`.
4. Validación visual (gate del README) en Home y detalle + lint/typecheck/tests.

## Validation

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `... npm run format:check` → sin errores
- `... npm run typecheck` → sin errores
- Tests: `frontend/src/domains/guide/__tests__` en verde.
- **Gate de fidelidad visual (obligatorio, Regla 0 + Regla 6):** `/` y `/guia/fases/:phaseId`
  comparados **junto al prototipo**, elemento por elemento (strip de fases, pastillas grade A–E,
  panel de score); cada desviación es un defecto a corregir. Recorrer checklist de reconciliación
  (incl. estados de construcción / fase inexistente); capturas pantalla+prototipo adjuntas.
- **Grep anti-híbrido:** sin `ui-home-*`/`ui-pro-*`/`ui-section-card`/`card` en el render final.

## Required Documentation Updates

- [ ] `docs/frontend/frontend-visual-contract.md` — strip de fases y pastillas grade A–E
- [ ] `docs/frontend/frontend-visual-guide.md` — patrón Guía
- [ ] `docs/project-status.md` — estado de la tarea; marcar el módulo de rediseño como completado
- [ ] `docs/tasks/frontend-redesign-direction-a/README.md` — marcar Fase 4 ✅ y módulo completo

## Risks

- Grades con color: si `scoreVisuals.ts` produce estilos inline, mover a clases/tokens sin alterar el cálculo.
- Dos rutas comparten CSS de guía: validar Home y detalle tras cada cambio compartido.
- Datos mock del prototipo (scores 100/100): enlazar a datos reales, no hardcodear.

## Completion Criteria

- [ ] All validation commands pass (lint/format/typecheck/tests)
- [ ] **Gate de fidelidad visual en verde (Home + detalle):** coinciden con el prototipo, cero desviaciones sin aprobar; capturas pantalla+prototipo adjuntas
- [ ] **Grep anti-híbrido limpio**
- [ ] Puntos CONFIRMAR resueltos con el usuario
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
