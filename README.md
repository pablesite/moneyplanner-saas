# moneyplanner-saas

Private repository for the SaaS product.

## Version
- Current SaaS version is defined in `VERSION`.
- Public releases are tagged as `vX.Y.Z` in Git.

## Structure
- `core/`: submodule with the OSS base product.
- `backend/`: SaaS Django backend.
- `frontend/`: SaaS Vue frontend.

## First Steps
1. Clone the repository and initialize submodules:

```bash
git clone <REPO_URL>
cd moneyplanner
git submodule update --init --recursive
```

2. Start core services from the submodule:

```bash
cd core
docker compose up --build -d
```

3. Start SaaS services (backend + DB + frontend):

```bash
cd ..
docker compose up --build -d
```

- SaaS API: `http://localhost:8001`
- API docs: `http://localhost:8001/api/docs/`
- SaaS frontend: `http://localhost:5174`
- SaaS Postgres: `localhost:5433`

## Notes
- Core lives in `core/` as a submodule.
- SaaS-only private code must stay outside `core/`.

## Frontend Sync core -> saas
- Canonical source for base frontend: `core/frontend/src`.
- Sync manifest: `scripts/frontend-sync-manifest.txt`.
- Check drift:

```bash
powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1
```

- Apply sync:

```bash
powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1 -Apply
```

## Architecture
- Global product roadmap: `docs/roadmap/roadmap.md`.
- Platform boundaries contract: `docs/architecture/architecture.md`.
- Current refactor roadmap (Milestone 04): `docs/roadmap/roadmap-milestone-04-refactor.md`.
- Core/SaaS split roadmap (Milestone 02): `docs/roadmap/roadmap-milestone-02-core-saas.md`.

