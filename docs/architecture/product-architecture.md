# Arquitectura del Producto

## Objetivo
Definir la arquitectura funcional por mÃ³dulos de negocio, separada de la arquitectura de plataforma (`core` vs `saas`).

## Alcance de este documento
1. Describe capacidades funcionales y lÃ­mites entre mÃ³dulos.
2. Define quÃ© es obligatorio en `core` y quÃ© puede extenderse en `saas`.
3. Sirve como contrato evolutivo para refactor y nuevos mÃ³dulos.

## RelaciÃ³n con otros documentos
1. LÃ­mites de plataforma (`core` OSS vs `saas` privado): `docs/architecture/architecture.md`.
2. Hoja de ruta inicial ya ejecutada (V1): `docs/roadmap/roadmap-hito-02-core-saas.md`.
3. PrÃ³xima release/refactor (V2): `docs/roadmap/roadmap-hito-04-release.md`.

## Principios de arquitectura
1. Core-first: cada mÃ³dulo debe aportar valor end-to-end en `core`.
2. ExtensiÃ³n premium: `saas` agrega capacidades, no reemplaza las bases de `core`.
3. No duplicaciÃ³n: evitar lÃ³gica duplicada entre `core` y `saas`.
4. Contratos explÃ­citos: APIs y eventos versionados entre mÃ³dulos.
5. EvoluciÃ³n incremental: completar mÃ³dulos por etapas con trazabilidad.

## MÃ³dulo transversal
### Plataforma Core
PropÃ³sito: fundamentos compartidos para todos los mÃ³dulos.

Capacidades mÃ­nimas en core:
1. Usuarios, autenticaciÃ³n y perfil/configuraciÃ³n base.
2. Entidades y catÃ¡logos compartidos.
3. Modelos base de activos y pasivos.
4. Soporte de moneda (tipos de cambio y conversiones).
5. Soporte de inflaciÃ³n e indicadores relacionados.
6. Convenciones de API, permisos y primitivas de auditorÃ­a compartidas.

Extensiones permitidas en SaaS:
1. Reglas avanzadas de permisos por capacidad premium.
2. AuditorÃ­a y controles avanzados orientados a features premium.

## Relaciones entre mÃ³dulos
1. `Contabilidad -> Patrimonio`: coherencia de estado y consistencia de cifras.
2. `Contabilidad -> Presupuesto`: comparaciÃ³n real vs plan.
3. `Cartera de InversiÃ³n -> Contabilidad`: eventos de inversiÃ³n impactan movimientos contables.
4. `Cartera de InversiÃ³n -> Patrimonio`: valoraciÃ³n de cartera impacta patrimonio neto.
5. `Simulador -> (Patrimonio, Contabilidad, Presupuesto, Cartera de InversiÃ³n)`: lectura por API para proyectar escenarios.

## Estilo de integraciÃ³n
1. REST API para lecturas y operaciones sincrÃ³nicas.
2. Eventos para propagaciÃ³n de cambios cuando exista causalidad clara.
3. Contratos explÃ­citos entre mÃ³dulos para evitar acoplamientos ocultos.

## Contrato por mÃ³dulo (v0.1)
### Patrimonio
Objetivo:
- Gestionar inventario de activos/pasivos y cÃ¡lculo de patrimonio neto con evoluciÃ³n temporal.

Entidades core (modelo de datos):
1. `Asset` (activo): categorÃ­a/subcategorÃ­a, moneda, importe, modo de seguimiento, estado activo.
2. `Liability` (pasivo): categorÃ­a, moneda, importe, financiaciÃ³n asociada opcional a activo.
3. `NetWorthSnapshot` (snapshot): foto diaria en moneda base con total activos, pasivos y patrimonio neto.

Casos de uso core (flujos mÃ­nimos obligatorios):
1. CRUD de activos por usuario.
2. CRUD de pasivos por usuario.
3. CÃ¡lculo de resumen de patrimonio con conversiÃ³n a moneda base del usuario.
4. Guardado de snapshot diario desde estado actual (`from-current`).
5. VisualizaciÃ³n de desglose por categorÃ­a/subcategorÃ­a y pasivos respaldados/no respaldados.

APIs core (endpoints y contrato):
1. `GET/POST/PUT/PATCH/DELETE /api/net-worth/assets/`
2. `GET/POST/PUT/PATCH/DELETE /api/net-worth/liabilities/`
3. `GET /api/net-worth/summary/`
4. `GET /api/net-worth/snapshots/`
5. `POST /api/net-worth/snapshots/from-current/`
6. `DELETE /api/net-worth/snapshots/{id}/`

