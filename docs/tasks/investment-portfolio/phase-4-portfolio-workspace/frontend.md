# Cartera - Fase 4: workspace SaaS de lectura

## Area
`frontend`

## Stack
`saas`

## Context
Primera entrega visible: una vista profesional, comprensible y mobile-first sobre las APIs Core de cartera.

## Scope
1. Crear dominio `frontend/src/domains/portfolio/`, capability `core.portfolio` y ruta `/cartera`.
2. Mantener cinco destinos moviles; `/cartera` activa Patrimonio y ofrece retorno persistente preservando contexto e historial.
3. Tabs `Resumen`, `Posiciones` y `Evolucion`; `Asignacion` llega en fase 6.
4. Hero conjunto valor/TWR, resultado, aportaciones, grafico, composicion, calidad y freshness.
5. Tabla profesional desktop y lista compacta movil con sheet de detalle; filtros por titularidad, contenedor, clase, divisa y periodo.
6. Cubrir loading, empty, partial, stale y error con primitivas `@/domains/ui`.
7. No implementar formularios de operacion en esta fase.

## Plan
1. Validar IA y jerarquia con datos reales.
2. Implementar api/types/store/composables, luego vista y responsive.
3. Auditar teclado, foco, 360 px, desktop y retorno a Patrimonio.

## Validation
```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test
```

## Required Documentation Updates
- [ ] `docs/frontend/domain-map.md` - dominio y rutas.
- [ ] `docs/frontend/frontend-visual-guide.md` - contrato de Cartera.
- [ ] `docs/frontend/frontend-visual-contract.md` - solo si nace una primitiva compartida.
- [ ] `docs/architecture/capabilities-matrix.md` y `docs/project-status.md`.

## Risks
Una tabla densa no escala a movil. No convertir cada fila en una tarjeta gigante ni permitir overflow horizontal del contenido primario.

## Completion Criteria
- [ ] Vista usable a 360 px y desktop con datos reales.
- [ ] Navegacion Patrimonio <-> Cartera sin friccion.
- [ ] Estados, accesibilidad, tests, docs y commit completados.

