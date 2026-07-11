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
