# Hoja De Ruta Core/SaaS

## Alcance
Backlog de ejecucion para alcanzar la arquitectura objetivo definida en `docs/architecture.md`.

## Estado Actual
- Frontend separado entre `coreApi` y `saas api`.
- Build del frontend en verde.
- Contrato de arquitectura documentado.

## Fases

### Fase 1: Capa De Compatibilidad En SaaS
Estado: no completada.

- [ ] Crear una capa de servicios dedicada en `saas` para asignacion de ownership y validaciones de uso.
- [ ] Eliminar duplicacion de reglas de ownership en vistas/serializers.
- [ ] Anadir tests para restricciones de editar/eliminar cuando ownership esta en uso.

Notas de revision actual:
- En `backend/memberships` no existe modulo `services/` y la logica sigue repartida en `views.py` y `serializers.py`.
- `is_in_use` sigue hardcoded en `backend/memberships/serializers.py` (`return False`).
- `backend/memberships/tests.py` no contiene casos de negocio.

### Fase 2: Eliminar Dominio Premium De Core
Estado: completada.

- [x] Eliminar modelos ownership/member de `core`.
- [x] Eliminar endpoints ownership/member de `core` en net-worth API.
- [x] Mantener `core` usable con flujos basicos sin ownership premium.
- [x] Publicar notas de migracion y versionado.

### Fase 3: Cerrar Extension Premium En SaaS
Estado: pendiente.

- [ ] Anadir/activar tablas de enlace premium desde ownership hacia entidades base.
- [ ] Asegurar que `is_in_use` se calcule con enlaces reales (no hardcoded).
- [ ] Adaptar frontend premium para consumir solo APIs SaaS de ownership.

### Fase 4: Hardening
Estado: pendiente.

- [ ] Anadir tests de integracion para flujos cruzados (`core` + `saas`).
- [ ] Anadir checklist de rollout para upgrade de submodulo y verificacion de compatibilidad.
- [ ] Documentar plan de recuperacion para datasets mixtos/legacy.

## Criterios De Aceptacion
- `core` funciona standalone como producto basico completo.
- `saas` ofrece features premium de ownership sin reintroducir entidades premium en `core`.
- El frontend mantiene fronteras explicitas y no ambiguas entre endpoints base y premium.
