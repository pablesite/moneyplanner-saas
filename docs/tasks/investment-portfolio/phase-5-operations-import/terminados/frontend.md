# Cartera - Fase 5: operativa e importador SaaS

## Area
`frontend`

## Stack
`saas`

## Scope
1. Onboarding para confirmar contenedor, instrumento, tracking y cobertura de posiciones migradas.
2. Flujos contextuales para transferencia, compra, venta, dividendo/interes, fee, valoracion y corporate action esencial.
3. Compra siempre desde efectivo del contenedor; explicar el saldo disponible.
4. Wizard CSV: fichero, mapeo, preview, incidencias, coincidencias y confirmacion.
5. Permitir historico reconstruido o inicio desde fecha de corte por posicion.
6. Mostrar `performance_coverage` y `position_detail_coverage` por separado.

## Plan
1. Prototipar los recorridos movil y desktop con un unico CTA por contexto.
2. Implementar formularios sobre `BaseModal`/sheets y wizard recuperable.
3. Validar errores por fila, doble submit, navegacion y recalculo posterior.

## Validation
```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test
```

## Required Documentation Updates
- [x] `docs/frontend/domain-map.md`.
- [x] `docs/frontend/frontend-visual-guide.md`.
- [x] `docs/project-status.md`.

## Risks
El usuario puede confundir importe objetivo con ejecucion real. La UI debe separar plan, preview y confirmacion contabilizada.

## Completion Criteria
- [x] Operativa completa usable a 360 px.
- [x] Importacion nunca confirma sin preview.
- [x] Estados, tests y docs completados; commit registrado al finalizar la fase.
