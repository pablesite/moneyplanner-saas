# Mi Plan — Auditoría en navegador real (2026-07-11)

Informe de la tercera pasada de revisión de Mi Plan, ejecutada con Playwright sobre el stack de desarrollo (`docker-compose.dev.yml`) y **datos reales del usuario `pablesite`**, en desktop (1440×900) y móvil (390×844).

Este documento es el **contexto compartido** de las fases 7, 8 y 9 del módulo. Cada hallazgo tiene un identificador (`A-n`) que las task specs referencian. Las cifras están verificadas contra la base de datos y contra el propio motor, no estimadas.

Rutas navegadas: `/plan`, `/plan/escenarios`, `/plan/escenarios/:id`, `/plan/activos`, `/plan/setup`, `/presupuesto`.

---

## Resumen

| ID | Hallazgo | Tipo | Fase |
|----|----------|------|------|
| A-1 | Los Cimientos suman partidas de presupuesto de **todos los años fiscales** a la vez | Bug de motor | 7 |
| A-2 | La proyección trata los ingresos **puntuales** (`one_off`) como renta laboral perpetua | Bug de motor | 7 |
| A-3 | `employment_income_end_date` se pide, se guarda y **no se usa** en ningún cálculo | Bug de motor | 7 |
| A-4 | Combinaciones `time_profile`/`cashflow_role` que **ningún bucket recoge** (incluso las que genera el propio motor) | Bug de motor | 7 |
| A-5 | `annual_operating_expenses` es un input muerto de la proyección | Deuda | 7 |
| A-6 | Todos los errores del dominio plan se muestran como «No se pudo cargar Mi Plan.» | Bug de frontend | 9 |
| A-7 | Las partidas generadas por Mi Plan son editables/borrables desde `/presupuesto` sin aviso ni sincronización | Bug de frontera | 8 |
| A-8 | La entrada manual de presupuesto exige clasificar `time_profile`/`cashflow_role` a mano, sin validación ni ayuda | Diseño de dominio | 8 |
| A-9 | Sobrecarga informativa en `/plan`: todo el diagnóstico se muestra de golpe | UX | 9 |
| A-10 | `/plan/escenarios`: el formulario tapa la lista; la lista no informa ni parece navegable | UX | 9 |
| A-11 | Detalle de escenario incorporado casi vacío: no muestra su rastro real | UX | 9 |
| A-12 | `/plan/activos` en móvil: ~60 activos en columna única (página de ~16.000 px) | UX móvil | 9 |
| A-13 | Trayectoria y subnavegación del plan degradadas en móvil | UX móvil | 9 |
| A-14 | El placeholder de interés (7 %) contradice el supuesto documentado (4,5 %) | Copy | 9 |

**Resolución 2026-07-11:** A-1…A-5 quedan resueltos por la Fase 7. El motor usa el FY natural actual, excluye `one_off` de la renta estructural, aplica el corte laboral agregado, comparte una taxonomía exhaustiva de gasto y elimina el input muerto. Con los datos auditados, `committed_surplus` pasa de `-78.834,58 €` a `-31.771,75 €`; no se fuerza la paridad con el balance total FY2026 (`+44.579,57 €`) porque este último incluye `159.304,40 €` de ingresos puntuales que, por decisión de producto, no son renta recurrente. La fecha proyectada deja de aparecer al retirar la renta puntual perpetua y aplicar el corte de 2049, que es el cambio conservador esperado.

**Resolución Fase 8:** A-7 y A-8 quedan resueltos en su alcance presupuesto/plan. El prefijo `plan_event:` es reservado, las partidas gestionadas exponen su acontecimiento y rechazan edición/borrado, `/presupuesto` las marca como «Mi Plan» y el formulario manual retira el linaje interno y desplaza la clasificación técnica a opciones avanzadas. La auditoría de datos reportó ocho líneas heredadas de «Coche Ana» con ID de escenario; se repararon de forma explícita al ID real del `PlanEvent` y una segunda auditoría devolvió cero huérfanas.

