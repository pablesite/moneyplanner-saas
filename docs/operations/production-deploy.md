# Production Deployment (SaaS)

## Objective
Run the private MoneyPlanner SaaS production deployment at `https://moneyplanner.codinglab.es`.

Production serves the SaaS frontend as the only public UI. The SaaS backend handles access, admin, subscription state, and platform operations. The Core backend remains the source of truth for product APIs consumed by the SaaS frontend and by SaaS backend bootstrap flows. The Core frontend is not deployed for the SaaS product.

## Target Topology
1. Cloudflare DNS exposes `moneyplanner.codinglab.es`.
2. Cloudflare Tunnel forwards traffic to `localhost:80` on the server.
3. Traefik receives traffic on `localhost:80`.
4. Traefik routes to Docker services attached to the external `proxy` network.
5. MoneyPlanner services communicate through an internal Docker network.

Production services:
1. `saas_frontend` - nginx static build for the private SaaS UI.
2. `saas_backend` - Django SaaS API served by Gunicorn.
3. `saas_db` - PostgreSQL for SaaS access/platform data.
4. `core_backend` - Django Core API served by Gunicorn.
5. `core_db` - PostgreSQL for Core product data.
6. `core_market_data_sync` - Core market data worker.

Not deployed:
1. `core_frontend` - reserved for the public/self-hosted Core product.

## Phase 1 Production Images
Phase 1 leaves the production image artifacts in-repo, ready for the unified compose of phase 2:

1. SaaS backend image:
   - `backend/Dockerfile.prod`
   - `backend/entrypoint.prod.sh`
   - Startup flow: `python manage.py migrate --noinput` -> `python manage.py collectstatic --noinput` -> `gunicorn saas.wsgi:application --bind 0.0.0.0:8000`
   - The entrypoint does not run `seed`; first-deploy seeding stays controlled by production env/compose.
2. SaaS frontend image:
   - `frontend/Dockerfile.prod`
   - `frontend/nginx.prod.conf`
   - Multi-stage build: Node build stage -> nginx runtime stage
   - Runtime serves only the static `dist/` bundle with SPA fallback and basic response headers.

## Phase 2 Unified Production Compose
Root production orchestration now lives in `docker-compose.prod.yml`.

Networks:
1. `moneyplanner-internal` - private network for app-to-app and DB traffic.
2. `proxy` - external Traefik network shared with the reverse proxy on the server.

Persistent bind mounts:
1. `${MONEYPLANNER_DATA_ROOT:-/datos/docker/data/moneyplanner}/saas-db`
2. `${MONEYPLANNER_DATA_ROOT:-/datos/docker/data/moneyplanner}/core-db`

Compose services:
1. `saas_frontend` - SaaS nginx static app, attached to `proxy`.
2. `saas_backend` - SaaS Django/Gunicorn API, attached to `proxy` and `moneyplanner-internal`.
3. `saas_db` - PostgreSQL for SaaS data.
4. `core_backend` - Core Django/Gunicorn API, attached to `proxy` and `moneyplanner-internal`.
5. `core_db` - PostgreSQL for Core data.
6. `core_market_data_sync` - Core market-data worker.

The compose file intentionally excludes `core_frontend`.

## Routing Contract
Public origin: `https://moneyplanner.codinglab.es`.

The SaaS frontend should be built with same-origin API bases:

```bash
VITE_API_BASE_URL=""
VITE_CORE_API_BASE_URL=""
```

The SaaS frontend production bundle is expected to preserve empty-string base URLs, so both API clients resolve against the same public origin instead of falling back to localhost defaults.

Traefik owns path routing:
1. SaaS backend: `/api/auth`, `/api/admin`, `/api/schema`, `/api/docs`, `/admin`.
2. Core backend auth subpaths with higher priority: `/api/auth/settings`, `/api/auth/link-token`.
3. Core backend product paths: `/api/net-worth`, `/api/budget`, `/api/accounting`, `/api/core`, `/api/family-members`, `/api/ownerships`, `/api/ownership-links`.
4. SaaS frontend: all remaining paths for SPA fallback.

Use explicit Traefik router priorities so API routes win over the frontend fallback.

## Server Files
Expected server layout:

```text
/datos/docker/apps/moneyplanner/
  docker-compose.prod.yml
  .env.prod

/datos/docker/data/moneyplanner/
  saas-db/
  core-db/
```

