# Roadmap Global del Producto

## Objetivo
Mantener un roadmap oficial alineado con la estrategia actual `Open-Core + SaaS`, el estado real del codigo y una salida temprana a produccion.

## Rebaseline oficial (2026-02-26)
### Principio rector
1. `Core` = herramienta completa, inteligente y sin friccion (sin bloqueos artificiales).
2. `SaaS` = infraestructura, potencia centralizada y ecosistema.
3. Se monetiza lo que requiere servidor central, datos agregados o escalabilidad.

### Definicion de "salir a produccion" (corte inicial)
Cuando este roadmap hable de "produccion" en la primera salida, significa:
1. `core/` publico y listo para compartir con la comunidad (primero circulo cercano).
2. SaaS Cloud funcionando en produccion y con usuarios reales de prueba.
3. Sin pagos todavia (billing se difiere).

### Corte funcional permitido para esa primera salida
Se puede lanzar aunque NO este listo todo el vision scope:
1. Sin `Cartera de inversion` como modulo dedicado v1.
2. Sin `Fase 5` del coach financiero.
3. Con foco en estabilidad + valor usable + feedback real.

## Estrategia de producto (Open-Core + SaaS)
### Core (open-core, self-hosted)
Modulos base/objetivo:
1. `Patrimonio`
2. `Presupuesto`
3. `Contabilidad`
4. `Cartera de inversion` (evolucion progresiva)
5. `Simulador financiero` (evolucion progresiva)

Capas transversales/experiencia:
1. `Familia` como modelo logico (hogar, members, ownership, vista conjunta/individual).
2. `Coach financiero` v1 (deuda, flujo de caja, fondo de emergencia, salud patrimonial, progreso FI).
3. `Sistema de introduccion de datos` (onboarding guiado, asistentes, cierre mensual/anual).
4. Automatizaciones locales y asistencia contextual (OCR/voz/imports/LLM local cuando sea viable).

### SaaS (cloud)
Monetizacion principal:
1. Hosting gestionado
2. Backups automaticos
3. Acceso multidispositivo
4. PWA movil (fase inicial)
5. Notificaciones inteligentes

Valor centralizado (cloud-native):
1. Benchmark anonimo con la comunidad (dataset agregado)
2. Simulacion intensiva (Montecarlo / calculos pesados)
3. LLM conversacional avanzado en la nube
4. Modulos ASTRA que requieran infraestructura central

Familia avanzada en Cloud:
1. Miembros con login individual
2. Privacidad por miembro
3. Visualizacion familiar centralizada

### Evolucion futura B2B
1. Integracion con influencers financieros
2. Codigos de afiliacion/descuento
3. Panel de administracion para creadores
4. Gestion de comunidades
5. Posible version para asesores financieros

## Estado del codigo (revision para planificar el siguiente paso)
### Hallazgos clave (2026-02-26)
1. El contrato `capabilities` v2 ya existe en `frontend` y `core/frontend` (buena base para reorganizar packaging sin romper todo de golpe).
2. El uso real en SaaS sigue parcialmente en modo legacy:
   - rutas y menus con checks `people` / `isPremium`
   - adapters seleccionados por `capabilities.isPremium`
   - backend con permiso binario `HasPremiumAccess`
3. El backend SaaS sigue modelando suscripcion como binaria (`trial/active/...` + `premium_enabled`), sin `plan_code`.
4. La funcionalidad `People/ownership` vive hoy en `backend/memberships` y frontend SaaS (no en Core).
5. `core/backend` ya no tiene el modelo de familia/titularidad operativo (quedo retirado del dominio base).
6. `core/frontend` ya tiene buena parte del baseline que si queremos preservar como open-core:
   - `Guia`
   - `Patrimonio`
   - `Introduccion de datos`
   - `Presupuesto`

### Implicacion para la estrategia nueva
El codigo actual todavia refleja una estrategia anterior (gating funcional Pro/Premium). Con el enfoque nuevo, el primer paso no es "anadir features", sino reordenar responsabilidades entre `core` y `saas`.

## Prioridad 0 (inmediata): Reorganizar que va en cada sitio
### Objetivo
Definir y empezar a ejecutar una separacion coherente con la estrategia `Open-Core + SaaS`, antes de seguir construyendo.

