# Fase 2 — Presupuesto + Cierre mensual con Design System "Direction A"

> Aplicar la **metodología obligatoria** de `docs/tasks/frontend-redesign-direction-a/README.md`.
> **PRIORIDAD: fidelidad literal al prototipo (Regla 0)** — el resultado debe **coincidir** con
> `handoff/Moneyplanner Refinement.html` / el `.jsx`, no "ser equivalente". Reconstruir ≠ rediseñar.
> Además: separar lógica/presentación, contrato de composición primero, clasificar componentes,
> reconciliar funcionalidad, cero híbridos, gate de fidelidad visual. No injertar sobre el markup viejo.

## Title

Reimplementación visual íntegra de `BudgetDashboardView` (modos `budget` y `monthly-close`) sobre
"Direction A", preservando la lógica y toda la funcionalidad.

## Context

Referencia: `handoff/README.md` secciones "Presupuesto" y "Cierre mensual";
`handoff/direction-a-more.jsx` → `ABudgetView`, `AMonthlyCloseView`. Depende de la Fase 0 y de las
primitivas de la Fase 1; añade `AStepper`.

**Acoplamiento crítico:** `/presupuesto` (`mode='budget'`) y `/cierre-mensual`
(`mode='monthly-close'`) son **dos modos del mismo `BudgetDashboardView.vue`** (vía
`useBudgetDashboardPage`) y comparten componentes de dominio y `dashboard.css`. Se portan **juntos**;
validar **ambos modos** tras cada cambio en ficheros compartidos.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope: reconstrucción íntegra de la presentación de `BudgetDashboardView.vue` (ambos modos),
   de sus componentes de dominio (`BudgetHeroSection`, `BudgetAnnualSection`,
   `BudgetMonthlyClose{Income,Expense,Liquidity,Result}Section`), de las entradas anuales
   (`BudgetAnnualEntriesContent/Section`) y reescritura de `domains/budget/styles/dashboard.css`
   (2953 líneas) a clases del sistema. Nueva primitiva `AStepper` en `domains/ui/components/`.
2. Out of scope: cambiar comportamiento de `useBudgetDashboardPage`/`useBudgetAnnualEntriesPage` o
   sus stores/api; otras vistas.

## Contrato de composición (de arriba abajo)

```
Presupuesto (mode=budget):
.page → APageHead "Presupuesto" (meta FY·mes·EUR; actions: Sugerencias ghost + "+ Nueva partida")
      → AContextBar (Año fiscal · Titularidad · Vista Anual/Mensual/Ejecución)
      → Hero 2col: balance previsto + tasa ahorro + 3 KPIs (Ingresos/Gastos YTD, Residual mes)
                 | year-strip (12 barras income=--pos / expense=--neg, mes activo marcado)
      → tabs: Plan anual / Cierre mensual / Ejecución / Sugerencias
      → 2 tablas (Ingresos | Gastos): ASectHead + table.tbl (Partida / Previsto / Ejecutado), desvío ±color, footer totales

Cierre mensual (mode=monthly-close):
.page → APageHead "Cierre · {mes}" (meta FY · Borrador)
      → AContextBar (selector de mes · Titularidad)
      → AStepper 4 pasos (Liquidez/Ingresos/Gastos/Resultado, clickables)
      → Hero: residual del mes grande + 3 KPIs (Ingresos/Gastos/Tasa ahorro) vs previsto
      → contenido del paso activo: tabla conciliación + chips AKindChip de estado
```

## Clasificación de componentes

| Componente | Cat. | Acción |
| ---------- | ---- | ------ |
| `BudgetHeroSection` | B | Remaquetar a hero Direction A (modo-dependiente: KPIs+year-strip / residual+KPIs). |
| `BudgetAnnualSection` + `BudgetAnnualEntriesContent/Section` | B | Remaquetar a `.tbl` Ingresos/Gastos + alta/borrado de partidas. |
| `BudgetMonthlyClose{Income,Expense,Liquidity,Result}Section` | B | Remaquetar al contenido del paso activo + chips de estado. |
| `AStepper` (nuevo) | — | Crear primitivo (steps/activeId/onChange/eyebrowPrefix), reusable en Fase 4. |

## Reconciliación de funcionalidad (anti pérdida)

Mapear a la composición nueva (sin perder ninguno): `incomeViewMode`/`expenseViewMode`
(agrupación) → control de Vista; `selectedExecutionMonth`/`updateSelectedExecutionMonth` → context
bar; inline edit ejecutado (`expenseAdjustAmounts`/`setExpenseAdjustAmount` y equivalentes income/
liquidity) → celdas de tabla; `budgetSuggestions` + income/expense → tab Sugerencias;
`incomeEvolutionMonths`/`expenseEvolutionMonths` → sparklines en tabla; flujo de cierre
(`handleFinalizeClose`/`handleReopenClose`/`handleLockClose`, check-in de filas/grupos,
`handleApplyDistribution`) → stepper + tabla de conciliación; alta/borrado partidas anuales con
refresh encadenado → modales/acciones. **CONFIRMAR** cualquier control del prototipo sin estado
equivalente (p.ej. botones del hero que no existan en `useBudgetDashboardPage`).

## Plan

1. Contrato de composición por modo + mapeo a estado existente (~150 bindings).
2. Resolver puntos CONFIRMAR.
3. Reconstruir presentación de arriba abajo en cada modo; eliminar `ui-pro-*`/`card`/tailwind de layout.
4. Validación visual de **ambos modos** (gate del README) + lint/typecheck/tests.

## Validation

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `... npm run format:check` → sin errores
- `... npm run typecheck` → sin errores
- Tests de budget si existen, en verde.
- **Gate de fidelidad visual (obligatorio, Regla 0 + Regla 6):** `/presupuesto` y `/cierre-mensual`
  comparados **junto al prototipo**, elemento por elemento (hero/year-strip, stepper, tablas); cada
  desviación es un defecto a corregir, no una decisión de diseño. Recorrer checklist de reconciliación
  en ambos modos; capturas pantalla+prototipo adjuntas.
- **Grep anti-híbrido:** sin `ui-pro-*`/`ui-section-card`/`card`/tailwind de layout en el render final.

## Required Documentation Updates

- [ ] `docs/frontend/frontend-visual-contract.md` — `AStepper` y patrones tabla presupuesto/cierre
- [ ] `docs/frontend/frontend-visual-guide.md` — patrones Presupuesto y Cierre
- [ ] `docs/frontend/domain-map.md` — si cambian primitivas/fronteras de componentes
- [ ] `docs/project-status.md` — estado de la tarea
- [ ] `docs/tasks/frontend-redesign-direction-a/README.md` — marcar Fase 2 ✅

## Risks

- Densidad altísima (~150 bindings, CSS 2953 líneas): alto riesgo de regresión; porte por bloques + checklist.
- Acoplamiento de modos: validar siempre **ambos** tras tocar ficheros compartidos.
- Controles del prototipo sin backing: confirmar antes de inventar lógica.

## Completion Criteria

- [ ] All validation commands pass (lint/format/typecheck/tests)
- [ ] **Gate de fidelidad visual en verde (ambos modos):** coinciden con el prototipo, cero desviaciones sin aprobar; capturas pantalla+prototipo adjuntas
- [ ] **Grep anti-híbrido limpio**
- [ ] Puntos CONFIRMAR resueltos con el usuario
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
