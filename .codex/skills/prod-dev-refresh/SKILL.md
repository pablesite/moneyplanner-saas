---
name: prod-dev-refresh
description: Use when the task involves refreshing local WSL data from production, creating or pulling production dumps, restoring production Core+SaaS data into docker-compose.dev, or validating the safe one-way workflow production -> local.
---

# Prod Dev Refresh

Usa esta skill cuando la tarea sea traer datos reales de producción al entorno local integrado en
WSL o cuando haya que revisar/ejecutar ese workflow.

## Alcance

Esta skill cubre:

1. Crear dumps de producción desde `codinglab`
2. Copiarlos a WSL
3. Restaurarlos en `docker-compose.dev.yml`
4. Reaplicar ajustes locales seguros tras el restore
5. Validar el flujo `producción -> local`

No cubre:

1. Push o despliegues de código
2. Restore `local -> producción` como flujo habitual
3. Borrado de volúmenes

## Regla principal

1. Producción es la fuente de verdad para datos reales.
2. El flujo normal es `producción -> local`.
3. No copiar `.env` de producción a local.
4. No usar `docker compose down -v`.

## Workflow

### 1. Leer primero

Antes de actuar, revisar:

1. `docs/operations/prod-to-dev-refresh.md`
2. `docs/operations/dev-setup.md`
3. `docs/operations/production-deploy.md` si la petición toca también producción

### 2. Para sacar dumps de producción a WSL

Desde la raíz del repo en WSL:

```bash
./scripts/pull-prod-dumps.sh
```

### 3. Para restaurar esos dumps sobre local

Desde la raíz del repo en WSL:

```bash
./scripts/dev-restore-prod-refresh.sh
```

O con directorio explícito:

```bash
./scripts/dev-restore-prod-refresh.sh backups/prod-refresh/<timestamp>
```

### 4. Si el usuario no quiere reutilizar passwords de producción en local

Definir antes:

```bash
export LOCAL_SAAS_ADMIN_PASSWORD='...'
export LOCAL_SAAS_PABLESITE_PASSWORD='...'
```

Y luego ejecutar el restore.

## Validación mínima

Después del refresh:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev ps
```

Y comprobar manualmente:

1. login `admin`
2. login `pablesite`
3. `/account`
4. `/patrimonio`
5. `/presupuesto`
6. `/cierre-mensual`
7. `/movimientos`

## Notas

1. `CORE_SEED_CREATE_DEMO` debe permanecer en `0` en `.env.dev` si no quieres que reaparezca el
   usuario demo al recrear Core.
2. Si un restore local falla, diagnosticar con `docker compose ... logs --tail 100 <service>`.
3. Si la petición toca además importar a producción, esta skill ayuda como contexto, pero el flujo
   de despliegue/restore productivo debe seguir también `publish-flow` cuando aplique.