### Resultado esperado
1. `Core` queda como baseline funcional real (producto usable y defendible).
2. `SaaS` deja de ser "premium funcional" y pasa a ser "infraestructura + valor centralizado + colaboracion cloud".
3. El roadmap y `capabilities` vuelven a estar alineados con el producto real.

### Trabajo concreto (R0)
#### R0.1 Inventario y clasificacion oficial (docs + codigo)
1. Clasificar features existentes en tres grupos:
   - `Core base`
   - `SaaS infra/operacion`
   - `SaaS valor centralizado / colaboracion`
2. Marcar explicitamente las features implementadas pero fuera del corte de lanzamiento inicial.
3. Actualizar `docs/architecture/capabilities-matrix.md` y `docs/architecture/core-saas-boundaries.md`.

#### R0.2 Rebaseline del contrato de capabilities
1. Mantener el contrato `capabilities` v2 existente como base tecnica.
2. Cambiar el significado funcional de la matriz:
   - menos "bloquear modulo por plan"
   - mas "identificar capacidades cloud/centralizadas"
3. Mantener `compat.*` (`isPremium`, `people`, `ownership`) solo como puente de migracion.

#### R0.3 Reorganizacion de familia/titularidad (decision arquitectonica prioritaria)
1. Separar "familia como modelo logico" (Core) de "familia cloud multiusuario con privacidad" (SaaS).
2. Disenar el movimiento por fases:
   - opcion A: mover el modelo logico de `memberships` a `core/backend`
   - opcion B: extraer dominio compartido y dejar extensiones cloud en SaaS
3. No bloquear la salida temprana por una migracion total si se puede hacer en etapas (bridge + compatibilidad).

#### R0.4 Limpieza de gating en frontend SaaS (sin romper produccion)
1. Sustituir checks directos `isPremium` donde no aportan nada (auth/aux-data) por adapters neutrales o capabilities especificas.
2. Centralizar gating de rutas/menus con helpers (`canUse...`) en vez de checks dispersos.
3. Preparar el frontend para distinguir:
   - features core disponibles
   - features cloud centralizadas
   - features internas/admin

#### R0.5 Rebaseline de permisos backend SaaS
1. Mantener el gating actual binario como compatibilidad temporal.
2. Introducir contrato de acceso con `plan_code` + `capabilities` de forma incremental (aunque al principio no haya cobro).
3. Evitar que `premium_enabled` siga siendo la unica fuente de verdad.

## Roadmap de ejecucion (orientado a salida temprana)
## Fase A - Preparacion de lanzamiento temprano (Core publico + SaaS sin pagos)
### A1. Reorganizacion Core/SaaS (obligatorio, primero)
1. Completar `R0` (inventario, boundaries, capabilities, plan de migracion familia/titularidad).
2. Congelar el baseline funcional de `Core` para el primer release comunitario.
3. Definir lista de features no bloqueantes para la primera salida.

### A2. Cierre funcional minimo de valor (obligatorio)
1. Priorizar `Milestone 14` (contabilidad temporal / cierres):
   - check-ins mensuales
   - `Ejecutado` en presupuesto
   - UX de cierre mensual v1
2. Endurecer `Patrimonio`, `Presupuesto` e `Introduccion de datos` como flujo principal.
3. Mantener el coach util con fases actuales; `Fase 5` se difiere si compromete fecha.
4. Mantener `Cartera de inversion` fuera del corte si no llega una v1 defendible.

### A3. Activacion y UX de entrada (obligatorio ligero / deseable profundo)
1. Minimo obligatorio:
   - estados vacios pedagogicos
   - CTA guiados por modulo
   - checklist simple de completitud
2. `Milestone 24` (wizard/asistente) entra solo si no retrasa el lanzamiento.

### A4. SaaS cloud de prueba con usuarios reales (obligatorio)
1. Despliegue SaaS estable en cloud.
2. Registro/login y acceso funcional a la app.
3. Runbook minimo operativo (incidencias basicas, logs, recovery).
4. Onboarding manual de usuarios reales de test.
5. Sin pagos / sin billing / sin pricing definitivo en esta fase.

### A5. Publicacion de Core para comunidad (obligatorio)
1. Repo `core/` preparado para compartir:
   - docs de setup
   - docs de arquitectura basica
   - roadmap oficial publico
   - expectativas de contribucion/feedback
2. Release/tag inicial para comunidad (aunque sea beta temprana).

