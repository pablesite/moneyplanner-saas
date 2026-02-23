# Milestone 12 Roadmap: Guide Phase 3 Emergency Fund (`Fase 3: Fondo de emergencia`)

## Objective
Definir y entregar una primera version del diagnostico detallado de `Guia` para `Fase 3: Fondo de emergencia`, centrado en la cobertura real de gastos esenciales con liquidez utilizable.

## Context (How Phases 1, 2 and 4 ended up)
1. Fase 1 (`Deuda`) quedo con un modelo compuesto de coste + riesgo estructural (2 score cards + score global).
2. Fase 2 (`Flujo de caja`) evoluciono a un score compuesto de tension recurrente, separando gasto estructural, compromisos temporales y contexto extraordinario.
3. Fase 4 (`Salud patrimonial`) quedo con un modelo compuesto de respaldo + distribucion del riesgo y una clasificacion explicita de activos iliquidos.
4. Fase 3 v1 debe reutilizar esas bases en lugar de crear una semantica nueva:
   - denominador de cobertura: semantica de Fase 2
   - clasificacion de liquidez: baseline de Fase 4
   - UX del detalle: patron de Fases 1/4

## Scope (V1)
1. Activar el detalle diagnostico de Fase 3 en `Guia` (Core + SaaS frontend parity).
2. Definir un score global de Fase 3 (`0-100`) con enfoque de cobertura + calidad de liquidez.
3. Mostrar KPIs de liquidez y cobertura en meses dentro del detalle de fase.
4. Reutilizar `computeGuidePhaseDiagnostics` para el score global compartido.
5. Añadir tests unitarios y de vista para la primera version.

## Out Of Scope (V1)
1. Recomendaciones accionables automaticas (traspasar desde inversiones, ventas, etc.).
2. Integracion con contabilidad historica (Milestone 14) para variabilidad mensual real.
3. Ajuste fino por perfil familiar/laboral (autonomo vs asalariado, dependientes, etc.).
4. Backtesting del fondo de emergencia contra series temporales.

## Product Intent
1. Fase 3 debe responder: `Mi liquidez actual me permite absorber un bache de gastos?`
2. El score debe priorizar cobertura real de gasto esencial y no solo volumen de activos.
3. La lectura debe ser compatible con Fase 2 (gasto operativo / cargas temporales) y con Fase 4 (liquidez vs iliquidez).

## Phase 3 Diagnostic Model (V1)
### Definitions (V1)
1. `Liquidez de emergencia util`:
   - `cash:*`
   - inversiones liquidables (`deposits`, `funds`, `etfs`, `roboadvisor`, `stocks`, `cryptocurrencies`)
   - excluye inversiones iliquidas ya tratadas en Fase 4 (`pension_plans`, `real_estate_crowd`, `crowdlending`, `investments:other`)
2. `Liquidez inmediata`:
   - activos `cash:*` (subset de la liquidez util)
3. `Gasto base mensual` (desde Fase 2):
   - `gasto operativo estructural / 12`
4. `Gasto actual mensual con compromisos` (desde Fase 2):
   - `(gasto operativo estructural + compromisos temporales) / 12`

### Score (V1, `0-100`)
Score compuesto con 4 senales:
1. `Meses de gasto base cubiertos` (mayor es mejor)
2. `Meses de gasto actual cubiertos` (mayor es mejor; captura tension temporal)
3. `% liquidez util / activos` (mayor es mejor, saturado)
4. `% liquidez inmediata / liquidez util` (mayor es mejor)

Pesos V1:
1. Cobertura gasto base: `45%`
2. Cobertura gasto actual: `25%`
3. Peso de liquidez sobre activos: `15%`
4. Calidad inmediata dentro de la liquidez: `15%`

## UX / Information Architecture (V1)
1. Mismo patron que Fases 1 y 4:
   - summary cards
   - global score badge + meter
   - score cards con KPIs y barras
2. Dos score cards:
   - `Cobertura del colchon`
   - `Calidad de liquidez`
3. Mantener copy explicito indicando que el denominador reutiliza la semantica de Fase 2.

## Functional Requirements (V1)
1. `Guia > Fase 3` deja de mostrar placeholder y renderiza diagnostico.
2. El score global de Fase 3 se calcula en `computeGuidePhaseDiagnostics` (Core + SaaS).
3. El detalle muestra, como minimo:
   - liquidez de emergencia util
   - liquidez inmediata
   - meses de gasto base cubiertos
   - meses de gasto actual cubiertos
4. Si no hay gasto operativo suficiente para calcular meses, la UI mantiene KPIs informativos (`-`) y el score sigue siendo finito.
5. Core/SaaS mantienen paridad visual y de scoring.

## Dependencies
1. Milestone 08 (datos de ingresos/gastos/anuales y activos/pasivos).
2. Milestone 11 (semantica de gasto estructural y compromisos temporales de caja).
3. Milestone 13 / Fase 4 (criterio de liquidez/iliquidez reutilizable en `Guia`).

## Acceptance Criteria (V1)
1. Fase 3 detail route en `Guia` renderiza diagnostico en Core y SaaS.
2. `computeGuidePhaseDiagnostics` expone `phase3GlobalScore`.
3. El score mejora cuando aumenta la liquidez util o la cobertura en meses (a igual gasto).
4. Los tests de diagnostico y vista afectados pasan en ambos frontends.

## Validation Plan (Targeted)
1. SaaS frontend:
   - `docker compose exec saas_frontend npm run typecheck`
   - `docker compose exec saas_frontend npm run test:unit -- src/domains/guide/__tests__/phaseDiagnostics.spec.ts src/views/__tests__/GuidePhaseDetailView.spec.ts`
2. Core frontend:
   - `cd core`
   - `docker compose exec frontend npm run typecheck`
   - `docker compose exec frontend npm run test:unit -- src/domains/guide/__tests__/phaseDiagnostics.spec.ts src/views/__tests__/GuidePhaseDetailView.spec.ts`

## Deliverables (V1)
1. Milestone 12 roadmap detail document (this file).
2. Fase 3 guide diagnostic v1 in SaaS frontend.
3. Fase 3 guide diagnostic v1 parity in Core frontend.
4. Targeted unit/view test coverage for v1 behavior.
