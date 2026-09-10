# Tarea 1: Composición coherente — frontend

## Context
Entrega del plan solicitado el 2026-09-10 tras el diagnóstico de cartera. No tiene dependencias previas.

## Area
`frontend`

## Stack
`saas`

## Scope
1. Mostrar las fracciones de cada producto en sus clases sin inventar objetivos por subyacente.
2. Explicar la base completa de posiciones y la cobertura de clases; refrescar tras editar tenencias.

## Plan
1. Revisar implementación y contrato.
2. Implementar el alcance con pruebas deterministas de regresión.
3. Validar dentro de Docker, documentar y crear commit.

## Validation
Desde la raíz:
```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T saas_frontend npm run test:unit
```
Si cambia integración, ejecutar `validate all` y tests de ambos stacks. Migraciones solo si cambia el modelo.

## Required Documentation Updates
- [x] `docs/architecture/core-saas-boundaries.md` — Core resuelve la composición; SaaS presenta sus fracciones.
- [x] `docs/frontend/frontend-visual-guide.md` — cobertura y lectura de clases.
- [x] `docs/architecture/api-registry.md` — contrato y estado.
- [x] `docs/frontend/domain-map.md` — contrato y estado.
- [x] `docs/project-status.md` — contrato y estado.

## Risks
Preservar titularidad, fechas y fuentes monetarias. No reescribir datos reales ni políticas como efecto secundario. Declarar límites pendientes sin aparentar cobertura.

## Completion Criteria
- [x] Mostrar las fracciones de cada producto en sus clases sin inventar objetivos por subyacente.
- [x] Explicar la base completa de posiciones y la cobertura de clases; refrescar tras editar tenencias.
- [x] Calidad y tests en verde; documentación actualizada.
- [x] Spec movida a `terminados/` y commit Conventional Commits creado.

## Evidencia de validación — 2026-09-10

- Core backend: 913 tests de cartera y módulos integrados en verde.
- Core frontend: 312 tests en verde, 1 omitido por la suite.
- SaaS frontend: 362 tests en verde, incluida la regresión de presentación de fracciones por clase.
- Calidad Docker de ambos stacks: ruff, formato, mypy, eslint, prettier y typecheck en verde.
- SaaS backend: 180 tests de saas_access en verde.
- No cambia modelos: no requiere migraciones. No se modificaron tenencias, políticas ni saldos reales.
- No se ejecutó una inspección visual en navegador; la interfaz se verificó mediante tests de componentes.
