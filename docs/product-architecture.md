# Arquitectura del Producto

## Objetivo
Definir la arquitectura funcional por módulos de negocio, separada de la arquitectura de plataforma (`core` vs `saas`).

## Alcance de este documento
1. Describe capacidades funcionales y límites entre módulos.
2. Define qué es obligatorio en `core` y qué puede extenderse en `saas`.
3. Sirve como contrato evolutivo para refactor y nuevos módulos.

## Relación con otros documentos
1. Límites de plataforma (`core` OSS vs `saas` privado): `docs/architecture.md`.
2. Hoja de ruta inicial ya ejecutada (V1): `docs/roadmap-01-core-saas.md`.
3. Próxima release/refactor (V2): `docs/roadmap-02-release.md`.

## Principios de arquitectura
1. Core-first: cada módulo debe aportar valor end-to-end en `core`.
2. Extensión premium: `saas` agrega capacidades, no reemplaza las bases de `core`.
3. No duplicación: evitar lógica duplicada entre `core` y `saas`.
4. Contratos explícitos: APIs y eventos versionados entre módulos.
5. Evolución incremental: completar módulos por etapas con trazabilidad.

## Módulo transversal
### Plataforma Core
Propósito: fundamentos compartidos para todos los módulos.

Capacidades mínimas en core:
1. Usuarios, autenticación y perfil/configuración base.
2. Entidades y catálogos compartidos.
3. Modelos base de activos y pasivos.
4. Soporte de moneda (tipos de cambio y conversiones).
5. Soporte de inflación e indicadores relacionados.
6. Convenciones de API, permisos y primitivas de auditoría compartidas.

Extensiones permitidas en SaaS:
1. Reglas avanzadas de permisos por capacidad premium.
2. Auditoría y controles avanzados orientados a features premium.

## Relaciones entre módulos
1. `Contabilidad -> Patrimonio`: coherencia de estado y consistencia de cifras.
2. `Contabilidad -> Presupuesto`: comparación real vs plan.
3. `Cartera de Inversión -> Contabilidad`: eventos de inversión impactan movimientos contables.
4. `Cartera de Inversión -> Patrimonio`: valoración de cartera impacta patrimonio neto.
5. `Simulador -> (Patrimonio, Contabilidad, Presupuesto, Cartera de Inversión)`: lectura por API para proyectar escenarios.

## Estilo de integración
1. REST API para lecturas y operaciones sincrónicas.
2. Eventos para propagación de cambios cuando exista causalidad clara.
3. Contratos explícitos entre módulos para evitar acoplamientos ocultos.

## Contrato por módulo (v0.1)
### Patrimonio
Objetivo:
- Gestionar inventario de activos/pasivos y cálculo de patrimonio neto con evolución temporal.

Entidades core (modelo de datos):
1. `Asset` (activo): categoría/subcategoría, moneda, importe, modo de seguimiento, estado activo.
2. `Liability` (pasivo): categoría, moneda, importe, financiación asociada opcional a activo.
3. `NetWorthSnapshot` (snapshot): foto diaria en moneda base con total activos, pasivos y patrimonio neto.

Casos de uso core (flujos mínimos obligatorios):
1. CRUD de activos por usuario.
2. CRUD de pasivos por usuario.
3. Cálculo de resumen de patrimonio con conversión a moneda base del usuario.
4. Guardado de snapshot diario desde estado actual (`from-current`).
5. Visualización de desglose por categoría/subcategoría y pasivos respaldados/no respaldados.

APIs core (endpoints y contrato):
1. `GET/POST/PUT/PATCH/DELETE /api/net-worth/assets/`
2. `GET/POST/PUT/PATCH/DELETE /api/net-worth/liabilities/`
3. `GET /api/net-worth/summary/`
4. `GET /api/net-worth/snapshots/`
5. `POST /api/net-worth/snapshots/from-current/`
6. `DELETE /api/net-worth/snapshots/{id}/`

Eventos emitidos/consumidos:
1. Estado actual: no hay bus de eventos asíncrono en producción para Patrimonio.
2. Integración vigente: sincronización explícita por API desde SaaS (titularidad) tras cambios de activos/pasivos.
3. Evento lógico de dominio a formalizar más adelante: `asset_updated`, `liability_updated`, `snapshot_created`.

