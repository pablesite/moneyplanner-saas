# AGENTS.md

## Objetivo
Este repo contiene dos stacks coordinados:
1. `core/` (OSS)
2. SaaS (ra�z: `backend/` + `frontend/`)

## Regla de trabajo
1. Diagnosticar primero.
2. Cambiar lo m�nimo necesario.
3. Validar dentro de Docker.
4. Actualizar docs y versi�n.
5. Commit con Conventional Commits.

## Arranque est�ndar
1. `cd core`
2. `docker compose up --build -d`
3. `cd ..`
4. `docker compose up --build -d`

## Diagn�stico est�ndar
1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`
3. Opcional: `docker compose ps -a`, `docker compose logs --tail 200 <service>`

## Restricciones operativas
1. No borrar volúmenes de BD.
2. No usar `docker compose down -v` salvo petición explícita.
3. Ejecutar calidad/tests dentro de contenedores (`docker compose exec ...`).
4. En PowerShell no usar `&&`.

## Calidad (estado actual)
1. SaaS backend (`backend/`): `ruff check .`, `ruff format --check .`, `mypy .`
2. Core backend (`core/backend/`): `ruff check .`, `ruff format --check .`, `mypy .`
3. SaaS frontend (`frontend/`): `npm run lint`, `npm run format:check`, `npm run typecheck`
4. Core frontend (`core/frontend/`): `npm run lint`, `npm run format:check`, `npm run typecheck`

## Tests m�nimos actuales
1. SaaS backend: `docker compose exec saas_backend python manage.py test saas_access`
2. Core backend: cobertura por dominio (evolutiva)

## Documentos can�nicos (SaaS)
1. `docs/README.md`
2. `docs/operations/dev-setup.md`
3. `docs/operations/runbook.md`
4. `docs/architecture/architecture.md`
5. `docs/architecture/core-saas-boundaries.md`
6. `docs/architecture/capabilities-matrix.md`
7. `docs/roadmap/roadmap.md`
8. `docs/roadmap/core-v0-consolidation-parity-checklist.md`

## Capabilities (regla corta)
1. `plan_code` != `capabilities`.
2. Backend resuelve capabilities efectivas.
3. Frontend consume helpers (`canUse...`) y evita checks directos de plan.
4. `compat.*` solo como puente temporal.
5. Si cambia el packaging, actualizar primero `docs/architecture/capabilities-matrix.md`.
