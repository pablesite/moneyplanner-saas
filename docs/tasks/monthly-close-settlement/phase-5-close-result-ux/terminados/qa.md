# Fase 5 - QA integrado de la version 1

## Title

Validar Core y SaaS end-to-end antes de declarar utilizable la liquidacion manual.

## Context

La version 1 cruza modelos Core, historico contable, presupuesto y una vista financiera densa. El
gate debe demostrar exactitud con casos familiares y ausencia de friccion para usuarios no activos.

## Area

`qa`

## Stack

`both`

## Scope

### In scope

1. Flujo completo de activacion, preview dinamico, readiness, cierre y reapertura.
2. Caso canonico combinado dinamico + 50/50 con cifras verificadas manualmente.
3. Pago familiar desde cuenta personal y gasto personal desde cuenta compartida.
4. Cuenta destino incompatible, miembro sin cuenta personal y cobertura ledger incompleta.
5. Conciliacion inicial de monedero mixto y siguiente cierre sin doble conteo.
6. Usuario individual, multi-member disabled y bolsa comun sin cambios visibles ni contractuales.
7. Deep-link a Movimientos y retorno al mismo cierre.
8. Visual review a 1440, 820, 560 y 360 px; estados loading/error/empty/finalized/locked.
9. Accesibilidad basica: foco, labels, teclado, orden de lectura y mensajes `aria-live` cuando aplique.
10. Validacion integrada Docker de Core backend y SaaS frontend.

### Out of scope

1. Aplicacion automatica de transferencias.
2. Pruebas con banca externa.
3. FX ejecutado automaticamente.

## Plan

1. Preparar fixture reproducible con al menos doce meses de nominas y el mes a cerrar.
2. Contrastar resultados API con calculo manual por miembro.
3. Recorrer happy path y estados degradados en navegador.
4. Comparar jerarquia y densidad con Patrimonio y Movimientos, no con pantallas legacy de Core.
5. Ejecutar validacion integrada completa y registrar riesgos residuales.

## Validation

```bash
docker compose -f core/docker-compose.yml exec backend python manage.py test accounting accounts budget memberships net_worth core
docker compose -f core/docker-compose.yml exec backend ruff check .
docker compose -f core/docker-compose.yml exec backend ruff format --check .
docker compose -f core/docker-compose.yml exec backend mypy .
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test:unit
```

## Required Documentation Updates

- [x] `core/docs/tasks/monthly-close-settlement/spec.md` - resultado final de v1.
- [x] `core/docs/project-status.md` - v1 backend validada.
- [x] `docs/project-status.md` - v1 SaaS validada.

## Risks

- Una UI convincente puede esconder una formula incorrecta. El calculo manual se compara por miembro,
  no solo por total familiar.
- Datos reales no deben entrar en fixtures versionados. Usar datos sinteticos equivalentes.
- El modo disabled necesita test end-to-end, no solo unitario, porque la friccion puede aparecer en UI.

## Completion Criteria

- [x] Canonical scenario matches the independent manual calculation to the cent.
- [x] Disabled profiles are behaviorally and visually unchanged.
- [x] All blocking and degraded states are actionable.
- [x] Visual and responsive gates pass without horizontal overflow.
- [x] All validation commands pass.
- [x] All required documentation updates done.
- [x] Spec moved to `terminados/`.
- [x] Commit created (Conventional Commits).
