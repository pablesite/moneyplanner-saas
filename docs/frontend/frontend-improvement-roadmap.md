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

- [x] **Auditar `style=` inline.** No queda ninguno estático en el frontend SaaS.
      Los 19 `:style` que hay son dinámicos legítimos (anchos de barra, posición
      de tooltips y marcadores, color de serie, `--n` del stepper, panel de
      `ASelect`).
- [x] **Catálogo de patrones repetidos.** Medido con un script que compara los
      cuerpos de regla normalizados entre dominios: 26 cuerpos idénticos, pero la
      mayoría son coincidencias triviales de 3 declaraciones (`display: flex;
      gap: 8px`) que no son el mismo patrón semántico — consolidarlas sería
      justo el "mover CSS por mover" que prohíbe el último punto. Promovidos los
      cuatro que sí lo son: `.filter-ctrl` (4 dominios), `.sr-only` (3),
      `.data-table th` (4) y `.context-field` (3). Los tabs y el rail de contexto
      ya se hicieron en el bloque G.
- [x] Documentados en el visual-contract (regla 29) y eliminadas las clases de
      dominio huérfanas (`.a-nw-sr-only`, `.a-budget-sr-only`, `.mc-sr-only`).
- [x] Solo se consolidó lo duplicado entre ≥2 dominios.

**Pendiente en C:** el FAB móvil es idéntico entre Patrimonio y Presupuesto
(contenedor + menú), pero Contabilidad diverge estructuralmente (el propio botón
es el FAB, 54×54). Es una consolidación mayor y dentro de media queries; no
abrirla junto con las utilidades.

**Bug corregido de paso:** `.sr-only` se usaba en `AccountView` y
`PlanImprovementsView` pero **no estaba definida en ningún fichero** (tampoco la
aporta Tailwind), así que un `<input type="file">` de importación y un anuncio
`aria-live` se renderizaban visibles. Al promover la utilidad quedan ocultos.

**DoD**: cumplido para utilidades. Reducción neta de líneas duplicadas, sin
`style=` inline no-dinámico, patrones compartidos en `design-system.css` (no en
`app.css`, que es la capa legacy) y documentados.

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
- [x] **Migrados QuickEntry y `AccountingMovementsActivationModal`.** La técnica
      documentada funciona sin tocar `AButton`: se da `id` al `<form>` y el botón
      lleva el atributo HTML `form="<id>"`, que Vue reenvía solo porque `AButton`
      tiene un único nodo raíz. `.qe-footer` era el parche que describe este
      bloque —sticky dentro del scroll, replicando borde, fondo, backdrop y
      safe-area con márgenes negativos— y queda reducido a `display: grid; gap`.
      `.ui-accounting-submit-row` desaparece (huérfana), y con ella su override
      `.dir-a-sheet .ui-accounting-submit-row` en el design system.
- [ ] **`ItemForm`: no migrar por ahora (decisión).** Su footer depende de ~14
      refs de error internas, así que sacarlo del `<form>` exige o un slot con
      scope que las exponga todas, o cambiar el contrato de `BaseModal` para que
      `ItemForm` haga `Teleport` a un objetivo del panel. Es un refactor
      arquitectónico del formulario más grande de la app (~2,6k líneas, 3
      modales) a cambio de consistencia: **el bug ya no existe**, el sticky que
      tapaba el último campo se arregló pasándolo a no-sticky. Reabrir solo si se
      trocea `ItemForm` o si el footer que hace scroll llega a molestar.

**DoD**: cumplido salvo `ItemForm`, excluido a propósito con el motivo arriba.

## E. Pasada por vista (incremental) — absorbida

Los bloques A–D, F y G se aplicaron de forma transversal a todos los dominios,
así que la pasada vista por vista se quedó casi sin contenido. Medido con los
greps de control de la skill sobre Presupuesto, Cierre, Personas y Datos
auxiliares: **cero** `<button class="btn">` crudos, cero `<select>` nativos,
cero `style=` estáticos, cero `Set` propios de colapso y cero formatters
locales. Lo único que quedaba eran tres `sect-head` a mano.

