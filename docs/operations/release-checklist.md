# Checklist De Rollout Core/SaaS

## Objetivo
Checklist operativo para upgrades del submodulo `core` dentro de `saas` sin romper compatibilidad.

## 1. Preflight (antes de tocar nada)
- [ ] Confirmar rama y estado limpio en repo principal: `git status`.
- [ ] Confirmar estado limpio del submodulo `core`: `git -C core status`.
- [ ] Revisar cambios entre version actual y objetivo de `core`:
  - [ ] `git -C core fetch --all --tags`
  - [ ] `git -C core log --oneline --decorate <actual>..<objetivo>`
  - [ ] `git -C core diff --name-only <actual>..<objetivo>`
- [ ] Identificar cambios de contrato API en `core/backend/net_worth` y `core/backend/accounts` usando `docs/architecture/api-contracts.md`.
- [ ] Revisar notas de migracion/version en `core/README.md`.

## 2. Actualizacion Del Submodulo
- [ ] Mover `core` al commit/tag objetivo.
- [ ] Commit en repo SaaS con el puntero de submodulo actualizado.
- [ ] Documentar en mensaje de commit la version/sha de `core`.

## 3. Migraciones Y Arranque
- [ ] Levantar/recrear servicios necesarios:
  - [ ] `docker compose up -d --force-recreate saas_backend`
- [ ] Ejecutar migraciones:
  - [ ] `docker compose exec saas_backend python manage.py migrate`
- [ ] Verificar chequeo Django:
  - [ ] `docker compose exec saas_backend python manage.py check`

## 4. Verificacion Automatizada
- [ ] Backend SaaS:
  - [ ] `docker compose exec saas_backend ruff check .`
  - [ ] `docker compose exec saas_backend ruff format --check .`
  - [ ] `docker compose exec saas_backend mypy .`
  - [ ] `docker compose exec saas_backend python manage.py test memberships`
- [ ] Backend Core:
  - [ ] `cd core`
  - [ ] `docker compose exec backend ruff check .`
  - [ ] `docker compose exec backend ruff format --check .`
  - [ ] `docker compose exec backend mypy .`
  - [ ] `docker compose exec backend python manage.py test accounts net_worth core`
- [ ] Frontend SaaS:
  - [ ] `docker compose exec saas_frontend npm run lint`
  - [ ] `docker compose exec saas_frontend npm run format:check`
  - [ ] `docker compose exec saas_frontend npm run typecheck`
  - [ ] `docker compose exec saas_frontend npm run test:unit`
  - [ ] `docker compose exec saas_frontend npm run test:e2e -- --project=chromium`
- [ ] Frontend Core:
  - [ ] `cd core`
  - [ ] `docker compose exec frontend npm run lint`
  - [ ] `docker compose exec frontend npm run format:check`
  - [ ] `docker compose exec frontend npm run typecheck`
  - [ ] `docker compose exec frontend npm run test:unit`
  - [ ] `docker compose exec frontend npm run test:e2e -- --project=chromium`

## 5. Smoke Test Manual (API Dual)
- [ ] Login en frontend SaaS.
- [ ] Crear activo en patrimonio (core API).
- [ ] Asignar titularidad al activo (SaaS API).
- [ ] Recargar vista y confirmar que la titularidad persiste.
- [ ] Editar titularidad y confirmar persistencia.
- [ ] Intentar borrar una titularidad en uso y verificar bloqueo.
- [ ] Crear/editar pasivo con `financed_asset_id` y titularidad.

## 6. Rollback
- [ ] Tener identificado commit anterior del submodulo `core`.
- [ ] Si falla compatibilidad:
  - [ ] Revertir puntero de submodulo al commit previo.
  - [ ] Ejecutar `docker compose exec saas_backend python manage.py migrate` (si aplica).
  - [ ] Repetir `check` + tests criticos.

## 7. Cierre
- [ ] Actualizar `docs/roadmap/roadmap-hito-04-refactor.md` con estado real.
- [ ] Publicar `docs/roadmap/release-summary-v2.md`.
- [ ] Registrar incidencias y decisiones en PR/commit.
- [ ] Etiquetar release si el cambio queda estable.



