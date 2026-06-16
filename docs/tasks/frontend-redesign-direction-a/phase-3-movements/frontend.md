# Fase 3 — Movimientos (AccountingMovementsView) con Design System "Direction A"

> Aplicar la **metodología obligatoria** de `docs/tasks/frontend-redesign-direction-a/README.md`.
> **PRIORIDAD: fidelidad literal al prototipo (Regla 0)** — el resultado debe **coincidir** con
> `handoff/Moneyplanner Refinement.html` / el `.jsx`, no "ser equivalente". Reconstruir ≠ rediseñar.
> Además: separar lógica/presentación, contrato de composición primero, clasificar componentes,
> reconciliar funcionalidad, cero híbridos, gate de fidelidad visual. No injertar sobre el markup viejo.

## Title

Reimplementación visual íntegra de `AccountingMovementsView` sobre "Direction A", preservando la
lógica y toda la funcionalidad.

## Context

Referencia: `handoff/README.md` sección "Movimientos"; `handoff/direction-a-more.jsx` →
`AMovementsView`. Depende de la Fase 0 y reutiliza las primitivas de fases anteriores. Los charts de
evolución diaria reutilizan `NetWorthTimelineChart`/`NetWorthDeltaChart` tal como la Fase 1 los deje
(ya con la estética del prototipo, no solo recoloreados).

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope: reconstrucción íntegra de la presentación de `AccountingMovementsView.vue` (261 líneas)
   y de sus componentes de dominio (`AccountingMovementsHero`, `AccountingAccountCatalog`,
   `AccountingMovementsAllTransactions`, `AccountingBalances`, y los 3 modales:
   `Activation`/`EditTransaction`/`QuickEntry`); reescritura de
   `domains/accounting/styles/movements.css` (1622 líneas) a clases del sistema.
2. Out of scope: cambiar comportamiento de `useAccountingMovementsPage`/stores/api; reimplementar
   charts; otras vistas.

## Contrato de composición (de arriba abajo)

```
.page → APageHead "Movimientos" (meta mes·asientos·partida doble; actions: Catálogo · Importar bancario · "+ Asiento rápido")
      → sección Evolución diaria: toolbar presets + caption + Expandir(modal con sliders); charts (estética prototipo) a ancho completo
      → tabs: Cuentas / Todos los movimientos / Estadísticas
      → tab Cuentas: table.tbl (Cuenta+nº asientos / Tipo chip / Cobros / Pagos / Saldo); fila expandible inline + "Ver todos →"
      → tab Todos: filter-bar (búsqueda · kind · category · subcategory · período popover presets+custom)
                   + contador "X de Y · ±neto" + table.tbl (Fecha/Concepto/Tipo/Debe/Haber/Importe ±/Saldo/ARowMenu) + empty state
      → tab Estadísticas: selector FY + KPI strip Activos/Pasivos + cashflow 12 col (residual ±) + contrapartidas en <details>
      → modales: Activación · Edición de asiento · Asiento rápido (.sheet + underline + header DSL)
```

## Clasificación de componentes

| Componente | Cat. | Acción |
| ---------- | ---- | ------ |
| `NetWorthTimelineChart`, `NetWorthDeltaChart` | A | Reusar tal como la Fase 1 los deje (estética del prototipo). |
| `AccountingMovementsHero` | B | Remaquetar a page-head + sección Evolución diaria (toolbar/presets/expandir). |
| `AccountingAccountCatalog` | B | Remaquetar tab Cuentas a `.tbl` + expansión inline de fila. |
| `AccountingMovementsAllTransactions` | B | Remaquetar tab Todos a `.filter-bar` + `.tbl` + contador + empty state. |
| `AccountingBalances` | B | Remaquetar tab Estadísticas a KPI strip + cashflow + `<details>`. |
| `AccountingMovements{Activation,EditTransaction,QuickEntry}Modal` | B | Aplicar `.sheet`/underline; conservar lógica. |

## Reconciliación de funcionalidad (anti pérdida)

Preservar: deep-link por query (`tab`, `date_from/to`, `kind`, `category_key`, `subcategory_key`)
con el **orden de `nextTick`** intacto (kind → categoryKey → subcategoryKey); las 3 tabs y su
contenido; filtros encadenados (kind condiciona category/subcategory); expansión inline de cuenta +
"Ver todos →" con filtro; evolución diaria (presets, caption, modal expandido con sliders
`updateDailyTimelineWindowStart/End`); los 3 modales (alta/edición/guardado); estados loading/empty/
error de cada bloque. **CONFIRMAR** cualquier control del prototipo sin estado equivalente.

## Plan

1. Contrato de composición + mapeo a `page.*` de `useAccountingMovementsPage`.
2. Resolver puntos CONFIRMAR.
3. Reconstruir presentación por tab, de arriba abajo; eliminar `ui-accounting-*`/`ui-section-card`/tailwind de layout.
4. Validación visual (gate del README) + lint/typecheck/tests, cuidando el deep-link/watchers.

## Validation

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `... npm run format:check` → sin errores
- `... npm run typecheck` → sin errores
- Tests de accounting si existen, en verde.
- **Gate de fidelidad visual (obligatorio, Regla 0 + Regla 6):** `/movimientos` (las 3 tabs + modales
  + evolución) comparado **junto al prototipo**, elemento por elemento (filter-bar, tablas, KPI strip,
  cashflow); cada desviación es un defecto a corregir. Validar deep-link y orden de filtros; capturas
  pantalla+prototipo adjuntas.
- **Grep anti-híbrido:** sin `ui-accounting-*`/`ui-section-card`/tailwind de layout en el render final.

## Required Documentation Updates

- [ ] `docs/frontend/frontend-visual-contract.md` — patrón filter-bar y tabla de movimientos
- [ ] `docs/frontend/frontend-visual-guide.md` — patrón Movimientos
- [ ] `docs/frontend/domain-map.md` — si cambian primitivas/fronteras de componentes
- [ ] `docs/project-status.md` — estado de la tarea
- [ ] `docs/tasks/frontend-redesign-direction-a/README.md` — marcar Fase 3 ✅

## Risks

- Deep-linking + watchers encadenados: no romper el orden de aplicación de filtros al reescribir el template.
- CSS extenso (1622 líneas): regresión; porte por tab + checklist.
- Controles del prototipo sin backing: confirmar antes de inventar lógica.

## Completion Criteria

- [ ] All validation commands pass (lint/format/typecheck/tests)
- [ ] **Gate de fidelidad visual en verde:** coincide con el prototipo, cero desviaciones sin aprobar; capturas pantalla+prototipo adjuntas
- [ ] **Grep anti-híbrido limpio**
- [ ] Puntos CONFIRMAR resueltos con el usuario
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
