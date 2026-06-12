# SaaS production deployment - Phase 2: unified production compose and Traefik routing

## Context
Production should be operable from one root compose file. The deployed product needs the SaaS frontend, SaaS backend, SaaS database, Core backend, Core database, and Core market-data sync. The Core frontend is not part of SaaS production.

## Area
`qa`

## Stack
`both`

## Scope
1. In scope: create root `docker-compose.prod.yml`.
2. In scope: define internal networking and external Traefik `proxy` network.
3. In scope: add labels for `moneyplanner.codinglab.es`.
4. In scope: use persistent data paths under `/datos/docker/data/moneyplanner/...`.
5. Out of scope: writing GitHub Actions deploy logic and application hardening flags beyond what compose needs to boot.

## Plan
1. Diagnosis
   - Review current root `docker-compose.dev.yml`, root `docker-compose.prod.yml`, and `core/docker-compose.prod.yml`.
   - Confirm Traefik server pattern: Cloudflare Tunnel -> `localhost:80` -> Traefik -> Docker services on external `proxy` network.
2. Change implementation
   - Add `docker-compose.prod.yml` at repo root.
   - Services: `saas_frontend`, `saas_backend`, `saas_db`, `core_backend`, `core_db`, `core_market_data_sync`.
   - Networks: `moneyplanner-internal` and external `proxy`.
   - Do not include `core_frontend`.
   - Route SaaS API paths to `saas_backend`: `/api/auth`, `/api/admin`, `/api/schema`, `/api/docs`, `/admin`.
   - Route Core product API paths to `core_backend`: `/api/net-worth`, `/api/budget`, `/api/accounting`, `/api/core`, `/api/family-members`, `/api/ownerships`, `/api/ownership-links`.
   - Route all remaining host traffic to `saas_frontend`.
3. Validation
   - Validate compose syntax.
   - Start locally or on the server with a production env file.
   - Verify routing from outside through `https://moneyplanner.codinglab.es`.

## Validation
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod config
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
curl -I https://moneyplanner.codinglab.es/
curl -I https://moneyplanner.codinglab.es/api/auth/mode/
curl -I https://moneyplanner.codinglab.es/api/core/market-data/status/
```

Expected outcome:
1. Compose config renders without errors.
2. All six production services are healthy or running.
3. Root URL serves SaaS frontend.
4. SaaS API routes reach SaaS backend.
5. Core API routes reach Core backend.

## Required Documentation Updates
- [ ] `docs/operations/production-deploy.md` - document compose services, networks, volumes, and Traefik routing.
- [ ] `docs/architecture/saas-core-integration-flow.md` - document same-origin production routing.
- [ ] `docs/architecture/api-registry.md` - document production path ownership.
- [ ] `docs/project-status.md` - update phase status when closed.

## Risks
1. Traefik priority mistakes can send API calls to the frontend fallback; mitigate with explicit priorities and curl checks.
2. Cloudflare DNS/tunnel misconfiguration can look like app downtime; validate DNS before debugging containers.
3. Bind mount paths must match Restic coverage on the server.

## Completion Criteria
- [ ] `docker-compose.prod.yml` exists and excludes Core frontend.
- [ ] Traefik labels route SaaS and Core paths correctly.
- [ ] Cloudflare CNAME for `moneyplanner.codinglab.es` points to the tunnel.
- [ ] Validation commands pass from outside the LAN.
- [ ] Required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created with Conventional Commit.
