#!/usr/bin/env bash

set -euo pipefail

if [[ ! -f ".env.dev" ]]; then
  echo ".env.dev not found in repo root. Copy .env.dev.example first." >&2
  exit 1
fi

DUMP_DIR="${1:-}"
if [[ -z "${DUMP_DIR}" ]]; then
  DUMP_DIR="$(find backups/prod-refresh -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort | tail -n 1 || true)"
fi

if [[ -z "${DUMP_DIR}" || ! -d "${DUMP_DIR}" ]]; then
  echo "No dump directory found. Pass one explicitly, for example:" >&2
  echo "  ./scripts/dev-restore-prod-refresh.sh backups/prod-refresh/20260613_230000" >&2
  exit 1
fi

CORE_DUMP="${DUMP_DIR}/core_db_for_dev_refresh.dump"
SAAS_DUMP="${DUMP_DIR}/saas_db_for_dev_refresh.dump"

if [[ ! -f "${CORE_DUMP}" || ! -f "${SAAS_DUMP}" ]]; then
  echo "Expected dump files not found in ${DUMP_DIR}" >&2
  exit 1
fi

echo "Stopping local backend services"
docker compose -f docker-compose.dev.yml --env-file .env.dev stop saas_backend core_backend core_market_data_sync

echo "Recreating local core database"
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T core_db sh -lc 'dropdb -U "$POSTGRES_USER" --if-exists "$POSTGRES_DB" --force && createdb -U "$POSTGRES_USER" "$POSTGRES_DB"'

echo "Recreating local saas database"
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T saas_db sh -lc 'dropdb -U "$POSTGRES_USER" --if-exists "$POSTGRES_DB" --force && createdb -U "$POSTGRES_USER" "$POSTGRES_DB"'

echo "Restoring core database from ${CORE_DUMP}"
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T core_db sh -lc 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges' < "${CORE_DUMP}"

echo "Restoring saas database from ${SAAS_DUMP}"
docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T saas_db sh -lc 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges' < "${SAAS_DUMP}"

echo "Starting local services again"
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d core_backend core_market_data_sync saas_backend saas_frontend core_frontend

if [[ -n "${LOCAL_SAAS_ADMIN_PASSWORD:-}" || -n "${LOCAL_SAAS_PABLESITE_PASSWORD:-}" ]]; then
  echo "Resetting local SaaS passwords"
  docker compose -f docker-compose.dev.yml --env-file .env.dev exec -T saas_backend python manage.py shell -c "from django.contrib.auth.models import User; pairs = {'admin': '${LOCAL_SAAS_ADMIN_PASSWORD:-}', 'pablesite': '${LOCAL_SAAS_PABLESITE_PASSWORD:-}'}; [u.set_password(password) or u.save(update_fields=['password']) for username, password in pairs.items() if password for u in [User.objects.get(username=username)]]; print('local passwords updated')"
fi

echo
echo "Local refresh completed from ${DUMP_DIR}"
echo "Recommended checks:"
echo "  docker compose -f docker-compose.dev.yml --env-file .env.dev ps"
echo "  login as admin in SaaS"
echo "  login as pablesite in SaaS"
echo "  verify /account, /patrimonio, /presupuesto, /cierre-mensual, /movimientos"
