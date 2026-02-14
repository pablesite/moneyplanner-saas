# AGENTS.md

## Objetivo
Este repositorio contiene dos stacks que se trabajan en paralelo:
1. `core/` (base OSS)
2. `saas` (raíz: `backend/` + `frontend/`, con funcionalidades extra)

## Arranque estándar
Para levantar el proyecto entero, seguir este orden:
1. `cd core && docker compose up --build -d`
2. `cd .. && docker compose up --build -d`

## Diagnóstico estándar
Comandos base de diagnóstico:
1. `docker compose ps`
2. `docker compose logs --tail 100 <servicio>`

Comandos adicionales permitidos si ayudan a encontrar causa raíz:
1. `docker compose ps -a`
2. `docker compose logs --tail 200 <servicio>`
3. verificaciones HTTP puntuales (por ejemplo, preflight CORS con `curl`)

## Restricciones operativas
1. No borrar volúmenes de base de datos.
2. No ejecutar comandos destructivos tipo `docker compose down -v` salvo pedido explícito.
3. Se puede modificar `core/` y `saas` (se evolucionan ambos en paralelo).

## Flujo de trabajo acordado
1. Diagnóstico primero.
2. Explicar qué se pretende hacer, preguntar para decidir la mejor opción.
3. Acordada la opción: aplicar cambios.
4. Validar resultado.
5. Refactorizar siguiendo el estilo existente y revalidar.
6. Reportar estado final.
7. Al terminar, actualizar la documentación en `docs/` donde sea necesario.
8. Tras validar y actualizar documentación, terminar con un commit, siguiendo la guía: https://www.conventionalcommits.org/en/v1.0.0/.


## Validación (estado actual)
Hay comandos oficiales de calidad en ambos repos (`core` y `saas`) y validación en CI.

Comandos de calidad:
1. Backend SaaS (`backend/`):
   - `ruff check .`
   - `ruff format --check .`
   - `mypy .`
2. Backend Core (`core/backend/`):
   - `ruff check .`
   - `ruff format --check .`
   - `mypy .`
3. Frontend SaaS (`frontend/`):
   - `npm run lint`
   - `npm run format:check`
   - `npm run typecheck`
4. Frontend Core (`core/frontend/`):
   - `npm run lint`
   - `npm run format:check`
   - `npm run typecheck`

Tests disponibles actualmente:
1. Backend SaaS: `python manage.py test memberships` (suite en `backend/memberships/tests.py`).
2. Backend Core: hay archivos `tests.py` base, pero cobertura funcional todavía parcial.

Referencia de CI:
1. SaaS: `.github/workflows/quality-saas.yml`
2. Core: `core/.github/workflows/quality-core.yml`

## Documentación recomendada
1. Arquitectura de plataforma: `docs/architecture.md`
2. Arquitectura funcional del producto: `docs/product-architecture.md`
3. Operación y troubleshooting: `docs/runbook.md`
4. Configuración de desarrollo: `docs/dev-setup.md`
5. Plantilla de tareas para sesiones nuevas: `docs/task-template.md`
6. Glosario de términos canónicos: `docs/glossary.md`



