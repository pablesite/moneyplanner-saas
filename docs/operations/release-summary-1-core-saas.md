# Release Summary Core/SaaS V1

## Fecha
2026-02-13

## Alcance Del Hito
- Separacion de responsabilidades `core` (base) y `saas` (premium) completada.
- Eliminacion de dominio premium en `core`.
- Extension premium en `saas` con enlaces reales de titularidad sobre entidades base.
- Hardening documental y de tests completado.

## Cambios Relevantes
- `core`:
  - Eliminados modelos/endpoints de `members/ownership`.
  - Conservados flujos base de patrimonio (activos, pasivos, snapshots, resumen).
- `saas`:
  - Capa de servicios para reglas de `ownership`.
  - Nuevo modelo `OwnershipLink` para enlazar ownership premium con `asset/liability` base.
  - Endpoints SaaS:
    - `GET /api/ownership-links/`
    - `POST /api/ownership-links/sync/`
  - `is_in_use` calculado con enlaces reales.
- frontend SaaS:
  - Store de patrimonio sincroniza links de ownership via API SaaS.
  - Eliminadas llamadas legacy no existentes en `core`.
  - Vista de patrimonio alineada con modelo base + extension premium.

## Verificacion Ejecutada
- `docker compose exec saas_backend python manage.py migrate`
- `docker compose exec saas_backend python manage.py check`
- `docker compose exec saas_backend python manage.py test memberships`
- `npm.cmd run build` en `frontend/`

## Evidencia De Cierre
- Fase 1: completada.
- Fase 2: completada.
- Fase 3: completada.
- Fase 4: completada.
- Referencia: `docs/roadmap/roadmap-hito-02-core-saas.md`.

## Operacion
- Checklist de rollout: `docs/operations/release-checklist.md`.
- Plan de recuperacion dataset mixto/legacy: `docs/operations/recovery-plan.md`.

## Riesgos Residuales
- Falta ampliar tests de integracion fuera del dominio `memberships` si se incorporan mas dominios premium.
- Cualquier cambio de contrato futuro en `core` requiere revalidacion con checklist de rollout.




