# Milestone 14 Roadmap: Modulo Contabilidad con temporalidad

## Objetivo
Definir y entregar el primer modulo de contabilidad (`Modulo Contabilidad`) para introducir comportamiento temporal en los registros financieros y habilitar datos ejecutados mensuales reutilizables por dashboards y diagnosticos.

## Contexto y motivo del hito
1. Hasta Milestone 13, el producto trabaja principalmente con fotografia anual/manual (planificacion y estado actual), con diagnosticos derivados.
2. Milestone 10 (`Dashboard Presupuesto`) ya dejo preparada la UX para comparar `Planificado` vs `Ejecutado`, pero el `Ejecutado` real sigue pendiente de este hito.
3. Milestone 11 (`Fase 2`) y Milestone 12 (`Fase 3`) se benefician en el futuro de historico mensual (variabilidad real, estacionalidad, confirmacion de recurrencias), aunque sus v1 no dependen de ello.
4. Este hito crea la base temporal para pasar de `datos estaticos` a `evolucion mensual`, sin romper la semantica actual de entradas anuales.

## Estado actual (progreso del hito)
### Avance actual (en curso)
1. Se esta trabajando activamente en el flujo de `Pasivos` dentro de `Introduccion de datos`.
2. Ya existe generacion automatica de `gastos recurrentes` (entradas anuales recurrentes por ano) a partir de pasivos con calendario/cuotas.
3. Se ha mejorado la UX del formulario de pasivos para reducir ruido y hacer mas compacta la captura.
4. Se ha empezado a enlazar la logica de calendario del pasivo (plazo/cuotas y fecha fin) para acelerar la introduccion de datos.
5. Se esta afinando la validacion del gasto autogenerado para evitar clasificaciones incorrectas y reforzar reglas entre `temporalidad` y `naturaleza`.

### Subhito 14A (estado actual)
Objetivo:
1. Cerrar un flujo robusto `pasivo -> cronograma de deuda v1 -> gastos recurrentes anuales autogenerados`.

Implementado (14A):
1. Motor de deuda v1 para `tipo fijo` con frecuencia `mensual` y `trimestral` (cuota constante).
2. Validacion de plazo trimestral (`term_months` multiplo de 3).
3. Generacion automatica de gastos recurrentes anuales a partir del cronograma del pasivo.
4. Re-sincronizacion al editar pasivo (idempotente, sin duplicar entradas autogeneradas).
5. Preservacion de overrides manuales del usuario en entradas anuales generadas cuando la anualidad sigue existiendo.
6. Borrado de anualidades autogeneradas obsoletas cuando el nuevo cronograma reduce el plazo.
7. UX del formulario de pasivos simplificada a lo soportado en v1 (menos ruido en `condiciones`).

Pendiente para cerrar 14A:
1. Remate de documentacion/roadmap (este paso).
2. Barrido final de validaciones de calidad afectadas y checkpoint de release/commit.

### Situacion funcional actual de este subfrente
1. El subflujo de pasivos ya aporta valor a Milestone 14 porque conecta:
   - metadata temporal del pasivo
   - interpretacion de deuda
   - generacion de gasto anual derivado
2. El objetivo inmediato no es solo guardar el pasivo, sino mejorar la calidad del dato derivado que alimenta el `balance anual`.

## Intencion de producto
1. Mantener la simplicidad de captura anual actual (`Introduccion de datos`) como capa de plan.
2. Agregar una capa de seguimiento mensual (`check-ins`) para registrar lo que realmente ocurre.
3. Permitir una lectura contable minima pero consistente:
   - que paso este mes
   - cuanto llevamos ejecutado en el ano
   - desviacion vs presupuesto
4. Preparar contratos estables para reutilizacion en:
   - `Dashboard Presupuesto` (Milestone 10)
   - futuros analisis de resultado mensual/anual (Milestone 17)
   - refinamientos de fases de `Guia`

## Alcance (Hito 14)
### 1) Ingresos (`Ingresos`)
1. Soporte de temporalidad para entradas recurrentes y eventos puntuales.
2. Check-in mensual por entrada (confirmar importe real del mes, ausencia o ajuste).
3. Acumulados ejecutados por mes y por categoria.

### 2) Gastos (`Gastos`)
1. Soporte de temporalidad para entradas recurrentes y eventos puntuales.
2. Check-in mensual por entrada (confirmar importe real del mes, ausencia o ajuste).
3. Acumulados ejecutados por mes y por categoria.

