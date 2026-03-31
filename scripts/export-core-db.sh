#!/usr/bin/env bash
# Export the Core PostgreSQL database to a timestamped SQL dump.
# Usage: ./scripts/export-core-db.sh [output_dir]
# Default output dir: ./backups/

set -euo pipefail

OUTPUT_DIR="${1:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="core_db_${TIMESTAMP}.sql"
OUTPUT_PATH="${OUTPUT_DIR}/${FILENAME}"

CONTAINER="core_db"
DB="${POSTGRES_DB:-core}"
USER="${POSTGRES_USER:-core}"

# Verify the container is running
if ! docker inspect -f '{{.State.Running}}' "${CONTAINER}" 2>/dev/null | grep -q true; then
  echo "Error: container '${CONTAINER}' is not running." >&2
  echo "Start it with: docker compose -f core/docker-compose.yml up -d db" >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

echo "Exporting Core DB (${DB}) from container ${CONTAINER}..."
docker exec "${CONTAINER}" \
  pg_dump -U "${USER}" -d "${DB}" --no-password \
  > "${OUTPUT_PATH}"

echo "Done: ${OUTPUT_PATH}"
