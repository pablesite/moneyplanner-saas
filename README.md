# MoneyPlanner SaaS (privado)

Repositorio privado del SaaS de MoneyPlanner.

## Qué hay aquí
1. `core/`: repo OSS (submódulo) con la base funcional.
2. `backend/`: backend SaaS (auth, RBAC, suscripción trial, admin SaaS, linking con Core).
3. `frontend/`: frontend SaaS.
4. `docs/`: documentación operativa y de producto del SaaS.

## Modelo actual (importante)
1. Todo lo que es dominio Core (patrimonio, presupuesto, guía, familia/titularidad, etc.) se gestiona en `core`.
2. El backend SaaS solo gestiona extras SaaS (`saas_access`: auth/rbac/suscripción/admin/linking).
3. En producción SaaS se despliegan dos backends:
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

## Documentación útil
1. Índice SaaS: `docs/README.md`
2. Setup y calidad: `docs/operations/dev-setup.md`
3. Runbook local: `docs/operations/runbook.md`
4. Roadmap actual: `docs/roadmap/roadmap.md`
5. Checklist de consolidación/piloto: `docs/roadmap/core-v0-consolidation-parity-checklist.md`

## Versión
- SaaS: `VERSION`
- Core: `core/VERSION`