### 3) Activos (`Activos`)
1. Metadatos para mobiliario/equipamiento depreciable (vida util, fecha aproximada, criterio de depreciacion v1).
2. Metadatos de amortizacion/depreciacion de activos con:
   - fecha de inicio/adquisicion
   - valor de compra inicial
   - modelo de amortizacion (al menos lineal/manual)
3. Metadatos ampliados para activos financieros:
   - riesgo
   - volatilidad
   - rentabilidad esperada/actual
   - comisiones/costes
4. Sincronizacion de estos metadatos con calculos y vistas existentes sin degradar la UX actual.

### 4) Pasivos (`Pasivos`)
1. Mantener modelo actual compatible, ampliando datos temporales minimos del pasivo:
   - fecha de inicio (`start_date`)
   - fecha prevista de finalizacion (`expected_end_date`) o plazo (`term_months`)
2. Preparar ampliacion de metadata de amortizacion (base para `cuota mensual` automatica).
3. Anadir metadata especifica para hipotecas y prestamos complejos (comisiones y costes del pasivo).
4. Mejorar la UX del formulario de pasivos para autocompletar y reducir friccion de captura (en curso).
5. Validar visualmente el gasto anual autogenerado desde el pasivo en el momento de creacion (en curso).

### 5) Upgrade de deuda pendiente (base de amortizacion)
1. Agregar metadata necesaria para calculo automatico de `cuota mensual` cuando el producto lo soporte completamente:
   - fecha inicio / fecha fin o plazo
   - tipo de calendario/frecuencia
   - comportamiento del tipo (fijo/variable, v1 simplificado)
   - sistema de amortizacion (v1 puede quedar acotado a frances/fijo)
2. Si el calculo automatico completo no entra en la entrega inicial del hito, al menos debe quedar el contrato persistido y validado.

### 5B) Refinamiento de captura inteligente de pasivos (nuevo subfrente dentro del hito)
1. Dependiendo de la categoria del pasivo, autocompletar el maximo de campos razonables:
   - frecuencia por defecto
   - tipo de interes por defecto
   - sistema de amortizacion sugerido
   - campos visibles/obligatorios por categoria (ej. hipoteca vs prestamo personal)
2. Aplicar reglas especificas de `hipoteca` solo cuando corresponda (comisiones, costes y comportamiento esperado).
3. Mejorar sugerencias de `activo financiado` con heuristicas de nombre:
   - coincidencia exacta
   - coincidencia parcial
   - similitud simple (ej. `iPhone` -> `iPhone Pro 16`)
4. Mantener confirmacion explicita del usuario antes de guardar sugerencias automaticas para evitar errores silenciosos.

## Fuera de alcance (Hito 14)
1. Contabilidad de doble partida completa (asientos, libro mayor, conciliacion bancaria, plan contable formal).
2. Importacion bancaria automatica (PSD2/Open Banking) o OCR de recibos.
3. Motor de reconciliacion de movimientos con reglas.
4. Cierre fiscal o reportes tributarios.
5. Redefinicion total de dashboards existentes fuera del consumo de datos ejecutados.
6. Calculo definitivo de `cuota mensual` para todos los tipos de deuda complejos (carencia, tipo variable real, recalculos historicos).

## Principios de diseno del modulo
1. Compatibilidad hacia atras: los datos actuales deben seguir funcionando aunque el usuario no use check-ins.
2. Modelo incremental: primero registrar `ejecutado` mensual, luego enriquecer precision y automatizaciones.
3. Separacion clara entre:
   - `Plan` (anual / intencion)
   - `Ejecutado` (observado por mes)
4. Trazabilidad minima: saber si un valor ejecutado viene de confirmacion explicita, ajuste manual o ausencia de check-in.
5. Contratos estables de lectura para no acoplar dashboards a detalles internos de persistencia.
6. Captura por valor util: priorizar cierres mensuales y confirmaciones sobre registro manual de cada movimiento.

## Estrategia de captura de datos (niveles de uso)
### Nivel 1 - Lite (por defecto)
1. El usuario no registra movimientos individuales del dia a dia.
2. Realiza check-in mensual por categoria o por entrada recurrente.
3. Confirma, ajusta o marca ausencias, y solo agrega eventos puntuales.
4. Objetivo UX: cierre mensual rapido con alto valor para `Presupuesto` y diagnosticos.

### Nivel 2 - Guiado (intermedio)
1. El sistema propone el mes a partir del plan anual y recurrencias existentes.
2. El usuario revisa diferencias y confirma cambios relevantes.
3. Se prioriza una experiencia de "revision/cierre" frente a captura desde cero.