**Ajuste 2026-07-26 (superávit comprometido — reclasificación):** revisando el `committed_surplus` de `pablesite` (`-31.771,75 €`) se detectó que la partida `temporary_commitment` mezclaba tres perfiles temporales distintos por culpa de dos generadores que rompían el invariante `temporary_commitment ⟺ term_recurrent`: (1) las aportaciones de inversión espejo de un activo se emitían como `temporary_commitment` pese a ser aportación (`investment`) — además restaban en cimientos y sumaban en la proyección vía `InvestmentContributionInterval`, contradicción de signo; (2) la cancelación anticipada de principal (`one_off`) se emitía como `temporary_commitment`, colando un movimiento de balance puntual en un indicador de flujo. Corregido en los generadores (`services_assets_budget.py` → `investment`; `services_liabilities_budget.py` → `transfer`), en la proyección (`planned_contribution_amount` excluye los espejos `is_system_generated` para no duplicar) y con migración de datos `budget.0016`. Resultado con datos reales: `committed_surplus` pasa de `-31.771,75 €` a `-7.758,46 €`; la proyección (estimación central 2058, aportación planificada 9.860 €) no se mueve.

**Tercera capa — RESUELTA (2026-07-27).** El `committed_surplus` de `pablesite` sigue negativo (`-7.758,46 €`) porque los compromisos temporales de 2026 (Atrio, FIV, cuota Palmito, iPhone, óvulos = 27.582,54 €) superan al superávit operativo permanente (+19.824,08 €), pero es un **esfuerzo temporal**, no un déficit estructural. Cimientos ahora lo distingue: `services_foundations.py` calcula un **año de recuperación** (`committed_recovery_year`: primer año fiscal en que el superávit vuelve a ≥0 al ir venciendo los compromisos, usando `term_end_year`, en euros de hoy) y clasifica el flujo comprometido en `committed_status` = `healthy` / `transient` (operativo ≥0 y recuperación ≤ `TRANSIENT_SQUEEZE_MAX_YEARS`=3 años) / `structural`. El finding `NEGATIVE_CASH_FLOW` baja a **WARNING** cuando es transitorio (CRITICAL solo en estructural), la recomendación se reencuadra a «sostener liquidez hasta {recovery_year}» sin acción de recortar compromisos, y el blocker de `PlanHero` pasa a «Esfuerzo temporal: tu base recurrente es sana (+X €/año); estos compromisos vencen y el superávit vuelve a positivo en {año}». Con datos reales de `pablesite`: `committed_status=transient`, recuperación 2027, finding WARNING. No se ligó la clasificación al ingreso `one_off` del año (se descartó esa opción): basta operativo≥0 + recuperación pronta.

**UX del transitorio + posponer ingresos puntuales (2026-07-27).** Dos ajustes de Resumen sobre el caso transitorio. (1) La tarjeta «Lo más útil ahora» se **oculta** cuando `cash_flow.committed_status === 'transient'`: su recomendación (`review_budget`) y la CTA del diagnóstico del hero acababan las dos en `/presupuesto`, prometiendo una «mejora» que no aplica a compromisos que vencen solos; el diagnóstico del hero ya cubre el caso (`PlanView.vue`). (2) Nueva sección «Ingresos puntuales previstos» (`PlanOneOffIncomePlanner.vue`) para **posponer** un ingreso puntual que el usuario aún no cobra: `pablesite` tenía «Tito Ángel» (8.000 €, `one_off`, FY2026) sin forma de retrasarlo — el formulario de presupuesto no expone el año (lo fija su contexto) y su hint mandaba engañosamente «a Mi Plan». No hubo cambio de backend ni migración: `fiscal_year` ya es escribible en `AnnualIncomeEntrySerializer` (solo lo bloquea `_assert_not_plan_managed` para partidas `plan_event:`), así que la sección reutiliza `useAnnualIncomeStore('saas')` (`PATCH /api/budget/annual-income/{id}/`), presenta los `one_off` con año ≥ actual en una tabla con el estilo de Movimientos/Presupuesto y permite cambiar mes/año o quitarlos.

