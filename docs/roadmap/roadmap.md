# Roadmap Global del Producto

## Objetivo
Mantener una vision unica del producto, alineada con el codigo y con la estrategia comercial actual:
1. Lanzar primero `Community/Core` + `Cloud Basic` como PVM.
2. Introducir `Cloud Pro` en una iteracion posterior.
3. Introducir `Cloud Premium` en una iteracion posterior.

## Rebaselining de producto (2026-02-25)
### Principio de valor por linea
1. `Community/Core`: "Donde estoy?"
2. `Cloud Pro`: "Como mejoro?"
3. `Cloud Premium`: "Como optimizo y acelero?"

### Mundos separados (decision de producto)
1. `Community/Core` es `self-hosted` y no se conecta al Cloud.
2. `Cloud Basic`, `Cloud Pro` y `Cloud Premium` existen solo en Cloud.
3. `Cloud Basic` es el mismo core funcional servido como SaaS (comodidad + operacion gestionada), sin inteligencia Pro/Premium.

### Tiers objetivo (resumen)
1. `Community/Core` (gratis, self-hosted): gestion financiera base + guia de entrada + estadisticas basicas.
2. `Cloud Basic` (~3 EUR/mes): mismo core + hosting/backups/actualizaciones/multidispositivo/PWA minima.
3. `Cloud Pro` (~10-15 EUR/mes): fases + scores + agente basico + objetivos + simulador basico + notificaciones basicas.
4. `Cloud Premium` (~25-35 EUR/mes): familia + agente avanzado + simulacion avanzada + analisis avanzado + foto/voz + ASTRA informativo.

## Estado global (real, contrastado con docs y codigo)
El producto ya tiene una base funcional y tecnica mas madura de lo que reflejaba el roadmap global anterior, pero la planificacion seguia organizada por milestones funcionales lineales y no por estrategia de producto/lanzamiento.

### Que esta consolidado (historico)
1. Separacion `core` / `saas` completada (Milestone 02).
2. Refactor y endurecimiento de calidad/documentacion completados (Milestone 04).
3. Identidad separada y RBAC SaaS completados (Milestone 05 / 05B).
4. Mejoras de UX/analytics de patrimonio completadas (Milestone 06).
5. `Introduccion de datos` (Milestone 08) completada en Core/SaaS.
6. `Presupuesto` v1 (planificado) completado en Core/SaaS (Milestone 10).
7. Fases/diagnosticos 1-4 de `Guia` entregados (Milestones 09, 11, 12, 13), con paridad Core/SaaS en diagnosticos compartidos.

Referencias historicas relevantes:
1. `docs/roadmap/release-summary-milestone-10-budget-dashboard.md`
2. `docs/roadmap/release-summary-milestone-11-phase-2-cash-flow-guide-detail.md`
3. `docs/roadmap/release-summary-milestone-12-phase-3-emergency-fund-guide-detail.md`
4. `docs/roadmap/release-summary-milestone-13-guide-phase-detail.md`

### Estado construido actual (codigo) que impacta el PVM
#### Core (`core/`) - base del PVM
1. Backend con modulos `accounts`, `core`, `budget`, `net_worth`.
2. Frontend con vistas operativas para:
   - `Inicio`
   - `Guia`
   - `Introduccion de datos`
   - `Patrimonio`
   - `Presupuesto`
   - `Data` (auxiliares)
3. Datos anuales de ingresos/gastos con semantica `recurrente` y `puntual` (`one_off`).
4. Metadatos de flujo de caja (`time_profile`, `cashflow_role`, `event_group`, `term_end_year`) ya presentes y usados por diagnosticos.
5. Import/export portable (JSON) ya implementado en frontend de captura de datos (util para backup/manual migration).
6. Evolucion del Milestone 14 ya avanzada en backend Core:
   - `monthly check-ins` para ingresos y gastos
   - resumenes mensuales / YTD de presupuesto
   - `target_month` para gastos puntuales
   - `LiquidityMonthlyCheckin` en patrimonio (base de cierre mensual de liquidez)
