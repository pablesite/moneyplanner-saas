# Tarea 2: Liquidez y calidad de decisión — frontend

## Context
Entrega del plan solicitado el 2026-09-10 tras el diagnóstico de cartera. Depende de la tarea 1.

## Area
`frontend`

## Stack
`saas`

## Scope
1. Mostrar disponible, reservado, acumulado y calidad con fecha y acción de corrección.
2. Explicar qué impide calcular una propuesta y cómo resolverlo conservando el contexto.

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
- [ ] `docs/architecture/api-registry.md` — contrato y estado.
- [ ] `docs/frontend/domain-map.md` — contrato y estado.
- [ ] `docs/project-status.md` — contrato y estado.

## Risks
Preservar titularidad, fechas y fuentes monetarias. No reescribir datos reales ni políticas como efecto secundario. Declarar límites pendientes sin aparentar cobertura.

## Completion Criteria
- [ ] Mostrar disponible, reservado, acumulado y calidad con fecha y acción de corrección.
- [ ] Explicar qué impide calcular una propuesta y cómo resolverlo conservando el contexto.
- [ ] Calidad y tests en verde; documentación actualizada.
- [ ] Spec movida a `terminados/` y commit Conventional Commits creado.
