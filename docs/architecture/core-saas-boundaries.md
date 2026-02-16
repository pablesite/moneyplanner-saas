# Core/SaaS Boundaries

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

## Fuente Canonica Actual (Frontend)
- Canonico frontend base: `core/frontend/src`.
- Regla de independencia:
  - `core` no depende de archivos fuera de `core/`.
  - `saas` puede sincronizar archivos base desde `core`, pero no al reves.
- Sincronizacion declarada:
  - Manifest de archivos canonicos: `scripts/frontend-sync-manifest.txt`.
  - Check de drift: `powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1`
  - Aplicar sync: `powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1 -Apply`
- Zona premium SaaS (no sincronizar desde core):
  - `frontend/src/views/PeopleView.vue`
  - `frontend/src/stores/people.ts`
  - `frontend/src/components/people/*`

## Contrato De Extension Frontend (Slots/Hooks)
- Objetivo: evitar forks de vistas base y extender comportamiento premium desde `frontend` (SaaS) con puntos de extension explicitos.
- Regla 1: las vistas base del canonico (`core/frontend/src/views/*`) no importan dominios premium (`people`, `memberships`, etc.).
- Regla 2: cada punto de extension se define en `core` como contrato tipado (props/eventos/retornos) y en `saas` se resuelve con implementacion concreta.
- Regla 3: el valor por defecto en `core` debe ser no-op o UI neutra para mantener funcionamiento standalone.
- Regla 4: los flags de `domains/capabilities` solo habilitan features; no sustituyen el contrato de extension.

### Patron Recomendado
- Slot de UI: secciones inyectables en componentes base (por ejemplo: acciones extra en `NetWorthView`).
- Hook/composable de dominio: funcion registrada para comportamiento premium opcional (por ejemplo: ownership sync posterior a alta/edicion).
- Registry por dominio: modulo de resolucion en SaaS con fallback a implementacion base.

### Criterio De Done Para Este Punto
- Existe al menos un flujo base migrado a extension por contrato (sin copia de vista completa).
- El contrato tipado del punto de extension esta en `core/frontend/src/domains/*`.
- SaaS implementa el override en `frontend/src/domains/*` sin tocar la vista base sincronizada.
- Se valida lint/typecheck en `core/frontend` y `frontend` tras sync.

## Checklist Rapido Para Evitar Duplicacion Nueva
- Antes de crear modulo nuevo en `saas`, revisar si ya existe equivalente en `core`.
- Si se replica codigo por frontera de repos, documentar:
  - motivo de la replica,
  - archivo canonico,
  - regla de sincronizacion.
- Mantener contratos API documentados en `docs/architecture/api-contracts.md`.
- Cuando se toque frontend base:
  - cambiar primero en `core/frontend/src`,
  - correr check de drift,
  - aplicar sync en SaaS solo para archivos del manifest,
  - validar typecheck/lint en ambos frontends.


