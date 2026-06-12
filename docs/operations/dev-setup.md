# Desarrollo local integrado en WSL

## Objetivo

Este documento describe el flujo canonico de desarrollo local para este repo `moneyplanner-saas`
cuando `./core` se usa como submodulo Git y ambos stacks se levantan juntos desde la raiz.

Para el modo standalone del producto open core, ver
`core/docs/operations/dev-setup.md`. Ese documento sigue siendo valido para la comunidad que
trabaja solo sobre `./core`, pero no describe el entorno integrado SaaS + Core de este repo.

## Flujo recomendado

1. Copiar el archivo de ejemplo:

```bash
cp .env.dev.example .env.dev
```

2. Levantar todo el entorno integrado desde la raiz:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev up --build -d
```

3. Verificar estado:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev ps
```

## Servicios levantados

1. `core_db`
2. `core_backend`
3. `core_market_data_sync`
4. `core_frontend`
5. `saas_db`
6. `saas_backend`
7. `saas_frontend`

## Endpoints locales

1. Core frontend: `http://localhost:5173`
2. Core backend: `http://localhost:8000`
3. SaaS frontend: `http://localhost:5174`
4. SaaS backend: `http://localhost:8001`

## Variables de desarrollo

La unica fuente principal de configuracion para este entorno integrado es `.env.dev`.

| Variable | Uso | Valor dev recomendado |
| --- | --- | --- |
| `JWT_SIGNING_KEY` | Firma JWT compartida entre SaaS y Core | `dev-only-not-for-production-change-me-please-32b` |
| `CORE_LINKING_SHARED_SECRET` | Secret compartido para linking SaaS/Core | `dev-only-shared-linking-secret-32b-minimum` |
| `CORE_LINKING_TOKEN_MAX_AGE_SECONDS` | Validez del token de linking | `300` |
| `JWT_ISSUER` | Issuer del backend SaaS | `moneyplanner-saas` |
| `JWT_AUDIENCE` | Audience del backend SaaS | `moneyplanner-saas-api` |
| `AUTH_ACCEPT_EXTERNAL_TOKENS` | Permite a Core aceptar JWTs emitidos por SaaS | `1` |
| `EXTERNAL_JWT_ISSUER` | Issuer externo aceptado por Core | `moneyplanner-saas` |
| `EXTERNAL_JWT_AUDIENCE` | Audience externa aceptada por Core | `moneyplanner-saas-api` |
| `EXTERNAL_JWT_SIGNING_KEY` | Clave usada por Core para validar JWTs SaaS | Igual que `JWT_SIGNING_KEY` |
| `CORE_DJANGO_SECRET_KEY` | Secret key de Core backend | `dev-only-not-for-production-change-me-please-32b` |
| `CORE_DJANGO_DEBUG` | Debug Core | `1` |
| `CORE_DJANGO_ALLOWED_HOSTS` | Hosts permitidos por Core | `localhost,127.0.0.1,core_backend` |
| `CORE_CORS_ALLOWED_ORIGINS` | Origins permitidos por Core | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174` |
| `CORE_POSTGRES_DB` | Nombre de la BD Core | `core` |
| `CORE_POSTGRES_USER` | Usuario BD Core | `core` |
| `CORE_POSTGRES_PASSWORD` | Password BD Core | `core` |
| `CORE_SEED_CREATE_ADMIN` | Crear admin Core en arranque | `1` |
| `CORE_SEED_ADMIN_USERNAME` | Usuario admin Core | `admin` |
| `CORE_SEED_ADMIN_EMAIL` | Email admin Core | `admin@example.com` |
| `CORE_SEED_ADMIN_PASSWORD` | Password admin Core | `admin` |
| `CORE_SEED_FORCE_ADMIN_PASSWORD` | Forzar password admin Core | `0` |
| `CORE_SEED_CREATE_DEMO` | Cargar demo data Core | `1` |
| `FX_PIVOT` | Divisa pivote market data | `USD` |
| `FX_SYNC_ENABLED` | Worker de market data | `1` |
| `FX_SYNC_QUOTE_CURRENCY` | Divisa cotizada del sync FX | `EUR` |
| `FX_SYNC_INTERVAL_SECONDS` | Intervalo de sync market data | `86400` |
| `SAAS_DJANGO_SECRET_KEY` | Secret key de SaaS backend | `dev-only-not-for-production-change-me-please-32b` |
| `SAAS_DJANGO_DEBUG` | Debug SaaS | `1` |
| `SAAS_DJANGO_ALLOWED_HOSTS` | Hosts permitidos por SaaS | `localhost,127.0.0.1,saas_backend` |
| `SAAS_CORS_ALLOWED_ORIGINS` | Origins permitidos por SaaS | `http://localhost:5174,http://127.0.0.1:5174` |
| `SAAS_CORS_ALLOW_CREDENTIALS` | Credenciales CORS SaaS | `0` |
| `SAAS_CORS_ALLOW_ALL_ORIGINS` | Origins abiertos en SaaS | `0` |
| `CORE_API_BASE_URL` | URL interna Core usada por SaaS backend | `http://core_backend:8000` |
| `CORE_API_HOST_HEADER` | Host header forzado hacia Core | vacio |
| `CORE_API_X_FORWARDED_PROTO` | `X-Forwarded-Proto` forzado hacia Core | vacio |
| `CORE_BOOTSTRAP_TIMEOUT_SECONDS` | Timeout SaaS -> Core | `5` |
| `SAAS_PUBLIC_REGISTRATION_ENABLED` | Registro publico SaaS | `1` |
| `ACCOUNT_LINKING_ENABLED` | Linking SaaS/Core | `1` |
| `SAAS_POSTGRES_DB` | Nombre de la BD SaaS | `saas` |
| `SAAS_POSTGRES_USER` | Usuario BD SaaS | `saas` |
| `SAAS_POSTGRES_PASSWORD` | Password BD SaaS | `saas` |
| `SAAS_SEED_CREATE_ADMIN` | Crear admin SaaS en arranque | `1` |
| `SAAS_SEED_ADMIN_USERNAME` | Usuario admin SaaS | `admin` |
| `SAAS_SEED_ADMIN_EMAIL` | Email admin SaaS | `admin@example.com` |
| `SAAS_SEED_ADMIN_PASSWORD` | Password admin SaaS | `admin` |
| `SAAS_SEED_FORCE_ADMIN_PASSWORD` | Forzar password admin SaaS | `0` |
| `CORE_FRONTEND_VITE_API_BASE_URL` | API usada por frontend Core | `http://127.0.0.1:8000` |
| `CORE_FRONTEND_VITE_CORE_API_BASE_URL` | Override API Core frontend | `http://127.0.0.1:8000` |
| `SAAS_FRONTEND_VITE_API_BASE_URL` | API usada por frontend SaaS | `http://127.0.0.1:8001` |
| `SAAS_FRONTEND_VITE_CORE_API_BASE_URL` | API Core usada por frontend SaaS | `http://127.0.0.1:8000` |
| `FRONTEND_USE_POLLING` | Polling para hot reload en WSL si hace falta | `false` |
| `FRONTEND_POLLING_INTERVAL` | Intervalo de polling frontend | `300` |
| `PIONEX_API_KEY` | Integracion broker Core | vacio |
| `PIONEX_API_SECRET` | Integracion broker Core | vacio |
| `BINANCE_API_KEY` | Integracion broker Core | vacio |
| `BINANCE_API_SECRET` | Integracion broker Core | vacio |
| `BROKER_ENCRYPTION_KEY` | Cifrado credenciales broker Core | vacio |

