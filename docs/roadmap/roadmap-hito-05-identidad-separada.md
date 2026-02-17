# Roadmap Hito 05 Identidad Core OSS + SaaS Premium

## Objetivo
Definir e implementar una arquitectura de identidad separada que garantice:
- `core` usable de forma standalone por cualquier persona desde GitHub.
- `saas` con registro/login propios para suscriptores premium.
- Vinculacion opcional de cuentas entre `core` y `saas`, sin dependencia obligatoria.

## Decision Arquitectonica Del Hito 05
- `core` NO actua como IdP de `saas`.
- `core` mantiene autenticacion local e independiente.
- `saas` mantiene autenticacion propia e independiente.
- Si un usuario usa ambos productos, se ofrece account linking opcional.

## Resultado Esperado Del Hito 05
- Instalaciones `core` funcionan sin servicios externos ni dependencia de `saas`.
- `saas` controla autenticacion, autorizacion premium y suscripcion.
- No existe acoplamiento duro entre bases de usuarios.
- Existe estrategia de vinculacion opcional y segura para usuarios que quieran continuidad.

## Principios Del Hito
- Independencia operativa de `core` como producto OSS.
- Separacion estricta entre autenticacion y funcionalidades premium.
- Compatibilidad hacia atras sin romper sesiones actuales.
- Contratos explicitos y versionados para intercambio de identidad opcional.
- Seguridad por defecto y auditoria de eventos sensibles.

## No Objetivos
- No unificar tablas de usuarios entre `core` y `saas`.
- No forzar single sign-on obligatorio entre productos.
- No mover logica premium a `core`.

## Modelo De Identidad Objetivo
- Usuario `core`:
  - Existe y autentica solo dentro de su instancia `core`.
  - No requiere cuenta en `saas` para operar.
- Usuario `saas`:
  - Existe y autentica en la plataforma `saas`.
  - Requiere suscripcion/estado comercial para premium.
- Vinculo opcional:
  - `saas` puede guardar una referencia externa (`core_user_ref`) para migraciones/sincronizaciones puntuales.
  - El login de `saas` nunca depende de validar contra `core`.

## Fases

### Fase 0: Contrato De Identidad Separada
Estado: Completado.

Objetivo:
Cerrar definiciones funcionales y tecnicas de cuentas separadas y linking opcional.

Entregables:
- ADR del modelo dual identity (`core` independiente + `saas` independiente).
- Matriz de casos de uso (solo core, solo saas, ambos vinculados).
- Contrato de referencia externa (`core_user_ref`) y reglas de consistencia.

Checklist:
- [x] Definir identificadores canonicos por producto (`core_user_id`, `saas_user_id`).
- Avance: separacion explicita de identidad en `core` y `saas`; enlace opcional via `core_user_ref` en SaaS.
- [x] Definir reglas de unicidad de email por contexto.
- Avance: validacion de unicidad de usuario/email en registro SaaS y separacion de contexto por stack.
- [x] Definir lifecycle del linking (crear, validar, revocar).
- Avance: ciclo implementado con `POST/GET/DELETE /api/auth/core-link/`.
- [x] Definir errores y codigos estandar del flujo de linking.
- Avance: contrato de error normalizado documentado en `docs/architecture/api-contracts.md`.

### Fase 1: Fortalecer Auth Standalone En Core
Estado: Completado.

Objetivo:
Garantizar que `core` sea instalable y usable sin dependencia externa.

Entregables:
- Login/registro/logout locales robustos en `core`.
- Gestion de sesiones/tokens local con politicas seguras.
- Documentacion de setup OSS sin proveedor externo.

Checklist:
- [x] Revisar endpoints auth existentes de `core` para modo standalone.
- Avance: endpoint `GET /api/auth/mode/` agregado para declarar modo `core_local`.
- [x] Endurecer politicas de sesion y password.
- Avance: en `core` se aplican tokens mas cortos, rotacion de refresh + blacklist y `MinimumLengthValidator(min_length=10)`.
- [x] Anadir tests de autenticacion basica en `core`.
- Avance: test API de modo auth en `core/backend/accounts/tests.py`.
- [x] Documentar flujo de primer usuario en `core` desde instalacion limpia.
- Avance: playbook agregado en `docs/operations/runbook.md` (seccion `Primer Usuario Core (Standalone)`).

### Fase 2: Fortalecer Auth Y Billing En SaaS
Estado: Completado.

Objetivo:
Aislar la identidad de `saas` y su autorizacion premium.

Entregables:
- Auth propia de `saas` (registro/login/recuperacion/gestion de sesion).
- Mapeo de suscripcion a permisos/capacidades premium.
- Integracion auth <-> billing con estados consistentes.