7. Flujo de pasivos enriquecido (metadatos de amortizacion y sincronizacion con gasto anual autogenerado) en progreso avanzado.

#### SaaS (`backend/` + `frontend/`) - base de Cloud
1. Backend SaaS dedicado para:
   - auth SaaS
   - admin SaaS
   - membresias/suscripciones
   - RBAC SaaS
2. Frontend SaaS con features adicionales respecto a Core:
   - `People` (familia/titularidades)
   - `Account`
   - `Admin users`
   - vistas extra de settings (`FX`, `IPC`)
   - `cierre-mensual` como modo de `Presupuesto`
3. `capabilities` ya separan Core vs SaaS (actualmente con flags basicos `isPremium`, `people`, `ownership`).
4. El gating actual de membresias es binario (`premium` si/no), no un modelo de planes `basic/pro/premium`.

### Gaps claros frente a tu nueva estrategia (PVM y siguientes)
#### Para `Community/Core` (PVM)
1. Cerrar funcionalmente y documentar el alcance "core" objetivo (feature freeze explicito).
2. Completar y estabilizar el tramo prioritario de Milestone 14 que aporta valor directo al core:
   - cierre mensual / check-ins
   - `Ejecutado` real en `Presupuesto`
   - UX de cierre mensual util
3. Consolidar un unico baseline de frontend Fase A entre `core` y `saas` (ahora van a ritmos diferentes por slices historicos).
4. `Guia`/fases existen en frontend pero deben reubicarse como feature de `Cloud Pro` sin perder el trabajo ya hecho.
5. Wizard de onboarding / checklist de completitud (Milestone 24) aun no implementado.
6. CSV import manual basico no identificado como capability implementada (si existe portable JSON, pero no CSV).
7. Cierres mensual/anual como flujo producto formal (mas alla de ruta/piezas tecnicas) aun requieren consolidacion UX y criterio de "cierre".
8. `Cartera de inversion` como modulo dedicado aun no esta cerrada para Fase A (aunque hay base de seguimiento en patrimonio).

#### Para `Cloud Basic` (PVM)
1. No hay PWA (no aparece plugin/config PWA en `frontend`).
2. El modelo SaaS de suscripcion no distingue `Basic`, `Pro`, `Premium`.
3. Falta mapa de capabilities por plan para backend/frontend.
4. Falta aterrizar operacion de `Cloud Basic` como producto:
   - backups automaticos
   - actualizaciones operadas
   - observabilidad minima
   - runbook de incidencias SaaS en produccion
5. Falta flujo comercial de cobro (landing/pagos) para lanzar SaaS de pago.

#### Para `Cloud Pro` y `Cloud Premium`
1. Existen piezas reutilizables (fases, scores, datos de calidad), pero no un producto Pro/Premium empaquetado.
2. Falta arquitectura de planes/capabilities y separacion de features avanzada.
3. Muchas capacidades descritas (agente, objetivos, simuladores avanzados, ASTRA, foto/voz) siguen en roadmap conceptual.

## Estado de milestones (lectura actualizada)
### Milestones historicos cerrados
1. `01` a `06`: completados (fundacion, split, refactor, identidad/RBAC, UX net-worth).
2. `08`: completado (`Introduccion de datos`).
3. `09`, `11`, `12`, `13`: completados (fases/diagnosticos `Guia`; caveats de paridad ya resueltos segun release docs recientes).
4. `10`: completado para `Planificado`; la parte `Ejecutado` depende de Milestone 14 y ahora debe priorizarse por PVM.

