# Desarrollo y operacion local (SaaS + Core)

## Primer arranque: configurar .env

Antes del primer `docker compose up`, crear los archivos `.env` copiando los ejemplos:

```bash
# SaaS backend
cp backend/.env.example backend/.env

# SaaS frontend
cp frontend/.env.example frontend/.env

# Core backend
cp core/backend/.env.example core/backend/.env
```

Para desarrollo local no es necesario cambiar ningun valor si levantas ambos stacks con los ejemplos tal cual. La unica condicion es que el Core que este realmente arrancado tenga estos valores efectivos:

1. `DJANGO_ALLOWED_HOSTS` incluye `host.docker.internal` si SaaS lo alcanza por `http://host.docker.internal:8000`
2. `AUTH_ACCEPT_EXTERNAL_TOKENS=1`
3. `EXTERNAL_JWT_ISSUER`, `EXTERNAL_JWT_AUDIENCE` y `EXTERNAL_JWT_SIGNING_KEY` alineados con el backend SaaS

## Fuente de verdad del entorno Docker

El contenedor usa el `.env` del checkout desde el que fue creado, no el del repo que tengas abierto en el editor.

Ejemplo real de confusion habitual:
1. `moneyplanner-saas/core/` puede existir como submodulo
2. `C:\Users\pablo\Proyectos\moneyplanner-core` puede existir como checkout independiente
3. Si `core_backend` fue creado desde el checkout independiente, cambiar `moneyplanner-saas/core/backend/.env` no cambia nada en el contenedor ya existente

Compruebalo siempre con:

```bash
docker inspect core_backend --format '{{json .Mounts}}'
docker exec core_backend sh -c "env | grep DJANGO_ALLOWED_HOSTS"
```

## Arranque local
1. `cd core`
2. `docker compose up --build -d`
3. Verificar en `core/` que `backend`, `frontend`, `db` y `fx_sync` estan `Up` con `docker compose ps`
4. `cd ..`
5. `docker compose up --build -d`

## Cuando cambias un .env

Un simple `docker restart` no recarga variables de entorno. Hay que recrear el contenedor sin borrar volumenes:

```bash
# Core
cd core
docker compose up -d --force-recreate backend market_data_sync frontend

# SaaS
cd ..
docker compose up -d --force-recreate saas_backend saas_frontend
```

Esto no toca las bases de datos mientras no uses `down -v`.

## Endpoints locales
1. Core frontend: `http://localhost:5173`
2. Core backend: `http://localhost:8000`
3. SaaS frontend: `http://localhost:5174`
4. SaaS backend: `http://localhost:8001`

## Variables importantes (SaaS backend)
1. `CORE_API_BASE_URL` -> URL publica/interna del backend Core
2. `CORE_API_HOST_HEADER` -> host que SaaS fuerza en la llamada server-to-server hacia Core para satisfacer `ALLOWED_HOSTS` en desarrollo local
3. `JWT_*` -> issuer, audience y signing key SaaS
4. `ACCOUNT_LINKING_*` -> configuracion de linking, si aplica

Valores recomendados:

1. Desarrollo local con Core publicado en `localhost:8000`
   - `CORE_API_BASE_URL=http://host.docker.internal:8000`
   - `CORE_API_HOST_HEADER=localhost`
2. Produccion con Core detras del mismo proxy/origen final
   - `CORE_API_BASE_URL=https://tu-dominio-core-o-public-origin`
   - `CORE_API_HOST_HEADER=` (vacio, salvo necesidad explicita del proxy)

## Diagnostico estandar
1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`
3. Diagnostico profundo:
   - `docker compose ps -a`
   - `docker compose logs --tail 200 <service>`

En `core/`, `fx_sync` debe aparecer levantado porque mantiene el historico de FX usado por patrimonio.

## Backup/restore DB Core (comandos simples en cmder)
1. Exportar DB completa:
   - `.\scripts\db-export.cmd`
2. Importar el ultimo dump de `.\backups`:
   - `.\scripts\db-import.cmd`
3. Importar un dump concreto:
   - `.\scripts\db-import.cmd -DumpFile .\backups\core_db_YYYYMMDD_HHMMSS.dump`

Notas:
1. El import crea backup automatico antes de reemplazar (`core_db_pre_import_*.dump`).
2. El import valida el dump con `pg_restore -l` antes de hacer operaciones destructivas.
3. Formato oficial: `.dump` (PostgreSQL custom format).

## Problemas frecuentes
1. Frontend no refresca -> recarga dura y revisar logs del frontend.
2. Error CORS -> revisar `CORS_ALLOWED_ORIGINS`.
3. Error SaaS al crear usuario/member -> revisar `CORE_API_BASE_URL`, `CORE_API_HOST_HEADER` y conectividad SaaS -> Core.
   - En local, si `CORE_API_BASE_URL=http://host.docker.internal:8000`, Core debe incluir `host.docker.internal` en `DJANGO_ALLOWED_HOSTS`.
   - Si acabas de cambiar `.env`, recrea el contenedor: `docker compose up -d --force-recreate ...`
4. Auth/admin SaaS -> revisar `backend/logs/auth_audit.log`.

## Operacion segura
1. No borrar volumenes.
2. No usar `docker compose down -v` salvo peticion explicita.
3. Ejecutar tests y calidad siempre dentro de Docker.
4. En piloto SaaS:
   - usuarios testers en `trial`
   - alta manual desde Admin SaaS si hace falta
   - `family/ownership` se crea en Core automaticamente durante alta/registro

## Calidad (siempre en Docker)
### SaaS backend
```bash
docker compose exec saas_backend ruff check .
docker compose exec saas_backend ruff format --check .
docker compose exec saas_backend mypy .
```

### SaaS frontend
```bash
docker compose exec saas_frontend npm run lint
docker compose exec saas_frontend npm run format:check
docker compose exec saas_frontend npm run typecheck
```

### Core backend
```bash
cd core
docker compose exec backend ruff check .
docker compose exec backend ruff format --check .
docker compose exec backend mypy .
```

### Core frontend
```bash
cd core
docker compose exec frontend npm run lint
docker compose exec frontend npm run format:check
docker compose exec frontend npm run typecheck
```

## Tests minimos actuales
1. SaaS backend: `docker compose exec saas_backend python manage.py test saas_access`
2. Core backend: tests por dominio (segun avance)
