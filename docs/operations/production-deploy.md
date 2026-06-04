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

## Routing Contract
Public origin: `https://moneyplanner.codinglab.es`.

The SaaS frontend should be built with same-origin API bases:

```bash
VITE_API_BASE_URL=""
VITE_CORE_API_BASE_URL=""
```

Traefik owns path routing:
1. SaaS backend: `/api/auth`, `/api/admin`, `/api/schema`, `/api/docs`, `/admin`.
2. Core backend: `/api/net-worth`, `/api/budget`, `/api/accounting`, `/api/core`, `/api/family-members`, `/api/ownerships`, `/api/ownership-links`.
3. SaaS frontend: all remaining paths for SPA fallback.

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

Production Django defaults:
1. `DJANGO_DEBUG=0`
2. `DJANGO_ALLOWED_HOSTS=moneyplanner.codinglab.es`
3. `CORS_ALLOWED_ORIGINS=https://moneyplanner.codinglab.es`
4. Secure cookie and proxy SSL settings must be enabled in the production hardening phase.

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

Remote deploy command:

```bash
cd "$DEPLOY_PATH"
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --remove-orphans
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
```

## Manual Deploy
Use this before CI/CD is trusted:

```bash
cd /datos/docker/apps/moneyplanner
docker compose -f docker-compose.prod.yml --env-file .env.prod config
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --remove-orphans
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
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
2. Update `.env.prod` or compose image tags to those SHAs.
3. Run:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --remove-orphans
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
```

Database migrations are the main rollback risk. If a deployment includes migrations, document the forward-only recovery path before applying it.

## Restore Notes
Restic is the authoritative backup mechanism on the server. Before production launch, verify:
1. `/datos/docker/data/moneyplanner/saas-db` is included.
2. `/datos/docker/data/moneyplanner/core-db` is included.
3. `/datos/docker/apps/moneyplanner/docker-compose.prod.yml` is included.
4. `/datos/docker/apps/moneyplanner/.env.prod` handling is understood and secure.

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