Checklist:
- [x] Separar claramente auth de `saas` de cualquier dependencia de `core`.
- Avance: nuevo bloque auth local en `saas` (`/api/auth/register`, `/api/auth/me`, `/api/auth/mode`).
- [x] Definir estados de cuenta (trial, active, past_due, canceled).
- Avance: modelo `SaasSubscription` incorporado en `memberships`.
- [x] Bloquear/permitir funcionalidades premium por estado de suscripcion.
- Avance: `memberships` ahora exige suscripcion `trial|active`; `past_due|canceled` devuelve `403`.
- [x] Anadir tests API para control de acceso premium.
- Avance: tests API de auth roadmap-03 agregados en `backend/memberships/tests.py`.

### Fase 3: Account Linking Opcional Core <-> SaaS
Estado: Completado.

Objetivo:
Permitir continuidad opcional entre productos sin acoplar autenticacion.

Entregables:
- Flujo de vinculacion opcional de cuentas.
- Tabla/entidad de enlace en `saas` (o servicio dedicado) con trazabilidad.
- Reglas de revocacion/desvinculacion seguras.

Checklist:
- [x] Disenar token temporal de vinculacion (one-time, expiracion corta).
- Avance: `core` emite token temporal en `GET /api/auth/link-token/` y `saas` lo consume en `POST /api/auth/core-link/from-token/` con expiracion configurable.
- [x] Implementar endpoint de vinculo y validaciones anti replay.
- Avance: `POST/GET/DELETE /api/auth/core-link/` implementado con feature flag `ACCOUNT_LINKING_ENABLED`.
- [x] Registrar auditoria de link/unlink.
- Avance: eventos `core_account_link`/`core_account_unlink` auditados en logger estructurado `auth.audit`.
- [x] Soportar unlink sin afectar login de ninguno de los dos productos.
- Avance: desvinculacion elimina solo el enlace en SaaS, sin impactar autenticacion local.

### Fase 4: Migracion Y Compatibilidad
Estado: Completado.

Objetivo:
Transicionar desde el estado actual al modelo dual identity sin cortes.

Entregables:
- Estrategia de migracion incremental por feature flags.
- Scripts idempotentes para backfill de referencias opcionales.
- Plan de rollback por fase.

Checklist:
- [x] Introducir flags: `AUTH_MODE_CORE_LOCAL`, `AUTH_MODE_SAAS_LOCAL`, `ACCOUNT_LINKING_ENABLED`.
- Avance: flags operativos añadidos en `core/backend/config/settings.py` y `backend/saas/settings.py`.
- [x] Ejecutar migraciones de datos sin bloqueo de usuarios.
- Avance: migraciones aplicadas en ambos stacks (`token_blacklist` en core, `memberships.0005` en saas) sin corte completo.
- [x] Validar compatibilidad con sesiones existentes.
- Avance: tests de sesion (`token -> endpoint protegido -> refresh`) en `core` y `saas`, incluyendo caso SaaS tras linking por token temporal.
- [x] Definir criterios de salida de modo transitorio.
- Avance: `GET /api/auth/mode/` en `core` y `saas` expone `transition_mode`, `exit_criteria` y `exit_ready`.

### Fase 5: Frontend Y UX De Identidad Dual
Estado: Completado.

Objetivo:
Reflejar claramente que `core` y `saas` son cuentas distintas, con linking opcional.

Entregables:
- UX separada de login en `core/frontend` y `frontend`.
- Pantallas y mensajes claros de vinculacion opcional.
- Manejo uniforme de errores de autenticacion y linking.

Checklist:
- [x] Ajustar microcopy: Cuenta core vs Cuenta saas.
- Avance: nueva vista `Cuenta SaaS` en `frontend/src/views/AccountView.vue` y accesos desde Patrimonio/Personas.
- [x] Implementar flujo UI de vincular/desvincular cuenta.
- Avance: formulario y acciones de linking opcional integradas contra `/api/auth/core-link/`.
- [x] Anadir tests de integracion para login y linking.
- Avance: test unitario de `AccountView` agregado en `frontend/src/views/__tests__/AccountView.spec.ts`.
- [x] Validar UX de sesion expirada en ambos frontends.
- Avance: redireccion de refresh fallido a `/login?reason=session_expired` y aviso visible en `LoginView` de `core/frontend` y `frontend`.

### Fase 6: Seguridad, Observabilidad Y Operacion
Estado: Completado.

Objetivo:
Operar autenticacion dual con controles de seguridad y monitoreo adecuados.

Entregables:
- Politicas de seguridad por producto (`core` y `saas`).
- Logs de eventos de auth y linking.
- Alertas de incidentes de autenticacion y abuso.

