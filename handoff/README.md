# Handoff: Moneyplanner — Rediseño visual sistema completo

## Overview

Este paquete es el resultado de un proceso de refinamiento visual de la app **Moneyplanner** — un coach financiero personal con vistas de Patrimonio, Presupuesto, Cierre mensual, Movimientos y Guía.

El objetivo era limpiar el sistema visual existente (many nested cards, headers inconsistentes, modales de estilos variados) y reemplazarlo por un **sistema unificado** con un único patrón de header, una sola elevación y una paleta cromática coherente.

## Sobre los archivos de diseño

Los archivos `.jsx` y `.html` de este paquete son **prototipos de diseño creados en HTML+React** — referencias visuales e interactivas de cómo debe verse y comportarse la app. **No son código de producción**. Tu tarea es **reimplementar estos diseños en el codebase Vue existente** (`frontend/`) manteniendo toda la funcionalidad ya implementada (composables, stores, API calls, etc.) y reemplazando únicamente la capa visual (markup HTML + CSS).

## Fidelidad

**Alta fidelidad (hifi).** Los prototipos son pixel-accurate en colores, tipografía, espaciado e interacciones. El desarrollador debe recrear el UI con precisión usando el codebase Vue existente, sus componentes y patrones establecidos.

---

## El sistema en una frase

> Una sola superficie. Headers siempre iguales. Color solo donde informa.

---

## Principios del sistema

### 1. Una sola elevación
No hay cards dentro de cards. Toda la página es una única superficie (`--bg`). Las secciones se separan con `gap` y hairlines (`1px solid var(--line)`), nunca con borders + background anidados.

### 2. Header DSL unificado
Todo bloque de contenido — página, sección, modal — usa el mismo patrón:
```
eyebrow (opcional, uppercase, --accent o --muted)
title (32px, font-weight 600, letter-spacing -0.02em)
meta (12.5px, --muted, separado por dots)
actions (botones a la derecha)
```
En Vue: `<APageHead>` para páginas, `<ASectHead>` para secciones.

### 3. Context bar para filtros de página
Los filtros que "cambian qué mira la página" (titularidad, moneda, año fiscal, valoración) van en una barra horizontal entre el page-head y el contenido, usando controles compactos. **Nunca en el área de actions**, que es para acciones que modifican datos.

### 4. Color solo donde informa
- `--accent` (teal oklch) → acento de la app, nav activa, tabs activas, eyebrows.
- `--pos` (verde oklch 148) → positivo semántico: ganancias, activos, ACTIVOS en tabla.
- `--neg` (rojo oklch 24) → negativo semántico: pérdidas, pasivos, PASIVOS en tabla.
- Grades A→E en Guía: misma luminosidad/croma que pos/neg, hues 148→115→80→45→24.
- Nunca usar `--accent` donde el color es semántico (ej. no usar teal en "ACTIVOS", usar --pos).

### 5. Tipografía
- **Body**: Geist, system-ui, sans-serif. `font-feature-settings: "ss01", "cv11"`.
- **Números**: Geist Mono, `font-variant-numeric: tabular-nums` en **todas** las cifras.
- **Eyebrows / labels**: `font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600`.

### 6. Densidad responsive por container query
Cada vista tiene `container-type: inline-size` para que los artboards reaccionen a su propio ancho, no al viewport. Breakpoints: 1280 / 1024 / 820 px.

---

## Vistas

### Patrimonio (`/patrimonio` → `NetWorthView.vue`)

**Layout:** Stack vertical de secciones separadas por `gap: 28px`.

**Page head:**
- Title: "Patrimonio" (sin eyebrow)
- Meta: `<ADateSelector>` (selector de fecha histórica) · "Base EUR" · botón "Archivadas N" (ghost)
- Actions: `+ Añadir cuenta` (primary)

**Context bar (bajo el page-head):**
- Titularidad: select (Todos / Compartida / Marta / Alex) → `ownershipFilter` en el store
- Moneda: select (EUR / USD / GBP) → `baseCurrency`
- Valoración: segmented Nominal / Real (inflación) → `valueMode`

**Hero (una fila flex, wrap):**
- Izquierda: eyebrow "Patrimonio neto" + cifra grande (72px Geist, tabular-nums) + delta line (`+X€ (+Y%) este mes · +Z€ YTD · N% capital propio`)
- Centro: `<Donut>` 200px — 3 slices: Capital propio (hue 148) / Deuda respaldada (hue 45) / Deuda no respaldada (hue 24). Centro muestra "CAPITAL PROPIO · 75%". Hover sobre slice actualiza el centro.
- Derecha: dos listas clickables (Activos / Pasivos) con toggle; click filtra el timeline abajo.

