# Roadmap: refactor integral del frontend SaaS — plan ejecutable

## Objetivo
Mantener el frontend SaaS alineado con el refactor del frontend Core, eliminando la deuda
técnica acumulada y preparando el terreno para un futuro shared package Core/SaaS.

## Relación con el roadmap Core
Este roadmap espeja `core/docs/roadmap/terminados/frontend-refactor-roadmap.md`.
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
**Target acordado: >= 80% en todas las métricas** (Fase 0).

### Coverage real actual (2026-03-19)
- `statements: 88.72%`
- `lines: 81.73%`
- `functions: 89.17%`
- `branches: 88.72%`

Fase 0 cerrada: todos los thresholds de coverage (`>=80%`) pasan en Core y SaaS.
Fases 3d, 3e, 4, 5 y 6 del espejo SaaS cerradas el 2026-03-19 y alineadas con Core.

### Hotspots de tamaño

| Vista | Líneas | Riesgo |
|-------|--------|--------|
| `BudgetDashboardView.vue` | 5,512 | Alto |
| `NetWorthView.vue` | 3,608 | Alto |
| `DataInputView.vue` | 16 | Completada Fase 3c el 2026-03-19 |
| `AccountingMovementsView.vue` | 2,237 | Medio |
| `GuidePhaseDetailView.vue` | 2,207 | Medio |
| `App.vue` | 13 | Completada Fase 2 el 2026-03-19 |

### Diferencias respecto a Core (solo 3-4 ficheros)
- `lib/api.ts`: SaaS usa `http://localhost:8001` como baseURL
- `domains/accounting/models.ts`: SaaS no tiene el tipo `MoneyWizUnmappedCategory`
- `views/AccountingMovementsView.vue`: SaaS no muestra la sección de unmapped categories
- `components/people/`: directorio vacío en Core, no existe en SaaS

Estas diferencias deben preservarse al replicar cada fase.

### Candidatos a shared package (identificados, solo para extraccion futura)
Dominios idénticos en Core y SaaS: `net-worth`, `people`, `guide`, `aux-data`, `data-input`, `ui`
No compartibles: `auth`, `capabilities`, `lib/api.ts`
La Fase 5 de Core preparo los dominios; la Fase 6 documento la extracción en
`core/docs/architecture/shared-package-candidates.md`.

### Línea de trabajo estratégica: Opción C — core como librería Vue

**Decisión vigente (2026-05-22):** se mantienen dos frontends espejo (Opción A) para
salir a producción en el corto plazo. Es una decisión temporal y consciente.

**Arquitectura objetivo:** Core exporta sus dominios como `@moneyplanner/core-ui`.
SaaS importa ese paquete y solo mantiene sus capas específicas (auth, billing, capabilities).
Esto elimina la replicación manual y espeja el modelo ya vigente en el backend
(SaaS usa Core como submódulo Python).

Ver especificación completa, condiciones de extracción y hoja de ruta en:
`core/docs/architecture/shared-package-candidates.md` — sección "Arquitectura objetivo".

## Fases SaaS (espejo de Core)

Cada fase se ejecuta después de que la fase equivalente de Core haya cerrado con éxito.

| Fase | Nombre | Cuándo ejecutar | Spec (sección SaaS Replication) |
|------|--------|-----------------|----------------------------------|
| 0 | Baseline + tests ≥80% | Completada | `core/docs/tasks/frontend-refactor/phase-0-baseline/terminados/frontend.md` |
| 1 | Arch boundaries | Completada | `core/docs/tasks/frontend-refactor/phase-1-arch-boundaries/terminados/frontend.md` |
| 2 | Shell + router | Completada | `core/docs/tasks/frontend-refactor/phase-2-shell-router/terminados/frontend.md` |
| 3a | BudgetDashboardView | Completada | `core/docs/tasks/frontend-refactor/phase-3a-budget-dashboard/terminados/frontend.md` |
| 3b | NetWorthView | Completada | `core/docs/tasks/frontend-refactor/phase-3b-net-worth/terminados/frontend.md` |
| 3c | DataInputView | Completada | `core/docs/tasks/frontend-refactor/phase-3c-data-input/terminados/frontend.md` |
| 3d | GuidePhaseDetailView | Completada | `core/docs/tasks/frontend-refactor/phase-3d-guide-view/terminados/frontend.md` |
| 3e | AccountingMovementsView | Completada | `core/docs/tasks/frontend-refactor/phase-3e-accounting-movements/terminados/frontend.md` |
| 4 | CSS contract | Completada | `core/docs/tasks/frontend-refactor/phase-4-css-contract/terminados/frontend.md` |
| 5 | Domain contracts | Completada | `core/docs/tasks/frontend-refactor/phase-5-domain-contracts/terminados/frontend.md` |
| 6 | Hardening | Completada | `core/docs/tasks/frontend-refactor/phase-6-hardening/terminados/frontend.md` |

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
1. Este roadmap es el espejo SaaS de `core/docs/roadmap/terminados/frontend-refactor-roadmap.md`.
2. Las specs están centralizadas en `core/docs/tasks/frontend-refactor/` para evitar duplicación.
3. Si una diferencia entre frontends requiere una spec SaaS exclusiva, crearla en `docs/tasks/frontend-refactor/`.

