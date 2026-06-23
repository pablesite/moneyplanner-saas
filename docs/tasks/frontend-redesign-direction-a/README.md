# Frontend redesign "Direction A" — Módulo de portado

Reimplementación del frontend SaaS sobre el sistema visual "Direction A" del handoff (`handoff/`),
**preservando toda la funcionalidad**. Branding se mantiene "The Arkenstone".

## Estado

| Fase | Vista(s) | Estado |
| ---- | -------- | ------ |
| 0 | Fundación (tokens `.dir-a`, fuentes Geist, shell → topbar) | ✅ hecha (revisar) |
| 1 | Patrimonio (`NetWorthView`) | ✅ cerrada. El rework Direction A queda dado por bueno; los remates de gate visual y consistencia transversal se mueven a la Fase 5 |
| 2 | Presupuesto + Cierre mensual (`BudgetView` + `MonthlyCloseView`) | ✅ cerrada. La presentación desacoplada y el reskin completo quedan aceptados; los remates de gate visual y consistencia transversal se mueven a la Fase 5 |
| 3 | Contabilidad (`AccountingMovementsView`) | ✅ cerrada. La antigua fase de Movimientos se considera completada y consolidada como Contabilidad |
| 4 | Estado financiero (`HomeView` + `GuidePhaseDetailView`) | ✅ cerrada. El port Direction A y el renombrado de la antigua Guía quedan aceptados; los remates de gate visual y happy-path se mueven a la Fase 5 |
| 5 | Gate visual + consistencia transversal | ✅ cerrada. Happy-path validado manualmente y primitivas/shared CSS consolidados para el cierre definitivo del módulo |

Orden de ejecución: 0 → 1 → 2 → 3 → 4 → 5. La Fase 5 consolida el cierre visual transversal sobre las vistas ya aceptadas en las fases anteriores y deja el módulo Direction A dado por cerrado a nivel de frontend SaaS.

---

## Post-mortem de la Fase 1 (por qué se rehace)

El primer porte de Patrimonio quedó como **UI híbrida**: cabecera/context-bar/hero/tabla nuevos
conviviendo con bloques heredados (`ui-nw-timeline-*`, `NetWorthCategoryWorkspace` lateral,
`NetWorthTimelineMain`, utilidades tailwind en el modal, `ui-state-block`, `ui-status-line`).
Faltaban estilos y la jerarquía visual no coincidía con el handoff.

Causas raíz:

1. **Porte "por capas" / injerto.** Se añadieron secciones nuevas encima de la estructura previa en
   vez de remaquetar la pantalla completa de arriba abajo. Resultado: patrones visuales
   incompatibles coexistiendo.
2. **Restricción mal entendida: "no tocar lógica" → "no tocar nada salvo CSS".** La vista real no
   mapea 1:1 con el prototipo, así que reutilizar markup viejo con CSS nuevo produjo híbridos.
3. **Validación insuficiente.** lint/typecheck/tests solo dicen que compila; no verifican jerarquía
   visual, fidelidad al handoff ni ausencia de mezcla de estilos. No hubo revisión visual de la
   pantalla completa.
4. **Alcance subestimado.** Patrimonio no era "restilar": hero, donut, timeline, workspace lateral,
   tabla balance, modales, chips, acciones por fila y estados vacío/error/loading, repartidos en
   varios componentes con CSS heredado (1300+ líneas).

## Segundo intento — desviación de fidelidad (otra causa, distinta del híbrido)

El segundo porte de Patrimonio **sí** cumplió la metodología anti-híbridos y preservó lógica, pero
**se desvió de la fidelidad visual**: el agente interpretó "reconstruir presentación / limpiar
híbridos" como permiso para **reinterpretar el diseño**. Resultado: estructuralmente "Direction A
compatible", pero **no igual al handoff**. Síntomas concretos reportados:

- Hero simplificado en vez de copiar el layout exacto (cifra grande izquierda, donut centrado con
  proporciones/leyenda concretas, **dos columnas marcadas** para Activos y Pasivos).
- Donut reutilizado sin llevarlo a la estética del prototipo (tamaño, centro, pesos, leyenda,
  colores, relación con las listas laterales).
- Tabla de balance rehecha "a interpretación propia" en vez de replicar su ritmo tipográfico/de
  filas (densidad, hairlines, swatches, jerarquía nombre/subcategoría, importes, acciones).

Lección: preservar lógica y eliminar híbridos **no** autoriza a rediseñar detalles visuales. El
handoff es **hifi**: el resultado visual debe **coincidir** con el prototipo, no "ser equivalente".
De ahí la Regla 0.

---

## Metodología correcta (obligatoria en todas las fases)

### Regla 0 — Fidelidad visual literal al handoff (PRIORIDAD MÁXIMA)

El handoff es **alta fidelidad (hifi), pixel-accurate**. El prototipo
(`handoff/Moneyplanner Refinement.html` + el `.jsx` correspondiente) es la **fuente de verdad del
resultado visual**: composición, layout, proporciones, ritmo tipográfico, densidad de filas,
hairlines, swatches, tamaño/centro/leyenda/pesos del gráfico, colores semánticos y relaciones entre
bloques (p.ej. las **dos columnas** Activos/Pasivos del hero).

