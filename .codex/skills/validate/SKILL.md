---
name: validate
description: Run the full quality check cycle (ruff, mypy, eslint, prettier, typecheck) inside Docker for the affected stack. Use after any code change before committing.
---

# Validate

Ejecuta el ciclo completo de calidad dentro de Docker para el stack indicado.

## Uso

`/validate` → pregunta qué stack validar (saas, core, ambos)
`/validate saas` → solo SaaS
`/validate core` → solo Core
`/validate all` → ambos stacks

## Workflow

Determina qué stacks validar según el argumento o los archivos modificados:
- Si hay cambios en `backend/` o `frontend/` → incluir SaaS
- Si hay cambios en `core/backend/` o `core/frontend/` → incluir Core
- Si no hay argumento, revisar `git diff --name-only` para decidir

### SaaS Backend
```bash
docker compose exec saas_backend ruff check .
docker compose exec saas_backend ruff format --check .
docker compose exec saas_backend mypy .
```

### SaaS Frontend
```bash
docker compose exec saas_frontend npm run lint
docker compose exec saas_frontend npm run format:check
docker compose exec saas_frontend npm run typecheck
```

### Core Backend
```bash
docker compose -f core/docker-compose.yml exec backend ruff check .
docker compose -f core/docker-compose.yml exec backend ruff format --check .
docker compose -f core/docker-compose.yml exec backend mypy .
```

### Core Frontend
```bash
docker compose -f core/docker-compose.yml exec frontend npm run lint
docker compose -f core/docker-compose.yml exec frontend npm run format:check
docker compose -f core/docker-compose.yml exec frontend npm run typecheck
```

## Reglas

1. Ejecutar siempre dentro de Docker, nunca en local.
2. Si algún check falla, corregir antes de continuar.
3. Si los contenedores no están corriendo, indicarlo y no dar el check por válido.
4. Reportar el resultado de cada check de forma concisa: ✅ o ❌ con el error relevante.