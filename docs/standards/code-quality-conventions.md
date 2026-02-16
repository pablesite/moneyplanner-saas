# Convenciones De Calidad De Codigo

## Objetivo
Definir reglas minimas de legibilidad y control de complejidad para `core` y `saas`.

## Comentarios
1. Escribir comentarios solo cuando aportan contexto no obvio.
2. Priorizar comentarios de "por que" y evitar comentarios de "que" triviales.
3. Mantener comentarios breves, actualizados y consistentes con el codigo.
4. Usar espaciado estandar en comentarios de linea (`// comentario`, `# comentario`).

## Complejidad Maxima Por Funcion
1. Backend Python (`ruff` / `mccabe`):
   - Maximo: `20`
   - Configurado en `backend/pyproject.toml` y `core/backend/pyproject.toml`.
2. Frontend TypeScript/Vue (`eslint`):
   - Maximo: `20`
   - Configurado en `frontend/.eslintrc.cjs` y `core/frontend/.eslintrc.cjs`.

## Aplicacion
1. CI valida estas reglas en:
   - `.github/workflows/quality-saas.yml`
   - `core/.github/workflows/quality-core.yml`
2. Pre-commit mantiene validacion rapida local.
