# Frontend Improvement Roadmap (SaaS)

Plan vivo para mejorar el frontend SaaS **vista por vista**, sin big-bang. Nace
del trabajo de consolidación hecho en los módulos de **movimientos**
(`domains/accounting`) y **patrimonio** (`domains/net-worth`), que sirven de
patrón de referencia para el resto.

> Documento de trabajo: actualizar el estado de cada ítem al cerrarlo. No es un
> roadmap de refactor profundo (los mega-componentes quedan fuera de alcance,
> ver más abajo).

## Cómo se usa

1. Coger **un ítem** de las secciones A–E (idealmente uno acotado a una vista o
   primitiva).
2. Seguir la skill `frontend-system` (leer visual-guide, visual-contract,
   css-workflow antes de tocar).
3. Patrón de trabajo: **dedup hacia `lib`/`ui` → arreglar bugs UX concretos →
   tests verdes → commit pequeño** (Conventional Commits).
4. Validar en Docker antes de cada commit (`lint`, `format:check`, `typecheck`,
   `test:unit`). Verificación visual con Playwright reutilizando el mock de
   `e2e/` cuando el cambio sea visual.
5. Marcar el ítem como ✅ aquí y, si aplica, actualizar
   [`frontend-visual-contract.md`](frontend-visual-contract.md) y
   [`domain-map.md`](domain-map.md).

## Principios

- **Reusar antes que crear**: `@/domains/ui` (primitivas `A*` + `BaseModal`),
  `@/lib/format`, `@/lib/dates`, `@/lib/useCollapsibleGroups`.
- **Cambios acotados y reversibles**. Una vista o una primitiva por PR.
- **Sin paridad obligatoria con Core**; el SaaS decide.
- **No introducir `style=` inline ni `<style scoped>`** salvo aislamiento crítico
  o estilo dinámico real (charts).
- Cubrir siempre estados loading/empty/error/success (usar `AState`).

## Fuera de alcance (decisión vigente)

- **Trocear los mega-componentes**: `NetWorthView.vue` (~2,3k líneas),
  `ItemForm.vue` (~2,6k), `accounting/composables.ts` (~4k). Es un proyecto en
  sí; no abrir sin decisión explícita.
- Unificar los enfoques de gráfico (SVG propio vs Chart.js).
- Refactors de backend.

---

## A. Deduplicar utilidades hacia `lib`

Reemplazar reimplementaciones locales por los helpers compartidos. Detectado:

- [x] `domains/guide/*` — retirado del frontend SaaS en Financial Plan Phase 5;
      los diagnósticos equivalentes viven en `plan`/backend.
- [x] `views/budget/useBudgetDashboardPage.ts` — `formatNumber`/`formatMoney`
      locales → `@/lib/format`.
- [x] **Añadir `formatPct` a `@/lib/format`** y migrar consumidores vivos.
- [x] Barrido final: `grep` de `function (toNumber|formatNumber|formatMoney|
      formatPct|normalizeNumberInput)` fuera de `lib/` debe quedar ~vacío.

**DoD**: sin definiciones locales equivalentes; tests de dominios vivos verdes.

## B. Adopción y crecimiento de la librería UI

Por cada vista que se toque, sustituir markup ad-hoc por primitivas y detectar
candidatos nuevos (regla: una primitiva nueva solo si ≥2 pantallas la usarían).

- [x] Auditar cada vista contra el catálogo de
      [`frontend-visual-contract.md`](frontend-visual-contract.md) (botones,
      selects, estados, heads, pills, chips, menús de fila).
- [x] Reusar `AToast` donde hoy haya mensajes de éxito/inline propios.
- [x] Reusar `AChevron` + `useCollapsibleGroups` en cualquier lista colapsable
      (budget/monthly-close suelen tener bloques colapsables).
- [x] Documentar toda primitiva nueva en el visual-contract.

