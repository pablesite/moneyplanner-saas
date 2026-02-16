# Setup de Desarrollo

## Objetivo
Levantar entorno local completo (`core` + `saas`) de forma reproducible y dejar lista la validación de calidad en Docker.

## Alcance de este documento
1. Preparación inicial de entorno.
2. Variables recomendadas.
3. Matriz oficial de checks/tests en contenedores.

## Requisitos
1. Docker Desktop en ejecución.
2. Git con submódulos habilitados.

## Estructura del repositorio
1. `core/`: producto OSS (submódulo).
2. `backend/`: backend SaaS.
3. `frontend/`: frontend SaaS.

## Preparación inicial
1. Clonar e inicializar submódulos:
```bash
git clone <REPO_URL>
cd moneyplanner
git submodule update --init --recursive
```

2. Verificar archivos de entorno mínimos:
- `core/backend/.env`
- `backend/.env`
- `frontend/.env`

## Valores recomendados de entorno
### Core (`core/backend/.env`)
Campos críticos:
```env
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

DB_NAME=core
DB_USER=core
DB_PASSWORD=core
DB_HOST=db
DB_PORT=5432
```

### SaaS (`backend/.env`)
- Debe apuntar a la DB SaaS interna del compose (host de servicio DB).
- Mantener credenciales coherentes con `docker-compose.yml` de raíz (`saas/saas/saas`).

### SaaS Frontend (`frontend/.env`)
- Verificar base URL hacia backend SaaS (`http://localhost:8001`) según variables del frontend.

## Operación diaria (fuente canónica)
Para arranque, verificación, diagnóstico, playbooks de incidencia, apagado seguro y flujo frontend `core` -> `saas`, usar:
1. `docs/operations/runbook.md`
2. Fronteras `core`/`saas`: `docs/architecture/core-saas-boundaries.md`
3. Flujo CSS frontend: `docs/frontend/frontend-css-workflow.md`

## Script rápido de operación
También puedes usar el wrapper de comandos:

```powershell
.\scripts\dev.ps1 up-core
.\scripts\dev.ps1 up-saas
.\scripts\dev.ps1 up-all
.\scripts\dev.ps1 ps
.\scripts\dev.ps1 logs core-backend
.\scripts\dev.ps1 logs saas-backend
.\scripts\dev.ps1 health
```

Para ver ayuda:
```powershell
.\scripts\dev.ps1 help
```

## Chequeos de calidad (Roadmap-02 / Fase 3)
Regla obligatoria:
- En este repo, los checks se ejecutan dentro de contenedores Docker, no en el host.

Si acabas de reiniciar contexto/sesión:
1. Ejecutar recuperación rápida del runbook:
- `docs/operations/runbook.md` (Playbook `0) Checks fallan tras reiniciar contexto/sesión`).
2. Asegurar dependencias frontend en contenedores:
```bash
docker compose exec saas_frontend npm install
cd core
docker compose exec frontend npm install
```

1. Backend SaaS (en Docker):
```bash
docker compose exec saas_backend python -m ruff check .
docker compose exec saas_backend python -m ruff format --check .
docker compose exec saas_backend python -m mypy .
```

2. Backend Core (en Docker):
```bash
cd core
docker compose exec backend python -m ruff check .
docker compose exec backend python -m ruff format --check .
docker compose exec backend python -m mypy .
```

3. Frontend SaaS (en Docker):
```bash
docker compose exec saas_frontend npm run lint
docker compose exec saas_frontend npm run format:check
docker compose exec saas_frontend npm run typecheck
```

4. Frontend Core (en Docker):
```bash
cd core
docker compose exec frontend npm run lint
docker compose exec frontend npm run format:check
docker compose exec frontend npm run typecheck
```

5. Hooks pre-commit:
```bash
pre-commit install
pre-commit run --all-files
```

CI configurado:
1. SaaS: `.github/workflows/quality-saas.yml`
2. Core: `core/.github/workflows/quality-core.yml`
3. Convenciones de calidad: `docs/standards/code-quality-conventions.md`

## Tests actuales
1. Backend SaaS (dominio memberships, en Docker):
```bash
docker compose exec saas_backend python manage.py test memberships
```
2. Backend Core:
- Existen archivos base de tests (`core/backend/*/tests.py`), pero la cobertura funcional principal sigue concentrada en SaaS por ahora.
3. Frontend SaaS E2E (Playwright, en Docker):
```bash
docker compose exec saas_frontend npx playwright install chromium
docker compose exec saas_frontend npm run test:e2e -- --list
docker compose exec saas_frontend npm run test:e2e -- --project=chromium
# opcional: flujo real (sin mocks) de login/patrimonio en SaaS
docker compose exec saas_frontend sh -lc "E2E_REAL_API=1 npm run test:e2e -- e2e/login-networth-real.spec.ts --project=chromium"
```
4. Frontend Core E2E (Playwright, en Docker):
```bash
cd core
docker compose exec frontend npx playwright install chromium
docker compose exec frontend npm run test:e2e -- --list
docker compose exec frontend npm run test:e2e -- --project=chromium
```

Formato de errores API (Roadmap-02 / Fase 1):
```json
{
  "error": {
    "code": "validation_error",
    "message": "Request failed.",
    "details": {
      "campo": ["motivo"]
    }
  }
}
```

## Referencias
1. Operación y troubleshooting: `docs/operations/runbook.md`
2. Contrato `core` vs `saas`: `docs/architecture/architecture.md`
3. Arquitectura funcional: `docs/architecture/product-architecture.md`
4. Reglas de colaboración: `AGENTS.md`