Eventos emitidos/consumidos:
1. Estado actual: no hay bus de eventos asÃ­ncrono en producciÃ³n para Patrimonio.
2. IntegraciÃ³n vigente: sincronizaciÃ³n explÃ­cita por API desde SaaS (titularidad) tras cambios de activos/pasivos.
3. Evento lÃ³gico de dominio a formalizar mÃ¡s adelante: `asset_updated`, `liability_updated`, `snapshot_created`.

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
- bloqueo de operaciones cuando la titularidad estÃ¡ en uso
- consistencia de enlaces de titularidad sobre activos/pasivos

Riesgos de acoplamiento y decisiones de diseÃ±o:
1. No duplicar cÃ¡lculos base de patrimonio en SaaS; usar `core` como fuente de verdad para totales.
2. Mantener titularidad fuera de modelos `core` para preservar el contrato OSS.
3. Versionar contratos de API dual (`coreApi` y `saasApi`) para evitar roturas en frontend.
4. Si se introduce mensajerÃ­a asÃ­ncrona, mantener idempotencia en sincronizaciÃ³n de `OwnershipLink`.

Estado:
- `in_progress` (funcionalmente casi completo, en refactor activo).

### Contabilidad
Objetivo:
- Gestionar quÃ© estÃ¡ pasando en los flujos reales de dinero.

Capacidades obligatorias en core:
1. Cuentas y movimientos/transacciones.
2. CategorizaciÃ³n base de ingresos y gastos.
3. Cierres mensuales/anuales y comparativas.
4. IntegraciÃ³n de salidas para comparaciÃ³n con presupuesto.

Extensiones permitidas en SaaS:
1. Reglas avanzadas de clasificaciÃ³n.
2. Automatizaciones y controles guiados premium.
3. Validaciones avanzadas de consistencia.

Estado funcional:
- Pendiente de desarrollo/refactor en la nueva etapa.

### Presupuesto
Objetivo:
- Definir el plan financiero y medir su cumplimiento.

Capacidades obligatorias en core:
1. DefiniciÃ³n de presupuesto base.
2. Versionado de presupuesto.
3. ComparaciÃ³n real vs plan.
4. Indicadores de cumplimiento de metas.

Extensiones permitidas en SaaS:
1. Multiescenario y polÃ­ticas avanzadas de flexibilidad.
2. Recomendaciones y proyecciones premium.
3. Flujos guiados de optimizaciÃ³n.

Estado funcional:
- PrÃ³ximo mÃ³dulo objetivo.

### Cartera de InversiÃ³n
Objetivo:
- Gestionar posiciones de inversiÃ³n y su impacto financiero.

Capacidades obligatorias en core:
1. Posiciones y valoraciÃ³n base.
2. Registro de eventos de inversiÃ³n relevantes.
3. Impacto de cartera en patrimonio.

Extensiones permitidas en SaaS:
1. MÃ©tricas avanzadas de rendimiento/riesgo.
2. Alertas premium y controles de concentraciÃ³n.
3. Herramientas avanzadas de seguimiento.

Estado funcional:
- Definido a nivel arquitectura, pendiente de implementaciÃ³n completa.

### Simulador
Objetivo:
- Probar escenarios futuros antes de tomar decisiones.

Capacidades obligatorias en core:
1. Consumo de datos de mÃ³dulos vÃ­a API.
2. Proyecciones base de escenarios.
3. ComparaciÃ³n de resultados contra metas.

Extensiones permitidas en SaaS:
1. Restricciones y motores avanzados de simulaciÃ³n.
2. Plantillas premium de estrategia.
3. Asistentes de anÃ¡lisis "what-if".

Estado funcional:
- Definido a nivel arquitectura, pendiente de implementaciÃ³n completa.

## Plantilla para completar cada mÃ³dulo (iterativo)
Usar esta plantilla cuando se refine un mÃ³dulo en detalle:

1. Entidades core (modelo de datos).
2. Casos de uso core (flujos mÃ­nimos obligatorios).
3. APIs core (endpoints + contratos).
4. Eventos emitidos/consumidos.
5. Extensiones SaaS (features premium).
6. Riesgos de acoplamiento y decisiones de diseÃ±o.
7. Estado (`planned`, `in_progress`, `done`).

## PrÃ³ximos pasos de documentaciÃ³n
1. Completar Presupuesto con el formato de plantilla completo.
2. Completar Contabilidad con el formato de plantilla completo.
3. Definir catÃ¡logo de eventos de dominio cross-mÃ³dulo (aunque inicialmente se implementen por API sÃ­ncrona).