**Rediseño del bloque + paridad de edición (2026-07-27, 2ª iteración).** Tras revisión UX el bloque pasa a `PlanOneOffMovementsPlanner`: **desplegable colapsado por defecto**, incluye **ingresos y gastos** puntuales (excluye gastos `is_system_generated`), filas de **solo lectura con acción "Editar"** → modo inline que edita **importe + mes + año** (resuelve que en el plan no se pudiera tocar el importe), chip Ingreso/Gasto y letra compacta. El CTA "Revisar presupuesto" se **movió del hero** (donde flotaba sin anclaje) al pie del bloque. Y para cerrar la asimetría "en presupuesto no puedo cambiar mes/año", el formulario de presupuesto (`AnnualEntryModalForm.vue`) ahora expone **Mes objetivo y Año previsto** para partidas `one_off`, cableado en `useBudgetAnnualEntriesPage.ts` (`resolveDraftFiscalYear`): importe/mes/año se editan desde ambos sitios. Verificado en navegador (Playwright, `pablesite`): bloque colapsado con "3 ingresos · 10 gastos", modo edición inline funcional, hero sin CTA flotante, y el modal de presupuesto muestra Mes/Año al marcar una partida como puntual. Se corrigió también el copy engañoso del hint del formulario manual. Verificado en navegador (Playwright, `pablesite`): tarjeta oculta, sección con Tito Ángel 8.000 € editable, sin errores de consola.

**Fecha de jubilación sostenible (2026-07-26).** El motor trataba `plan.target_date` (el objetivo deseado) como fecha de jubilación: cortaba el salario ahí y reportaba una «fecha estimada» confusa (con datos reales, objetivo 2039 → el capital productivo se agota a 0 hacia 2045 y las pensiones lo reconstruyen → «estimada 2058»). Nueva semántica: `plan.target_date` es solo **aspiración**, y el titular pasa a la **jubilación sostenible más temprana** = primer año en que, dejando de trabajar entonces, el capital productivo **nunca baja del patrimonio a preservar** hasta el fin de proyección. Solver por **búsqueda binaria** (factibilidad monótona) reutilizando `calculate_projection` (`earliest_sustainable_retirement_year`, `services_projection.py`), con override de retiro en memoria sin mutar `plan.target_date` (`ProjectionService.calculate(retirement_year=...)`). El overview expone `desired_year`, `sustainable_year`, `sustainable_range` (por escenario) y `gap_years`; la trayectoria mostrada usa el retiro sostenible (ya no se desploma). Con datos reales de `pablesite`: **sostenible 2045** (rango 2042–2047), objetivo 2039, gap 6, capital mínimo 207.481 €. Pendiente (follow-up): alinear `Recommendation`/findings con la nueva fecha; jubilación por-persona; usar `member.employment_income_end_date` como tope de «hasta cuándo puedo trabajar».

**Bug patrimonio proyectado — doble resta de deuda asociada (2026-07-26).** La clasificación guarda cada bucket **neto** de su deuda asociada (`net_value = bruto − deuda_asociada`, `services_classification.py:128`) pero calcula `net_worth = total_activos_bruto − pasivos_totales`. La proyección hacía `net_worth = productivo + seguridad + no_productivo − pasivos_totales`, restando la deuda asociada **dos veces** → el patrimonio proyectado arrancaba por debajo del real (con `pablesite`: real 264.599,84 € vs proyección 238.900,33 €, exactamente los 25.699,51 € de deuda asociada efectiva) y producía un salto hacia abajo en el empalme histórico→proyección. Corregido: `ClassificationSummary` expone `associated_liabilities`, `ProjectionInputs` lo transporta y `calculate_projection` lo suma de vuelta en `net_worth`. `productive_capital` (renta sostenible, progreso, fecha sostenible) no cambia; solo se corrige la línea de patrimonio y el chequeo de preservación. Verificado: trayectoria 2026 pasa a 264.599,84 € = patrimonio real, sin salto.

**Follow-up abierto — patrimonio productivo histórico.** El timeline (`net_worth`/`total_assets`/`total_liabilities` por mes) no guarda el desglose productivo/seguridad; la clasificación solo existe para el estado actual. Dibujar la línea de capital productivo en el tramo histórico requiere que el timeline clasifique los activos mes a mes (capacidad backend nueva). Pendiente.

