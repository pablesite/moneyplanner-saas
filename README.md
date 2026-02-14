# moneyplanner-saas

Repositorio privado para la version SaaS.

## Estructura
- `core/`: submodulo con el producto OSS.
- `backend/`: backend Django del SaaS.
- `frontend/`: frontend Vue del SaaS.

## Primeros pasos

1. Clona el repo y actualiza submodulos:

```bash
git clone <REPO_URL>
cd moneyplanner
git submodule update --init --recursive
```

2. Arranca el core desde el submodulo:

```bash
cd core
docker compose up --build -d
```

3. Arranca el SaaS (backend + DB + frontend):

```bash
cd ..
docker compose up --build -d
```

- API SaaS: `http://localhost:8001`
- Docs: `http://localhost:8001/api/docs/`
- Frontend SaaS: `http://localhost:5174`
- Postgres SaaS: `localhost:5433`

## Notas
- El core vive en `core/` como submodulo.
- Cualquier codigo SaaS privado debe vivir fuera de `core/`.

## Arquitectura
- Roadmap global de producto: `docs/roadmap.md`.
- Contrato de limites `core` (OSS) vs `saas` (premium): `docs/architecture.md`.
- Roadmap actual de refactor (V2): `docs/roadmap-02-release.md`.
- Roadmap historico inicial (V1, completado): `docs/roadmap-01-core-saas.md`.
