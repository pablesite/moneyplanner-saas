# Fase 6 - QA integrado de ejecucion

## Title

Validar idempotencia, lifecycle y experiencia de transferencias materializadas.

## Context

Esta fase crea movimientos contables reales. Un fallo de retry, signo o lifecycle puede duplicar
dinero o dejar el cierre sin trazabilidad, por lo que requiere un gate cross-stack independiente.

## Area

`qa`

## Stack

`both`

## Scope

### In scope

1. Apply completo, parcial, retry, timeout simulado y dos requests concurrentes.
2. Transferencias salientes, aportaciones inversas y rutas 50/50.
3. Enlace a movimiento, neutralidad en summaries y ausencia de nueva compensacion.
4. Matching de transferencia manual/importada unica y seleccion entre candidatas ambiguas.
5. Reopen despues de aplicar, reverso explicito y lock.
6. Fallo a mitad de materializacion con rollback total.
7. Validacion visual y accesible de todos los estados.

### Out of scope

1. Conexion bancaria.
2. FX automatizado.
3. Eliminacion destructiva de historico.

## Plan

1. Ejecutar tests transaccionales Core y contratos API.
2. Simular retries/concurrencia con una idempotency key estable.
3. Recorrer flujo SaaS completo y verificar el ledger resultante.
4. Confirmar invariantes economicas antes y despues de aplicar.
5. Ejecutar gate integrado final.

## Validation

```bash
docker compose -f core/docker-compose.yml exec backend python manage.py test accounting accounts budget memberships net_worth core
docker compose -f core/docker-compose.yml exec backend ruff check .
docker compose -f core/docker-compose.yml exec backend ruff format --check .
docker compose -f core/docker-compose.yml exec backend mypy .
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test -- --run
```

## Required Documentation Updates

- [ ] `core/docs/tasks/monthly-close-settlement/README.md` - marcar modulo completado.
- [ ] `core/docs/project-status.md` - cierre backend.
- [ ] `docs/project-status.md` - cierre SaaS.

## Risks

- Las pruebas secuenciales no detectan carreras. Ejecutar dos solicitudes realmente concurrentes.
- El frontend puede mostrar exito antes del commit. Refrescar solo despues de respuesta autoritativa.
- Un reverso no es un delete; validar que ambos asientos permanecen trazables.

## Completion Criteria

- [ ] Concurrency and retry tests prove exactly-once ledger creation.
- [ ] Rollback tests leave no partial transaction or status.
- [ ] Economic totals remain invariant after every applied route.
- [ ] Full UI lifecycle is validated at desktop and 360 px.
- [ ] All validation commands pass.
- [ ] All required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created (Conventional Commits).