### Milestones en curso o recontextualizados
1. `14` (`Modulo Contabilidad con temporalidad`): en curso, con avance real superior al reflejado en el roadmap global anterior.
2. `24` (`Asistente de captura de datos`): candidato clave para mejorar activacion de `Community/Core` y `Cloud Basic`, pero puede entrar como post-PVM si compromete fecha.
3. `20` (`Landing + pagos SaaS`): pasa a ser critico para `Cloud Basic` (antes estaba demasiado tarde en la secuencia).
4. `23` (escalado continuo): sigue vigente como pista transversal.

## Roadmap objetivo (nuevo, orientado a producto y lanzamiento)
## Fase A - PVM (`Community/Core` + `Cloud Basic`)
### Hito A0 - Congelar alcance y contratos de producto (inmediato)
Objetivo:
1. Traducir la segmentacion comercial a capacidades tecnicas y alcance release.

Decisiones A0 ya cerradas (2026-02-25):
1. `core.accounting_movements_manual` entra en Fase A (modo detalle opcional).
2. `core.onboarding_assisted` entra en Fase A.
3. `core.investment_portfolio_basic` se mantiene en Fase A como capability objetivo, con implementacion "cuando llegue el momento" dentro de la ejecucion de Fase A.

Entregables:
1. Matriz de capacidades por tier (`Community/Core`, `Cloud Basic`, `Cloud Pro`, `Cloud Premium`).
2. Decision explicita de que entra en PVM vs se difiere:
   - obligatorio PVM
   - deseable PVM
   - post-PVM
3. Mapa de flags/capabilities backend/frontend (v1) alineado con planes.
4. Actualizacion de docs de arquitectura funcional si cambia el boundary Core/Cloud.

Notas de implementacion:
1. Reutilizar el patron ya existente de `capabilities` en frontend.
2. Evolucionar `SaasSubscription` de binario a modelo de plan, sin romper el gating actual de `premium` mientras se migra.

### Hito A1 - Cierre funcional de `Community/Core` (detalle alto)
Objetivo:
1. Dejar una version `Community/Core` cerrada, estable y defendible para salir a mercado en paralelo con `Cloud Basic`.

### A1.1 Recorte de alcance y preservacion de features ya implementadas (prioridad maxima)
Objetivo:
1. Sacar del alcance de Fase A las features ya implementadas que pasan a `Cloud Pro`, sin perder codigo ni UX ya construida.

Trabajo concreto:
1. Reclasificar `Guia` (plan paso a paso + fases) como feature `Cloud Pro`.
2. Reclasificar `ownership` / `People` (modo familia/titularidades) como feature de `Cloud Premium`, pero fuera de la oferta `Community/Core` y `Cloud Basic`.
3. Mantener estas features preservadas en codigo:
   - sin borrarlas
   - con gating por capabilities
   - con rutas/CTAs ocultos o bloqueados segun plan
4. Documentar explicitamente en roadmap/capabilities que son "implementadas pero fuera de Fase A".

### A1.2 Convergencia de frontend Core/SaaS para Fase A (prioridad maxima)
Objetivo:
1. Consolidar un baseline comun de frontend para todo lo que si pertenece a Fase A y evitar que `core` y `saas` sigan divergiendo por descuidos.

Trabajo concreto:
1. Definir lista de pantallas/componentes "baseline Fase A" compartidos:
   - `Patrimonio`
   - `Introduccion de datos`
   - `Presupuesto`
   - `Cartera de inversion` (cuando entre el slice basico)
   - shell/navegacion/UX comun
2. Identificar diferencias actuales `core/frontend` vs `frontend` (SaaS) y resolverlas con criterio:
   - compartir codigo cuando aplique
   - o mantener divergencia solo si esta documentada por capability
3. Alinear rutas, copy y comportamiento de estados vacios para Fase A en ambos fronts.
4. Dejar `Guia` y `People/ownership` fuera del baseline Fase A, aunque se conserven en SaaS para fases posteriores via gating.

### A1.3 Refactor de consolidacion (antes de seguir construyendo Fase A)
Objetivo:
1. Hacer un refactor completo de lo ya valido hasta ese momento para construir el resto de Fase A sobre una base mas solida.

