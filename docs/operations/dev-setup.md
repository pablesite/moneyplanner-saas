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

Para desarrollo local no es necesario cambiar ningún valor — los defaults de los `.env.example` funcionan tal cual.

## Arranque local
1. `cd core`
2. `docker compose up --build -d`
3. Verificar en `core/` que `backend`, `frontend`, `db` y `fx_sync` estan `Up` con `docker compose ps`
4. `cd ..`
5. `docker compose up --build -d`

## Endpoints locales
1. Core frontend: `http://localhost:5173`
2. Core backend: `http://localhost:8000`
3. SaaS frontend: `http://localhost:5174`
4. SaaS backend: `http://localhost:8001`

## Variables importantes (SaaS backend)
1. `CORE_API_BASE_URL` -> URL publica/interna del backend Core
2. `JWT_*` -> issuer, audience y signing key SaaS
3. `ACCOUNT_LINKING_*` -> configuracion de linking, si aplica

## Diagnostico estandar
1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`
3. Diagnostico profundo:
   - `docker compose ps -a`
   - `docker compose logs --tail 200 <service>`

En `core/`, `fx_sync` debe aparecer levantado porque mantiene el historico de FX usado por patrimonio.

## Problemas frecuentes
1. Frontend no refresca -> recarga dura y revisar logs del frontend.
2. Error CORS -> revisar `CORS_ALLOWED_ORIGINS`.
3. Error SaaS al crear usuario/member -> revisar `CORE_API_BASE_URL` y conectividad SaaS -> Core.
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