**Auditoría de 2026-08 (Patrimonio, Contabilidad, Presupuesto, Cierre):** no
quedan `<select>` nativos en componentes de producto; el único `<option>`
restante pertenece a un `datalist` de texto libre en `AnnualEntryModalForm`
(sugerencias de grupo de evento, no selector cerrado). Los mensajes de éxito
usan `AToast`, los indicadores de expansión usan `AChevron`, y esos cuatro
dominios consumen `AButton`, `ASelect`, `AState`, `APageHead`/`ASectHead`,
`AKindChip`, `ARowMenu`, `AHero`/`AKpiBand`, `ASparkline`, `ADateRange` y
`BaseModal` donde aplica. No se creó ninguna primitiva nueva.

> **Mi Plan quedó fuera de esa auditoría** (el dominio se construyó después) y
> no cumple el DoD. Auditado el 2026-08-03: adopta el shell (`.page`,
> `APageHead`, `.sect`), los tokens, `ASelect`, `AState`, `BaseModal`,
> `AStepper` y `AHero`/`AKpiBand`, pero se saltó la capa de primitivas y
> helpers. Ver bloque F.

**DoD**: la vista no reimplementa nada que ya exista en `@/domains/ui`.

## C. Consolidación de CSS (fragmentación)

Estado: ~10,6k líneas en 13 ficheros. Los grandes:
`accounting-movements-view.css` (1981), `net-worth-view.css` (1723),
`app.css` (1508), `design-system.css` (1091), `budget.css` (1079),
`movements.css` (1024).

- [ ] **Auditar `style=` inline** en componentes (detectado en `budget/*`,
      `NetWorthEvolutionChart`, `NetWorthView`): separar lo dinámico legítimo
      (`:style` en charts) de lo que debe ir a clases/tokens.
- [ ] **Catálogo de patrones repetidos** con prefijo por dominio (`a-mov-*`,
      `a-nw-*`, `bdg-*`, `mc-*`): identificar los que son el mismo patrón visual
      y promoverlos a clase compartida `.ui-*` en `app.css` (como se hizo con
      `.ui-toast`, `.ui-chevron`). Empezar por: cabeceras de grupo, KPI bands,
      filtros/toolbars, footers de modal.
- [ ] Verificar que los nuevos patrones compartidos quedan documentados en el
      visual-contract y que las clases por dominio que queden huérfanas se
      eliminan.
- [ ] No mover CSS por mover: solo consolidar lo que esté **duplicado** entre
      ≥2 dominios.

**DoD**: reducción neta de líneas duplicadas; sin `style=` inline no-dinámico;
patrones compartidos en `app.css` + documentados.

## D. Hueco estructural en `BaseModal` (slot de footer)

Problema: `BaseModal` solo tiene `head` + cuerpo con scroll; **no expone slot de
footer**. Por eso el footer de acciones vive dentro del área desplazable y, al
hacerlo sticky, tapaba el último campo (arreglado en patrimonio pasándolo a
no-sticky, pero es un parche). Cada modal resuelve sus acciones a mano
(`ItemForm`, `QuickEntry`, `FamilyMemberManager`, `OwnershipManager`,
`AccountingMovementsActivationModal`…). 9 usos de `BaseModal` en total.

- [x] **Añadir `<slot name="footer" />`** a `BaseModal`, fuera del cuerpo con
      scroll (footer fijo del panel, no del scroll). Compatibilidad: si no se
      pasa footer, comportamiento actual. El cuerpo lleva `min-h-0` para
      desplazarse de forma independiente.
- [x] Clase compartida `.ui-modal-foot` + `.ui-modal-foot-actions` (Direction A:
      borde superior, acciones a la derecha, safe-area) en `app.css`.
- [x] Migrados los modales **auto-contenidos sencillos** al slot de footer:
      `FamilyMemberManager` (crear + editar) y `OwnershipManager` (people).
- [ ] **Migrar QuickEntry y `AccountingMovementsActivationModal`**: su botón de
      envío es `type="submit"` dentro de un `<form>` en el slot por defecto.
      Mover el footer fuera del form requiere dar `id` al `<form>` y `form="<id>"`
      al botón (atributo HTML `form`), o que `AButton` reenvíe `form`. Acotado
      pero toca componentes grandes.
