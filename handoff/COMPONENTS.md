# Catálogo de componentes — Moneyplanner Design System

Todos los componentes están implementados como funciones React en `direction-a.jsx`.
Al portar a Vue, recrea la misma estructura HTML y aplica las mismas clases CSS.

---

## ATopbar

Navegación horizontal persistente en la parte superior de cada vista.

```jsx
<ATopbar active="nw" />
// active: "guide" | "nw" | "budget" | "close" | "mov"
```

**Estructura:** `.topbar` → brand mark (MP) + `.topnav-list` (5 botones) + `.topnav-right` (buscar, notif, avatar)

**Clases clave:**
- `.topnav-item` — ítem de nav muted por defecto
- `.topnav-item.on` — ítem activo: color text + `border-bottom: 1.5px solid var(--accent)`
- `.topnav-divider` — separador vertical entre brand y nav

---

## APageHead

Header de página. Siempre el primer hijo de `.page`.

```jsx
<APageHead
  title="Patrimonio"
  eyebrow="opcional"        // uppercase, --accent
  meta={[                   // array de strings o JSX (React.ReactNode)
    <ADateSelector ... />,
    "Base EUR",
  ]}
  actions={<><button>...</button></>}
/>
```

**Clases:** `.page-head` (flex, space-between, border-bottom) · `.eyebrow` · `.page-title` (32px) · `.page-meta` · `.actions`

---

## ASectHead

Header de sección. Mismo DSL que APageHead pero más ligero (17px, no eyebrow).

```jsx
<ASectHead
  title="Evolución"
  count="12 meses"          // opcional, aparece muted tras ·
  sub="subtítulo opcional"  // 12px muted
  actions={<div className="seg">...</div>}
/>
```

**Clases:** `.sect-head` · `.sect-title` · `.sect-count` · `.sect-sub`

---

## AContextBar + AContextField

Barra de filtros contextuales entre page-head y contenido.

```jsx
<AContextBar>
  <AContextField label="Titularidad">
    <ASelectCtrl value={ownership} onChange={setOwnership} options={[...]} />
  </AContextField>
  <span className="context-divider" />
  <AContextField label="Valoración">
    <div className="seg">
      <button className="on">Nominal</button>
      <button>Real</button>
    </div>
  </AContextField>
</AContextBar>
```

**Clases:** `.context-bar` (flex, gap 18px) · `.context-field` · `.context-field-label` (uppercase, --faint)

---

## ASelectCtrl

Dropdown custom que respeta dark mode (sin fondo blanco del SO).

```jsx
<ASelectCtrl
  value={kind}
  onChange={(v) => setKind(v)}
  options={[
    { value: "all", label: "Todos" },
    { value: "income", label: "Ingresos" },
  ]}
/>
```

Renderiza un `.filter-ctrl` (botón) + `.filter-popover` (lista) al abrirse.

---

## AHero

Bloque de titular hero: eyebrow + cifra grande + delta line.

```jsx
<AHero
  eyebrow="Patrimonio neto"
  value={fmtEUR(287420)}
  delta={[
    { value: "+2.840 €", tone: "pos", label: "este mes" },
    { value: "+18.640 €", tone: "pos", label: "YTD" },
  ]}
/>
```

**Clases:** `.hero-headline` · `.hero-value` (72px) · `.hero-delta`

---

## AKPI

Tarjeta KPI: label + valor grande + meta text.

```jsx
<AKPI
  label="Ingresos · YTD"
  value="28.120 €"
  meta="41% de lo previsto"
  tone="pos"               // "pos" | "neg" | undefined (neutral)
/>
```

**Clases:** `.kpi` · `.kpi-label` (uppercase, --faint) · `.kpi-value` (20px) · `.kpi-meta` (11.5px, --muted)

Las `.kpis` son un grid de KPIs: `display: grid; grid-template-columns: repeat(N, 1fr)`.

---

## AKindChip

Chip semántico con tono de color.

```jsx
<AKindChip tone="pos">Ahorrado</AKindChip>
<AKindChip tone="neg">Excedido</AKindChip>
<AKindChip tone="neutral">Pendiente</AKindChip>
```

Tones:
- `pos` → color `--pos`, border `--pos-soft`
- `neg` → color `--neg`, border `--neg-soft`
- `neutral` → color `--muted`, border `--line`

Base: `.chip` (padding 4px 10px, border-radius 999px, border 1px, font-size 11.5px)

