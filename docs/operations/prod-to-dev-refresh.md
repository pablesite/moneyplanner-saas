# Refresh de producción a desarrollo

## Objetivo

Mantener el entorno local integrado (`docker-compose.dev.yml`) al día con datos reales de
producción sin convertir local en una fuente de verdad paralela.

Regla operativa:

1. Producción es la fuente de verdad para datos reales.
2. Local es una copia de trabajo desechable.
3. El flujo normal de datos es `producción -> local`.
4. No usar local como paso intermedio habitual para volver a subir datos a producción.

## Cuándo usarlo

1. Antes de una tarea grande sobre datos reales.
2. Después de cambios relevantes en producción que quieras probar en local.
3. Cuando el entorno local haya quedado desfasado respecto al patrimonio, budget o movimientos
   reales.

## Prerrequisitos

1. Acceso SSH desde WSL al alias `codinglab`.
2. Stack local levantado con `.env.dev`.
3. `CORE_SEED_CREATE_DEMO=0` en `.env.dev` para no reinyectar el usuario demo al recrear Core.
4. Duplicar secretos solo en `.env`/`.env.dev`; nunca copiar `.env` de producción a local.

## Flujo recomendado

### 1. Sacar dumps de producción hacia WSL

Desde la raíz del repo en WSL:

```bash
./scripts/pull-prod-dumps.sh
```

El script:

1. Crea dumps `pg_dump -Fc --no-owner --no-privileges` en el servidor.
2. Los deja archivados en `backups/<timestamp>/` del servidor.
3. Copia ambos dumps a `backups/prod-refresh/<timestamp>/` en local.

### 2. Restaurar esos dumps sobre local

Desde la raíz del repo en WSL:

```bash
./scripts/dev-restore-prod-refresh.sh
```

Por defecto restaura el último directorio de `backups/prod-refresh/`.

También puedes pasar uno explícito:

```bash
./scripts/dev-restore-prod-refresh.sh backups/prod-refresh/20260613_230000
```

El script:

1. Para `saas_backend`, `core_backend` y `core_market_data_sync`.
2. Recrea `core_db` y `saas_db`.
3. Restaura Core y SaaS.
4. Vuelve a levantar servicios locales.

### 3. Opcional: reponer passwords locales conocidas

Si no quieres reutilizar en local los hashes que vengan de producción, exporta passwords locales
antes de restaurar:

```bash
export LOCAL_SAAS_ADMIN_PASSWORD='cambia-esto-admin-local'
export LOCAL_SAAS_PABLESITE_PASSWORD='cambia-esto-pablesite-local'
./scripts/dev-restore-prod-refresh.sh
```

El script solo resetea passwords si esas variables están definidas.

## Validación posterior

1. `docker compose -f docker-compose.dev.yml --env-file .env.dev ps`
2. Login como `admin` en SaaS local
3. Login como `pablesite` en SaaS local
4. Revisar `/account`
5. Abrir `/patrimonio`
6. Abrir `/presupuesto`
7. Abrir `/cierre-mensual`
8. Abrir `/movimientos`

## Qué no copiar desde producción

1. `.env` de producción
2. secretos del servidor
3. claves SSH
4. credenciales operativas no necesarias para desarrollo

## Notas

1. El refresh sustituye completamente las BDs locales de Core y SaaS.
2. Los dumps de producción se guardan tanto en el servidor como en `backups/prod-refresh/` local.
3. Si cambias `.env.dev`, recrea servicios con `up -d --force-recreate`; un restart no recarga
   variables.