### Nivel 3 - Detalle (avanzado, opcional)
1. Registro manual de movimientos individuales de ingresos/gastos.
2. Pensado para usuarios que valoran granularidad y trazabilidad maxima.
3. No debe ser requisito para obtener valor del modulo.

## Modelo funcional propuesto (primera iteracion del hito)
### A. Capa de planificacion (ya existente, con extensiones)
1. Entradas de `Ingresos` y `Gastos` siguen siendo el origen del presupuesto anual.
2. Cada entrada debe poder declarar su comportamiento temporal:
   - recurrente estructural
   - recurrente temporal
   - puntual (evento aislado)
3. Las entradas puntuales deben poder indicar mes/fecha objetivo.

### B. Capa de ejecucion mensual (nueva)
1. Cada mes del ano puede registrar `check-ins` por entrada de ingreso/gasto.
2. Un check-in mensual permite:
   - confirmar importe previsto
   - editar importe ejecutado real
   - marcar que no ocurrio
   - registrar observacion opcional (si ya existe soporte de notas)
3. La ausencia de check-in no debe bloquear el sistema; se mostrara como `pendiente` o `sin confirmar`.

### C. Capa de lectura agregada (nueva)
1. Agregados mensuales por categoria para `Ingresos` y `Gastos`.
2. Acumulado YTD (`year-to-date`) planificado vs ejecutado.
3. Estado de cobertura de check-ins por mes (porcentaje confirmado / pendiente).
4. Senales de calidad de dato para dashboards (por ejemplo `executedDataCompleteness`).

## Requisitos funcionales (primera iteracion del hito)
1. El usuario puede registrar entradas puntuales (eventos aislados) en `Ingresos` y `Gastos`.
2. El usuario puede hacer check-in mensual de ingresos y gastos sin perder la configuracion anual base.
3. El sistema puede calcular `ejecutado mensual` y `acumulado` por categoria.
4. El sistema diferencia entre:
   - importe planificado
   - importe ejecutado confirmado
   - importe pendiente de confirmacion
5. `Dashboard Presupuesto` puede consumir un contrato de lectura con series de `Planificado` y `Ejecutado`.
6. Si no hay datos ejecutados suficientes, la UI mantiene placeholders/mensajes claros (comportamiento definido en Milestone 10).
7. El modelo de activos admite metadatos financieros ampliados sin romper formularios existentes.
8. El modelo de pasivos admite metadata de amortizacion base y validaciones consistentes.
9. La captura de datos debe soportar operacion util sin exigir registro de movimientos individuales (modo Lite).

## Requisitos de datos y contratos (propuestos)
### Ingresos/Gastos - temporalidad
1. Campos minimos nuevos (nombres orientativos, ajustables a estilo del repo):
   - `temporal_mode`: `recurrent` | `punctual`
   - `target_month` (para evento puntual)
   - `active_from_month` / `active_to_month` (si aplica)
2. Check-in mensual (entidad o estructura equivalente):
   - `year`
   - `month`
   - `entry_id`
   - `status`: `confirmed` | `adjusted` | `skipped` | `pending`
   - `executed_amount`
   - `confirmed_at` (opcional)
   - `note` (opcional)

### Contrato de lectura para Presupuesto (Milestone 10 dependency)
1. Serie mensual por categoria:
   - `planned_by_month[12]`
   - `executed_by_month[12]`
   - `pending_by_month[12]` (si se decide exponer)
2. Totales:
   - `planned_total`
   - `executed_total`
   - `variance_total`
3. Metadatos de calidad:
   - `has_executed_data`
   - `completion_ratio`
   - `months_with_checkins`

### Activos - metadatos ampliados
1. Mobiliario/equipamiento depreciable:
   - `is_depreciable`
   - `acquired_at` (fecha o ano/mes)
   - `useful_life_years`
   - `depreciation_method` (v1 acotado)
2. Activos financieros:
   - `risk_level`
   - `volatility_profile`
   - `expected_yield`
   - `current_yield` (si aplica)
   - `fee_ratio` / `fees`

### Pasivos - metadata de amortizacion (base)
1. `amortization_enabled` (o equivalente)
2. `principal_amount`
3. `start_date`
4. `expected_end_date` o `term_months`
5. `rate_type`
6. `annual_rate_nominal` / `tae` (segun contrato actual)
7. `payment_frequency`
8. `amortization_system`
9. `manual_monthly_payment` se mantiene como fallback mientras coexistan ambos modos
10. Metadata adicional para hipoteca (cuando `liability_type = mortgage`, nombres orientativos):
   - `opening_fees`
   - `early_repayment_fee`
   - `novation_or_subrogation_fee`
   - `linked_products_cost` (opcional; revisar si modelar aparte como gasto)

