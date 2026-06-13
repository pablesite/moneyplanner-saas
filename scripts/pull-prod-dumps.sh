#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-codinglab}"
REMOTE_COMPOSE_DIR="${REMOTE_COMPOSE_DIR:-/datos/docker/compose/moneyplanner}"
REMOTE_ENV_FILE="${REMOTE_ENV_FILE:-.env}"
LOCAL_BACKUP_ROOT="${LOCAL_BACKUP_ROOT:-backups/prod-refresh}"
STAMP="${STAMP:-$(date +%Y%m%d_%H%M%S)}"

LOCAL_TARGET_DIR="${LOCAL_BACKUP_ROOT}/${STAMP}"
REMOTE_TARGET_DIR="${REMOTE_COMPOSE_DIR}/backups/${STAMP}"
CORE_DUMP_NAME="core_db_for_dev_refresh.dump"
SAAS_DUMP_NAME="saas_db_for_dev_refresh.dump"

mkdir -p "${LOCAL_TARGET_DIR}"

echo "Creating production dumps on ${REMOTE_HOST}:${REMOTE_TARGET_DIR}"
ssh "${REMOTE_HOST}" "mkdir -p '${REMOTE_TARGET_DIR}'"
ssh "${REMOTE_HOST}" "cd '${REMOTE_COMPOSE_DIR}' && docker compose -f docker-compose.prod.yml --env-file '${REMOTE_ENV_FILE}' exec -T core_db pg_dump -U core -d core -Fc --no-owner --no-privileges > '${REMOTE_TARGET_DIR}/${CORE_DUMP_NAME}'"
ssh "${REMOTE_HOST}" "cd '${REMOTE_COMPOSE_DIR}' && docker compose -f docker-compose.prod.yml --env-file '${REMOTE_ENV_FILE}' exec -T saas_db pg_dump -U saas -d saas -Fc --no-owner --no-privileges > '${REMOTE_TARGET_DIR}/${SAAS_DUMP_NAME}'"

echo "Copying dumps back to ${LOCAL_TARGET_DIR}"
scp "${REMOTE_HOST}:${REMOTE_TARGET_DIR}/${CORE_DUMP_NAME}" "${LOCAL_TARGET_DIR}/${CORE_DUMP_NAME}"
scp "${REMOTE_HOST}:${REMOTE_TARGET_DIR}/${SAAS_DUMP_NAME}" "${LOCAL_TARGET_DIR}/${SAAS_DUMP_NAME}"

echo
echo "Production dumps copied to ${LOCAL_TARGET_DIR}"
echo "Next step:"
echo "  ./scripts/dev-restore-prod-refresh.sh ${LOCAL_TARGET_DIR}"