Checklist:
- [x] Rate limiting en login/registro/recovery/linking.
- Avance: throttle por scope aplicado en `saas` y `core` para endpoints de auth y APIs premium sensibles.
- [x] Auditoria de eventos sensibles (login fail, link fail, unlink).
- Avance: logger estructurado `auth.audit` en `saas` (login fail, link fail, unlink) y en login de `core`.
- [x] Dashboards con metricas separadas de `core` y `saas`.
- Avance: endpoints operativos `/api/auth/ops/metrics/` implementados en `core` y `saas` para consumo de dashboards.
- [x] Actualizar runbook de soporte y troubleshooting.
- Avance: `docs/operations/runbook.md` incluye playbook de `429` y chequeo operativo de `auth.audit`.

### Fase 7: Cierre Del Hito Y Formalizacion
Estado: Completado.

Objetivo:
Cerrar el hito con documentacion, validacion y decision final de arquitectura estabilizada.

Entregables:
- Documento final de arquitectura actualizado.
- Checklist de salida validada en ambos stacks.
- Backlog de mejoras post-hito.

Checklist:
- [x] Ejecutar smoke tests completos en `core` y `saas`.
- Avance: smoke tests API ejecutados en ambos stacks (token, refresh, endpoints protegidos, mode y metrics).
- [x] Confirmar que `core` funciona standalone de punta a punta.
- Avance: validado con flujo completo `core` (`token -> settings -> refresh -> ops/metrics`).
- [x] Confirmar que premium en `saas` funciona sin dependencia de auth `core`.
- Avance: validado con flujo completo `saas` y verificacion cruzada (`token core` sobre endpoint saas => `401`).
- [x] Publicar resumen final del Hito 05.
- Avance: publicado en `docs/roadmap/release-summary-hito-05-identidad-separada.md`.

## Validacion Recomendada (Dentro De Contenedores)
Backend Core (`core/backend`):
- `ruff check .`
- `ruff format --check .`
- `mypy .`

Backend SaaS (`backend/`):
- `ruff check .`
- `ruff format --check .`
- `mypy .`

Frontend Core (`core/frontend`):
- `npm run lint`
- `npm run format:check`
- `npm run typecheck`

Frontend SaaS (`frontend`):
- `npm run lint`
- `npm run format:check`
- `npm run typecheck`

## Definition Of Done (Hito 05)
- [x] `core` mantiene autenticacion local y funcionamiento standalone documentado.
- [x] `saas` mantiene autenticacion propia y control premium por suscripcion.
- [x] No existe dependencia obligatoria de login entre `core` y `saas`.
- [x] Linking opcional disponible (o explicitamente descartado y documentado).
- [x] Seguridad, observabilidad y runbook actualizados en ambos stacks.

## Dependencias
- Hito 04 con baseline de calidad y tests.
- Contratos API actualizados en `docs/architecture/api-contracts.md`.
- Fronteras core/saas vigentes en `docs/architecture/core-saas-boundaries.md`.

## Orden Recomendado De Ejecucion
1. Fase 0 (contrato de identidad separada)
2. Fase 1 (auth standalone en core)
3. Fase 2 (auth + billing en saas)
4. Fase 3 (linking opcional)
5. Fase 4 (migracion y compatibilidad)
6. Fase 5 (frontend y UX)
7. Fase 6 (seguridad y observabilidad)
8. Fase 7 (cierre del hito)

## Hito 5B: Autorizacion SaaS Multirol
Estado: En progreso.

### Objetivo
Extender el modelo de identidad separada con autorizacion interna de SaaS para distinguir:
- `saas_admin`: control total operativo de la plataforma SaaS, incluyendo gestion de usuarios/permisos dentro del SaaS.
- `saas_member`: acceso funcional al producto segun plan/permisos asignados.

### Alcance
- Definir RBAC en SaaS sin romper la separacion de identidad `core`/`saas`.
- Mantener la suscripcion (`trial|active|past_due|canceled`) como capa comercial, separada del rol.
- Incorporar administracion de usuarios y permisos en API + frontend SaaS.

### No Objetivos
- No unificar autenticacion de `core` y `saas`.
- No mover autorizacion premium a `core`.
- No introducir dependencias obligatorias de SSO.

### Fases

#### Fase 5B.0: Modelo De Roles Y Matriz De Permisos
Estado: Completado.

Entregables:
- Definicion canonica de roles SaaS y capacidades.
- Matriz accion->permiso (backend + frontend).
- Reglas de precedencia entre rol, estado de suscripcion y linking.

