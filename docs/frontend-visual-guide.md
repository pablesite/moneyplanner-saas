# Frontend Visual Guide (Minimo)

## Objetivo
Definir una base visual comun para `core/frontend` y `frontend` sin bloquear iteracion.

## Stack de estilos
- Base recomendada activa: `Tailwind CSS` + tokens CSS propios.
- Flujo operativo y reglas de trabajo: `docs/frontend-css-workflow.md`
- Configuracion:
  - `core/frontend/tailwind.config.cjs`
  - `frontend/tailwind.config.cjs`
  - `core/frontend/postcss.config.cjs`
  - `frontend/postcss.config.cjs`
  - entradas Tailwind: `core/frontend/src/styles/tailwind.css` y `frontend/src/styles/tailwind.css`

## Tokens base
Fuente canonica de tokens de UI:
- `core/frontend/src/styles/app.css`
- `frontend/src/styles/app.css`

Variables clave:
- Espaciado: `--space-2`, `--space-3`, `--space-4`, `--space-6`
- Bordes/radio: `--radius-sm`, `--radius-md`, `--radius-lg`
- Focus: `--focus-border`, `--focus-ring`
- Error: `--state-error-border`, `--state-error-bg`
- Tipografia: `--font-sans`
- Fondo: `--bg`, `--bg-gradient`

## Reglas de uso
1. Nuevos componentes deben usar tokens, no valores hardcodeados repetidos.
2. Estados `focus` y `error` deben mantener contraste consistente.
3. Si un token cambia en `core`, sincronizar en `saas` dentro de la misma tarea.
4. Preferir utilidades Tailwind para layout/spacing/typography y reservar CSS scoped para reglas de dominio muy especificas.

## Estado actual (Roadmap-02 / Fase 2)
- Base de espaciado/radio/focus/error aplicada en `styles/app.css`.
- Tailwind integrado en `core/frontend` y `frontend` con mapeo de tokens desde CSS variables.
- `NetWorthView` y `BaseModal` ya migrados a layout utilitario Tailwind en `core/frontend` y `frontend`.
- Capa `@layer components` activa en `src/styles/tailwind.css` para primitivas de formularios (`ui-form-help`, `ui-select-placeholder`, `ui-form-actions`).
- Primitivas de pagina/datos unificadas en `src/styles/tailwind.css` para vistas principales:
  - `ui-page-header`, `ui-page-title`, `ui-page-actions`
  - `ui-section-header`, `ui-status-line`
  - `ui-data-form-grid`, `ui-data-field`, `ui-data-table`, `ui-data-table-actions`
  - `ui-alert-success`, `ui-table-empty`
- Feedback de accion y estado vacio aplicado en:
  - `AuxDataView` (`core/frontend` y `frontend`) con mensajes de exito post CRUD y filas vacias por tabla.
  - dominio `people` (`frontend`) con mensajes de exito en `FamilyMemberManager` y `OwnershipManager`.
- Microcopy UI alineado en español en vistas/componentes principales (`core/frontend` y `frontend`) para evitar drift de encoding (acentos y signos de apertura).
- Siguiente paso: homogeneizar componentes base (`button`, `form`, `table`, `modal`) migrando estilos repetidos a utilidades y componentes comunes.