---

## AStepper

Strip de fases/pasos. Usado en Guía y Cierre mensual.

```jsx
<AStepper
  steps={[
    {
      id: "liquidity",
      label: "Liquidez",
      status: "done",        // "done" | "current" | "pending"
      badge: <span>✓</span>, // opcional — pill grade A-E en Guía
      meta: "100/100",       // opcional — texto pequeño debajo
    },
    ...
  ]}
  activeId={stepId}          // si onChange, controla cuál está activo
  onChange={setStepId}       // opcional — hace los ítems clickables
  eyebrowPrefix="Paso"       // "Paso" | "Fase"
/>
```

**CSS clave:** `.phase-strip` (grid, --n columnas) · hairline coloreada en `border-top` · opacity 0.55 para pending

---

## ADateSelector

Selector de fecha histórica inline en el page-meta.

```jsx
<ADateSelector
  value={{ presetId: "today" }}
  onChange={(v) => setAsOf(v)}
/>
```

Presets: Hoy / Ayer / Hace 1 semana / Hace 1 mes / Hace 3 meses / Hace 6 meses / Hace 1 año / Rango personalizado (inputs date)

Renderiza como `.meta-picker` (pill sutil con caret ▾).

---

## ARowMenu

Kebab ⋯ para filas de tabla con acciones contextuales.

```jsx
<ARowMenu name={it.name} />
```

**Opciones:** Editar / Duplicar / Ver movimientos / Archivar / separador / Eliminar (rojo, confirmación 2 clicks)

**Clases:** `.row-menu-wrap` · `.row-menu` (popover absoluto, border-radius 10px, shadow profunda) · `.danger` (color --neg)

---

## Tabla de balance (patrón)

No es un componente aislado — es un patrón HTML que se replica. Estructura:

```html
<table class="tbl">
  <thead>
    <tr>
      <th>Cuenta</th>
      <th>Subcategoría</th>
      <th>Titular</th>
      <th class="num">Valor</th>
      <th><!-- kebab --></th>
    </tr>
  </thead>
  <tbody>
    <!-- grupo -->
    <tr class="grp-row">
      <td colspan="3">
        <span class="grp-name">
          <span class="grp-kind grp-kind-asset">Activos</span>
          Liquidez
        </span>
      </td>
      <td class="num"><span class="grp-total">28.640 €</span></td>
      <td></td>
    </tr>
    <!-- fila de cuenta -->
    <tr class="clickable [row-active]">
      <td>
        <div class="name">
          <div class="swatch [lia]"></div>  <!-- 4×20px, --pos o --neg -->
          <div class="nameMain">Nombre cuenta</div>
        </div>
      </td>
      <td>Subcategoría</td>
      <td>Titular</td>
      <td class="num account-value">
        <!-- opcional: (6.000 USD) en --faint -->
        5.600 €
      </td>
      <td><ARowMenu /></td>
    </tr>
  </tbody>
  <tfoot>
    <tr class="tbl-foot">
      <td colspan="3">Patrimonio neto</td>
      <td class="num">287.420 €</td>
      <td></td>
    </tr>
  </tfoot>
</table>
```

**CSS de grupo:**
- `.grp-kind-asset` → color `--pos`
- `.grp-kind-liability` → color `--neg`
- `.grp-name` → font-size 14px, font-weight 500, color --text
- `.grp-total` → Geist Mono, font-size 14px, font-weight 500

**CSS de fila:**
- `.account-value` → font-weight 400, color --muted (contraste con el total del grupo)
- `.row-active` → background --accent-soft

---

## Donut (SVG puro)

3 slices estructurales: Capital propio / Deuda respaldada / Deuda no respaldada.

```jsx
<Donut
  data={[
    { label: "Capital propio",       value: 287420, hue: 148 },
    { label: "Deuda respaldada",     value: 84320,  hue: 45  },
    { label: "Deuda no respaldada",  value: 12440,  hue: 24  },
  ]}
  size={200}
  thickness={14}
  centerLabel="Capital propio"
  centerValue="75%"
/>
```

Color de slices: `oklch(0.74 0.13 ${hue})`. Hover sobre slice → se engruesa, otros se atenúan, centro actualiza.

Si mantienes Chart.js (`NetWorthDonut.vue`): cambia los colores a `oklch(...)` equivalentes.

---

