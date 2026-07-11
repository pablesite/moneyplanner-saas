# Financial Plan — Fase 8: Frontera presupuesto ↔ plan (SaaS frontend)

## Title
Hacer visible en `/presupuesto` la distinción entre presupuesto recurrente (editable) y partidas gobernadas por Mi Plan (solo lectura, con enlace al acontecimiento), y simplificar la entrada manual para que Mi Plan pueda interpretarla.

## Context

Depende de `core/docs/tasks/financial-plan/phase-8-budget-plan-boundary/backend.md`, que expone `is_plan_managed` / `plan_event_id` / `plan_event_name` y bloquea la escritura de esas partidas.

Hallazgos **A-7** y **A-8** del informe `docs/tasks/financial-plan/browser-audit-2026-07-11.md`:

- las partidas creadas al incorporar un escenario (p. ej. las del «Coche Ana») aparecen en `/presupuesto` **indistinguibles** de las manuales, editables y borrables, sin que Mi Plan se entere;
- el formulario de partida expone `event_group` como texto libre («Grupo de evento (opcional, ej: vivienda_2026)»), lo que permite falsificar el linaje del plan;
- el formulario obliga al usuario a elegir `time_profile` **y** `cashflow_role` a mano: una combinación «equivocada» no da error, simplemente hace que la partida **desaparezca de todos los diagnósticos de Mi Plan** en silencio (ver A-4, fase 7).

El modelo mental que hay que hacer explícito en la UI:

| Nivel | Qué es | Dónde se crea | En `/presupuesto` |
|-------|--------|---------------|-------------------|
| **Recurrente** | Lo que gastas de forma estable: alimentación, transporte, ocio | `/presupuesto` (manual) | Editable |
| **Puntual / compromiso** | Lo que nace de una decisión simulada: coche, vivienda, excedencia | Mi Plan (escenario incorporado) | Solo lectura, con enlace al acontecimiento |

## Area
`frontend`

## Stack
`saas`

> Usar la skill `frontend-system` antes de empezar.

## Scope

### In scope

1. **Partidas gestionadas por Mi Plan, identificables y protegidas.**
   - Badge «Mi Plan» (o equivalente del sistema de diseño) en cada línea con `is_plan_managed`.
   - Acciones de editar/borrar deshabilitadas, con explicación al pasar/pulsar: qué acontecimiento la generó y dónde se gestiona.
   - Enlace directo a `/plan/escenarios/:id` (o al acontecimiento en `/plan`).
   - Si el backend devuelve `403 plan_managed_entry`, mostrar ese mensaje accionable, no un error genérico.
2. **Sección o filtro que separe los dos niveles** en el detalle anual, para que la lectura «esto es mi presupuesto recurrente / esto viene de mis decisiones planificadas» sea inmediata. Decidir con el sistema de diseño si es un filtro, un grupo o una columna; no añadir una pestaña más si un filtro basta.
3. **Retirar `event_group` del formulario manual.** Es un concepto interno; ningún usuario debería teclearlo. Si se necesita agrupar partidas manuales, resolverlo con otro mecanismo o dejarlo fuera del MVP.
4. **Simplificar la clasificación en el formulario de partida (A-8).**
   - Por defecto, una partida manual es **recurrente estructural** del año fiscal activo: no pedir `time_profile` ni `cashflow_role` en el camino normal.
   - Derivar `cashflow_role` de la categoría/subcategoría siempre que se pueda; exponer los selectores solo tras un «Opciones avanzadas» para los casos que lo necesiten.
   - Nunca permitir guardar una combinación que Mi Plan no reconozca (la fase 7 define la lista exhaustiva): si el usuario insiste en una combinación rara, avisar de que esa partida no entrará en el diagnóstico.
5. **Explicabilidad en `/presupuesto`.** Una línea de texto breve que explique la regla: las partidas puntuales y los compromisos se crean desde Mi Plan; aquí se ajusta el presupuesto recurrente.
6. **Tests** (`frontend/src/domains/budget/__tests__/`): la línea gestionada no ofrece editar/borrar; el formulario manual produce el payload por defecto correcto (estructural, año activo, rol derivado); el 403 se muestra con su mensaje.

### Out of scope
- Rediseño general de `/presupuesto` (fuera del alcance de Mi Plan).
- El detalle de escenario y la UX de `/plan` (fase 9).
- La acción de baja de un acontecimiento (fase 6).

## Plan
1. **Diagnosis** — Leer `frontend/src/domains/budget/annual-entries/` (`annualExpenseStore.ts`, `annualIncomeStore.ts`, `components/AnnualEntryModalForm.vue`, `annualEntryUtils.ts`) y `components/BudgetAnnualSection.vue`. Confirmar los nuevos campos del backend.
2. **Change implementation** — Tipos y stores → presentación de la partida gestionada → simplificación del formulario → copy explicativo → tests.
3. **Validation** — Comandos abajo + navegación real.

## Validation

```
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test
```

Validación en navegador real con el usuario `pablesite` (receta en la memoria de proyecto `playwright-browser-validation`): las partidas del «Coche Ana» aparecen marcadas y no editables en `/presupuesto`; crear una partida recurrente a mano sigue siendo un flujo de dos campos y aparece en los cimientos de Mi Plan.

## Required Documentation Updates
- [x] `docs/frontend/domain-map.md` — relación budget ↔ plan y campos de linaje
- [x] `docs/architecture/glossary.md` — «presupuesto recurrente» vs «partida de plan»
- [x] `docs/project-status.md` — estado de la fase
- [x] `docs/tasks/financial-plan/browser-audit-2026-07-11.md` — marcar A-7 y A-8 como resueltos

## Risks
- Bloquear la edición sin ofrecer salida frustra al usuario: el enlace «gestionar en Mi Plan» debe llevar a un sitio donde **realmente** pueda hacer algo (hoy, descartar; con la fase 6, cerrar).
- Simplificar el formulario puede romper flujos de usuarios avanzados que hoy clasifican a mano: mantener el camino avanzado, solo dejar de exigirlo.
- Ojo con asumir que todo `event_group` con prefijo `plan_event:` tiene un evento vivo detrás (puede haber huérfanos; el backend los reporta).

## Completion Criteria
- [x] All validation commands pass
- [x] Validación en navegador real ejecutada
- [x] All required documentation updates done
- [x] Spec moved to `terminados/`
- [x] Commit created (Conventional Commits)

## Completion note (2026-07-11)

- `/presupuesto` identifica las líneas gestionadas con badge «Mi Plan», elimina sus acciones y mantiene un enlace al plan.
- El formulario manual no envía `event_group`; el camino normal delega perfil y rol en Core y las opciones técnicas quedan bajo «Opciones avanzadas».
- Playwright verificó el flujo real de `/presupuesto`, el selector FY2027 y la carga autenticada a través del proxy local; la respuesta Core de las líneas «Coche Ana» expone el linaje reparado.
