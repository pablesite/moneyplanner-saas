# moneyplanner-saas

Repositorio privado para la versión SaaS.

## Primeros pasos

1. Clona el repo y actualiza submódulos:

```bash
git clone <REPO_URL>
cd moneyplanner
git submodule update --init --recursive
```

2. Arranca el core desde el submódulo:

```bash
cd core
docker compose up --build
```

## Notas
- El core vive en `core/` como submódulo.
- Cualquier código SaaS privado debe vivir fuera de `core/`.
