# Setup de desarrollo (SaaS + Core)

## Arranque local (orden)
1. `cd core`
2. `docker compose up --build -d`
3. `cd ..`
4. `docker compose up --build -d`

## Endpoints locales
1. Core frontend: `http://localhost:5173`
2. Core backend: `http://localhost:8000`
3. SaaS frontend: `http://localhost:5174`
4. SaaS backend: `http://localhost:8001`

## Variables importantes (SaaS backend)
1. `CORE_API_BASE_URL` -> URL pública/interna del backend Core
2. `JWT_*` (issuer/audience/signing key SaaS)
3. `ACCOUNT_LINKING_*` (si usas linking)

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

## Tests mínimos actuales
1. SaaS backend: `docker compose exec saas_backend python manage.py test saas_access`
2. Core backend: tests por dominio (según avance)