Trabajo concreto:
1. Extraer logica duplicada `core`/`saas` en frontend (stores, composables, vistas y utilidades) donde sea rentable.
2. Consolidar contratos y tipos compartidos en dominios clave (`net-worth`, `data-input`, `budget`).
3. Reducir debt de capabilities/gating en frontend antes de introducir mas features de Fase A.
4. Dejar pruebas de regresion en los flujos baseline Fase A para proteger el refactor.

### A1.4 Alcance funcional a cerrar (PVM Core)
Debe quedar disponible y usable:
1. `Patrimonio`: activos, pasivos, patrimonio neto, snapshots/evolucion basica.
2. `Contabilidad lite`: datos anuales (`Ingresos`/`Gastos`) + eventos puntuales (`one_off`) + check-ins mensuales.
3. `Presupuesto`: planificado vs ejecutado (cuando haya check-ins).
4. `Recurrentes`: gestion via entradas anuales recurrentes y gastos generados desde pasivos.
5. `Cierres`: experiencia de cierre mensual util (aunque sea v1 apoyada en `Presupuesto` + check-ins).
6. `Cartera de inversion` (si entra en Fase A, prioridad explicitada por producto):
   - objetivo minimo: modulo de seguimiento basico
   - puede salir como dashboard/simple slice incremental mientras se preserva una v1 defendible
7. Estadisticas basicas:
   - totales anuales/mensuales disponibles en dashboards actuales
   - distribuciones y comparativas simples (`Patrimonio`/`Presupuesto`)

No debe entrar en PVM Core:
1. Agente de consejos.
2. Objetivos.
3. Simuladores inteligentes.
4. Notificaciones inteligentes.
5. `Guia` / fases (se mueve a `Cloud Pro`, aunque se preserve el trabajo ya implementado).
6. Familia/titularidades (`ownership`, `People`) como modo producto (se mueve a `Cloud Premium`).
7. ASTRA.

### A1.5 Trabajo tecnico prioritario (Core)
#### A1.5.a Cerrar Milestone 14 para valor PVM (prioridad maxima)
1. Verificar y finalizar `14A` (pasivos -> gasto autogenerado) con docs/tests/cierre de release interno.
2. Cerrar `14C` minimo para `Gastos` e `Ingresos`:
   - CRUD check-ins mensual
   - estados `confirmed/adjusted/skipped/pending`
   - lectura mensual/YTD
3. Integrar `Ejecutado` real en `Dashboard Presupuesto` Core (no placeholder).
4. Asegurar UX de `cierre mensual` en Core:
   - decidir ubicacion final (`Presupuesto` modo cierre o vista dedicada)
   - flujo por mes con estados claros `Plan/Ejecutado/Pendiente`
5. Definir criterio funcional de "cierre" v1:
   - que significa "mes cerrado"
   - como se mide completitud
   - que pasa si se reabre/ajusta despues

#### A1.5.b Modulo de cartera de inversion (Fase A, prioridad alta por producto)
1. Repriorizar `Milestone 15` para que entre en Fase A con alcance v1 basico.
2. Definir alcance minimo de "seguimiento basico":
   - holdings/posiciones manuales
   - valor actual y coste (si aplica)
   - vista resumen de cartera
   - metricas basicas (valor, variacion simple, distribucion)
3. Integrar con datos de `Patrimonio` sin duplicar reglas cuando sea posible.
4. Documentar explicitamente lo que queda fuera de v1 (analisis avanzado, rebalanceo, riesgo/retorno avanzado).

#### A1.5.c Cierre de experiencia de captura (PVM)
1. Refinar `Introduccion de datos` para minimizar friccion en alta de:
   - vivienda/hipoteca
   - coche/prestamo
   - efectivo/cuentas
   - inversiones
