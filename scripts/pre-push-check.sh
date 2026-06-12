#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_ARGS=(-f docker-compose.dev.yml --env-file .env.dev)

required_services=(
  core_db
  core_backend
  core_market_data_sync
  core_frontend
  saas_db
  saas_backend
  saas_frontend
)

run_compose() {
  docker compose "${COMPOSE_ARGS[@]}" "$@"
}

step() {
  printf '\n[%s] %s\n' "$1" "$2"
}

require_file() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    echo "Missing required file: $path" >&2
    exit 1
  fi
}

require_running_service() {
  local service="$1"
  local status
  status="$(run_compose ps --status running --services | grep -Fx "$service" || true)"
  if [[ -z "$status" ]]; then
    echo "Required service is not running: $service" >&2
    echo "Start the integrated stack first with:" >&2
    echo "  docker compose -f docker-compose.dev.yml --env-file .env.dev up --build -d" >&2
    exit 1
  fi
}

run_exec() {
  local label="$1"
  shift
  step RUN "$label"
  run_compose exec -T "$@"
}

main() {
  cd "$ROOT_DIR"

  require_file ".env.dev"
  require_file "docker-compose.dev.yml"

  step CHECK "Verifying integrated dev services are running"
  for service in "${required_services[@]}"; do
    require_running_service "$service"
  done

  step CHECK "SaaS quality"
  run_exec "saas_backend ruff check" saas_backend ruff check .
  run_exec "saas_backend ruff format --check" saas_backend ruff format --check .
  run_exec "saas_backend mypy" saas_backend mypy .
  run_exec "saas_frontend lint" saas_frontend npm run lint
  run_exec "saas_frontend format:check" saas_frontend npm run format:check
  run_exec "saas_frontend typecheck" saas_frontend npm run typecheck

  step CHECK "Core quality"
  run_exec "core_backend ruff check" core_backend ruff check .
  run_exec "core_backend ruff format --check" core_backend ruff format --check .
  run_exec "core_backend mypy" core_backend mypy .
  run_exec "core_frontend lint" core_frontend npm run lint
  run_exec "core_frontend format:check" core_frontend npm run format:check
  run_exec "core_frontend typecheck" core_frontend npm run typecheck

  step CHECK "SaaS tests (CI-like auth/linking flags)"
  run_exec \
    "saas_backend test saas_access" \
    -e ACCOUNT_LINKING_ENABLED=0 \
    -e CORE_LINKING_SHARED_SECRET= \
    saas_backend \
    python manage.py test saas_access
  run_exec \
    "saas_frontend unit test BudgetDashboardView" \
    saas_frontend \
    npm run test:unit -- src/views/__tests__/BudgetDashboardView.spec.ts

  step CHECK "Core tests (CI-like auth/linking flags)"
  run_exec \
    "core_backend test accounts budget memberships net_worth core" \
    -e AUTH_ACCEPT_EXTERNAL_TOKENS=0 \
    -e CORE_LINKING_SHARED_SECRET= \
    core_backend \
    python manage.py test accounts budget memberships net_worth core
  run_exec "core_frontend test:coverage" core_frontend npm run test:coverage

  step OK "Pre-push integrated validation passed"
}

main "$@"