- [x] **Presupuesto** (`BudgetView` + `domains/budget`) — `ASectHead` en la
      cabecera de Sugerencias.
- [x] **Cierre mensual** (`MonthlyCloseView`) — `ASectHead` en la cabecera de
      Impacto en Mi Plan.
- [x] **Estado / Home / Guía** — retirado del SaaS en Financial Plan Phase 5;
      `/estado-financiero` redirige a `/plan`.
- [x] **Personas** (`domains/people`) — sin deuda: sus modales ya se migraron al
      slot de footer en la tanda que abrió el bloque D.
- [x] **Datos auxiliares** (`domains/aux-data`) — sin deuda; ya consumía
      `AChevron`, `useCollapsibleGroups`, `AToast` y `AButton`.
- [x] **Panel de administración y perfil** (`/account`, `domains/admin`) —
      auditado el 2026-08-04. Era el único hueco de esta lista: `AccountView` no
      apareció en ningún bloque A–G y se había quedado como la última isla
      legacy. Detalle en el bloque H.

**Excepción documentada:** `BudgetAnnualSection` mantiene su `sect-head` a mano
porque `.bdg-section-title` es otro tratamiento (16px con barra de color según
ingreso/gasto), no el `.sect-title` estándar; `ASectHead` fija la clase del `h2`
y forzarlo sería calzar el patrón. Mismo criterio que `NetWorthTrajectoryChart`
en el bloque F.

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
- [x] **F4 — Chrome.** Dos decisiones de producto y dos limpiezas.
      **Decidido:** las cabeceras de bloque usan `.eyebrow` (acento) como el resto
      del producto; `.plan-block-eyebrow` (muted, 7 usos) se retira. El muted es
      tratamiento de hero (`.dir-a .a-hero-figure .eyebrow`), patrón compartido
      que Mi Plan había extendido a bloques con una clase que ningún otro dominio
      tenía. Y el título de las páginas de asistente vuelve a la escala
      compartida de 32px: se retira `font-size: 26px`, que dejaba esas cuatro
      pantallas fuera de cualquier cambio futuro de la escala.
      **Corrección a la auditoría:** los otros dos puntos no cambiaban el aspecto,
      eran reglas muertas anuladas por un override que no comprobé. La caja de
      `.plan-toolbar` la anulaba `.plan-scenario-context`, y la card de
      `.plan-form-section` la anula `.plan-setup-page > .plan-form-section`. La
      barra pasa a `.context-bar` compartida y ambas reglas se borran sin cambio
      visual. `PlanFoundations` cierra además el pendiente de F2: quedó fuera
      justo por el color del eyebrow, y ahora usa `ASectHead`.

**DoD**: los greps de control de la Review Checklist de la skill salen limpios en
`views/Plan*.vue` y `domains/plan/**`.

## G. Deuda transversal (4 dominios) — cerrada

- [x] **Tabs compartidas.** `.tabs` / `.tab` estaban duplicadas literalmente en
      net-worth, accounting, budget y plan: las mismas 10 declaraciones cambiando
      solo el prefijo. Promovidas a `design-system.css`. Los ajustes responsive de
      cada dominio (tap targets, scroll horizontal) sí divergen de verdad y se
      quedan locales.
- [x] **Rail de contexto compartido.** El hallazgo real no era `AContextBar`: hay
      **dos** patrones de barra de contexto, y el triplicado era el otro. Los
      `*-read-controls` de Patrimonio, Presupuesto y Cierre eran idénticos (10
      declaraciones, un `border-bottom: 0` de diferencia que era no-op).
      Promovidos a `.context-rail`. `.a-budget-read-controls` y `.mc-read-controls`
      desaparecen; `.a-nw-read-controls` sobrevive solo como gancho de su `gap`
      responsive. `AContextBar` (variante que envuelve) pasa a usarse en
      `PlanScenarioDetailView`, así que deja de estar exportado sin consumidores, y
      se borran los overrides muertos de `.context-bar` / `.context-divider` en
      Contabilidad, que no renderiza ninguna de las dos.