**Resolución Fase 9:** A-6 y A-9…A-14 quedan resueltos. El dominio usa el parser canónico de errores y extrae detalles anidados por campo; `/plan` reduce el primer nivel a titular, acción principal y trayectoria; escenarios guardados preceden al simulador y el detalle incorporado muestra su rastro presupuestario; el interés por defecto se alinea en 4,5 %; Activos colapsa grupos extensos; la trayectoria y subnavegación tienen tratamiento móvil específico. Validación Playwright ejecutada en 1440×900 y 390×844 sobre las cuatro rutas; los errores de consola observados al reemitir `/api/auth/me/` pertenecen al proxy CORS de validación, no a promesas de la aplicación.

---

## A-1 · Los Cimientos suman todos los años fiscales

**Severidad: crítica.** Es el hallazgo que invalida el diagnóstico visible en pantalla.

`AnnualIncomeEntry` y `AnnualExpenseEntry` tienen `fiscal_year`. Los helpers de cimientos filtran **solo** por `user + is_active`, sin ventana temporal:

- `core/backend/plan/services_foundations.py:88-93` — `annual_income_entries()` / `annual_expense_entries()`
- de ahí beben `structural_income()`, `structural_operating_expense()`, `temporary_commitment_expense()` y `debt_metrics()`

Con los datos reales de `pablesite` (2026-07-11), el motor devuelve:

```
structural_income (todos los años)            56.434,08 €   ← solo hay ingresos de 2026
structural_operating_expense (todos)          41.410,00 €   ← 36.610 (2026) + 4.800 (2028)
temporary_commitment_expense (todos)          93.858,66 €   ← acumula 2016..2031, préstamos ya terminados
committed_surplus = 56.434,08 - 135.268,66 = -78.834,58 €
```

Ese `-78.834,58 €` es exactamente el «Superávit −78.834,58 €» que la tarjeta de Cimientos muestra en `/plan`. Mientras tanto `/presupuesto` (FY 2026) muestra **+44.579,57 €** de balance previsto y 21 % de tasa de ahorro. Las dos cifras conviven en la misma sesión y se contradicen.

Efectos en cascada, todos observados:

1. **Score de flujo de caja 44/100** — calculado sobre ratios contaminados.
2. **Fondo de emergencia**: `coverage_months_committed = 1,50` y score 14/100, porque el gasto mensual comprometido incluye deudas de 2016-2025 ya extinguidas. `coverage_months_base = 4,89` (el «4,9 meses» de pantalla) también arrastra el gasto operativo de 2028.
3. **Finding «superávit comprometido negativo»** (`services_findings.py:70`) se dispara sin ser cierto.
4. **La recomendación principal** que ve el usuario («Reforzar el fondo de emergencia») nace de ese diagnóstico falso.
5. `planned_contribution_amount()` (`services_projection.py:515`) tiene el mismo defecto: hoy no se nota (solo hay una línea de ahorro/inversión, en 2026), pero una línea de ahorro de 2027 se contaría ya como aportación actual.

**Decisión de producto pendiente** (la spec de la fase 7 la fija): qué ventana usan los Cimientos. La propuesta es el **año fiscal en curso** (el mismo concepto de «FY activo» que ya usa `/presupuesto`), no el acumulado histórico.

## A-2 · Ingresos puntuales proyectados como renta perpetua

`core/backend/plan/services_projection.py:132-134` suma **todas** las partidas de ingreso activas, sin excluir `time_profile='one_off'` ni filtrar por año:

```
projection annual_income input = 215.738,48 €
    = 55.234,08 (structural_recurrent, 2026)
    +  1.200,00 (term_recurrent, 2026)
    + 159.304,40 (one_off, 2026)   ← ingresos puntuales
```

`future_income_for_year()` (`services_projection.py:478`) proyecta ese total como **renta laboral creciente** (`income_growth_rate`) hasta el fin de proyección (2065). Consecuencia: las retiradas post-objetivo (`nominal_target_income - future_income`) salen artificialmente bajas y la trayectoria es demasiado optimista.

