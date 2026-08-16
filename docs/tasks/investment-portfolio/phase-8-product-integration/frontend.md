# Cartera - Fase 8: alertas e integracion SaaS

## Context
La ultima fase conecta superficies y cierra la experiencia sin convertir cada incidencia en una interrupcion global.

## Area
`frontend`

## Stack
`saas`

## Scope
1. Centro de alertas dentro de `/cartera`, agrupado por calidad y estructura.
2. Acciones contextuales hacia posicion, valoracion, importacion, asignacion o cesta.
3. Enlaces coherentes Cartera <-> Patrimonio <-> Mi Plan, preservando contexto.
4. Reflejar en Mi Plan la calidad de capital productivo proveniente de Cartera.
5. Ejecutar cierre UX completo desktop/movil, accesibilidad y estados parciales.

## Plan
1. Disenar prioridad, agrupacion y acciones de alertas.
2. Integrar enlaces y quality hints con Patrimonio/Mi Plan.
3. Ejecutar auditoria real de navegacion, responsive y accesibilidad.

## Validation
```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test
```

## Required Documentation Updates
- [ ] Domain map, visual guide, capabilities y project status.
- [ ] Checklist de piloto si Cartera entra en readiness.

## Risks
Alertas numerosas pueden generar fatiga; agrupar, priorizar y no promoverlas fuera de Cartera en el MVP.

## Completion Criteria
- [ ] Alertas accionables sin lenguaje de recomendacion financiera.
- [ ] Navegacion transversal y estados parciales validados a 360 px/desktop.
- [ ] Tests, docs y commit completados.
- [ ] Spec movida a `terminados/`.