- [ ] **Migrar `ItemForm`**: lo renderiza el wrapper `NetWorthItemModals` (el
      `BaseModal` vive en el wrapper, `ItemForm` es contenido por defecto y su
      footer depende de su estado interno). Opciones: exponer un slot con scope
      desde `ItemForm`, o `Teleport` a un objetivo del panel. Hoy funciona
      (footer no-sticky), así que es consistencia, no bug.

**DoD parcial**: primitiva entregada y validada con los modales de people. Resto
pendiente con técnica documentada arriba.

## E. Pasada por vista (incremental)

Una vista por iteración, aplicando A–D donde toque. Orden sugerido por
esfuerzo/impacto (ajustable):

- [ ] **Presupuesto** (`BudgetView` + `domains/budget`) — CSS grande (1079) y
      formatters locales; buen primer candidato.
- [ ] **Cierre mensual** (`MonthlyCloseView`, `monthly-close.css`) — bloques
      colapsables y KPI bands reutilizables.
- [x] **Estado / Home / Guía** — retirado del SaaS en Financial Plan Phase 5;
      `/estado-financiero` redirige a `/plan`.
- [ ] **Personas** (`domains/people`) — modales (sección D).
- [ ] **Datos auxiliares** (`domains/aux-data`).

Para cada vista, checklist mínima:
- [ ] Dedup utilidades (A) · [ ] Primitivas UI (B) · [ ] CSS compartido (C) ·
      [ ] Modales al slot de footer (D) · [ ] Estados loading/empty/error/success
      · [ ] Validación Docker + tests verdes.

## F. Alineación de Mi Plan con el design system

Auditoría del 2026-08-03 sobre las 10 vistas de `domains/plan`, contrastadas con
Patrimonio y Contabilidad. Mi Plan se construyó después de cerrar el bloque B, no
pasó por esa auditoría, y la skill `frontend-system` apuntaba entonces a ficheros
obsoletos (corregido en este mismo bloque). Resultado: `plan.css` son 4.248
líneas frente a 1.981 de contabilidad y 1.765 de patrimonio.

**Cumple**: shell (`.page` + `APageHead` + `.sect`), tokens, `ASelect`, `.input`,
`AState` para loading/empty/error de página, `BaseModal`, `AStepper`,
`AHero`/`AKpiBand`, `AInfoHint`, `--shell-bottom-inset`. Cero `style=` inline,
cero `<style scoped>`, cero `<select>` nativo. Los hex de la escala de notas A–E
son una excepción documentada y validada con la skill `dataviz`.

- [x] **F0 — Doc y skill.** Corregidas las fuentes canónicas en la skill
      `frontend-system`, `frontend-visual-contract.md` y `frontend-css-workflow.md`
      (apuntaban a `core/frontend/src/styles/app.css`, congelado y pre-Direction A).
      Añadida a la skill la tabla de primitivas `@/domains/ui` y los greps de
      control al Review Checklist. Contrato e improvement-roadmap añadidos a los
      docs canónicos de `CLAUDE.md`/`AGENTS.md`.
- [x] **F1 — Estados y botones.** `AState layout="inline"` sustituye a
      `.plan-empty-inline` / `.plan-muted` / `.plan-inline-error`; `AButton`
      sustituye los `<button class="btn …">` crudos.
- [x] **F2 — `ASectHead`.** 30 de los 32 `<div class="sect-head">` de Mi Plan
      migrados a la primitiva. `ASectHead` gana un slot `#subtitle` (tres
      pantallas tenían subtítulo con énfasis o partes condicionales y por eso
      quedaban fuera) y su primer spec. Quedan dos casos fuera a propósito:
      `NetWorthTrajectoryChart` no tiene `sect-title` (su cabecera es rótulo con
      `AInfoHint` + leyenda, estructura distinta), y `PlanFoundations` usa
      `.plan-block-eyebrow` (muted) en vez de `.eyebrow` (accent), así que
      migrarlo cambiaría el color — va con F4.