The `.env.prod` file must stay outside git. It contains production secrets and deployment-specific values.

Restic already backs up Docker volumes and compose files on the server at 03:00 daily. Keep MoneyPlanner database data under `/datos/docker/data/moneyplanner/...` so it remains covered by that policy.

## Required Production Variables
Shared:
1. `MONEYPLANNER_DOMAIN=moneyplanner.codinglab.es`
2. `JWT_SIGNING_KEY` - long random value, identical for SaaS and Core.

SaaS backend:
1. `SAAS_DJANGO_SECRET_KEY`
2. `SAAS_POSTGRES_DB`
3. `SAAS_POSTGRES_USER`
4. `SAAS_POSTGRES_PASSWORD`
5. `SAAS_PUBLIC_REGISTRATION_ENABLED=0`
6. `SEED_CREATE_ADMIN=1` for first deploy, then set to `0` or keep safe with `SEED_FORCE_ADMIN_PASSWORD=0`.
7. `SEED_ADMIN_USERNAME`
8. `SEED_ADMIN_EMAIL`
9. `SEED_ADMIN_PASSWORD`

Core backend:
1. `CORE_DJANGO_SECRET_KEY`
2. `CORE_POSTGRES_DB`
3. `CORE_POSTGRES_USER`
4. `CORE_POSTGRES_PASSWORD`
5. `FX_SYNC_ENABLED=1`
6. `FX_SYNC_INTERVAL_SECONDS=86400`

Optional linking:
1. `ACCOUNT_LINKING_ENABLED=0` for initial private pilot unless self-hosted-to-cloud linking is actively tested.
2. `CORE_LINKING_SHARED_SECRET` only when account linking is enabled.

Core acceptance of SaaS JWTs:
1. `AUTH_ACCEPT_EXTERNAL_TOKENS=1`
2. `EXTERNAL_JWT_ISSUER=moneyplanner-saas`
3. `EXTERNAL_JWT_AUDIENCE=moneyplanner-saas-api`
4. `EXTERNAL_JWT_SIGNING_KEY=${JWT_SIGNING_KEY}`

Production Django defaults:
1. `DJANGO_DEBUG=0`
2. `DJANGO_ALLOWED_HOSTS=moneyplanner.codinglab.es`
3. `CORS_ALLOWED_ORIGINS=https://moneyplanner.codinglab.es`
4. `CSRF_TRUSTED_ORIGINS=https://moneyplanner.codinglab.es`
5. `USE_X_FORWARDED_HOST=1`
6. `SECURE_PROXY_SSL_HEADER_ENABLED=1`
7. `SECURE_PROXY_SSL_HEADER_NAME=HTTP_X_FORWARDED_PROTO`
8. `SECURE_PROXY_SSL_HEADER_VALUE=https`
9. `SECURE_SSL_REDIRECT=1`
10. `SESSION_COOKIE_SECURE=1`
11. `CSRF_COOKIE_SECURE=1`
12. `SECURE_HSTS_SECONDS=31536000`
13. `SECURE_HSTS_INCLUDE_SUBDOMAINS=1`
14. `SECURE_HSTS_PRELOAD=1`
15. `SECURE_REFERRER_POLICY=strict-origin-when-cross-origin`

Private access policy:
1. Initial production access is admin-controlled only.
2. `POST /api/auth/register/` must return `registration_disabled` while the private pilot lasts.
3. New member onboarding must happen through `POST /api/admin/users/` or the controlled seed admin flow.
4. Keep `SEED_CREATE_ADMIN=1` only for the first deploy or an explicit recovery operation.

## GitHub Deployment Contract
GitHub Actions should:
1. Run SaaS backend and frontend quality checks.
2. Run security checks: gitleaks, CodeQL, dependency audits, and image scan.
3. Build production images.
4. Push images to GHCR.
5. Deploy over SSH to the server.

Required GitHub secrets:
1. `DEPLOY_HOST`
2. `DEPLOY_USER`
3. `DEPLOY_SSH_KEY`
4. `DEPLOY_PATH`
5. `RELEASE_PLEASE_TOKEN` if release-please remains enabled.

Required GitHub variable:
1. `ENABLE_PRODUCTION_DEPLOY=1` only when the production server, tunnel, and DNS are ready to receive automatic deploys. Keep it unset or `0` while phases 2 and 5 are still being validated.

