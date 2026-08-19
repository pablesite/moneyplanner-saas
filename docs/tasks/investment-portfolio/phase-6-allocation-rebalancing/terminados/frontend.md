# Cartera - Fase 6: asignacion y cestas SaaS

## Context
La desviacion debe convertirse en una accion comprensible sin presentar una recomendacion de producto ni confundir propuesta con compra ejecutada.

## Area
`frontend`

## Stack
`saas`

## Scope
1. Anadir tab `Asignacion` con actual, objetivo y desviacion en dos niveles.
2. Editor de estrategia versionada con fecha efectiva y nota.
3. Simulador de aportacion con sugerencia Budget/Plan editable.
4. Mostrar restricciones, reparto, efectivo residual y explicacion.
5. Crear, revisar, confirmar parcialmente y descartar cestas pendientes.
6. Evitar copy de asesoramiento o CTA de venta.

## Plan
1. Validar jerarquia de asignacion por clase/posicion y estados de cesta.
2. Implementar editor, simulador y confirmacion parcial.
3. Auditar copy, accesibilidad, responsive y errores de materializacion.

## Validation
```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test
```

## Required Documentation Updates
- [x] `docs/frontend/domain-map.md` y visual guide.
- [x] `docs/project-status.md`.

## Risks
La densidad de dos niveles y restricciones puede saturar movil; usar disclosure progresivo y mantener una unica accion primaria.

## Completion Criteria
- [x] Asignacion y cesta utilizables a 360 px. Verificado en navegador real a 360x780: sin scroll horizontal, acciones apiladas y la fila de linea como objetivo tactil.
- [x] Confirmacion distingue objetivo de ejecucion real. La cesta se guarda sin tocar contabilidad, se confirma entera o por lineas y contabilizar pide un segundo clic que dice que va a crear movimientos reales.
- [x] Tests, docs y commit completados. 329 tests de frontend en verde y recorrido completo en navegador con datos reales.
- [x] Spec movida a `terminados/`.