- [x] **F3 — Helpers y menús.** `useCollapsibleGroups` sustituye las 5
      reimplementaciones con `Set` propio (`PlanAssetsView`,
      `PlanPlannedDecisionView` ×2, `PlanOccurredEventView` ×2); `AChevron`
      sustituye el texto "Ver/Ocultar" en las 7 cabeceras de grupo; `ARowMenu`
      sustituye el menú de opciones de `PlanView`.
      **Bug corregido de paso:** el chrome de `ARowMenu` (`.row-menu`,
      `.row-menu-wrap`) vivía en `net-worth-view.css` acotado a `.a-nw-page`, así
      que el menú de fila de **Contabilidad** —que consume la misma primitiva— se
      pintaba sin caja, sombra ni posicionamiento. Promovido a
      `design-system.css`. `ARowMenu` gana cierre con Esc + restauración de foco
      y su primer spec.
      **Corrección a la auditoría:** el ítem "`AToast` en vez de
      `.plan-scenario-notice`" estaba mal planteado. Esos bloques son estado
      persistente del escenario (descartado / incorporado), no confirmaciones
      transitorias; un toast que se auto-descarta sería peor. Se mantienen como
      sección. Sí se retira el modificador `.plan-scenario-notice.success`, que
      era CSS muerto.
- [ ] **F4 — Chrome.** `.plan-toolbar` es una caja con borde/radio/fondo panel; el
      patrón compartido `.context-bar` es una tira transparente con hairline
      inferior, que es lo que usan Patrimonio, Presupuesto y Cierre. Además
      `.plan-setup-page > .page-head .page-title { font-size: 26px }` re-estiliza
      chrome compartido para una sola página, `.plan-form-section` duplica la
      superficie de card, y `.plan-block-eyebrow` (muted, 7 usos) convive con
      `.eyebrow` (accent, ~30 usos) sin criterio documentado. **Cambia el
      aspecto: requiere decisión de producto.**

**DoD**: los greps de control de la Review Checklist de la skill salen limpios en
`views/Plan*.vue` y `domains/plan/**`.

## G. Deuda transversal detectada (4 dominios)

No es específica de Mi Plan; no abrir sin decidir si se tocan los cuatro
dominios a la vez.

- [ ] `.tabs` / `.tab` no existen en `design-system.css`: los redefinen por
      separado net-worth, accounting, budget y plan.
- [ ] `AContextBar` está exportado en `domains/ui/index.ts` y **no lo usa nadie**;
      todas las vistas montan la barra de contexto a mano.
- [ ] `padding-bottom: 84px/88px` mágico en los 5 CSS de dominio, justo lo que
      prohíbe la regla 24 del visual-contract (`--shell-bottom-inset`).

---

## Hecho (baseline de esta tanda)

Trabajo ya completado que establece el patrón:

- ✅ `lib/format` ampliado (`toNumber`, `formatNumber`, `formatCompact`,
  `currencySymbol`) + nuevo `lib/dates`; migrados movimientos y patrimonio.
- ✅ `movementKind.ts` (glifos unificados).
- ✅ Primitivas nuevas: `AToast`, `AChevron` (+`useCollapsibleGroups`),
  `ADateRange`.
- ✅ Código muerto eliminado en net-worth.
- ✅ Modales de patrimonio alineados al layout etiqueta/valor de movimientos.
- ✅ Arreglos UX: orden del formulario de activo, alcance de Notas, FAB de
  movimientos sobre la barra inferior.

## Referencias

- [`frontend-visual-contract.md`](frontend-visual-contract.md) — catálogo de
  primitivas y helpers compartidos.
- [`frontend-visual-guide.md`](frontend-visual-guide.md),
  [`frontend-css-workflow.md`](frontend-css-workflow.md),
  [`frontend-ux-iteration-playbook.md`](frontend-ux-iteration-playbook.md).
- [`domain-map.md`](domain-map.md) — dominios, rutas y clientes API.
