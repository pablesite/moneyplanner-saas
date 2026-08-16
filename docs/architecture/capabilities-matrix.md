# Matriz de capabilities (actual)

## Aim
Separar packaging comercial de capacidades t�cnicas.

## Regla
1. Backend define capabilities efectivas.
2. Frontend consume helpers (`canUse...`).
3. `compat.*` solo puente temporal.

## Baseline Core (sin bloqueo artificial)
1. `core.netWorth` -> patrimonio
2. `core.budget` -> budget and monthly closing
3. `core.coachV1` -> guía/coach v1 legacy. Superseded by `core.plan` in SaaS after Financial Plan Phase 5; keep only as historical/compat capability while Core standalone decides its own path.
4. `core.familyLogicalModel` -> base family/ownership
5. `core.simulatorBasic` -> simulaci�n base (evolutiva)
6. `core.plan` -> Mi Plan (planificación financiera: proyección, escenarios, cimientos, hallazgos y recomendaciones). Motor en Core backend (app `plan`); UI del MVP solo en frontend SaaS. Desde la fase 5 sustituye la navegación de Estado financiero en SaaS y gobierna el antiguo helper compatible `canUseGuide()`. Packaging pendiente de decisión comercial; durante el desarrollo se expone en el piloto mediante `canUsePlan()` en el frontend SaaS. Specs: `core/docs/tasks/financial-plan/`.
7. `core.portfolio` -> cartera de inversión familiar consolidada. Activa en el piloto mediante `canUsePortfolio()`: Core posee dominio y cálculos; el frontend SaaS expone el workspace de solo lectura `/cartera` dentro de la familia de navegación de Patrimonio. Plan: `core/docs/tasks/investment-portfolio/README.md`.

## Capacidades SaaS (infra / extra)
1. `platform.cloudHosting`
2. `platform.backups`
3. `platform.multiDevice`
4. `platform.notifications`
5. `saas.accountPage`
6. `saas.adminUsers`
7. `familyCloud.multiLogin`
8. `familyCloud.memberPrivacy`
9. `central.benchmarkCommunity`
10. `central.heavyCompute`
11. `central.llmCloud`

## SaaS pilot status (free)
1. `trial` as default state for testers.
2. Se expone baseline Core + operaci�n SaaS necesaria.
3. `saas.adminUsers` se mantiene para uso interno.
4. No billing visible to the end user (while the pilot lasts).

## Nota de migraci�n
1. Mantener `compat.isPremium`, `compat.people`, `compat.ownership` hasta terminar limpieza de checks legacy.