Los Cimientos sí excluyen `one_off` (`structural_income()`). Motor y diagnóstico usan definiciones distintas de «ingreso».

## A-3 · `employment_income_end_date` es un campo muerto

El setup (`/plan/setup`) pide **«Fin de ingresos laborales»** (el usuario tiene 2049-10-13), el serializer lo expone (`plan/serializers.py:112`) y el modelo lo guarda. Ningún servicio lo lee: `grep employment_income_end_date` en `core/backend/plan/` solo da el serializer.

`future_income_for_year()` suma la renta laboral **todos los años del horizonte**, sin cortarla nunca. Combinado con A-2, la proyección asume ~215 k €/año de ingresos hasta 2065.

## A-4 · Combinaciones sin bucket

Los cimientos solo reconocen dos combinaciones de gasto:

- `structural_recurrent` + `operating` → gasto operativo
- `term_recurrent` + `temporary_commitment` → compromiso temporal

Todo lo demás **desaparece del diagnóstico en silencio** (no hay error, ni aviso, ni cajón «otros»). Con los datos reales queda fuera, entre otras:

- la línea del primer año parcial del coche (2027, 2.800 €), creada como `term_recurrent` + `operating` **por el propio motor** al incorporar el escenario (`services_scenarios.py`);
- `structural_recurrent` + `temporary_commitment` (8.505 € en 2026, 8.360 € en 2027).

Además la proyección filtra el gasto **solo** por `cashflow_role='operating'` ignorando el `time_profile` (`services_projection.py:136-141`), con lo que sí recoge esos 2.800 € (44.210 € frente a los 41.410 € de cimientos): dos módulos del mismo motor cuentan cosas distintas.

## A-5 · Input muerto en la proyección

`ProjectionInputs.annual_operating_expenses` se calcula (44.210 €) y se pasa, pero **no se usa en ningún cálculo** de `calculate_projection()`. El nivel de vida objetivo viene de `target_monthly_income_today_eur`. O se usa (p. ej. como semilla del objetivo) o se retira.

## A-6 · Contrato de errores roto en el dominio plan

`frontend/src/domains/plan/store.ts:27-32` construye el mensaje leyendo `error.response.data.detail`. El backend, desde la Fase 3 del refactor, responde con el contrato canónico:

```json
{"error": {"code": "validation_error", "message": "Request failed.", "details": {"name": ["Este campo es requerido."]}}}
```

Como `detail` no existe, **cualquier fallo** (400 de validación, 500, error de red) cae en el fallback y pinta el banner rojo **«No se pudo cargar Mi Plan.»** en la parte superior de la página, lejos del formulario que lo causó y sin errores por campo. Observado en `/plan/escenarios` con un 400 de validación real.

Además `submit()` en `frontend/src/views/PlanScenariosView.vue:133-136` no captura el error que el store relanza → `AxiosError` sin manejar en consola (`PAGEERROR` capturado en la sesión).

## A-7 · Las partidas de Mi Plan no están protegidas en `/presupuesto`

Al incorporar un escenario, Core crea líneas con `event_group = "plan_event:<scenario_id>"` (`services_scenarios.py:319,342`). El linaje existe, pero:

- `/presupuesto` **no distingue** esas líneas: se editan y se borran como cualquier otra;
- `event_group` es un **campo de texto libre** en el formulario de partida (`AnnualEntryModalForm.vue`, placeholder «Grupo de evento (opcional, ej: vivienda_2026)»), así que el usuario puede escribir a mano `plan_event:7`;
- si el usuario edita o borra una línea del coche, el `PlanEvent` no se entera: el evento y su presupuesto quedan desincronizados y el motor sigue aplicando los deltas del `planned_impact_json`.

## A-8 · La entrada manual exige clasificación experta

Para que Mi Plan interprete bien una partida creada a mano, el usuario debe acertar con `time_profile` **y** `cashflow_role` (ver A-4). Ambos se exponen como selectores crudos en el formulario. Una elección «equivocada» no da error: la partida simplemente no aparece en ningún diagnóstico.

Esto valida la intuición del usuario sobre **dos niveles de presupuesto**:

