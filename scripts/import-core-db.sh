#!/usr/bin/env bash
# Import a SQL dump into Core PostgreSQL (full replace).
# Usage:
#   ./scripts/import-core-db.sh ./backups/core_db_20260331_120000.sql
#   ./scripts/import-core-db.sh ./backups/core_db.sql --force

set -euo pipefail

DUMP_FILE="${1:-}"
FORCE_FLAG="${2:-}"

if [[ -z "$DUMP_FILE" ]]; then
  echo "Usage: ./scripts/import-core-db.sh <path-to-dump.sql> [--force]"
  exit 1
fi

if [[ ! -f "$DUMP_FILE" ]]; then
  echo "File not found: $DUMP_FILE" >&2
  exit 1
fi

CONTAINER="core_db"
DB="${POSTGRES_DB:-core}"
USER="${POSTGRES_USER:-core}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
SAFETY_DIR="./backups"
SAFETY_FILE="${SAFETY_DIR}/core_db_pre_import_${TIMESTAMP}.sql"
TMP_IMPORT="/tmp/core_db_import.sql"
TMP_SAFETY="/tmp/core_db_pre_import_${TIMESTAMP}.sql"

if ! docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null | grep -q true; then
  echo "Container '$CONTAINER' is not running. Start it with: docker compose -f core/docker-compose.yml up -d db" >&2
  exit 1
fi

if [[ "$FORCE_FLAG" != "--force" ]]; then
  echo "This will REPLACE database '$DB' in container '$CONTAINER'."
  read -r -p "Type REPLACE to continue: " CONFIRM
  if [[ "$CONFIRM" != "REPLACE" ]]; then
    echo "Import cancelled."
    exit 0
  fi
fi

mkdir -p "$SAFETY_DIR"

cleanup() {
  docker exec "$CONTAINER" sh -lc "rm -f '$TMP_IMPORT' '$TMP_SAFETY'" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Creating safety backup..."
docker exec "$CONTAINER" sh -lc "pg_dump -U '$USER' -d '$DB' --no-owner --no-privileges > '$TMP_SAFETY'"
docker cp "${CONTAINER}:${TMP_SAFETY}" "$SAFETY_FILE"
echo "Safety backup saved at: $SAFETY_FILE"

echo "Copying dump into container..."
docker cp "$DUMP_FILE" "${CONTAINER}:${TMP_IMPORT}"

echo "Dropping and recreating database '$DB'..."
docker exec "$CONTAINER" psql -U "$USER" -d postgres -c "DROP DATABASE IF EXISTS $DB WITH (FORCE);"
docker exec "$CONTAINER" psql -U "$USER" -d postgres -c "CREATE DATABASE $DB OWNER $USER;"

echo "Importing SQL..."
docker exec "$CONTAINER" sh -lc "psql -U '$USER' -d '$DB' -f '$TMP_IMPORT'"

echo "Restarting core backend..."
docker compose -f core/docker-compose.yml restart backend >/dev/null

echo "Done."
