# Runbook Operativo

## Objetivo
Guía rápida para diagnosticar y recuperar el entorno local de `moneyplanner`.

## Convenciones
1. Stack `core`: carpeta `core/`.
2. Stack `saas`: raíz del repo.
3. Diagnóstico mínimo obligatorio:
- `docker compose ps`
- `docker compose logs --tail 100 <servicio>`

## Arranque estándar
1. Levantar `core`:
`cd core && docker compose up --build -d`
2. Levantar `saas`:
`cd .. && docker compose up --build -d`

## Verificación rápida
1. Estado de contenedores:
- `cd core && docker compose ps`
- `cd .. && docker compose ps`
2. Endpoints esperados:
- Core frontend: `http://localhost:5173`
- Core backend: `http://localhost:8000`
- SaaS frontend: `http://localhost:5174`
- SaaS backend: `http://localhost:8001`

## Playbooks de incidencia

### 0) Checks fallan tras reiniciar contexto/sesión
Síntoma:
- `eslint: not found`, `prettier: not found`, `No module named ruff` o `No module named mypy`.

Causa común:
- Contenedores desactualizados o dependencias no disponibles dentro del contenedor actual.

Recuperación rápida:
1. Rebuild completo en orden:
- `cd core && docker compose up --build -d`
- `cd .. && docker compose up --build -d`
2. Reinstalar dependencias frontend en contenedores:
- `docker compose exec saas_frontend npm install`
- `cd core && docker compose exec frontend npm install`
3. Reintentar checks oficiales (siempre dentro de Docker):
- SaaS frontend: `docker compose exec saas_frontend npm run lint && docker compose exec saas_frontend npm run format:check && docker compose exec saas_frontend npm run typecheck`
- Core frontend: `cd core && docker compose exec frontend npm run lint && docker compose exec frontend npm run format:check && docker compose exec frontend npm run typecheck`
- SaaS backend: `docker compose exec saas_backend python -m ruff check . && docker compose exec saas_backend python -m ruff format --check . && docker compose exec saas_backend python -m mypy .`
- Core backend: `cd core && docker compose exec backend python -m ruff check . && docker compose exec backend python -m ruff format --check . && docker compose exec backend python -m mypy .`

### 1) `core_backend` en `Exited`
Síntoma:
- `core_backend` no aparece `Up` en `core/docker compose ps`.

Diagnóstico:
1. `cd core`
2. `docker compose ps -a`
3. `docker compose logs --tail 200 backend`

Causa común:
- Credenciales DB incorrectas en `core/backend/.env` (ejemplo: quedó `saas` en vez de `core`).

Corrección esperada en `core/backend/.env`:
- `DB_NAME=core`
- `DB_USER=core`
- `DB_PASSWORD=core`
- `DB_HOST=db`
- `DB_PORT=5432`

Aplicar y recrear backend:
- `docker compose up -d --force-recreate backend`

### 2) Error CORS desde `http://localhost:5174` a `http://localhost:8000`
Síntoma:
- En navegador: preflight bloqueado, sin `Access-Control-Allow-Origin`.

Diagnóstico:
1. Revisar `core/backend/.env`:
- `CORS_ALLOWED_ORIGINS`
2. Ver logs:
- `cd core && docker compose logs --tail 100 backend`

Corrección típica:
- `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174`

Reiniciar backend core:
- `cd core && docker compose up -d --force-recreate backend`

Verificación preflight (ejemplo):
```bash
curl -i -X OPTIONS "http://localhost:8000/api/net-worth/liabilities/" \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: content-type"
```
Debe incluir:
- `access-control-allow-origin: http://localhost:5174`

### 3) Servicio `Up` pero endpoint no responde
Diagnóstico:
1. `docker compose ps`
2. `docker compose logs --tail 200 <servicio>`
3. Verificar puerto ocupado por otro proceso/stack.

Acción:
1. Reintentar recreación del servicio:
- `docker compose up -d --force-recreate <servicio>`
2. Si persiste, revisar `.env` y colisiones de puertos.

### 4) Frontend no refleja cambios
Diagnóstico/acción:
1. Confirmar contenedor frontend `Up`.
2. Revisar logs frontend:
- `docker compose logs --tail 100 saas_frontend`
- `cd core && docker compose logs --tail 100 frontend`
3. Hard refresh del navegador (`Ctrl+F5`).

## Operaciones seguras
1. Permitido para diagnóstico:
- `docker compose ps`
- `docker compose ps -a`
- `docker compose logs --tail N <servicio>`
2. Evitar por defecto:
- `docker compose down -v`
3. Regla del proyecto:
- No borrar volúmenes de base de datos sin autorización explícita.

## Comandos útiles
1. Ver estado completo `core`:
- `cd core && docker compose ps`
2. Ver estado completo `saas`:
- `cd .. && docker compose ps`
3. Logs backend core:
- `cd core && docker compose logs --tail 200 backend`
4. Logs backend saas:
- `cd .. && docker compose logs --tail 200 saas_backend`

## Referencias
1. Arquitectura de plataforma: `docs/architecture.md`
2. Arquitectura funcional: `docs/product-architecture.md`
3. Recovery plan de datos: `docs/recovery-plan.md`