2. Completar ayudas de captura ya encaminadas (pasivos/autocompletados) antes de abrir nuevos subfrentes.
3. Decidir alcance PVM de importacion:
   - opcion A: lanzar con import/export portable JSON y documentarlo como importacion manual v1
   - opcion B: anadir CSV basico manual para ingresos/gastos y/o movimientos
4. Si CSV no entra, dejar Milestone especifico post-PVM documentado y no prometerlo en copy comercial.

#### A1.5.d Activacion y onboarding (PVM vs post-PVM)
1. `Wizard`/asistente (Milestone 24) es deseable, pero no debe bloquear salida si compromete fecha.
2. Minimo PVM alternativo si se difiere el wizard:
   - checklist de completitud de datos
   - CTA guiados por modulo (`anade vivienda`, `anade deuda`, `anade ingreso principal`)
   - estados vacios pedagogicos
3. Si el wizard entra:
   - limitar v1 a screening + propuestas simples
   - reutilizar contratos existentes de `Introduccion de datos`

#### A1.5.e Hardening y release de Core
1. Ejecutar matriz de calidad de `core/backend` y `core/frontend` en Docker.
2. Ejecutar pruebas dirigidas de:
   - net worth CRUD
   - data input annual entries
   - monthly check-ins
   - presupuesto plan vs ejecutado
   - cartera de inversion v1 (si entra en el corte)
   - guia/fases (regresion)
3. Crear `release-summary` del cierre funcional que consolide el estado PVM Core.
4. Actualizar docs de uso (`docs/operations/dev-setup.md`, `docs/operations/runbook.md`) si cambian flujos.

### Hito A2 - Producto `Cloud Basic` (detalle alto)
Objetivo:
1. Lanzar SaaS gestionado con el mismo valor funcional del core, sin features Pro/Premium.

### A2.1 Alcance funcional de `Cloud Basic`
Incluye:
1. Todo el alcance de `Community/Core` (misma base funcional).
2. Auth SaaS + acceso web multi-dispositivo.
3. Operacion gestionada (hosting/actualizaciones).
4. Backups automaticos.
5. PWA minima funcional.

No incluye:
1. Fases/scores/agente/objetivos/simuladores/notificaciones inteligentes si decides reservarlos para Pro.
2. Modo familia/titularidades como feature producto (aunque existan piezas internas en SaaS).

### A2.2 Trabajo tecnico prioritario (SaaS)
#### A2.2.a Planes y capabilities (prioridad maxima)
1. Cambiar modelo de suscripcion SaaS de binario a planificado (`basic`, `pro`, `premium`), manteniendo compatibilidad temporal.
2. Definir permisos/capabilities por plan en backend:
   - `cloud_basic`
   - `cloud_pro`
   - `cloud_premium`
   - flags funcionales derivados (ej. `people`, `ownership`, `guide_scores`, `agent`, `simulators`)
3. Consumir capabilities en frontend SaaS para ocultar/mostrar rutas y CTAs correctamente.
4. Desacoplar el significado actual de `isPremium` (hoy mezcla "SaaS avanzado" con "features family/ownership").

#### A2.2.b Paridad funcional con Core (prioridad alta)
1. Confirmar que la funcionalidad PVM Core consumida desde SaaS esta disponible (especialmente `Milestone 14` integrado).
2. Evitar que SaaS exponga features avanzadas no vendidas en `Cloud Basic`:
   - `Guia` / fases (si quedan visibles hoy)
   - `People`
   - titularidades avanzadas
   - vistas admin solo internas
3. Revisar copy/UI para que `Cloud Basic` no se perciba como "premium recortado", sino como "core gestionado".

#### A2.2.c PWA minima (prioridad alta para promesa comercial)
1. Implementar base PWA en frontend SaaS:
   - manifest
   - iconos
   - service worker (cache shell)
   - instalable en movil
2. Asegurar funcionamiento minimo de vistas clave:
   - login
   - patrimonio
   - presupuesto
   - introduccion de datos