Checklist:
- [x] Definir roles iniciales: `saas_admin`, `saas_member`.
- Avance: modelo canonico de dos roles documentado en arquitectura funcional.
- [x] Definir permisos minimos por dominio (auth, miembros, ownership, ops, billing).
- Avance: matriz minima v1 publicada con separacion entre gestion administrativa y uso funcional.
- [x] Definir politica por defecto para nuevos usuarios (least privilege).
- Avance: politica de alta inicial definida como `saas_member` por defecto.
- [x] Documentar matriz en `docs/architecture/product-architecture.md` y `docs/architecture/api-contracts.md`.
- Avance: contrato RBAC añadido con reglas, codigos de error y borrador de endpoints administrativos.

#### Fase 5B.1: Dominio De Autorizacion En Backend SaaS
Estado: Completado.

Entregables:
- Modelo persistente de rol/permisos por usuario SaaS.
- Servicios transaccionales para asignacion/revocacion.
- Migraciones y seed idempotente con usuario admin inicial.

Checklist:
- [x] Crear modelo(s) de rol/permisos (o integracion formal con `groups/permissions` de Django).
- Avance: nuevo modelo `SaasAccessProfile` (`OneToOne` con usuario SaaS) con roles `saas_admin|saas_member`.
- [x] Implementar servicios de negocio para alta/baja/cambio de rol.
- Avance: servicios RBAC añadidos (`get_or_create_access_profile`, `assign_role`, `has_admin_role`).
- [x] Asegurar constraints de integridad (al menos un `saas_admin` activo).
- Avance: guardia de dominio activa para impedir degradar al ultimo `saas_admin` activo.
- [x] Agregar migraciones + plan de backfill para usuarios existentes.
- Avance: migracion `memberships.0007_saasaccessprofile` crea perfiles y backfill (`staff/superuser -> saas_admin`, resto -> `saas_member`).

#### Fase 5B.2: Endpoints De Administracion SaaS
Estado: Pendiente.

Entregables:
- API de administracion de usuarios/roles/permisos.
- Endpoints protegidos por permisos finos (no solo `IsAuthenticated`).
- Contrato de errores de autorizacion uniforme (`403` con codigo estable).

Checklist:
- [ ] Exponer endpoints CRUD de usuarios SaaS para admins.
- [ ] Exponer endpoint de cambio de rol/permisos con auditoria.
- [ ] Aplicar permisos por accion en vistas premium y operativas.
- [ ] Versionar y documentar contratos en `docs/architecture/api-contracts.md`.

#### Fase 5B.3: Frontend De Administracion Y UX De Permisos
Estado: Pendiente.

Entregables:
- Vista de administracion de usuarios en `frontend`.
- Guardas de ruta y UI condicional por rol/capacidad.
- Mensajeria clara para denegaciones por rol vs por suscripcion.

Checklist:
- [ ] Implementar pantalla de usuarios SaaS (listar, crear, editar rol, desactivar).
- [ ] Adaptar navegacion por capacidades visibles para cada rol.
- [ ] Diferenciar errores de negocio: `subscription_blocked` vs `permission_denied`.
- [ ] Añadir tests de componentes/composables para escenarios RBAC.

#### Fase 5B.4: Seguridad, Auditoria Y Operacion
Estado: Pendiente.

Entregables:
- Auditoria estructurada de eventos administrativos.
- Hardening para acciones sensibles (rate-limit, confirmacion explicita).
- Runbook de soporte para incidencias RBAC.

Checklist:
- [ ] Auditar eventos: alta usuario, cambio rol, bloqueo/desbloqueo, borrado.
- [ ] Aplicar throttling dedicado para endpoints de administracion.
- [ ] Incluir consultas operativas RBAC en `/api/auth/ops/metrics/` o endpoint complementario.
- [ ] Actualizar `docs/operations/runbook.md` con troubleshooting RBAC.

#### Fase 5B.5: Validacion, Cierre Y Release Summary
Estado: Pendiente.

Entregables:
- Suite de tests RBAC completa.
- Evidencias de validacion en contenedores.
- Resumen de release del Hito 5B.

Checklist:
- [ ] Tests backend: permitido/denegado por rol y por estado de suscripcion.
- [ ] Tests frontend: guardas de ruta y visibilidad de acciones por rol.
- [ ] Ejecutar calidad completa (`ruff`, `mypy`, `lint`, `typecheck`) en contenedores.
- [ ] Publicar `docs/roadmap/release-summary-hito-05b-rbac-saas.md`.

### Definition Of Done (Hito 5B)
- [ ] Existe RBAC SaaS documentado y aplicado en backend/frontend.
- [ ] Las acciones administrativas quedan restringidas a `saas_admin`.
- [ ] Se mantiene la separacion entre autenticacion (`quien eres`) y autorizacion (`que puedes hacer`).
- [ ] Se preserva la separacion de identidad `core`/`saas` sin regresiones.
- [ ] Hay auditoria, runbook y pruebas automatizadas de permisos.
