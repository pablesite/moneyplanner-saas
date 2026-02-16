# Frontend CSS Workflow (Tailwind + Tokens)

## Objetivo
Definir un flujo unico para construir UI nueva sin drift entre `core/frontend` y `frontend` (SaaS).

## Fuente canonica de estilos
1. Tokens y estilos base:
- `core/frontend/src/styles/app.css`
- `frontend/src/styles/app.css`
2. Primitivas compartidas (`@layer components`):
- `core/frontend/src/styles/tailwind.css`
- `frontend/src/styles/tailwind.css`
3. Legacy neutralizado (no usar como fuente de estilos):
- `core/frontend/src/style.css`
- `frontend/src/style.css`

## Orden de decision para estilos nuevos
1. Reusar primero una clase existente `ui-*` o `nw-*`.
2. Si no existe, crear una nueva clase compartida en `src/styles/tailwind.css` dentro de `@layer components`.
3. Solo si la regla es estrictamente local y no reutilizable, dejar estilo en el componente.

## Reglas obligatorias
1. No agregar estilos inline (`style="..."`) para layout visual estable.
2. Evitar `style scoped` para patrones base reutilizables (botones, formularios, tablas, modales, headers, charts).
3. `@apply` solo con utilities de Tailwind o clases definidas en `@layer`:
- Correcto: `@apply mt-6 text-sm text-white/75;`
- Incorrecto: `@apply section ...;` si `section` no existe en Tailwind ni en `@layer`.
4. Mantener naming consistente:
- `ui-*` para primitivas transversales de UI.
- `nw-*` para net-worth.
- `ui-people-*` para dominio people.
5. Si una clase nueva se agrega en `core/frontend`, replicarla en `frontend` dentro de la misma tarea.

## Flujo de trabajo recomendado (nuevo modulo o vista)
1. Implementar base en `core/frontend` cuando sea funcionalidad OSS.
2. Crear/ajustar primitivas en `core/frontend/src/styles/tailwind.css`.
3. Sincronizar a SaaS (`frontend`) respetando contratos de extension.
4. Validar en Docker:
- `docker compose exec frontend npm run lint` (en `core/`)
- `docker compose exec frontend npm run typecheck` (en `core/`)
- `docker compose exec saas_frontend npm run lint` (raiz)
- `docker compose exec saas_frontend npm run typecheck` (raiz)

## Checklist rapido antes de cerrar un cambio UI
1. No hay nuevos `style scoped` para patrones reutilizables.
2. No hay `style="..."` para reglas visuales permanentes.
3. Las clases nuevas estan en `tailwind.css` y con prefijo de dominio correcto.
4. `core` y `saas` quedan alineados para ese cambio.
5. `lint` y `typecheck` pasan en ambos frontends.

## Referencias
1. `docs/frontend/frontend-visual-guide.md`
2. `docs/architecture/core-saas-boundaries.md`
3. `docs/operations/dev-setup.md`

