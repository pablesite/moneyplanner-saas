# The Arkenstone SaaS

Private SaaS repository for The Arkenstone.

Current public brand:
1. Product brand: `The Arkenstone`
2. Primary domain: `https://arkenstone.app`

## What Lives Here
1. `core/`: open-source Core repository as submodule
2. `backend/`: SaaS backend for platform features
3. `frontend/`: SaaS frontend
4. `docs/`: canonical SaaS documentation

## SaaS Scope
1. Authentication and account access
2. RBAC and SaaS administration
3. Subscription and trial state
4. SaaS-to-Core linking
5. Cloud operation and managed deployment

## Relationship With Core
1. Core product functionality lives in `core/`.
2. Core documentation is maintained in `core/docs/`.
3. SaaS documentation should reference Core docs instead of duplicating Core product behavior.

## Integrated Local Startup
1. `cp .env.dev.example .env.dev`
2. `docker compose -f docker-compose.dev.yml --env-file .env.dev up --build -d`
3. Verificar estado con:
   `docker compose -f docker-compose.dev.yml --env-file .env.dev ps`

This root repository now uses the integrated WSL flow only.
The standalone Core workflow for community contributors remains documented in
`core/docs/operations/dev-setup.md`.

## Local Endpoints
1. Core frontend: `http://localhost:5173`
2. Core backend: `http://localhost:8000`
3. SaaS frontend: `http://localhost:5174`
4. SaaS backend: `http://localhost:8001`
5. SaaS API docs: `http://localhost:8001/api/docs/`

## Documentation
1. `docs/README.md`
2. `core/README.md`
3. `core/docs/README.md`
4. `docs/operations/dev-setup.md`

## Version
1. SaaS: `VERSION`
2. Core: `core/VERSION`