**Timeline (sección "Evolución"):**
- Línea suave (Catmull-Rom) + área degradada + eje Y (8 ticks, Geist Mono compact) + barras de delta mensual debajo
- Hover → crosshair + dot + tooltip (mes, valor, delta)
- Click en fila de la tabla o categoría del donut → timeline filtra a esa cuenta/categoría

**Balance (sección):**
- Tabla 5 columnas: Cuenta / Subcategoría / Titular / Valor / ⋯
- Grupos con cabecera `ACTIVOS` (--pos) o `PASIVOS` (--neg) + nombre categoría (text, peso 500)
- Filas de cuenta: swatch 4×20px (pos/neg), nombre, subcategoría, titular, valor en --muted (no bold)
- Moneda extranjera: `(6.000 USD)` en --faint a la izquierda del valor EUR
- Click en fila → row-active (--accent-soft bg) + filtra timeline
- Kebab ⋯: Editar / Duplicar / Ver movimientos / Archivar / Eliminar (confirmación 2 clicks)

**Modal "Añadir cuenta":**
- Diálogo centrado ~640px, border-radius 14px, shadow profunda
- Mismo header DSL: eyebrow "Nuevo · Cuenta" + title + meta + botón cerrar ✕
- Formulario underline (sin borders en campos, solo línea inferior al focus)
- Footer: Descartar (ghost) / Guardar borrador / Añadir al patrimonio (primary)

---

### Presupuesto (`/presupuesto` → `BudgetDashboardView.vue`)

**Page head:** Title "Presupuesto" · meta FY+mes activo+EUR · actions: Sugerencias (ghost) / + Nueva partida

**Context bar:** Año fiscal / Titularidad / Vista (Anual · Mensual · Ejecución)

**Hero (2 columnas):**
- Izquierda: balance previsto + tasa de ahorro + 3 KPIs (Ingresos YTD / Gastos YTD / Residual mes)
- Derecha: year-strip (12 barras, income=--pos, expense=--neg) con mes activo marcado

**Tabs:** Plan anual / Cierre mensual / Ejecución / Sugerencias

**Tabla (2 columnas, Ingresos | Gastos):**
- Cada tabla: ASectHead + `<table>` con Partida (nombre + cat) / Previsto / Ejecutado
- Desvío por fila con color pos/neg
- Footer con totales

**Funcionalidades del codebase a preservar:**
- `incomeViewMode` / `expenseViewMode` — modos de agrupación
- `selectedExecutionMonth` + `updateSelectedExecutionMonth` — selector de mes
- `expenseAdjustAmounts` / `setExpenseAdjustAmount` — inline edit del ejecutado
- `budgetSuggestions` — tab de sugerencias
- `incomeEvolutionMonths` / `expenseEvolutionMonths` — sparklines de evolución

---

### Guía (`/guia` → vista guía)

**Page head:** Title `Guía · {nombre fase}` · meta `Fase N de 5 · {hint} · Actualizado hoy`

**Strip de fases (`<AStepper>`):**
- 5 bloques, hairline coloreada arriba (--accent si done/current, --line si pending)
- Eyebrow "Fase N" + pastilla grade (A-E, oklch(0.74 0.13 H) según score)
- Label de fase + score en mono (100/100)

**Score panel + tareas (2 columnas):**
- Izquierda: score con color del grade actual + barra de progreso
- Derecha: lista de tareas con filtro Pendientes / Todas / Hechas, checkmarks coloreados, botón Abrir/Reabrir

---

### Cierre mensual (`/cierre-mensual`)

**Page head:** Title `Cierre · {mes}` · meta FY · Borrador

**Context bar:** Selector de mes / Titularidad

**Stepper 4 pasos:** Liquidez ✓ / Ingresos ✓ / Gastos (activo) / Resultado — clickables

**Hero:** Residual del mes en grande + 3 KPIs (Ingresos / Gastos / Tasa de ahorro) con comparativa vs previsto

**Contenido del paso activo:** Tabla de conciliación (Partida / Categoría / Previsto / Ejecutado / Desvío / Estado), chips `<AKindChip>` de estado

---

### Movimientos (`/movimientos` → `AccountingMovementsView.vue`)

**Page head:** Title "Movimientos" · meta mes+asientos+partida doble · actions: Catálogo de cuentas / Importar bancario / + Asiento rápido

**Tabs:** Cuentas / Todos los movimientos / Estadísticas

**Tab Cuentas:**
- Tabla: Cuenta (nombre + n asientos) / Tipo chip / Cobros mes / Pagos mes / Saldo
- Click en fila → expande inline los últimos 6 movimientos de esa cuenta con signo correcto desde el POV de la cuenta
- "Ver todos →" en la expansión salta a la tab con filtro aplicado