1. **Recurrente** (alimentación, transporte, ocio…) → entrada manual legítima en `/presupuesto`, `structural_recurrent`, año fiscal activo.
2. **Puntual / compromisos** (los que nacen de un escenario del plan) → **solo** desde Mi Plan, marcados con `event_group=plan_event:*`, de solo lectura en `/presupuesto`.

La fase 8 formaliza esta frontera; la fase 6 (ya planificada) cierra el ciclo de vida al dar de baja el evento.

## A-9 · Sobrecarga informativa en `/plan`

La vista muestra de una sola vez: hero con 4 métricas + 2 recomendaciones con 3 acciones cada una + progreso de capital + fechas objetivo/estimada + gráfico con 6 series en leyenda + calidad de datos + 5 indicadores de cimientos + acontecimientos. El usuario recibe todo el diagnóstico antes de haber entendido el titular.

Detalles concretos:

- La tarjeta **«Calidad de datos»** (desktop) es un bloque casi vacío con un enlace, y **duplica** el «Calidad de datos 100/100» que ya aparece en Cimientos.
- **«Renta sostenible 79,46 €»** se lee como un dato roto sin su contexto (es el 2 % del objetivo de 4.000 €/mes).
- La **fecha proyectada 2064** («29 años después del objetivo») es el mensaje más importante de la página y compite visualmente con otras tres métricas del mismo tamaño.

## A-10 · `/plan/escenarios`

- El formulario «Simular una decisión» está **siempre abierto** y ocupa la primera pantalla completa; los escenarios guardados quedan debajo (en móvil, tras mucho scroll).
- La lista de guardados no muestra fecha ni resumen de impacto; el estado («Incorporado» / «Descartado») va en monoespaciada sin chip de color y **no parece clicable** aunque lo es.
- Layout desktop con columnas derechas vacías (bloques «Cuándo» y «Cambios mensuales»).
- Los campos de importe no indican unidad (€) ni tienen ayuda contextual.
- Copy críptico: «Al incorporar, solo se actualiza el presupuesto futuro.»

## A-11 · Detalle de escenario incorporado

`/plan/escenarios/2` (Coche Ana, incorporado) muestra los inputs y un aviso de que ya forma parte del plan. Faltan las tres cosas que le darían valor: enlace al **acontecimiento** en el plan, las **partidas de presupuesto que generó** (con sus años fiscales) y la futura **acción de cierre** (fase 6).

## A-12 · `/plan/activos` en móvil

~60 activos en columna única producen una página de ~16.000 px. El grupo «Uso familiar» solo son 32 ítems. Faltan grupos colapsados por defecto y buscador *sticky*.

## A-13 · Trayectoria y subnavegación en móvil

El gráfico de trayectoria queda muy comprimido y su leyenda (6 series) ocupa casi tanto como el propio gráfico. La subnavegación del plan (Objetivo / Hipótesis / Supuestos / Clasificar activos) se apila como texto plano, sin jerarquía ni aspecto de control.

## A-14 · Placeholder de interés vs supuesto documentado

El formulario de escenarios sugiere `7` como interés anual (`PlanScenariosView.vue:293`, placeholder), mientras el drawer de Supuestos declara «Coste de deuda por defecto 4,5 %» (que es lo que el backend aplica si el campo se deja vacío). Uno de los dos números debe ceder.

---

## Cómo se reprodujo

Playwright dentro del contenedor `saas_frontend` (los navegadores del host fallan en WSL), con JWT de `pablesite` inyectado en `localStorage` y las llamadas del navegador a `127.0.0.1:8000/8001` reescritas hacia `core_backend` / `saas_backend`. Capturas en `frontend/.pw-shots/` (no versionadas).

Aviso para quien repita la sesión: las **mutaciones** (POST/PUT/PATCH) reemitidas a través de ese proxy pueden llegar a Django con el cuerpo vacío. Antes de dar por bueno un fallo de validación visto a través del proxy, hay que re-probarlo con una petición directa desde el contenedor. El único escenario de prueba creado durante la auditoría (`__pw_probe_borrar`) fue eliminado; **no se modificaron datos reales del usuario**.