Published GHCR images on `main`:
1. `ghcr.io/pablesite/moneyplanner-saas-backend`
2. `ghcr.io/pablesite/moneyplanner-saas-frontend`
3. `ghcr.io/pablesite/moneyplanner-core-backend`

Tag policy:
1. Every `main` push publishes `sha-${GITHUB_SHA}` and `latest`.
2. Deploys must use the SHA tag, not only `latest`.
3. The workflow uploads a server-side `.env.release` file with the exact image refs used by the last deploy.

Remote deploy command:

```bash
cd "$DEPLOY_PATH"
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release pull
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release up -d --remove-orphans
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release ps
```

Workflow flow on `main`:
1. Run secret scan, dependency audit, backend quality, and frontend quality.
2. Build production images from `backend/Dockerfile.prod`, `frontend/Dockerfile.prod`, and `core/backend/Dockerfile.prod`.
3. Scan built images with Trivy and upload SARIF results.
4. Push GHCR images tagged as `sha-${GITHUB_SHA}` and `latest`.
5. If `ENABLE_PRODUCTION_DEPLOY=1`, copy `docker-compose.prod.yml` to the server, upload `.env.release`, run pull/up over SSH, and execute smoke checks against `https://moneyplanner.codinglab.es`.

## Manual Deploy
Use this before CI/CD is trusted:

```bash
cd /datos/docker/apps/moneyplanner
docker compose -f docker-compose.prod.yml --env-file .env.prod config
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
```

Once GHCR publishing is available in phase 4, the same file should also support pull-based deploys:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release pull
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release up -d --remove-orphans
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release ps
```

## Logs and Diagnosis
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod logs --tail 100 saas_backend
docker compose -f docker-compose.prod.yml --env-file .env.prod logs --tail 100 core_backend
docker compose -f docker-compose.prod.yml --env-file .env.prod logs --tail 100 saas_frontend
docker compose -f docker-compose.prod.yml --env-file .env.prod ps -a
```

Routing checks:

```bash
curl -I https://moneyplanner.codinglab.es/
curl -I https://moneyplanner.codinglab.es/api/auth/mode/
curl -I https://moneyplanner.codinglab.es/api/core/market-data/status/
```

If root works but API paths return the SPA, check Traefik priorities and path rules.

If APIs work internally but not externally, check Cloudflare CNAME and tunnel hostname.

## Rollback
Rollback should use the previous GHCR SHA tag, not only `latest`.

1. Identify the previous known-good image tags from GitHub Actions logs.
2. Update `.env.release` to those SHA-tagged image refs.
3. Run:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release pull
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release up -d --remove-orphans
docker compose -f docker-compose.prod.yml --env-file .env.prod --env-file .env.release ps
```

Database migrations are the main rollback risk. If a deployment includes migrations, document the forward-only recovery path before applying it.

## Restore Notes
Restic is the authoritative backup mechanism on the server. Before production launch, verify:
1. `/datos/docker/data/moneyplanner/saas-db` is included.
2. `/datos/docker/data/moneyplanner/core-db` is included.
3. `/datos/docker/apps/moneyplanner/docker-compose.prod.yml` is included.
4. `/datos/docker/apps/moneyplanner/.env.prod` handling is understood and secure.
5. `/datos/docker/apps/moneyplanner/.env.release` is included or can be reconstructed from GitHub Actions logs.

Perform a restore drill before treating production as durable.

## Production Smoke Checklist
Run after the first deployment and after each deploy until CI/CD smoke is trusted.

1. Open `https://moneyplanner.codinglab.es`.
2. Log in as SaaS admin.
3. Create a `saas_member` from admin operations.
4. Confirm Core bootstrap succeeds.
5. Log in as the created member.
6. Open `/patrimonio`.
7. Open `/presupuesto`.
8. Open `/cierre-mensual`.
9. Open `/movimientos`.
10. Confirm no billing UI is exposed.

API checks:

```bash
curl -I https://moneyplanner.codinglab.es/api/auth/mode/
curl -I https://moneyplanner.codinglab.es/api/core/market-data/status/
```

## Phase Specs
Implementation is intentionally split into task specs:
1. `docs/tasks/production-deployment/phase-1-prod-images/`
2. `docs/tasks/production-deployment/phase-2-prod-compose-traefik/`
3. `docs/tasks/production-deployment/phase-3-security-private-access/`
4. `docs/tasks/production-deployment/phase-4-github-ci-cd/`
5. `docs/tasks/production-deployment/phase-5-production-runbook-smoke/`
