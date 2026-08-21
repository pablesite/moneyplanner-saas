# Cartera - Fase 7: benchmark y riesgo SaaS

## Context
Las metricas avanzadas deben ayudar a interpretar la cartera sin desplazar el valor y la rentabilidad ni ocultar sus limitaciones.

## Area
`frontend`

## Stack
`saas`

## Scope
1. Comparar cartera y benchmark estrategico en el periodo activo.
2. Mostrar exceso de rentabilidad sin ocultar costes ni calidad.
3. Presentar volatilidad, drawdown, mejor/peor periodo y Sharpe con explicacion progresiva.
4. No mostrar huecos como cero ni metricas `insufficient` como validas.
5. Mantener valor/rentabilidad como protagonistas del resumen; riesgo es detalle.

## Plan
1. Probar jerarquia y copy con estados completos/insuficientes.
2. Implementar comparacion y detalle progresivo de riesgo.
3. Validar graficos, tablas accesibles y responsive.

## Validation
```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test
```

## Required Documentation Updates
- [x] Visual guide y domain map.
- [x] `docs/project-status.md`.

## Risks
Una doble escala puede exagerar diferencias; usar comparaciones normalizadas y tabla accesible con metodologia visible.

## Completion Criteria
- [x] Graficos legibles a 360 px sin doble escala enganosa.
- [x] Calidad y metodologia accesibles desde cada metrica.
- [x] Tests, docs y commit completados.
- [x] Spec movida a `terminados/`.
