# Runbook Operativo

## Objetivo
Guía rápida para operar, diagnosticar y recuperar el entorno local de `moneyplanner`.

## Alcance de este documento
1. Arranque, verificación y diagnóstico diario.
2. Playbooks de incidencia.
3. Operaciones seguras.

## Convenciones
1. Stack `core`: carpeta `core/`.
2. Stack `saas`: raíz del repo.
3. Diagnóstico mínimo obligatorio:
- `docker compose ps`
- `docker compose logs --tail 100 <servicio>`
4. Archivos de documentación/configuración: guardar siempre en `UTF-8` (ver `.editorconfig`).

## Arranque estándar
1. Levantar `core`:
- `cd core`
- `docker compose up --build -d`
2. Levantar `saas`:
- `cd ..`
- `docker compose up --build -d`

## Verificación rápida
1. Estado de contenedores:
- `cd core`
- `docker compose ps`
- `cd ..`
- `docker compose ps`
2. Endpoints esperados:
- Core frontend: `http://localhost:5173`
- Core backend: `http://localhost:8000`
- SaaS frontend: `http://localhost:5174`
- SaaS backend: `http://localhost:8001`

## Flujo Frontend Core/SaaS (estándar)
Objetivo:
- Mantener `core/frontend` como fuente canónica base y `frontend` como overlay premium sin forks de vistas.

Reglas:
1. Si el cambio es base/reutilizable, se implementa primero en `core/frontend/src`.
2. Si el cambio es premium, se implementa en `frontend/src` usando contratos de extensión (`domains/*/extensions.ts`) en lugar de copiar vistas completas.
3. Los archivos canónicos del frontend se mantienen en `scripts/frontend-sync-manifest.txt`.
4. No editar directamente en SaaS los archivos canónicos del manifest.

Checklist operativo:
1. Implementar en `core/frontend/src` (o en SaaS si es premium puro).
2. Revisar drift:
- `powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1`
3. Si hay drift en archivos canónicos, aplicar sync:
- `powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1 -Apply`
4. Validar frontend en ambos stacks (Docker):
- `cd core`
- `docker compose exec frontend npm run lint`
- `docker compose exec frontend npm run typecheck`
- `cd ..`
- `docker compose exec saas_frontend npm run lint`
- `docker compose exec saas_frontend npm run typecheck`
5. Commits en orden:
- primero commit en `core`,
- luego commit en repo raíz con actualización del submódulo + cambios SaaS/docs.

## Playbooks de incidencia

### 0) Checks fallan tras reiniciar contexto/sesión
Síntoma:
- `eslint: not found`, `prettier: not found`, `No module named ruff` o `No module named mypy`.

Causa común:
- Contenedores desactualizados o dependencias no disponibles dentro del contenedor actual.

Recuperación rápida:
1. Rebuild completo en orden:
- `cd core`
- `docker compose up --build -d`
- `cd ..`
- `docker compose up --build -d`
2. Reinstalar dependencias frontend en contenedores:
- `docker compose exec saas_frontend npm install`
- `cd core`
- `docker compose exec frontend npm install`
3. Reintentar matriz oficial de checks:
- `docs/operations/dev-setup.md` (sección `Chequeos de calidad`).

Nota PowerShell:
- No usar `&&` para encadenar comandos.
- Usar secuencia compatible: `cmd1; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; cmd2`.

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
- `cd core`
- `docker compose logs --tail 100 backend`

Corrección típica:
- `CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174`

Reiniciar backend core:
- `cd core`
- `docker compose up -d --force-recreate backend`

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
- `cd core`
- `docker compose logs --tail 100 frontend`
3. Hard refresh del navegador (`Ctrl+F5`).

### 5) Bloqueos de autenticación por rate limit (`429`)
Síntoma:
- Login/register/refresh/core-link devuelven `429 Too Many Requests`.

Diagnóstico:
1. Revisar logs backend:
- `docker compose logs --tail 200 saas_backend`
- `cd core`
- `docker compose logs --tail 200 backend`
2. Verificar scopes de throttle configurados:
- `THROTTLE_AUTH_LOGIN`
- `THROTTLE_AUTH_REFRESH`
- `THROTTLE_AUTH_REGISTER`
- `THROTTLE_AUTH_CORE_LINK`
- `THROTTLE_PREMIUM_API`

Acción:
1. Ajustar temporalmente límites en `.env` para entorno local.
2. Recrear backend afectado:
- `docker compose up -d --force-recreate saas_backend`
- `cd core`
- `docker compose up -d --force-recreate backend`
3. Confirmar que desaparece el `429` en el flujo objetivo.

### 6) Auditoría de eventos auth/linking
Eventos auditados (logger `auth.audit`):
1. `login` (`success|failed`)
2. `core_account_link` (`success|failed`)
3. `core_account_unlink` (`success`)

Revisión rápida:
1. `docker compose logs --tail 200 saas_backend | findstr auth.audit`
2. `cd core`
3. `docker compose logs --tail 200 backend | findstr auth.audit`

## Apagado
1. Detener `saas`:
- `cd ..`
- `docker compose down`
2. Detener `core`:
- `cd core`
- `docker compose down`

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
- `cd core`
- `docker compose ps`
2. Ver estado completo `saas`:
- `cd ..`
- `docker compose ps`
3. Logs backend core:
- `cd core`
- `docker compose logs --tail 200 backend`
4. Logs backend saas:
- `cd ..`
- `docker compose logs --tail 200 saas_backend`

## Referencias
1. Setup y matriz de calidad: `docs/operations/dev-setup.md`
2. Arquitectura de plataforma: `docs/architecture/architecture.md`
3. Arquitectura funcional: `docs/architecture/product-architecture.md`
4. Recovery plan de datos: `docs/operations/recovery-plan.md`
