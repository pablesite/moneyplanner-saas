# Roadmap 03 Identidad Core OSS + SaaS Premium

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
Estado: pendiente.

Objetivo:
Cerrar definiciones funcionales y tecnicas de cuentas separadas y linking opcional.

Entregables:
- ADR del modelo dual identity (`core` independiente + `saas` independiente).
- Matriz de casos de uso (solo core, solo saas, ambos vinculados).
- Contrato de referencia externa (`core_user_ref`) y reglas de consistencia.

Checklist:
- [ ] Definir identificadores canonicos por producto (`core_user_id`, `saas_user_id`).
- [ ] Definir reglas de unicidad de email por contexto.
- [ ] Definir lifecycle del linking (crear, validar, revocar).
- [ ] Definir errores y codigos estandar del flujo de linking.

### Fase 1: Fortalecer Auth Standalone En Core
Estado: pendiente.

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
- [ ] Documentar flujo de primer usuario en `core` desde instalacion limpia.

### Fase 2: Fortalecer Auth Y Billing En SaaS
Estado: pendiente.

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
Estado: pendiente.

Objetivo:
Permitir continuidad opcional entre productos sin acoplar autenticacion.

Entregables:
- Flujo de vinculacion opcional de cuentas.
- Tabla/entidad de enlace en `saas` (o servicio dedicado) con trazabilidad.
- Reglas de revocacion/desvinculacion seguras.

Checklist:
- [ ] Disenar token temporal de vinculacion (one-time, expiracion corta).
- [x] Implementar endpoint de vinculo y validaciones anti replay.
- Avance: `POST/GET/DELETE /api/auth/core-link/` implementado con feature flag `ACCOUNT_LINKING_ENABLED`.
- [ ] Registrar auditoria de link/unlink.
- [x] Soportar unlink sin afectar login de ninguno de los dos productos.
- Avance: desvinculacion elimina solo el enlace en SaaS, sin impactar autenticacion local.

### Fase 4: Migracion Y Compatibilidad
Estado: pendiente.

Objetivo:
Transicionar desde el estado actual al modelo dual identity sin cortes.

Entregables:
- Estrategia de migracion incremental por feature flags.
- Scripts idempotentes para backfill de referencias opcionales.
- Plan de rollback por fase.

Checklist:
- [ ] Introducir flags: `AUTH_MODE_CORE_LOCAL`, `AUTH_MODE_SAAS_LOCAL`, `ACCOUNT_LINKING_ENABLED`.
- [ ] Ejecutar migraciones de datos sin bloqueo de usuarios.
- [ ] Validar compatibilidad con sesiones existentes.
- [ ] Definir criterios de salida de modo transitorio.

### Fase 5: Frontend Y UX De Identidad Dual
Estado: pendiente.

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
Estado: pendiente.

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
- [ ] Dashboards con metricas separadas de `core` y `saas`.
- [x] Actualizar runbook de soporte y troubleshooting.
- Avance: `docs/operations/runbook.md` incluye playbook de `429` y chequeo operativo de `auth.audit`.

### Fase 7: Cierre Del Hito Y Formalizacion
Estado: pendiente.

Objetivo:
Cerrar el hito con documentacion, validacion y decision final de arquitectura estabilizada.

Entregables:
- Documento final de arquitectura actualizado.
- Checklist de salida validada en ambos stacks.
- Backlog de mejoras post-hito.

Checklist:
- [ ] Ejecutar smoke tests completos en `core` y `saas`.
- [ ] Confirmar que `core` funciona standalone de punta a punta.
- [ ] Confirmar que premium en `saas` funciona sin dependencia de auth `core`.
- [ ] Publicar resumen final del Hito 05.

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
- [ ] `core` mantiene autenticacion local y funcionamiento standalone documentado.
- [ ] `saas` mantiene autenticacion propia y control premium por suscripcion.
- [ ] No existe dependencia obligatoria de login entre `core` y `saas`.
- [ ] Linking opcional disponible (o explicitamente descartado y documentado).
- [ ] Seguridad, observabilidad y runbook actualizados en ambos stacks.

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
