# Financial Plan — Fase 5: Absorción de Estado financiero (SaaS frontend + docs)

## Title
Retirar `/estado-financiero` con redirect a `/plan` y eliminar el dominio `guide/` del frontend SaaS.

## Context
Fase final del MVP `financial-plan` (ver `core/docs/tasks/financial-plan/README.md`, decisión 4). Con los cimientos calculados en backend (Fase 4), el scoring frontend del guide queda redundante: Mi Plan absorbe el Estado financiero. **Gate de entrada:** verificar antes de empezar que la paridad de fórmulas de Fase 4 se dio por buena; si no, posponer esta fase (riesgo documentado en el README).

## Area
`frontend`

## Stack
`saas`

## Scope

### In scope
1. Redirects compatibles en `frontend/src/router.ts`: `/estado-financiero` → `/plan`; `/estado-financiero/ambitos/:phaseId` → `/plan` (los ámbitos 1-4 quedan representados por los cimientos). Patrón ya usado con `/movimientos` → `/contabilidad`.
2. Retirar el dominio `frontend/src/domains/guide/` (composables, phaseDiagnostics, componentes, tests) y toda referencia (navegación, imports).
3. Capabilities: marcar `core.coachV1` como superseded por `core.plan` en `frontend/src/domains/capabilities/index.ts` y en `docs/architecture/capabilities-matrix.md` (regla: matriz primero si cambia packaging).
4. Verificar que ninguna funcionalidad exclusiva del Estado financiero se pierde: comparar sus diagnósticos con los cimientos + findings visibles en `/plan`; documentar cualquier hueco aceptado.

### Out of scope
- `core/frontend/` (su guía sigue intacta; el OSS decide su propio camino post-MVP).
- Cambios de backend.

## Plan
1. **Diagnosis** — Inventariar consumidores de `domains/guide/` (`grep` de imports), enlaces de navegación y deep-links; confirmar gate de paridad.
2. **Change implementation** — Redirects → retirada del dominio → capabilities → docs.
3. **Validation** — Lint/typecheck + manual.

## Validation
```
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
```
Manual: `/estado-financiero` y `/estado-financiero/ambitos/3` redirigen a `/plan`; la navegación no muestra la entrada antigua; `/plan` cubre los diagnósticos que antes daba el Estado financiero; build sin referencias muertas.

## Required Documentation Updates
- [ ] `docs/frontend/domain-map.md` — retirar dominio `guide`, anotar redirect
- [ ] `docs/architecture/capabilities-matrix.md` — `core.coachV1` superseded por `core.plan`
- [ ] `docs/project-status.md` — Estado financiero absorbido por Mi Plan

## Risks
- Pérdida funcional inadvertida: mitigar con el inventario comparativo del paso 4 antes de borrar.
- Deep-links guardados por usuarios: cubiertos por los redirects.

## Completion Criteria
- [ ] Redirects verificados y dominio retirado sin referencias muertas
- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits, `feat(frontend)!:` o `refactor(frontend):` según impacto de contrato)