## UX / Arquitectura de informacion (primera iteracion del hito)
1. `Introduccion de datos` mantiene el alta/edicion de entradas anuales como flujo principal.
2. Se agrega experiencia de check-in mensual (ubicacion exacta a decidir en implementacion):
   - dentro de `Introduccion de datos`
   - o como vista relacionada desde `Presupuesto`
3. La interfaz debe dejar explicito:
   - que es `Plan`
   - que es `Ejecutado`
   - que esta `Pendiente`
4. El usuario debe poder operar mes a mes sin reconfigurar categorias ni entradas base.
5. Estados vacios deben ser pedagogicos (especialmente en primera configuracion del ano).
6. La UX debe favorecer `modo Lite` por defecto y permitir evolucion progresiva a `Guiado`/`Detalle`.

## Estrategia de implementacion recomendada (por fases internas del hito)
### Fase A - Contratos y modelos base (prioridad alta)
1. Cerrar contratos de datos objetivo del hito (ingresos/gastos temporales, activos, pasivos).
2. Extender schema de `Pasivos` con fechas (`start_date`, `expected_end_date`/`term_months`) y metadata hipotecaria base.
3. Extender schema de `Activos` con depreciacion y metadatos financieros.
4. Validaciones backend/frontend y compatibilidad con datos existentes.

### Fase B - Temporalidad de ingresos/gastos y check-ins (prioridad alta)
1. Modelo de datos para eventos puntuales + check-ins mensuales.
2. API/servicios para CRUD de check-ins.
3. Soporte de captura simplificada (modo Lite como flujo principal).

### Fase C - Read model y consumo de presupuesto (prioridad alta)
1. Agregados de lectura para series plan vs ejecutado (mensual + YTD).
2. Metadatos de completitud/pendiente para calidad de dato.
3. Integracion con `Dashboard Presupuesto` (activar `Ejecutado` real).

### Fase D - Base de amortizacion automatica (prioridad media)
1. Consolidar metadata de amortizacion en pasivos.
2. Mantener `manual_monthly_payment` como fallback.
3. Si entra en plazo:
   - calculo automatico de cuota para caso simple (tipo fijo + cuota constante)
4. Estado actual:
   - caso simple operativo en v1 para `mensual` y `trimestral`
   - fuera de alcance v1: variable/mixto, carencias, recalculo historico, otros sistemas de amortizacion

### Fase D2 - Asistentes de captura y autocompletado en pasivos (prioridad media)
1. Reglas de autocompletado por categoria de pasivo (`defaults` + visibilidad condicional).
2. Sugerencias de `activo financiado` por similitud de nombre y contexto.
3. Confirmacion/ajuste del gasto autogenerado en el flujo de alta del pasivo.

## Dependencias
1. Milestone 08 (`Introduccion de datos`) como base de entradas anuales y categorias.
2. Milestone 10 (`Dashboard Presupuesto`) como consumidor principal de `Ejecutado`.
3. Milestone 11 (`Fase 2`) para futura mejora con series reales de caja mensual.
4. Milestone 12 (`Fase 3`) para futura mejora de variabilidad y cobertura con historico.
5. Milestone 17 (`Resultado mensual/anual`) como consumidor directo posterior de este modelo.

## Criterios de aceptacion (Hito 14)
1. Se pueden registrar ingresos y gastos puntuales con comportamiento temporal consistente.
2. Se pueden registrar check-ins mensuales de ingresos/gastos y consultar agregados mensuales/YTD.
3. `Dashboard Presupuesto` puede mostrar datos `Ejecutado` reales cuando existan check-ins.
4. La UI mantiene comportamiento seguro cuando faltan check-ins (placeholders / estado pendiente).
5. Activos aceptan metadatos ampliados definidos en el alcance sin romper datos existentes.
6. Pasivos aceptan fechas de inicio/fin previstas y metadata de amortizacion base sin romper datos existentes.
7. Hipotecas aceptan metadata de comisiones/costes del pasivo definida para la primera iteracion.
8. Core y SaaS conservan contratos compartidos donde aplique (o divergencia documentada si es SaaS-only).
9. Quality gates afectados pasan en Docker para los componentes modificados.
10. El flujo de alta de pasivo reduce friccion de captura con autocompletado de campos por defecto (moneda/base y defaults de categoria donde aplique).
11. El usuario puede revisar/validar el gasto anual autogenerado desde el pasivo antes de continuar.