3. Definir claramente limite v1:
   - "PWA minima funcional" no implica offline full-sync.

#### A2.2.d Operacion gestionada (prioridad alta)
1. Backups automaticos:
   - politica (frecuencia/retencion)
   - restauracion validada
   - runbook documentado
2. Actualizaciones:
   - proceso de despliegue reproducible
   - rollback minimo
3. Observabilidad minima:
   - logs centralizados
   - errores backend/frontend
   - healthchecks basicos
4. Seguridad operacional minima:
   - gestion de secretos
   - HTTPS/proxy de produccion
   - controles de acceso admin

#### A2.2.e Cobro y alta comercial (prioridad alta)
1. Landing de SaaS (Milestone 20 re-priorizado).
2. Pricing con comparativa `Basic / Pro / Premium` (aunque Pro/Premium esten "proximamente").
3. Flujo de pago/suscripcion para `Cloud Basic`.
4. Gestion de estado de suscripcion:
   - alta
   - renovacion
   - cancelacion
   - `past_due`
5. Pantalla de cuenta/plan con estado de suscripcion y upgrade path.

### A2.3 Validacion de lanzamiento `Cloud Basic`
1. Matriz de calidad SaaS backend/frontend en Docker.
2. Smoke tests funcionales:
   - registro/login
   - acceso a app
   - CRUD patrimonio
   - introduccion de datos
   - presupuesto con ejecutado
   - cambio de plan/capabilities (si aplica con entornos seed)
3. Smoke tests operativos:
   - backup/restore
   - deploy/rollback
   - healthcheck
4. Prueba PWA:
   - instalacion
   - carga inicial
   - navegacion basica

### Hito A3 - Lanzamiento coordinado PVM (Core + Cloud Basic)
Objetivo:
1. Sacar ambas ofertas a mercado con narrativa y alcance coherentes, evitando divergencias de promesa.

Entregables:
1. Version/tag de release PVM.
2. Documentacion publica de diferencias `Community/Core` vs `Cloud Basic`.
3. Runbook de soporte inicial.
4. Checklist de incidentes/rollback de produccion.
5. Release summaries de cierre (Core y SaaS/PVM).

## Fase B - `Cloud Pro` (detalle medio)
Objetivo:
1. Convertir datos en mejora accionable (estructura + guia + recomendaciones + objetivos + simulacion simple).

Hitos propuestos (alto nivel):
1. `B1` - Arquitectura de capabilities Pro y gating fino (si no quedo completa en A2).
2. `B2` - Sistema de fases como feature de pago Cloud (estado, progreso, siguientes pasos).
3. `B3` - Scores Pro (estabilidad/ahorro/control/resiliencia) con penalizacion por calidad de dato.
4. `B4` - Agente financiero basico (consejos accionables + alertas por desvio + incoherencias simples).
5. `B5` - Objetivos (creacion, seguimiento, estimacion simple).
6. `B6` - Simulador basico (3-5 anos, escenarios tipicos).
7. `B7` - Notificaciones inteligentes basicas.

Dependencias clave:
1. Datos temporales y cierres mensuales (Milestone 14) suficientemente estables.
2. Modelo de completitud/calidad de dato maduro.
3. Capacidades/planes y billing ya estables desde `Cloud Basic`.

## Fase C - `Cloud Premium` (detalle medio-bajo)
Objetivo:
1. Optimizar y acelerar con capacidades avanzadas de hogar, simulacion y analitica.

Hitos propuestos (alto nivel):
1. `C1` - Modo familia como producto premium (roles, privacidad por miembro, menores).
2. `C2` - Agente avanzado (multi-escenario, sensibilidad, explicabilidad).
3. `C3` - Simulador avanzado (Montecarlo, FIRE, escenarios macro).
4. `C4` - Analisis avanzado de cartera (riesgo/retorno, concentracion, rebalanceo sugerido).
5. `C5` - Entrada premium (foto/voz/importacion masiva).
6. `C6` - ASTRA informativo (senales/backtests/simulacion, sin ejecucion real).

