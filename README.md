# MoneyPlanner SaaS (privado)

Repositorio privado del SaaS de MoneyPlanner.

## Que hay aqui
1. `core/`: repo OSS (submodulo) con la base funcional.
2. `backend/`: backend SaaS (auth, RBAC, suscripcion trial, admin SaaS, linking con Core).
3. `frontend/`: frontend SaaS.
4. `docs/`: documentacion operativa y de producto del SaaS.

## Modelo actual (importante)
1. Todo lo que es dominio Core (patrimonio, presupuesto, guia, familia/titularidad, etc.) se gestiona en `core`.
2. El backend SaaS solo gestiona extras SaaS (`saas_access`: auth/rbac/suscripcion/admin/linking).
3. En produccion SaaS se despliegan dos backends:
   - `core/backend`
   - `backend/` (SaaS)

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
5. Docs API SaaS: `http://localhost:8001/api/docs/`

## Documentacion util
1. Indice SaaS: `docs/README.md`
2. Setup y calidad: `docs/operations/dev-setup.md`
3. Arquitectura actual: `docs/architecture/architecture.md`
4. Roadmap actual: `docs/roadmap/roadmap.md`
5. Checklist de consolidacion/piloto: `docs/roadmap/core-v0-consolidation-parity-checklist.md`
6. Guia visual frontend: `docs/frontend/frontend-visual-guide.md`
7. Modelos de scoring: `docs/scoring/README.md`

## Version
- SaaS: `VERSION`
- Core: `core/VERSION`
