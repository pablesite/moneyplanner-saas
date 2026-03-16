# MoneyPlanner SaaS

Private SaaS repository for MoneyPlanner.

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

## Local Startup Order
1. `cd core`
2. `docker compose up --build -d`
3. Verificar en `core/` que `backend`, `frontend`, `db` y `fx_sync` estan `Up` con `docker compose ps`
4. `cd ..`
5. `docker compose up --build -d`

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

## Version
1. SaaS: `VERSION`
2. Core: `core/VERSION`
