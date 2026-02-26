# Arquitectura (SaaS + Core)

## Resumen
1. `core/` es la base funcional del producto (open-core).
2. El SaaS añade infraestructura, acceso cloud y administración SaaS.
3. El frontend SaaS consume dominios Core desde `core/backend`.

## Stacks
1. Core:
   - `core/backend` (Django/DRF)
   - `core/frontend` (Vue)
2. SaaS:
   - `backend` (Django, `saas_access`)
   - `frontend` (Vue)

## Regla de diseño actual
1. Dominio Core -> se implementa en `core/backend`.
2. Extra SaaS (auth/rbac/subscription/admin/linking) -> `backend/saas_access`.
3. El SaaS no duplica dominios Core en su backend.

## Documentos relacionados
1. `docs/architecture/core-saas-boundaries.md`
2. `docs/architecture/product-architecture.md`
3. `docs/architecture/capabilities-matrix.md`
4. `docs/roadmap/roadmap.md`
