# AGENTS.md

## Objetivo

Este repo contiene dos stacks coordinados:

1. `core/` (OSS) — producto independiente, es un submódulo git de este repo
2. SaaS (raiz: `backend/` + `frontend/`) — consume Core como backend base y lo extiende con acceso, billing y multi-tenant

Core y SaaS tienen ciclos de validación independientes pero comparten boundaries e integración API. El frontend SaaS ya no se mantiene como espejo obligatorio del frontend Core.

## Skills disponibles

Usar obligatoriamente cuando aplique. No son opcionales:

| Cuándo usarla                                                       | Skill             |
| ------------------------------------------------------------------- | ----------------- |
| Cualquier cambio en frontend: layouts, vistas, componentes, CSS, UX | `frontend-system` |
| Antes de commitear cualquier cambio de código                       | `validate`        |
| Antes de cualquier push a GitHub o preparación de deploy            | `publish-flow`    |
| Inicio de sesión sin contexto claro del estado del proyecto         | `status`          |

Las skills están en `.codex/skills/`. Leer el `SKILL.md` correspondiente antes de ejecutar.

## Read First

Leer al inicio de cualquier tarea, antes de tocar código o documentación:

- Si la tarea es **solo Core**: leer `core/docs/project-status.md` + doc de arquitectura del área afectada + task spec si existe en `core/docs/tasks/`
- Si la tarea es **solo SaaS**: leer `docs/project-status.md` + doc de arquitectura del área afectada + task spec si existe en `docs/tasks/`
- Si la tarea **toca integración Core/SaaS**: leer ambos `project-status.md` + `docs/architecture/core-saas-boundaries.md` + `docs/architecture/capabilities-matrix.md`

## Regla de trabajo

1. Diagnosticar antes de cambiar.
   - Revisar primero el estado real del stack afectado.
   - Consultar los documentos canonicos si el cambio toca arquitectura, packaging o flujos operativos.
   - No asumir que la documentacion historica refleja el estado actual.
2. Cambiar lo minimo necesario.
   - Priorizar cambios acotados, reversibles y faciles de validar.
   - Evitar refactors o limpiezas fuera de alcance salvo que desbloqueen el problema.
   - No duplicar logica entre Core y SaaS.
   - **Regla vigente SaaS frontend:** `frontend/` evoluciona de forma autónoma. Consultar `core/frontend/` solo como referencia cuando ayude a entender un flujo apoyado en APIs de Core, pero sin obligación de replicar cambios ni de mantener paridad visual exacta.
   - No proponer ni ejecutar refactors de frontend o backend salvo peticion explicita. La prioridad actual es completar funcionalidad. Los roadmaps de refactor (frontend-refactor-roadmap.md, backend-refactor-roadmap.md) estan deliberadamente aparcados.
3. Validar dentro de Docker **antes de cada commit**.
   - Ejecutar la skill `validate` para el stack afectado antes de commitear cualquier cambio de código.
   - Si el cambio toca integración Core/SaaS, validar ambos lados (`/validate all`).
   - No crear commits ni PRs sin que lint, format, typecheck y tests pasen en verde.
   - No dar por bueno un cambio sin validacion suficiente para su alcance.
4. Validar obligatoriamente **antes de cualquier push o preparación de producción**.
   - Ejecutar `./scripts/pre-push-check.sh` antes de cualquier `git push`, propuesta de `git push`, o preparación de despliegue a producción.
   - Usar obligatoriamente la skill `publish-flow` cuando la tarea implique subir cambios a GitHub, revisar readiness de CI, o preparar deploy productivo.
   - Si `./scripts/pre-push-check.sh` falla, detener el flujo: no proponer push, no proponer deploy y no dar por listo el release hasta resolver la causa.
   - La validación pre-push debe ejecutarse sobre el stack integrado de la raíz, salvo que el usuario pida explícitamente auditar solo el repo Core standalone.
5. Actualizar documentacion y version cuando aplique.
   - Actualizar solo la documentacion canonica afectada por el cambio.
   - Si cambia arquitectura, boundaries o capabilities, reflejarlo antes de cerrar la tarea.
   - El versionado es automatico via release-please: NO tocar VERSION ni package.json manualmente.
   - El tipo de Conventional Commit determina el bump: `fix:` → PATCH, `feat:` → MINOR, `feat!:` / `BREAKING CHANGE:` → MAJOR. `chore:`, `docs:`, `refactor:` no generan release.
   - Al hacer push a main, release-please abre un PR "Release vX.Y.Z" con el CHANGELOG generado. Al mergear ese PR se crea el tag y se actualiza VERSION + frontend/package.json.