Extensiones SaaS (feature premium):
1. Titularidad avanzada:
- `FamilyMember`
- `Ownership`
- `OwnershipSplit`
- `OwnershipLink`
2. APIs premium asociadas:
- `GET/POST/PUT/PATCH/DELETE /api/family-members/`
- `GET/POST/PUT/PATCH/DELETE /api/ownerships/`
- `GET /api/ownership-links/`
- `POST /api/ownership-links/sync/`
3. Validaciones premium de uso:
- bloqueo de operaciones cuando la titularidad está en uso
- consistencia de enlaces de titularidad sobre activos/pasivos

Riesgos de acoplamiento y decisiones de diseño:
1. No duplicar cálculos base de patrimonio en SaaS; usar `core` como fuente de verdad para totales.
2. Mantener titularidad fuera de modelos `core` para preservar el contrato OSS.
3. Versionar contratos de API dual (`coreApi` y `saasApi`) para evitar roturas en frontend.
4. Si se introduce mensajería asíncrona, mantener idempotencia en sincronización de `OwnershipLink`.

Estado:
- `in_progress` (funcionalmente casi completo, en refactor activo).

### Contabilidad
Objetivo:
- Gestionar qué está pasando en los flujos reales de dinero.

Capacidades obligatorias en core:
1. Cuentas y movimientos/transacciones.
2. Categorización base de ingresos y gastos.
3. Cierres mensuales/anuales y comparativas.
4. Integración de salidas para comparación con presupuesto.

Extensiones permitidas en SaaS:
1. Reglas avanzadas de clasificación.
2. Automatizaciones y controles guiados premium.
3. Validaciones avanzadas de consistencia.

Estado funcional:
- Pendiente de desarrollo/refactor en la nueva etapa.

### Presupuesto
Objetivo:
- Definir el plan financiero y medir su cumplimiento.

Capacidades obligatorias en core:
1. Definición de presupuesto base.
2. Versionado de presupuesto.
3. Comparación real vs plan.
4. Indicadores de cumplimiento de metas.

Extensiones permitidas en SaaS:
1. Multiescenario y políticas avanzadas de flexibilidad.
2. Recomendaciones y proyecciones premium.
3. Flujos guiados de optimización.

Estado funcional:
- Próximo módulo objetivo.

### Cartera de Inversión
Objetivo:
- Gestionar posiciones de inversión y su impacto financiero.

Capacidades obligatorias en core:
1. Posiciones y valoración base.
2. Registro de eventos de inversión relevantes.
3. Impacto de cartera en patrimonio.

Extensiones permitidas en SaaS:
1. Métricas avanzadas de rendimiento/riesgo.
2. Alertas premium y controles de concentración.
3. Herramientas avanzadas de seguimiento.

Estado funcional:
- Definido a nivel arquitectura, pendiente de implementación completa.

### Simulador
Objetivo:
- Probar escenarios futuros antes de tomar decisiones.

Capacidades obligatorias en core:
1. Consumo de datos de módulos vía API.
2. Proyecciones base de escenarios.
3. Comparación de resultados contra metas.

Extensiones permitidas en SaaS:
1. Restricciones y motores avanzados de simulación.
2. Plantillas premium de estrategia.
3. Asistentes de análisis "what-if".

Estado funcional:
- Definido a nivel arquitectura, pendiente de implementación completa.

## Plantilla para completar cada módulo (iterativo)
Usar esta plantilla cuando se refine un módulo en detalle:

1. Entidades core (modelo de datos).
2. Casos de uso core (flujos mínimos obligatorios).
3. APIs core (endpoints + contratos).
4. Eventos emitidos/consumidos.
5. Extensiones SaaS (features premium).
6. Riesgos de acoplamiento y decisiones de diseño.
7. Estado (`planned`, `in_progress`, `done`).

## Próximos pasos de documentación
1. Completar Presupuesto con el formato de plantilla completo.
2. Completar Contabilidad con el formato de plantilla completo.
3. Definir catálogo de eventos de dominio cross-módulo (aunque inicialmente se implementen por API síncrona).