## Gráfico de evolución (SVG puro)

Componente `<AInteractiveChart>` en `direction-a.jsx`:
- Línea suave (Catmull-Rom cubic bezier, tension 0.22)
- Eje Y izquierdo (8 ticks, Geist Mono compact)
- Barras de delta mensual debajo de la línea
- Hover → crosshair + dot + tooltip (mes, valor, delta)
- `preserveAspectRatio` sin `none` (evita distorsión de glyphs)

Si mantienes Chart.js (`NetWorthTimelineChart.vue` + `NetWorthDeltaChart.vue`):
- Aplica el mismo layout (línea arriba, barras debajo en mismo canvas o 2 canvas apilados)
- Ajusta colores: `rgba(52,211,153)` → `oklch(0.74 0.13 148)` para ingresos/positivo; rojo para negativo
- Añade eje Y con 8 ticks en formato compact (280k €, 285k €…)

---

## Botones

```html
<button class="btn">Secundario</button>
<button class="btn btn-primary">Primario</button>
<button class="btn btn-ghost">Ghost / Terciario</button>
<button class="btn btn-icon">⋯</button>   <!-- 32×32 cuadrado -->
```

`.btn`: `padding: 8px 14px; border-radius: 8px; font-size: 13px; border: 1px solid var(--line-strong)`
`.btn-primary`: `background: var(--accent-soft); border-color: var(--accent-line)`
`.btn-ghost`: `border-color: transparent; color: var(--muted)`

---

## Segmented control (seg)

```html
<div class="seg">
  <button class="on">Nominal</button>
  <button>Real</button>
</div>
```

`.seg`: `display: inline-flex; border: 1px solid var(--line); border-radius: 8px; padding: 2px`
`.seg button.on`: `background: var(--hover); color: var(--text)`

---

## Filter bar

```html
<div class="filter-bar">
  <input class="filter-ctrl" placeholder="Buscar…" />
  <ASelectCtrl ... />
  <!-- más controles -->
  <span class="filter-count"><strong>12</strong> de 47</span>
</div>
```

`.filter-ctrl`: `padding: 7px 12px; border: 1px solid var(--line); border-radius: 8px; background: transparent`

---

## Tabs

```html
<div class="tabs">
  <button class="tab on">Balance</button>
  <button class="tab">Por categoría</button>
</div>
```

`.tabs`: `display: flex; gap: 18px; border-bottom: 1px solid var(--line)`
`.tab.on`: `color: var(--text); border-bottom: 1.5px solid var(--accent); margin-bottom: -1px`

---

## Formulario (underline style)

Usado en el modal de añadir cuenta:

```html
<div class="form" style="grid-template-columns: 1fr 1fr">
  <div class="field">
    <span class="field-label">Nombre</span>
    <input class="input" />
  </div>
  <div class="field full">   <!-- full = grid-column: 1 / -1 -->
    <span class="field-label">Nota</span>
    <input class="input" />
  </div>
</div>
```

`.field`: `display: grid; gap: 6px; padding: 14px 0; border-bottom: 1px solid var(--line)`
`.input`: `background: transparent; border: 0; font-size: 15px` + `box-shadow: 0 1px 0 0 var(--accent)` en focus

---

## Modal (dialog centrado)

```html
<div class="sheet-scrim"></div>   <!-- overlay -->
<div class="sheet-wrap">          <!-- centra el diálogo -->
  <div class="sheet">
    <div class="sheet-head">      <!-- header DSL -->
      <div>
        <p class="eyebrow">Nuevo · Cuenta</p>
        <h2 class="page-title" style="font-size:22px">Añadir cuenta</h2>
        <div class="page-meta">...</div>
      </div>
      <button class="btn btn-icon">✕</button>
    </div>
    <div class="sheet-body"><!-- formulario --></div>
    <div class="sheet-foot">
      <button class="btn btn-ghost">Descartar</button>
      <div class="actions">
        <button class="btn">Guardar borrador</button>
        <button class="btn btn-primary">Añadir al patrimonio</button>
      </div>
    </div>
  </div>
</div>
```

`.sheet`: `width: min(100%, 640px); border: 1px solid var(--line-strong); border-radius: 14px; box-shadow: 0 24px 64px ...`
`.sheet-wrap`: `position: absolute; inset: 0; display: flex; align-items: flex-start; justify-content: center; padding: 64px 24px 24px`
