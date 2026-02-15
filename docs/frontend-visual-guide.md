# Frontend Visual Guide (Minimo)

## Objetivo
Definir una base visual comun para `core/frontend` y `frontend` sin bloquear iteracion.

## Tokens base
Fuente canonica de tokens de UI:
- `core/frontend/src/styles/app.css`
- `frontend/src/styles/app.css`

Variables clave:
- Espaciado: `--space-2`, `--space-3`, `--space-4`, `--space-6`
- Bordes/radio: `--radius-sm`, `--radius-md`, `--radius-lg`
- Focus: `--focus-border`, `--focus-ring`
- Error: `--state-error-border`, `--state-error-bg`

## Reglas de uso
1. Nuevos componentes deben usar tokens, no valores hardcodeados repetidos.
2. Estados `focus` y `error` deben mantener contraste consistente.
3. Si un token cambia en `core`, sincronizar en `saas` dentro de la misma tarea.

## Estado actual (Roadmap-02 / Fase 2)
- Base de espaciado/radio/focus/error aplicada en `styles/app.css`.
- Falta ampliar guia de tipografia y layout por vistas.
