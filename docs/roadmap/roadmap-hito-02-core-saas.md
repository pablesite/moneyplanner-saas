# Roadmap Hito 02 Core/SaaS

## Alcance
Backlog de ejecucion para alcanzar la arquitectura objetivo definida en `docs/architecture/architecture.md`.

## Estado Actual
- Frontend separado entre `coreApi` y `saas api`.
- Build del frontend en verde.
- Contrato de arquitectura documentado.

## Fases

### Fase 1: Capa De Compatibilidad En SaaS
Estado: completada.

- [x] Crear una capa de servicios dedicada en `saas` para asignacion de ownership y validaciones de uso.
- [x] Eliminar duplicacion de reglas de ownership en vistas/serializers.
- [x] Anadir tests para restricciones de editar/eliminar cuando ownership esta en uso.

Notas:
- Se creo `backend/memberships/services.py` y `views.py`/`serializers.py` consumen esa capa.
- `is_in_use` se resuelve via servicio (`ownership_is_in_use`), preparado para evolucionar con enlaces reales en Fase 3.
- Se anadieron tests API en `backend/memberships/tests.py` para bloqueos de update/delete en escenarios de uso.

### Fase 2: Eliminar Dominio Premium De Core
Estado: completada.

- [x] Eliminar modelos ownership/member de `core`.
- [x] Eliminar endpoints ownership/member de `core` en net-worth API.
- [x] Mantener `core` usable con flujos basicos sin ownership premium.
- [x] Publicar notas de migracion y versionado.

### Fase 3: Cerrar Extension Premium En SaaS
Estado: completada.

- [x] Anadir/activar tablas de enlace premium desde ownership hacia entidades base.
- [x] Asegurar que `is_in_use` se calcule con enlaces reales (no hardcoded).
- [x] Adaptar frontend premium para consumir solo APIs SaaS de ownership.

Notas:
- Se anadio `OwnershipLink` en `backend/memberships/models.py` con migracion dedicada.
- Se expusieron endpoints SaaS `GET /api/ownership-links/` y `POST /api/ownership-links/sync/`.
- El store de patrimonio sincroniza ownership via API SaaS al crear/editar activos y pasivos del core.
- `ownership_is_in_use` ahora se basa en enlaces reales (`OwnershipLink`) en lugar de placeholder.

### Fase 4: Hardening
Estado: completada.

- [x] Anadir tests de integracion para flujos cruzados (`core` + `saas`) y cubrir escenarios completos de API dual.
- [x] Anadir checklist de rollout para upgrade de submodulo y verificacion de compatibilidad.
- [x] Documentar plan de recuperacion para datasets mixtos/legacy.

Notas:
- Checklist de rollout documentado en `docs/operations/release-checklist.md`.
- Plan de recuperacion documentado en `docs/operations/recovery-plan.md`.
- Tests de integracion API dual en `backend/memberships/tests.py` (sync/unsync de links, `is_in_use`, y aislamiento por usuario).

## Criterios De Aceptacion
- `core` funciona standalone como producto basico completo.
- `saas` ofrece features premium de ownership sin reintroducir entidades premium en `core`.
- El frontend mantiene fronteras explicitas y no ambiguas entre endpoints base y premium.

## Siguiente Release
- Roadmap de la siguiente release (refactor completo): `docs/roadmap/roadmap-hito-04-release.md`.