6. Cerrar con trazabilidad.
   - Dejar claro que se cambio, que se valido y que queda pendiente si aplica.
   - Al terminar cada feature o bloque funcional validado, crear un commit.
   - Usar Conventional Commits.
   - Indicar riesgos, deuda pendiente o validaciones no ejecutadas si las hubiera.

## Arranque estandar

Solo ejecutar si los contenedores no están ya corriendo.

### Repo raiz `moneyplanner-saas` (flujo canonico integrado)

1. `cp .env.dev.example .env.dev`
2. `docker compose -f docker-compose.dev.yml --env-file .env.dev up --build -d`

### Core standalone (`./core`)

Mantener disponible para la comunidad open core:

1. `cd core`
2. `docker compose up --build -d`

## Diagnostico estandar

### Repo raiz `moneyplanner-saas`

1. `docker compose -f docker-compose.dev.yml --env-file .env.dev ps`
2. `docker compose -f docker-compose.dev.yml --env-file .env.dev logs --tail 100 <service>`
3. Opcional: `docker compose -f docker-compose.dev.yml --env-file .env.dev ps -a`, `docker compose -f docker-compose.dev.yml --env-file .env.dev logs --tail 200 <service>`

### Core standalone (`./core`)

1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`
3. Opcional: `docker compose ps -a`, `docker compose logs --tail 200 <service>`

## Restricciones operativas

1. No borrar volumenes de BD.
2. No usar `docker compose down -v` salvo peticion explicita.
3. Ejecutar calidad/tests dentro de contenedores (`docker compose exec ...`).
4. En PowerShell no usar `&&`.
5. No ejecutar `git push` sin confirmacion explicita del usuario.
6. No preparar ni recomendar un despliegue a producción sin haber ejecutado antes `./scripts/pre-push-check.sh` en verde en la copia de trabajo actual.

## Migraciones (obligatorio cuando cambia modelo de datos)

1. Si se modifica cualquier `models.py`, generar migraciones en el stack afectado:
   - Core: `docker compose -f core/docker-compose.yml exec backend python manage.py makemigrations`
   - SaaS: `docker compose exec saas_backend python manage.py makemigrations`
2. Aplicar migraciones antes de cerrar la tarea:
   - Core: `docker compose -f core/docker-compose.yml exec backend python manage.py migrate`
   - SaaS: `docker compose exec saas_backend python manage.py migrate`
3. Verificar estado aplicado:
   - Core: `docker compose -f core/docker-compose.yml exec backend python manage.py showmigrations <app>`
   - SaaS: `docker compose exec saas_backend python manage.py showmigrations <app>`
4. No dar por finalizado un cambio de modelo sin `migrate` aplicado y verificado.

## Calidad (estado actual)

1. SaaS backend: `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend ruff check .`, `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend ruff format --check .`, `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend mypy .`
2. Core backend: `docker compose -f core/docker-compose.yml exec backend ruff check .`, `ruff format --check .`, `mypy .`
3. SaaS frontend: `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint`, `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check`, `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck`
4. Core frontend: `docker compose -f core/docker-compose.yml exec frontend npm run lint`, `npm run format:check`, `npm run typecheck`

## Tests minimos actuales

1. SaaS backend: `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend python manage.py test saas_access`
2. Core backend: `docker compose -f core/docker-compose.yml exec backend python manage.py test accounting accounts budget memberships net_worth core`

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
11. `docs/roadmap/saas-pilot-integration-checklist.md` — checklist operacional de readiness para el piloto
12. `docs/frontend/frontend-visual-guide.md`
13. `docs/frontend/frontend-ux-iteration-playbook.md`
14. `docs/frontend/frontend-css-workflow.md`
15. `docs/frontend/domain-map.md` — dominios frontend SaaS, rutas y clientes API
16. `docs/standards/task-template.md` — plantilla canónica para task specs
17. `docs/standards/planning-guide.md` — instrucciones para planificar un módulo

## Capabilities (regla corta)

1. `plan_code` != `capabilities`.
2. Backend resuelve capabilities efectivas.
3. Frontend consume helpers (`canUse...`) y evita checks directos de plan.
4. `compat.*` solo como puente temporal.
5. Si cambia el packaging, actualizar primero `docs/architecture/capabilities-matrix.md`.

## Patrones de trabajo

### Añadir un endpoint en el backend SaaS

1. Vista en `backend/saas/<feature>_views.py`
2. Serializer en `backend/saas/<feature>_serializers.py`
3. Lógica de negocio en `backend/saas/<feature>_services.py` (o en `saas_access/` si afecta a modelos de acceso)
4. URL en `backend/saas/<feature>_urls.py` + incluir en `backend/saas/urls.py`
5. Tests en `backend/saas_access/tests.py`
6. Actualizar `docs/architecture/api-registry.md`

### Añadir un dominio frontend SaaS

> Usar skill `frontend-system` antes de empezar.

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
4. Si el cambio en Core afecta a contratos consumidos por el frontend SaaS, adaptar `frontend/` solo en lo necesario para mantener la integración y la UX del SaaS.

### Cambiar un modelo de datos SaaS

1. Modificar `backend/saas_access/models.py`
2. `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend python manage.py makemigrations`
3. `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend python manage.py migrate`
4. `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend python manage.py showmigrations saas_access`
5. Actualizar `docs/architecture/data-model.md`

### Planificar un módulo

Seguir `docs/standards/planning-guide.md` paso a paso.

1. Entrar en plan mode
2. Leer roadmap + project-status + docs de arquitectura del módulo antes de hablar
3. Presentar interpretación y esperar input del usuario
4. Acordar breakdown de fases y tasks
5. Al salir del plan mode: generar los ficheros de task specs directamente (no pedir confirmación adicional)
6. Actualizar `project-status.md` con las nuevas tasks

### Cerrar una tarea tipo Agente (con spec)

1. Verificar que todos los criterios de `Completion Criteria` de la spec están cumplidos
2. Si la tarea tocó `core/frontend/`: verificar si cambia algún contrato, copy o flujo consumido por `frontend/` y adaptar el SaaS solo si impacta a la integración.
3. Si la tarea tocó `frontend/` (SaaS): no asumir réplica en `core/frontend/`; documentar solo dependencias reales con Core si las hubiera
4. Actualizar cada doc listado en `Required Documentation Updates` de la spec
5. Actualizar la fila correspondiente en `project-status.md` (estado → ✅ o eliminar de "en curso")
6. Mover el fichero de spec a `terminados/` dentro de su carpeta de módulo
7. Crear commit (Conventional Commits) con resumen de qué se cambió, qué se validó y qué queda pendiente si aplica

### Cerrar una tarea tipo Manual (sin spec)

1. Actualizar los docs canónicos afectados por los cambios realizados
2. Actualizar la fila correspondiente en `project-status.md`
3. Crear commit (Conventional Commits)

### Añadir un endpoint en el backend Core

1. Vista en `core/backend/<app>/views.py`
2. Serializer en `core/backend/<app>/serializers.py`
3. Lógica de negocio en `core/backend/<app>/services.py`
4. URL en `core/backend/<app>/urls.py` + incluir en `core/backend/config/urls.py`
5. Tests en `core/backend/<app>/tests/`
6. Actualizar `core/docs/architecture/architecture.md` si cambia la API pública

### Añadir un dominio frontend Core

> Usar skill `frontend-system` antes de empezar.

1. Crear o modificar componentes en `core/frontend/src/`
2. Registrar ruta si aplica
3. Actualizar `core/docs/frontend/` con notas UX si el cambio afecta flujo de usuario
4. Documentar dependencias con el SaaS solo si el cambio altera contratos o expectativas de integración

## Documentos canonicos (Core)

1. `core/README.md`
2. `core/docs/README.md` — índice y orden de lectura canónico
3. `core/docs/project-status.md` — estado actual, tareas en curso y hoja de ruta pre-producción
4. `core/docs/architecture/architecture.md`
5. `core/docs/architecture/accounting-movements-architecture.md` — modelo contable (LedgerAccount/Transaction/Entry)
6. `core/docs/roadmap/product-roadmap.md` — módulos y mejoras pendientes para v1
7. `core/docs/roadmap/community-roadmap.md` — ideas y áreas abiertas para la comunidad (post-lanzamiento)
8. `core/docs/roadmap/backend-refactor-roadmap.md` — refactor backend _(aparcado — no ejecutar hasta petición explícita)_
9. `core/docs/roadmap/frontend-refactor-roadmap.md` — refactor frontend _(aparcado — no ejecutar hasta petición explícita)_
10. `core/docs/roadmap/terminados/accounting-category-budget-separation-roadmap.md` — separación accounting/budget (terminado)
11. `core/docs/operations/dev-setup.md`
12. `core/docs/operations/portable-import.md` — importación portable de datos Core
13. `core/docs/frontend/accounting-movements-ux-notes.md`
14. `core/docs/frontend/net-worth-ux-notes.md`
