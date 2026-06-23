# Librería de componentes Direction A — cierre y follow-ups

> Handoff para retomar el trabajo de consolidación de la librería de componentes del
> frontend SaaS dentro del cierre transversal de Direction A.
> Última actualización: 2026-06-23.

## Contexto

Se partió de un análisis de duplicidades en `frontend/src` y se construyó una librería de
primitivas Direction A en `@/domains/ui`, consolidando heroes, selects, badges, estados,
bandas KPI y donut. La Fase 5 del redesign quedó cerrada el `2026-06-23`; este documento
queda como nota de cierre y backlog menor asociado. Referencia de la librería en
`docs/frontend/frontend-visual-contract.md` (sección "Librería de componentes (primitivas
Direction A)").

## Hecho (no repetir)

- **Primitivas nuevas** en `frontend/src/domains/ui/`: `AButton`, `AHero`, `AKpiBand`,
  `AMetaPill`, `AState`, `ADonut`. Más `ScoreGrade` en `domains/guide` (no en `ui`, por
  depender de `gradeFromScore`; evita acoplar `ui → guide`). Todas con test y exportadas en
  `domains/ui/index.ts`.
- **Heroes** (Presupuesto/Cierre/Patrimonio/Contabilidad) → `AHero` + `AKpiBand`, con shell
  de alineación `.a-hero-shell` y clases `.hero-*`/`.kpi-*` promovidas a `design-system.css`.
- **36 `<select>` nativos → `ASelect`** en 9 ficheros. Incluye **bugfix de ASelect**:
  `inheritAttrs: false` + `v-bind="$attrs"` en el trigger (el `<Teleport>` descartaba los
  attrs, así que `.filter-ctrl`/`.select` no llegaban), y panel con `width/height: auto`
  (antes heredaba `100%` de `.dir-a` y se estiraba a `max-height`).
- **Badges/pills**: borrado `ScoreHealthBadge` (muerto); merge `ScoreGradeBadge` +
  `ScoreGradeLabel` → `ScoreGrade` (prop `variant`); `*-meta-pill` → `AMetaPill`.
- **Estados** loading/empty/error → `AState` (layouts `inline` / `panel`), incluidos los
  `mc-*` del cierre.
- **Bandas KPI del cierre** → `AKpiBand` (con `cellClass` para la desviación). **NO se
  colapsaron las 4 secciones de cierre** — decisión deliberada: props de dominio divergentes,
  sería peor abstracción; solo se deduplicaron las piezas (AKpiBand + AState).
- **Donut** unificado en `ADonut`; **hero legacy `ui-pro` de Contabilidad borrado** (estaba
  muerto, 0 usos) + su CSS huérfano retirado de `movements.css` y de `app.css` (`ui-hero-*`).

## Cierres realizados en la Fase 5 final

1. **Gate visual manual completado.** Quedó validado el happy-path de las vistas Direction A y
   de los formularios afectados por `ASelect`, incluyendo `/presupuesto`, `/patrimonio`,
   `/movimientos`, `/estado-financiero`, `/aux-data`, `/account`, `ItemForm`,
   `AnnualEntryModalForm` y `FamilyMemberManager`.

2. **Retirada grande de legacy CSS hecha.**
   - `frontend/src/domains/accounting/styles/movements.css`: borrado masivo de bloques legacy
     muertos previos a Direction A.
   - `frontend/src/styles/app.css` y `frontend/src/styles/tailwind.css`: barrida adicional de
     utilidades y familias `ui-*` sin consumidores.

3. **Acoplamiento CSS cross-dominio resuelto.** Las clases compartidas de hero/breakdown
   quedaron promovidas al `design-system.css` de SaaS, eliminando la dependencia cruzada solo
   para reutilizar `.hero-*`/`.comp-*`.

4. **Reskin del Período en Contabilidad cerrado.** El picker custom de `/movimientos` se dejó
   alineado con el chrome de `ASelect` sin forzar una abstracción incorrecta.

## Follow-ups menores abiertos

1. **Propagación completa de `AButton`.** La primitiva existe, pero todavía quedan botones
   crudos fuera de la pasada de consolidación. Ya no bloquea el cierre visual; queda como
   mejora incremental.

2. **Limpieza menor de `guide-detail.css`.** Tras migrar el picker "Evento extraordinario" a
   `ASelect`, `.guide-event-filter` quedó parcialmente huérfano.

3. **`router.spec.ts` sigue siendo el test más lento.** Se aumentó su margen a `20s`, con lo
   que deja de quedar tan al borde bajo carga, pero sigue siendo buen candidato a revisión si
   vuelve a dar señales de fragilidad.

## Validación (cada cambio)

Dentro de Docker: `docker compose -f docker-compose.dev.yml --env-file .env.dev exec
saas_frontend` + `npm run typecheck` · `npm run lint` · `npm run format:check` ·
`npm run test:unit`. Conventional Commits; no tocar VERSION (release-please). Usar la skill
`frontend-system`; preferir clases/tokens compartidos sobre CSS por vista; sin `style=` inline
ni nuevos `<style scoped>` salvo justificación clara.
