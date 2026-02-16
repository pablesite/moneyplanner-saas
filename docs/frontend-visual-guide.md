# Frontend Visual Guide (Minimo)

## Objetivo
Definir una base visual comun para `core/frontend` y `frontend` sin bloquear iteracion.

## Stack de estilos
- Base recomendada activa: `Tailwind CSS` + tokens CSS propios.
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
- Siguiente paso: homogeneizar componentes base (`button`, `form`, `table`, `modal`) migrando estilos repetidos a utilidades y componentes comunes.
