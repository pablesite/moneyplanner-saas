# Roadmap: refactor integral del frontend SaaS — plan ejecutable

## Objetivo
Mantener el frontend SaaS alineado con el refactor del frontend Core, eliminando la deuda
técnica acumulada y preparando el terreno para un futuro shared package Core/SaaS.

## Relación con el roadmap Core
Este roadmap espeja `core/docs/roadmap/frontend-refactor-roadmap.md`.
**El trabajo se ejecuta Core-first:** cada fase se implementa primero en Core y se replica
en SaaS al cerrarla. Las specs de task están en `core/docs/tasks/frontend-refactor/` e
incluyen una sección **SaaS Replication** con las instrucciones específicas para este frontend.

## Estado de este documento
Creado el 2026-03-18. Baseline inicial documentada en esta fecha.

## Estado real (2026-03-19)

### Validación actual en Docker
- `docker compose exec saas_frontend npm run lint`: verde
- `docker compose exec saas_frontend npm run typecheck`: verde
- `docker compose exec saas_frontend npm run test:unit`: verde (37 suites)
- `docker compose exec saas_frontend npm run format:check`: verde
- `docker compose exec saas_frontend npm run test:coverage`: verde con thresholds `>=80%`

### Coverage thresholds actuales (vite.config.ts)
```
statements: 80%, lines: 80%, functions: 80%, branches: 80%
```
**Target acordado: ≥ 80% en todas las métricas** (Fase 0).

### Coverage real actual (2026-03-19)
- `statements: 98.29%`
- `lines: 98.29%`
- `functions: 92.41%`
- `branches: 81.50%`

Fase 0 cerrada: todos los thresholds de coverage (`>=80%`) pasan en Core y SaaS.

### Hotspots de tamaño

| Vista | Líneas | Riesgo |
|-------|--------|--------|
| `BudgetDashboardView.vue` | 5,512 | Alto |
| `NetWorthView.vue` | 3,608 | Alto |
| `DataInputView.vue` | 2,742 | Alto |
| `AccountingMovementsView.vue` | 2,237 | Medio |
| `GuidePhaseDetailView.vue` | 2,207 | Medio |
| `App.vue` | ~492 | Medio |

### Diferencias respecto a Core (solo 3-4 ficheros)
- `lib/api.ts`: SaaS usa `http://localhost:8001` como baseURL
- `domains/accounting/models.ts`: SaaS no tiene el tipo `MoneyWizUnmappedCategory`
- `views/AccountingMovementsView.vue`: SaaS no muestra la sección de unmapped categories
- `components/people/`: directorio vacío en Core, no existe en SaaS

Estas diferencias deben preservarse al replicar cada fase.

### Candidatos a shared package (identificados, no ejecutar aún)
Dominios idénticos en Core y SaaS: `net-worth`, `people`, `guide`, `aux-data`, `data-input`, `ui`
No compartibles: `auth`, `capabilities`, `lib/api.ts`
La Fase 5 de Core prepara los dominios; la Fase 6 documenta la extracción en
`core/docs/architecture/shared-package-candidates.md`.

## Fases SaaS (espejo de Core)

Cada fase se ejecuta después de que la fase equivalente de Core haya cerrado con éxito.

| Fase | Nombre | Cuándo ejecutar | Spec (sección SaaS Replication) |
|------|--------|-----------------|----------------------------------|
| 0 | Baseline + tests ≥80% | Completada | `core/docs/tasks/frontend-refactor/phase-0-baseline/terminados/frontend.md` |
| 1 | Arch boundaries | Completada | `core/docs/tasks/frontend-refactor/phase-1-arch-boundaries/terminados/frontend.md` |
| 2 | Shell + router | Después de Core Fase 2 | `core/docs/tasks/frontend-refactor/phase-2-shell-router/frontend.md` |
| 3a | BudgetDashboardView | Completada | `core/docs/tasks/frontend-refactor/phase-3a-budget-dashboard/terminados/frontend.md` |
| 3b | NetWorthView | Completada | `core/docs/tasks/frontend-refactor/phase-3b-net-worth/terminados/frontend.md` |
| 3c | DataInputView | Después de Core Fase 3c | `core/docs/tasks/frontend-refactor/phase-3c-data-input/frontend.md` |
| 3d | GuidePhaseDetailView | Después de Core Fase 3d | `core/docs/tasks/frontend-refactor/phase-3d-guide-view/frontend.md` |
| 3e | AccountingMovementsView | Después de Core Fase 3e | `core/docs/tasks/frontend-refactor/phase-3e-accounting-movements/frontend.md` |
| 4 | CSS contract | Después de Core Fase 4 | `core/docs/tasks/frontend-refactor/phase-4-css-contract/frontend.md` |
| 5 | Domain contracts | Después de Core Fase 5 | `core/docs/tasks/frontend-refactor/phase-5-domain-contracts/frontend.md` |
| 6 | Hardening | Después de Core Fase 6 | `core/docs/tasks/frontend-refactor/phase-6-hardening/frontend.md` |

## Instrucciones de replicación

Al replicar una fase de Core en SaaS:
1. Leer la sección **SaaS Replication** de la spec correspondiente.
2. Aplicar los mismos cambios estructurales, respetando las diferencias de los 3-4 ficheros.
3. No replicar la sección de unmapped categories de `AccountingMovementsView`.
4. No replicar `MoneyWizUnmappedCategory` de `domains/accounting/models.ts`.
5. Mantener `lib/api.ts` SaaS con su baseURL específica.
6. Validar dentro del contenedor `saas_frontend`:
   ```bash
   docker compose exec saas_frontend npm run lint
   docker compose exec saas_frontend npm run format:check
   docker compose exec saas_frontend npm run typecheck
   docker compose exec saas_frontend npm run test:coverage
   # → statements ≥80%, lines ≥80%, functions ≥80%, branches ≥80%
   ```

## Nota de trazabilidad
1. Este roadmap es el espejo SaaS de `core/docs/roadmap/frontend-refactor-roadmap.md`.
2. Las specs están centralizadas en `core/docs/tasks/frontend-refactor/` para evitar duplicación.
3. Si una diferencia entre frontends requiere una spec SaaS exclusiva, crearla en `docs/tasks/frontend-refactor/`.