- El objetivo es **replicar**, no "reinterpretar de forma equivalente". Ante cualquier duda, se
  copia el prototipo; no se inventa una variante "productiva".
- La libertad estructural de la Regla 1 (reorganizar componentes, extraer composables) existe
  **solo** para preservar lógica y evitar híbridos. **No** es licencia para alterar el aspecto final.
- Cualquier diferencia respecto al prototipo es un **defecto**, no una decisión de diseño, salvo que
  el usuario la apruebe explícitamente.
- **Gráficos/charts:** deben **coincidir con el prototipo** (donut: tamaño, grosor, centro tipo
  "CAPITAL PROPIO · 75%", leyenda, pesos, hover que actualiza el centro). La **técnica es libre**
  (SVG a medida según `handoff/shared.jsx`, o Chart.js con plugins/config), pero si la opción
  elegida no alcanza la estética del prototipo, **escalar a SVG**. "Recolorear y ya" no cumple.

### Regla 1 — Separar capa de lógica y capa de presentación (no "no tocar nada")

- **Capa de LÓGICA (se preserva el comportamiento):** composables (`use*`), stores Pinia, `api.ts`,
  modelos, métricas computadas y handlers de acciones. Su API/comportamiento público es el contrato
  intocable.
- **Capa de PRESENTACIÓN (se reconstruye íntegra, NO se parchea):** `<template>` de la vista,
  templates de los componentes presentacionales y CSS. Se construye **de arriba abajo** desde la
  composición Direction A, no se adapta el markup viejo.
- **Permitido (y a menudo necesario):** reestructurar fronteras de componentes — p.ej. extraer la
  lógica de un componente "gordo" a un composable headless y construir un componente presentacional
  nuevo que la consuma. Esto estaba implícitamente prohibido por la regla vieja y es lo que forzó
  los híbridos. Debe ser **preservando comportamiento** y validado.
- **Límite de esta libertad:** la reorganización es para lógica e híbridos, **no** para el aspecto
  visual. El resultado debe seguir coincidiendo con el prototipo (Regla 0). Reconstruir ≠ rediseñar.

### Regla 2 — Contrato de composición primero

Antes de tocar ningún fichero, definir el **árbol de markup final completo** de la pantalla
(de arriba abajo), con las clases del sistema y qué dato/handler alimenta cada bloque. Es el
objetivo contra el que se valida. Sin esto, no se empieza a codificar.

### Regla 3 — Clasificar cada componente existente

Tabla obligatoria por fase. Cada componente cae en una categoría:

- **A. Reusar tal cual** — ya es headless/neutral o es un primitivo (charts recoloreados). Sin cambios.
- **B. Remaquetar completo** — se reescribe su `<template>` + estilos a Direction A; se conserva su lógica/props.
- **C. Extraer lógica → componente nuevo** — la lógica va a un composable; se crea un presentacional nuevo.
- **D. Eliminar del render** — bloque heredado que no pertenece a Direction A; se descompone/sustituye.

### Regla 4 — Reconciliación de funcionalidad (anti pérdida)

Inventariar **cada comportamiento** de la vista actual (incluidos los de componentes que Direction A
no contempla) y asignar a cada uno su ubicación en la composición nueva. Todo comportamiento **sin
hueco claro en el diseño** se lista explícitamente como **CONFIRMAR con el usuario** — nunca se
descarta en silencio ni se mantiene como híbrido.

### Regla 5 — Cero híbridos en el render final

Ninguna clase/bloque del sistema viejo (`ui-nw-*`, `ui-pro-*`, `ui-section-card`, utilidades
tailwind de layout, `card`, etc.) puede sobrevivir en el render final de una pantalla portada.
Grep de verificación antes de cerrar (ver Regla 6).

### Regla 6 — Gate de fidelidad visual (cierre obligatorio)

lint/typecheck/tests son necesarios pero **no suficientes**: solo dicen que compila, no que el
diseño coincida. Antes de dar una fase por cerrada:

1. Levantar la app (`docker-compose.dev.yml`) y abrir la pantalla con datos reales.
2. Abrir el prototipo `handoff/Moneyplanner Refinement.html` **en paralelo** y comparar
   **sección por sección y elemento por elemento**: composición, layout, proporciones, ritmo
   tipográfico, densidad de filas, hairlines/swatches, tamaño/centro/leyenda del gráfico, colores
   semánticos, relaciones entre bloques. **El criterio es "coincide", no "es coherente".**
3. Anotar **cada desviación** respecto al prototipo como defecto a corregir (no como decisión de
   diseño). Iterar hasta que no queden desviaciones, o hasta que el usuario apruebe una excepción.
4. Recorrer estados loading / vacío / error y todas las interacciones del checklist de la fase.
5. Grep anti-híbrido sobre los ficheros de la pantalla: no deben quedar clases del sistema viejo en
   el render final.
6. Capturas de la pantalla completa **junto al prototipo** adjuntas en el cierre como evidencia de
   fidelidad.

Solo con este gate en verde, además de lint/typecheck/tests, se considera completa una fase.

### Regla 7 — Una pantalla, un commit coherente

Cada fase se cierra cuando la pantalla está **completa y coherente** de arriba abajo, no a trozos.
No se mergea una pantalla a medio portar.
