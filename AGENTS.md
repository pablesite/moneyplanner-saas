# AGENTS.md

## Objetivo
Este repo contiene dos stacks coordinados:
1. `core/` (OSS)
2. SaaS (raiz: `backend/` + `frontend/`)

## Regla de trabajo
1. Diagnosticar antes de cambiar.
   - Revisar primero el estado real del stack afectado.
   - Consultar los documentos canonicos si el cambio toca arquitectura, packaging o flujos operativos.
   - No asumir que la documentacion historica refleja el estado actual.
2. Cambiar lo minimo necesario.
   - Priorizar cambios acotados, reversibles y faciles de validar.
   - Evitar refactors o limpiezas fuera de alcance salvo que desbloqueen el problema.
   - No duplicar logica entre Core y SaaS.
3. Validar dentro de Docker.
   - Ejecutar calidad, typecheck y tests en contenedores del stack afectado.
   - Si el cambio toca integracion Core/SaaS, validar ambos lados.
   - No dar por bueno un cambio sin validacion suficiente para su alcance.
4. Actualizar documentacion y version cuando aplique.
   - Actualizar solo la documentacion canonica afectada por el cambio.
   - Si cambia arquitectura, boundaries o capabilities, reflejarlo antes de cerrar la tarea.
   - Ajustar version segun el impacto real del cambio.
5. Cerrar con trazabilidad.
   - Dejar claro que se cambio, que se valido y que queda pendiente si aplica.
   - Al terminar cada feature o bloque funcional validado, crear un commit.
   - Usar Conventional Commits.
   - Indicar riesgos, deuda pendiente o validaciones no ejecutadas si las hubiera.

## Arranque estandar
1. `cd core`
2. `docker compose up --build -d`
3. `cd ..`
4. `docker compose up --build -d`

## Diagnostico estandar
1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`
3. Opcional: `docker compose ps -a`, `docker compose logs --tail 200 <service>`

## Restricciones operativas
1. No borrar volumenes de BD.
2. No usar `docker compose down -v` salvo peticion explicita.
3. Ejecutar calidad/tests dentro de contenedores (`docker compose exec ...`).
4. En PowerShell no usar `&&`.

## Calidad (estado actual)
1. SaaS backend (`backend/`): `ruff check .`, `ruff format --check .`, `mypy .`
2. Core backend (`core/backend/`): `ruff check .`, `ruff format --check .`, `mypy .`
3. SaaS frontend (`frontend/`): `npm run lint`, `npm run format:check`, `npm run typecheck`
4. Core frontend (`core/frontend/`): `npm run lint`, `npm run format:check`, `npm run typecheck`

## Tests minimos actuales
1. SaaS backend: `docker compose exec saas_backend python manage.py test saas_access`
2. Core backend: cobertura por dominio (evolutiva)

## Documentos canonicos (SaaS)
1. `docs/README.md`
2. `docs/operations/dev-setup.md`
3. `docs/operations/portable-import.md`
4. `docs/architecture/architecture.md`
5. `docs/architecture/core-saas-boundaries.md`
6. `docs/architecture/capabilities-matrix.md`
7. `docs/roadmap/roadmap.md`
8. `docs/roadmap/core-v0-consolidation-parity-checklist.md`
9. `docs/frontend/frontend-visual-guide.md`
10. `docs/frontend/frontend-ux-iteration-playbook.md`
11. `docs/frontend/frontend-css-workflow.md`

## Capabilities (regla corta)
1. `plan_code` != `capabilities`.
2. Backend resuelve capabilities efectivas.
3. Frontend consume helpers (`canUse...`) y evita checks directos de plan.
4. `compat.*` solo como puente temporal.
5. Si cambia el packaging, actualizar primero `docs/architecture/capabilities-matrix.md`.
