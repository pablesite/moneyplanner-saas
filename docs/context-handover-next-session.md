# Contexto Para Retomar En Otro PC

## Copiar/Pegar Al Iniciar Nueva Conversacion
Usa este bloque como primer mensaje:

```md
Contexto del proyecto:
- Repo: moneyplanner
- Arquitectura: `core` publico (base) + `saas` privado (premium).
- Objetivo ya cumplido en V1:
  - core sin ownership/memberships.
  - saas con ownership premium enlazado a entidades base via `OwnershipLink`.
  - frontend saas sincroniza titularidades con API saas (`ownership-links`) y datos base con `coreApi`.

Estado actual:
- Fases 1-4 del roadmap V1 completadas (`docs/roadmap.md`).
- Tag de hito creado: `milestone/core-saas-v1`.
- Documentos de referencia:
  - `docs/architecture.md`
  - `docs/roadmap.md`
  - `docs/release-checklist.md`
  - `docs/recovery-plan.md`
  - `docs/release-summary-core-saas-v1.md`
  - `docs/roadmap-release-v2.md`

Cambios tecnicos clave ya aplicados:
- Backend saas:
  - modelo `OwnershipLink` + migracion.
  - endpoints:
    - `GET /api/ownership-links/`
    - `POST /api/ownership-links/sync/`
  - `ownership_is_in_use` usa enlaces reales.
- Frontend saas:
  - store de patrimonio usa:
    - `coreApi` para activos/pasivos/snapshots/summary.
    - `api` saas para ownership y ownership-links.
  - eliminadas llamadas legacy de by-member del core.

Tests y checks que deben seguir pasando:
- `docker compose exec saas_backend python manage.py migrate`
- `docker compose exec saas_backend python manage.py check`
- `docker compose exec saas_backend python manage.py test memberships`
- `npm.cmd run build` en `frontend/`

Commits recientes importantes:
- `e427aea` saas: persist ownership links for core assets and liabilities
- `9a9e626` tests/docs: add dual-api integration flows and complete phase 4
- `831ad24` docs: add core/saas v1 release summary
- `7e24659` docs: add v2 refactor roadmap (core+saas, testing, css, linters)
- `4eb6c33` docs: add shared frontend architecture to v2 professionalization plan

Siguiente objetivo:
- Ejecutar roadmap V2 (`docs/roadmap-release-v2.md`), empezando por Fase 0:
  - nuevo repo `core` limpio (sin historial ownership),
  - reapuntar submodulo,
  - preparar base de calidad (linters + type checks + CI).
```

## Nota Rapida
- Si en el nuevo PC no existe el tag local: `git fetch --tags`.
- Si usas contenedores, comprobar que `saas_backend` esta levantado antes de tests/migrate.