## Volumenes reutilizados

El entorno integrado reutiliza explicitamente los volumenes existentes del flujo standalone
anterior. No crea nuevas bases de datos por defecto.

1. Core DB: `moneyplanner-core_core_postgres_data`
2. SaaS DB: `moneyplanner-saas_saas_postgres_data`

Esto preserva historico local, movimientos reales, sincronizacion FX e indices ya persistidos.

## Comunicacion interna

En este modo integrado no se usa `host.docker.internal`.

La comunicacion backend a backend queda asi:

1. `saas_backend` -> `CORE_API_BASE_URL=http://core_backend:8000`
2. `CORE_API_HOST_HEADER=localhost`
3. `CORE_API_X_FORWARDED_PROTO=`

## Cuando cambias `.env.dev`

Un `docker restart` no recarga variables. Hay que recrear los servicios sin borrar volumenes:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --force-recreate
```

## Diagnostico estandar

1. `docker compose -f docker-compose.dev.yml --env-file .env.dev ps`
2. `docker compose -f docker-compose.dev.yml --env-file .env.dev logs --tail 100 <service>`
3. Diagnostico mas profundo:
   - `docker compose -f docker-compose.dev.yml --env-file .env.dev ps -a`
   - `docker compose -f docker-compose.dev.yml --env-file .env.dev logs --tail 200 <service>`

## Operacion segura

1. No borrar volumenes.
2. No usar `docker compose down -v` salvo peticion explicita.
3. No eliminar contenedores ni volumenes antiguos sin validarlo antes.
4. Ejecutar calidad y tests dentro de Docker.

## Calidad en Docker

### SaaS backend

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend ruff check .
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend ruff format --check .
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend mypy .
```

### SaaS frontend

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
```

### Core backend

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec core_backend ruff check .
docker compose -f docker-compose.dev.yml --env-file .env.dev exec core_backend ruff format --check .
docker compose -f docker-compose.dev.yml --env-file .env.dev exec core_backend mypy .
```

### Core frontend

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec core_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec core_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec core_frontend npm run typecheck
```

## Tests minimos actuales

1. SaaS backend:
   `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_backend python manage.py test saas_access`
2. Core backend:
   `docker compose -f docker-compose.dev.yml --env-file .env.dev exec core_backend python manage.py test accounting accounts budget memberships net_worth core`

## Problemas frecuentes

1. SaaS no puede bootstrapear Core:
   - revisar `CORE_API_BASE_URL`
   - revisar que `core_backend` este `Up`
   - revisar logs de `saas_backend` y `core_backend`
2. Error CORS:
   - revisar `CORE_CORS_ALLOWED_ORIGINS` o `SAAS_CORS_ALLOWED_ORIGINS`
3. Frontend no refresca en WSL:
   - poner `FRONTEND_USE_POLLING=true` en `.env.dev`
   - recrear `core_frontend` y `saas_frontend`
4. Auth/linking falla:
   - revisar que `JWT_SIGNING_KEY`, `EXTERNAL_JWT_*` y `CORE_LINKING_SHARED_SECRET`
     esten alineados
