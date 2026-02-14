# Setup de Desarrollo

## Objetivo
Levantar entorno local completo (`core` + `saas`) de forma reproducible.

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

## Arranque estándar (obligatorio)
1. Levantar `core` primero:
```bash
cd core
docker compose up --build -d
```

2. Levantar `saas` después:
```bash
cd ..
docker compose up --build -d
```

## Verificación rápida
1. Estado de contenedores:
```bash
cd core && docker compose ps
cd .. && docker compose ps
```

2. Endpoints esperados:
- Core frontend: `http://localhost:5173`
- Core backend: `http://localhost:8000`
- SaaS frontend: `http://localhost:5174`
- SaaS backend: `http://localhost:8001`
- SaaS docs: `http://localhost:8001/api/docs/`

## Diagnóstico básico
1. Core:
```bash
cd core
docker compose ps
docker compose logs --tail 100 backend
```

2. SaaS:
```bash
cd ..
docker compose ps
docker compose logs --tail 100 saas_backend
```

## Problemas frecuentes
Para incidencias operativas y playbooks detallados (CORS, backend caído, auth DB, colisiones de puertos), usar:
- `docs/runbook.md`

## Apagado
1. Detener `saas`:
```bash
cd ..
docker compose down
```

2. Detener `core`:
```bash
cd core
docker compose down
```

Nota:
- No usar `docker compose down -v` salvo autorización explícita (no borrar volúmenes DB).


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
1. Backend SaaS:
```bash
cd backend
ruff check .
ruff format --check .
mypy .
```

2. Backend Core:
```bash
cd core/backend
ruff check .
ruff format --check .
mypy .
```

3. Frontend SaaS:
```bash
cd frontend
npm run lint
npm run format:check
npm run typecheck
```

4. Frontend Core:
```bash
cd core/frontend
npm run lint
npm run format:check
npm run typecheck
```

5. Hooks pre-commit:
```bash
pre-commit install
pre-commit run --all-files
```

CI configurado:
1. SaaS: `.github/workflows/quality-saas.yml`
2. Core: `core/.github/workflows/quality-core.yml`
3. Convenciones de calidad: `docs/code-quality-conventions.md`

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
1. Runbook operativo: `docs/runbook.md`
2. Contrato `core` vs `saas`: `docs/architecture.md`
3. Arquitectura funcional: `docs/product-architecture.md`
4. Reglas de colaboración: `AGENTS.md`






