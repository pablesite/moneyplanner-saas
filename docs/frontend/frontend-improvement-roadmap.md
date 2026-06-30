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

- [x] `domains/guide/composables.ts` — `toNumber`, `formatNumber`, `formatPct`
      locales (líneas ~52, ~609–640) → `@/lib/format`.
- [x] `domains/guide/phaseDiagnostics.ts` — `toNumber` local → `@/lib/format`.
- [x] `views/budget/useBudgetDashboardPage.ts` — `formatNumber`/`formatMoney`
      locales → `@/lib/format`.
- [x] **Añadir `formatPct` a `@/lib/format`** (hoy vive local en `NetWorthView`
      y `guide`); migrar ambos a la versión compartida.
- [x] Barrido final: `grep` de `function (toNumber|formatNumber|formatMoney|
      formatPct|normalizeNumberInput)` fuera de `lib/` debe quedar ~vacío.

**DoD**: sin definiciones locales equivalentes; tests de `guide`/`budget` verdes.

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

**Auditoría ligera cerrada:** no quedan `<select>` nativos en componentes de
producto; el único `<option>` restante pertenece a un `datalist` de texto libre
en `AnnualEntryModalForm` (sugerencias de grupo de evento, no selector cerrado).
Los mensajes de éxito usan `AToast`, los indicadores de expansión usan
`AChevron`, y los flujos Direction A principales ya consumen `AButton`,
`ASelect`, `AState`, `APageHead`/`ASectHead`, `AKindChip`, `ARowMenu`,
`AHero`/`AKpiBand`, `ASparkline`, `ADateRange` y `BaseModal` donde aplica. No
se creó ninguna primitiva nueva en este bloque; por tanto no hay actualización
adicional necesaria en el visual-contract.

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
- [ ] **Estado / Home** (`HomeView`) — vista de resumen, revisar reuso de hero/
      KPI/sparkline.
- [ ] **Guía** (`domains/guide`, `guide-*.css`) — formatters locales (sección A).
- [ ] **Personas** (`domains/people`) — modales (sección D).
- [ ] **Datos auxiliares** (`domains/aux-data`).

Para cada vista, checklist mínima:
- [ ] Dedup utilidades (A) · [ ] Primitivas UI (B) · [ ] CSS compartido (C) ·
      [ ] Modales al slot de footer (D) · [ ] Estados loading/empty/error/success
      · [ ] Validación Docker + tests verdes.

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
