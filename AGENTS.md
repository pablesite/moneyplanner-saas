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
   - Cuando se actualice funcionalidad en `core/frontend/`, replicar el cambio equivalente en `frontend/` salvo que el alcance sea explicitamente Core-only.
   - No proponer ni ejecutar refactors de frontend o backend salvo peticion explicita. La prioridad actual es completar funcionalidad. Los roadmaps de refactor (frontend-refactor-roadmap.md, backend-refactor-roadmap.md) estan deliberadamente aparcados.
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

## Migraciones (obligatorio cuando cambia modelo de datos)
1. Si se modifica cualquier `models.py`, generar migraciones en el stack afectado:
   - Core: `docker compose exec backend python manage.py makemigrations`
   - SaaS: `docker compose exec backend python manage.py makemigrations`
2. Aplicar migraciones antes de cerrar la tarea:
   - Core: `docker compose exec backend python manage.py migrate`
   - SaaS: `docker compose exec backend python manage.py migrate`
3. Verificar estado aplicado:
   - `docker compose exec backend python manage.py showmigrations <app>`
4. No dar por finalizado un cambio de modelo sin `migrate` aplicado y verificado.

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
2. `docs/project-status.md` — estado actual de funcionalidades
3. `docs/architecture/architecture.md`
4. `docs/architecture/core-saas-boundaries.md`
5. `docs/architecture/capabilities-matrix.md`
6. `docs/architecture/data-model.md` — modelos de datos SaaS y ciclo de vida de usuario
7. `docs/architecture/saas-core-integration-flow.md` — flujo técnico de integración SaaS↔Core
8. `docs/architecture/api-registry.md` — endpoints SaaS y APIs Core consumidas
9. `docs/architecture/glossary.md` — glosario canónico del proyecto
10. `docs/operations/dev-setup.md`
11. `docs/operations/portable-import.md`
12. `docs/roadmap/roadmap.md`
13. `docs/frontend/frontend-visual-guide.md`
14. `docs/frontend/frontend-ux-iteration-playbook.md`
15. `docs/frontend/frontend-css-workflow.md`
16. `docs/frontend/domain-map.md` — dominios frontend SaaS, rutas y clientes API

## Patrones de trabajo

### Añadir un endpoint en el backend SaaS
1. Vista en `backend/saas/<feature>_views.py`
2. Serializer en `backend/saas/<feature>_serializers.py`
3. Lógica de negocio en `backend/saas/<feature>_services.py` (o en `saas_access/` si afecta a modelos de acceso)
4. URL en `backend/saas/<feature>_urls.py` + incluir en `backend/saas/urls.py`
5. Tests en `backend/saas_access/tests.py`
6. Actualizar `docs/architecture/api-registry.md`

### Añadir un dominio frontend SaaS
1. Crear `frontend/src/domains/<nombre>/` con al menos `index.ts` y `api.ts`
2. Usar `coreApi` para llamadas al Core backend, `api` para llamadas al SaaS backend
3. Si hay estado: `store.ts` (Pinia)
4. Si hay lógica Vue reutilizable: `composables.ts`
5. Registrar ruta en `frontend/src/router.ts`
6. Actualizar `docs/frontend/domain-map.md`
7. Verificar si la capacidad necesaria existe en `capabilities/index.ts`

### Actualizar el submodulo Core
1. En `core/`: hacer los cambios y validar
2. En repo raíz: `cd core && git pull origin main && cd ..`
3. `git add core && git commit -m "chore(submodule): update core pointer"`
4. Si el cambio en Core añade funcionalidad que el frontend SaaS debe replicar, aplicar el equivalente en `frontend/`

### Cambiar un modelo de datos SaaS
1. Modificar `backend/saas_access/models.py`
2. `docker compose exec saas_backend python manage.py makemigrations`
3. `docker compose exec saas_backend python manage.py migrate`
4. `docker compose exec saas_backend python manage.py showmigrations saas_access`
5. Actualizar `docs/architecture/data-model.md`

## Documentos canonicos (Core)
1. `core/README.md`
2. `core/docs/README.md` — índice y orden de lectura canónico
3. `core/docs/architecture/architecture.md`
4. `core/docs/architecture/accounting-movements-architecture.md` — modelo contable (LedgerAccount/Transaction/Entry)
5. `core/docs/roadmap/community-roadmap.md` — estado actual del roadmap Core
6. `core/docs/roadmap/backend-refactor-roadmap.md` — refactor backend activo
7. `core/docs/roadmap/terminados/accounting-category-budget-separation-roadmap.md` — separación accounting/budget (terminado)
8. `core/docs/roadmap/frontend-refactor-roadmap.md` — refactor frontend (no iniciado)
9. `core/docs/operations/dev-setup.md`
10. `core/docs/frontend/accounting-movements-ux-notes.md`
11. `core/docs/frontend/net-worth-ux-notes.md`

## Capabilities (regla corta)
1. `plan_code` != `capabilities`.
2. Backend resuelve capabilities efectivas.
3. Frontend consume helpers (`canUse...`) y evita checks directos de plan.
4. `compat.*` solo como puente temporal.
5. Si cambia el packaging, actualizar primero `docs/architecture/capabilities-matrix.md`.