**Tab Todos los movimientos:**
- Filter bar: búsqueda / `accountId` / `kind` (9 opciones) / `categoryKey` (condicional) / `subcategoryKey` (condicional) / selector de período con popover (presets + custom date range)
- Contador "X de Y · ±neto"
- Tabla: Fecha / Concepto / Tipo chip / Debe / Haber / Importe (±color) / Saldo running / ⋯
- Empty state si filtros no devuelven resultados

**Tab Estadísticas:**
- Selector de año fiscal
- KPI strip Activos / Pasivos contables
- Cashflow mensual (12 columnas, residual coloreado ±)
- Contrapartidas técnicas en `<details>` colapsable

---

## Componentes del sistema

Ver `COMPONENTS.md` para la referencia completa de cada componente.

---

## Design tokens

Ver `tokens.css` — contiene **todas** las variables CSS del sistema extraídas directamente del prototipo.

Variables clave:
```css
--accent:      oklch(0.72 0.12 178)   /* teal, tweakable via --accent-h */
--pos:         oklch(0.74 0.13 148)   /* verde semántico — ganancias, activos */
--neg:         oklch(0.72 0.16 24)    /* rojo semántico — pérdidas, pasivos */
--pos-soft:    oklch(0.74 0.13 148 / 0.14)
--neg-soft:    oklch(0.72 0.16 24 / 0.14)
--bg:          #0c0d10
--surface:     #0c0d10
--text:        rgba(255,255,255,0.94)
--muted:       rgba(255,255,255,0.58)
--faint:       rgba(255,255,255,0.32)
--line:        rgba(255,255,255,0.09)
--line-strong: rgba(255,255,255,0.16)
--hover:       rgba(255,255,255,0.04)
```

Tipografía:
- Body: `"Geist", "Segoe UI", system-ui, sans-serif`
- Números: `"Geist Mono", ui-monospace, monospace` + `font-variant-numeric: tabular-nums`
- Google Fonts URL: `https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Geist+Mono:wght@400..600&display=swap`

---

## Archivos incluidos

| Archivo | Descripción |
|---|---|
| `Moneyplanner Refinement.html` | **El prototipo interactivo** — ábrete en navegador para ver y explorar el diseño |
| `direction-a.jsx` | Componentes del sistema visual: tokens CSS, APageHead, ASectHead, AContextBar, AHero, AKPI, AKindChip, AStepper, ASelectCtrl, ARowMenu, ADateSelector, ANetWorthView, AAddAssetSheet |
| `direction-a-more.jsx` | Vistas: ABudgetView, AGuideView, AMonthlyCloseView, AMovementsView, ADataInputView |
| `shared.jsx` | Datos mock, helpers de formato (fmtEUR, fmtPct), Donut SVG, AreaChart SVG |
| `tokens.css` | Variables CSS extraídas del sistema, listas para añadir a `app.css` |
| `COMPONENTS.md` | Catálogo de componentes con props y variantes |

---

## Estrategia de portado

### Enfoque recomendado para Claude Code

1. **Empieza por los tokens** — añade el bloque de variables de `tokens.css` a `src/styles/app.css` (o como bloque `:root` adicional). Muchas variables ya existen en la app; ajusta los valores actuales en vez de duplicarlos.

2. **Porta pantalla a pantalla**, empezando por `NetWorthView.vue` (la más trabajada):
   - Lee `direction-a.jsx` para entender el markup objetivo
   - Mantén los composables y stores existentes sin cambios
   - Reemplaza solo el template HTML + los estilos scoped
   - Reutiliza las clases del sistema (`.page`, `.page-head`, `.sect`, `.sect-head`, `.tbl`, `.context-bar`, etc.) en vez de crear nuevas

3. **Orden de portado sugerido:**
   - `NetWorthView.vue` (hero + donut + timeline + tabla balance)
   - Shell global (`AppShellLayout.vue` → top nav en vez de sidebar)
   - `BudgetDashboardView.vue`
   - `AccountingMovementsView.vue`
   - Cierre mensual
   - Guía

4. **No portes el modal `AAddAssetSheet` verbatim** — en Vue ya tienes `BaseModal` y `NetWorthItemModals.vue`. Aplica el mismo CSS (underline fields, header DSL, dialog-inner) al modal existente.

5. **El donut** — `NetWorthDonut.vue` ya usa Chart.js. Puedes mantenerlo y solo ajustar los colores (`rgba(52, 211, 153)` → `oklch(0.74 0.13 148)`) o reimplementarlo en SVG puro siguiendo `shared.jsx`.
