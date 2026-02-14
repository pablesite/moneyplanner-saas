# Core/SaaS Backend Boundaries

## Objetivo
Reducir duplicacion entre `core` y `saas` sin mezclar dependencias entre repositorios.

## Principios
- `core` define capacidades base reutilizables del producto.
- `saas` extiende sobre `core` con funcionalidades premium o especificas de negocio.
- No se permiten importaciones Python cruzadas entre repos (`backend/` no importa desde `core/backend/` y viceversa).
- Cuando exista una implementacion igual en ambos repos, debe existir una fuente canonica declarada.

## Fuente Canonica Actual (Backend)
- Contrato de errores API (`error.code`, `error.message`, `error.details`):
  - Canonico: `core/backend/config/exceptions.py`
  - Replica en SaaS: `backend/saas/exceptions.py`
  - Regla: cualquier cambio en contrato de error se aplica primero en canonico y luego se replica en SaaS en la misma tarea.
  - Senalizacion aplicada: ambos archivos incluyen cabecera explicita de canonico/espejo para evitar divergencia accidental.

## Reglas De Frontera Por Dominio
- `core/backend/accounts`, `core/backend/core`, `core/backend/net_worth`:
  - Dominio base OSS.
- `backend/memberships`:
  - Dominio SaaS/premium.
- Validaciones de negocio:
  - Deben vivir en `services.py` de cada dominio, no en `views.py` ni en `serializers.py`.

## Checklist Rapido Para Evitar Duplicacion Nueva
- Antes de crear modulo nuevo en `saas`, revisar si ya existe equivalente en `core`.
- Si se replica codigo por frontera de repos, documentar:
  - motivo de la replica,
  - archivo canonico,
  - regla de sincronizacion.
- Mantener contratos API documentados en `docs/api-contracts.md`.