- [x] **Doble reserva de la tab bar.** Los cinco `padding-bottom: 84/88px` no eran
      solo números mágicos: `.ui-shell-content-stage` ya reserva
      `--shell-bottom-inset`, así que cada vista sumaba su propia reserva encima
      (~156 px en móvil en lugar de ~68). Retirados los cinco; la reserva la hace
      solo el shell.
- [x] **Especificidad documentada.** Al mover chrome al design system apareció un
      detalle que no estaba escrito: `main.ts` importa el router (línea 11) antes
      que `design-system.css` (línea 13), así que el CSS de dominio se inyecta
      primero y a igualdad de especificidad **gana el design system**. Verificado
      sobre el bundle. Las clases compartidas que las vistas matizan van dentro de
      `:where()` para no romper sus overrides. Reglas 26–28 del visual-contract.

## H. Panel de administración (`/account`) — cerrada

Auditoría del 2026-08-04. `AccountView` era la **última isla legacy** del
frontend: no aparece en ningún bloque A–G ni en la pasada del bloque E. Para
`saas_admin` el shell vacía la navegación, así que esa ruta es el panel de
administración completo.

Diagnóstico: shell legacy (`container ui-page-shell`, 1 de las 3 vistas que
quedaban) en vez de `.page`; secciones `ui-section-card` con gradiente y sombra
frente a la superficie abierta del resto; `article.card` dentro de `section.card`;
80 líneas de `ui-profile-*` en `app.css` con un único consumidor y un `@media
(max-width: 900px)` fuera de los breakpoints canónicos; 7 `.alert` y 2
`ui-status-line` en vez de `AState`; tres botones de fila en línea en vez de
`ARowMenu`; colores hex a pelo en los mini-paneles y en el overlay de importación
(`bg-[#111827f2]`, `border-t-teal-300`, `z-[70]`); breakpoints Tailwind `md:` en
layout de página; `.actions` con `flex-wrap: nowrap` y 4 badges por fila
desbordando a 360px.

- [x] **Alineación estructural.** `.page` + `ASectHead` + `AState` + `ARowMenu` +
      `AKpiBand` + `AMetaPill`. Retiradas las 80 líneas de `ui-profile-*` y su
      media query; el overlay de transferencia pasa a tokens. Breakpoints al
      sistema `@container page`. Los cuatro `AToast` apilados en el mismo anclaje
      se unifican en uno.
- [x] **Rediseño de Usuarios.** Un solo eje de conexión (los dos pares de badges
      se contradecían: una identidad solo-Core salía como "Solo Core" + "En
      Core"), banda de KPIs, búsqueda y filtros de conexión/estado, `.data-table`
      con `ARowMenu`, y el detalle técnico movido a un sheet. Bajo `sm`, registro
      vertical etiquetado.
- [x] **Borrado con peso.** `window.confirm` → diálogo con nombre, consecuencias
      y la alternativa de desactivar; `danger` en el menú de fila.
- [x] **Bug de datos corregido de paso.** El estado de una identidad se calculaba
      como `saas.is_active || core.is_active`, así que una cuenta SaaS
      desactivada con contraparte Core viva se listaba como **Activa**. Ahora,
      cuando hay cuenta SaaS, manda la suya. Cubierto por test.
- [x] **`.ui-import-spinner` promovido** a `design-system.css` con tokens de
      acento: lo consumía Contabilidad y el panel habría sido el tercer
      consumidor en un segundo dominio (regla 29).
- [x] **Extracción de dominio.** `AccountView` baja de 841 a ~420 líneas; la
      lógica vive en `useAdminUsersPage` (patrón `:page`) con 6 tests nuevos.

**Verificado en render**, no solo por grep: harness estático con el bundle CSS
real a 1180px y 390px (más el sheet a 520px). Sacó tres fallos que los greps no
ven, todos de especificidad contra el design system — de ahí la regla 32 del
visual-contract.

**DoD**: greps de control limpios en `AccountView` y `domains/admin/**`; lint,
format, typecheck y 302 tests en verde.

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