## Fase B - Estabilizacion post-salida (feedback real primero)
Objetivo:
1. Corregir fricciones detectadas por usuarios reales antes de ampliar scope.

Trabajo tipico:
1. Correccion de bugs de onboarding/captura/cierres.
2. Mejora de DX y docs de despliegue Core.
3. Hardening de SaaS (observabilidad, backups, restore, seguridad operacional).
4. Refines del coach financiero y del flujo de cierre mensual.

## Fase C - Profundidad funcional del Core (evolucion progresiva)
Objetivo:
1. Completar modulos base sin bloquear la adopcion temprana.

Candidatos prioritarios:
1. `Cartera de inversion` v1 (seguimiento basico).
2. `Simulador financiero` v1 local.
3. Mejoras del coach (incluida `Fase 5`).
4. Mejoras del sistema de captura (importaciones, OCR/voz/local LLM cuando sea viable).

## Fase D - SaaS de pago (cuando haya validacion suficiente)
Objetivo:
1. Monetizar la capa SaaS una vez validado el uso real y el valor operativo.

Hitos:
1. Billing / suscripciones / estados de plan.
2. Cuenta/plan y upgrade path.
3. Packaging comercial alineado con capabilities reales.
4. PWA minima (si aun no se cerro) y mejoras mobile.

## Fase E - Valor cloud centralizado (premium real por infraestructura)
Objetivo:
1. Anadir valor que no tiene sentido en local o requiere escala centralizada.

Hitos:
1. Benchmark anonimo con comunidad (opt-in y privacidad).
2. Simulacion intensiva (Montecarlo / calculo pesado).
3. LLM conversacional cloud.
4. ASTRA cloud-native.
5. Familia cloud avanzada (multi-login, privacidad por miembro, colaboracion).

## Fase F - B2B / Ecosistema
Objetivo:
1. Abrir lineas de crecimiento sin romper el foco del producto principal.

Hitos:
1. Programa de afiliacion / creadores
2. Panel para influencers / comunidades
3. Piloto para asesores financieros

## Decisiones de alcance explicitas (actuales)
1. El lanzamiento temprano NO depende de pagos.
2. El lanzamiento temprano NO depende de `Cartera de inversion` v1.
3. El lanzamiento temprano NO depende de `Coach Fase 5`.
4. El primer paso tecnico es reorganizar boundaries `core` / `saas`, no abrir mas features.

## Riesgos y mitigaciones
1. Riesgo: seguir construyendo sobre un boundary desalineado con la nueva estrategia.
   - Mitigacion: ejecutar `R0` antes de nuevos slices grandes.
2. Riesgo: mezclar "feature cloud" con "feature premium bloqueada" y perder la tesis open-core.
   - Mitigacion: capabilities centradas en infraestructura/valor centralizado.
3. Riesgo: intentar hacer a la vez reorganizacion, Milestone 14, wizard, cartera y billing.
   - Mitigacion: corte estricto de lanzamiento temprano + backlog explicito.
4. Riesgo: migracion de familia/titularidad rompiendo flujos existentes en SaaS.
   - Mitigacion: bridge por etapas, compatibilidad temporal y tests de regresion.

## Trabajo inmediato (siguiente iteracion)
1. Cerrar inventario y matriz `Core vs SaaS` de features actuales (docs + checklist de codigo).
2. Definir decision tecnica para `familia/titularidad` (Core logico vs SaaS colaboracion cloud).
3. Rebaselinar `capabilities` y limpiar checks legacy (`isPremium`/`people`) en puntos criticos.
4. Replanificar `Milestone 14` con corte minimo de lanzamiento temprano.
5. Preparar checklist de salida:
   - `core` publico compartible
   - SaaS cloud operativo con usuarios reales
   - soporte manual sin billing

## Referencias principales
1. `docs/architecture/capabilities-matrix.md`
2. `docs/architecture/core-saas-boundaries.md`
3. `docs/roadmap/roadmap-milestone-14-accounting-module.md`
4. `docs/roadmap/roadmap-milestone-24-assisted-data-capture.md`
5. `docs/roadmap/roadmap-milestone-02-core-saas.md`
6. `frontend/src/domains/capabilities/index.ts`
7. `core/frontend/src/domains/capabilities/index.ts`
8. `backend/memberships/models.py`
9. `backend/saas/auth_views.py`