## Plan de validacion (objetivo)
1. SaaS backend (`backend/`):
   - `docker compose exec -T saas_backend ruff check .`
   - `docker compose exec -T saas_backend ruff format --check .`
   - `docker compose exec -T saas_backend mypy .`
2. Core backend (`core/backend/`) si se toca:
   - `cd core`
   - `docker compose exec -T backend ruff check .`
   - `docker compose exec -T backend ruff format --check .`
   - `docker compose exec -T backend mypy .`
3. SaaS frontend (`frontend/`) si se toca:
   - `docker compose exec -T saas_frontend npm run lint`
   - `docker compose exec -T saas_frontend npm run format:check`
   - `docker compose exec -T saas_frontend npm run typecheck`
4. Core frontend (`core/frontend/`) si se toca:
   - `cd core`
   - `docker compose exec -T frontend npm run lint`
   - `docker compose exec -T frontend npm run format:check`
   - `docker compose exec -T frontend npm run typecheck`
5. Tests dirigidos (segun implementacion final):
   - backend de contabilidad/check-ins
   - frontend de presupuesto / check-in mensual

## Riesgos y mitigaciones
1. Riesgo: duplicar logica de agregacion en backend y frontend.
   - Mitigacion: centralizar el agregado canonical en backend y exponer contrato de lectura estable.
2. Riesgo: ambiguedad entre `pendiente` y `0 ejecutado`.
   - Mitigacion: estado explicito de check-in y serializacion separada de importes vs estado.
3. Riesgo: complejidad de UX al mezclar plan anual y ejecucion mensual.
   - Mitigacion: separar visualmente `Plan`, `Ejecutado`, `Pendiente` y usar copy contextual.
4. Riesgo: intentar capturar movimientos diarios como requisito reduce adopcion.
   - Mitigacion: `modo Lite` por defecto con cierre mensual y eventos puntuales.
5. Riesgo: migraciones de datos rompen formularios actuales.
   - Mitigacion: defaults compatibles y fallback a comportamiento anterior cuando no haya temporalidad configurada.
6. Riesgo: comisiones/seguros de hipoteca se mezclan con coste financiero y distorsionan metricas.
   - Mitigacion: distinguir metadata del pasivo vs gastos asociados; documentar criterio de modelado.
7. Riesgo: calculo de cuota automatica introduce errores financieros si se abre demasiado el alcance.
   - Mitigacion: limitar v1 a metadata base y, si se implementa calculo, acotarlo a casos simples con tests.

## Decisiones abiertas a cerrar durante implementacion
1. Ubicacion UX del check-in mensual (`Introduccion de datos` vs `Presupuesto` vs vista nueva).
2. Nivel de granularidad del check-in:
   - por entrada individual
   - por categoria con reparto implicito (menos recomendable para trazabilidad)
3. Contrato exacto de `Ejecutado` para Milestone 10:
   - incluir `pending_by_month` o calcularlo solo en frontend
4. Alcance real del calculo automatico de `cuota mensual` en este hito (metadata only vs caso simple operativo).
   - Cerrado para `14A`: caso simple operativo (tipo fijo, cuota constante) con frecuencia mensual y trimestral.
5. Tratamiento final de costes vinculados a hipoteca:
   - metadata dentro del pasivo
   - o gastos separados en `Gastos` con vinculacion al pasivo
6. Estrategia de autocompletado de `activo financiado`:
   - solo por seleccion manual
   - sugerencia por nombre con confirmacion
   - autoseleccion condicionada a alta confianza
7. Que campos de `condiciones` deben ser editables/visibles por categoria de pasivo en v1 (especialmente `hipoteca`).
   - Parcialmente cerrado en `14A`: UI simplificada a `TAE anual` + `frecuencia`; `tipo de interes` y `sistema de amortizacion` ocultos/fijados por defecto en v1.

## Entregables esperados
1. Documento de detalle del Milestone 14 (este archivo).
2. Cambios de modelo/serializacion/API para temporalidad de ingresos y gastos.
3. Experiencia de check-in mensual (v1).
4. Integracion de `Ejecutado` en `Dashboard Presupuesto`.
5. Extension de metadatos en activos y pasivos segun alcance final del hito.
6. Tests/validaciones y resumen de release del hito (`release-summary-milestone-14-...`) al cerrar implementacion.