Dependencias clave:
1. Capacidades de plan completamente desacopladas.
2. Dataset/telemetria (si se usa benchmarking) con opt-in y diseno de privacidad correcto.
3. Base de usuario y soporte operacional capaces de sostener features avanzadas.

## Trabajo inmediato (que hacer ahora mismo)
### Prioridad 1 (esta iteracion)
1. Actualizar y cerrar la matriz de capacidades por tier (docs + flags backend/frontend).
2. Sacar de Fase A (sin perderlas) `Guia`/fases hacia `Cloud Pro` y `ownership`/`People` hacia `Cloud Premium` via gating/capabilities.
3. Consolidar baseline de frontend Fase A entre `core` y `saas` (paridad y convergencia de UX/rutas).
4. Planificar el refactor de consolidacion sobre ese baseline comun.
5. Replanificar `Milestone 14` como bloque critico del PVM y definir subalcance exacto de cierre (`14A/14C`).
6. Repriorizar `Milestone 15` (cartera) dentro de Fase A con alcance basico.
7. Decidir si el wizard (`Milestone 24`) entra en PVM o pasa a post-PVM con fallback de checklist.
8. Repriorizar `Milestone 20` (landing/pagos) al camino de `Cloud Basic`.

### Prioridad 2 (siguiente iteracion corta)
1. Ejecutar refactor de consolidacion del baseline Fase A (`core` + `saas`) con regresion controlada.
2. Cerrar `Ejecutado` real en `Presupuesto` y experiencia de cierre mensual (Core + SaaS).
3. Estabilizar pasivos/gasto autogenerado y validar regresion de captura de datos.
4. Entregar `Cartera de inversion` v1 basica en Core/SaaS (si no entra en la iteracion anterior).
5. Definir/implementar modelo de plan SaaS (`basic/pro/premium`) y capabilities v1.
6. Delimitar y ocultar features no-PVM en frontend SaaS (`Guia`, `People`, titularidades avanzadas) para `Cloud Basic`.

### Prioridad 3 (pre-lanzamiento)
1. PWA minima SaaS.
2. Backups + restore + runbook.
3. Landing + cobro + pantalla de cuenta/plan.
4. QA y smoke de lanzamiento PVM.

## Riesgos de planificacion (actualizados)
1. Riesgo: intentar cerrar `Milestone 14`, `Milestone 24`, PWA y pagos a la vez.
   - Mitigacion: fijar corte PVM estricto y diferir wizard o CSV si comprometen fecha.
2. Riesgo: confundir capacidades tecnicas existentes en SaaS con producto vendible (`Cloud Basic`).
   - Mitigacion: definir matriz de features vendidas y gating visible en UI/backend.
3. Riesgo: mantener modelo de suscripcion binario demasiado tiempo.
   - Mitigacion: introducir `plan_code`/capabilities antes del lanzamiento comercial.
4. Riesgo: prometer PWA sin especificar alcance.
   - Mitigacion: documentar explicitamente "PWA minima funcional (sin offline completo)".
5. Riesgo: desalineacion entre `core` y `saas` al acelerar el lanzamiento.
   - Mitigacion: tratar `core` como baseline funcional y validar paridad PVM en cada release candidate.

## Referencias principales
1. `docs/roadmap/roadmap-milestone-14-accounting-module.md`
2. `docs/roadmap/roadmap-milestone-24-assisted-data-capture.md`
3. `docs/roadmap/release-summary-milestone-10-budget-dashboard.md`
4. `docs/roadmap/release-summary-milestone-13-guide-phase-detail.md`
5. `docs/architecture/capabilities-matrix.md`
6. `docs/operations/release-checklist.md`
7. `RELEASING.md`
