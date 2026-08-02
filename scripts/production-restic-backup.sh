#!/usr/bin/env bash

set -Eeuo pipefail

readonly RESTIC_REPOSITORY="${RESTIC_REPOSITORY:-/backups/restic}"
readonly RESTIC_PASSWORD_FILE="${RESTIC_PASSWORD_FILE:-/home/pablo/.restic-password}"
readonly BACKUP_MOUNT="${BACKUP_MOUNT:-/backups}"
readonly BACKUP_UUID="${BACKUP_UUID:-74a526b1-3625-4418-8ce1-c9cce3d62b37}"
readonly STAGING_DIR="${STAGING_DIR:-/datos/docker/backup-staging}"
readonly EXCLUDE_FILE="${EXCLUDE_FILE:-/etc/restic-backup.exclude}"
readonly KUMA_DB="${KUMA_DB:-/datos/docker/volumes/volumes/uptime-kuma_uptime-kuma-data/_data/kuma.db}"
readonly MIN_FREE_KIB="${MIN_FREE_KIB:-10485760}"
STARTED_AT="$(date +%s)"
readonly STARTED_AT
export KUMA_DB

CURRENT_STEP="initialization"
SNAPSHOT_ID="unknown"

log() {
  printf '%s [%s] %s\n' "$(date --iso-8601=seconds)" "$1" "$2"
}

notify_telegram() {
  local outcome="$1"
  local detail="$2"

  OUTCOME="$outcome" DETAIL="$detail" python3 <<'PY'
import json
import os
import socket
import sqlite3
import urllib.parse
import urllib.request

database_path = os.environ["KUMA_DB"]
connection = sqlite3.connect(f"file:{database_path}?mode=ro", uri=True, timeout=10)
row = connection.execute(
    "SELECT config FROM notification "
    "WHERE active = 1 AND json_extract(config, '$.type') = 'telegram' "
    "ORDER BY is_default DESC, id LIMIT 1"
).fetchone()
connection.close()
if row is None:
    raise RuntimeError("No active Telegram notification is configured in Uptime Kuma")

config = json.loads(row[0])
token = config.get("telegramBotToken")
chat_id = config.get("telegramChatID")
if not token or not chat_id:
    raise RuntimeError("The Uptime Kuma Telegram notification is incomplete")

outcome = os.environ["OUTCOME"]
detail = os.environ["DETAIL"]
text = f"Arda backup {outcome}\nHost: {socket.gethostname()}\n{detail}"
payload = urllib.parse.urlencode({"chat_id": chat_id, "text": text}).encode()
request = urllib.request.Request(
    f"https://api.telegram.org/bot{token}/sendMessage",
    data=payload,
    method="POST",
)
with urllib.request.urlopen(request, timeout=20) as response:
    body = json.loads(response.read().decode())
if not body.get("ok"):
    raise RuntimeError("Telegram rejected the notification")
PY
}

finish() {
  local exit_code=$?
  local elapsed
  local message

  trap - EXIT
  set +e
  elapsed="$(($(date +%s) - STARTED_AT))"
  if ((exit_code == 0)); then
    message="Snapshot ${SNAPSHOT_ID} completed in ${elapsed}s. Logical database dumps and repository check passed."
    log OK "$message"
    notify_telegram SUCCESS "$message" || log WARN "Backup succeeded, but Telegram notification failed."
  else
    message="Failed during '${CURRENT_STEP}' after ${elapsed}s (exit ${exit_code}). Check: journalctl -u restic-backup.service"
    log ERROR "$message"
    notify_telegram FAILURE "$message" || log WARN "Backup and Telegram notification both failed."
  fi
  exit "$exit_code"
}
trap finish EXIT

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    log ERROR "Required command not found: $1"
    return 1
  }
}

require_running_container() {
  local container="$1"
  [[ "$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null)" == "true" ]] || {
    log ERROR "Required container is not running: $container"
    return 1
  }
}

ensure_backup_mount() {
  if ! mountpoint -q "$BACKUP_MOUNT"; then
    log INFO "Mounting $BACKUP_MOUNT from /etc/fstab."
    mount "$BACKUP_MOUNT"
  fi

  local mounted_uuid
  mounted_uuid="$(findmnt -rn -T "$BACKUP_MOUNT" -o UUID)"
  [[ "$mounted_uuid" == "$BACKUP_UUID" ]] || {
    log ERROR "Unexpected filesystem mounted at $BACKUP_MOUNT: ${mounted_uuid:-none}"
    return 1
  }
}

check_free_space() {
  local free_kib
  free_kib="$(df -Pk "$BACKUP_MOUNT" | awk 'NR == 2 {print $4}')"
  if [[ ! "$free_kib" =~ ^[0-9]+$ ]] || ((free_kib < MIN_FREE_KIB)); then
    log ERROR "Less than $((MIN_FREE_KIB / 1024 / 1024)) GiB free on $BACKUP_MOUNT."
    return 1
  fi
}

dump_postgres() {
  local container="$1"
  local destination="$2"
  local temporary

  temporary="$(mktemp "${destination}.tmp.XXXXXX")"
  docker exec "$container" sh -lc \
    'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc --no-owner --no-privileges' \
    >"$temporary"
  docker exec -i "$container" pg_restore -l <"$temporary" >/dev/null
  mv "$temporary" "$destination"
}

dump_passbolt() {
  local destination="$1"
  local temporary

  temporary="$(mktemp "${destination}.tmp.XXXXXX")"
  docker exec passbolt-db sh -lc \
    'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump --single-transaction --quick --skip-lock-tables -u "$MYSQL_USER" "$MYSQL_DATABASE"' \
    | gzip -c >"$temporary"
  gzip -t "$temporary"
  DUMP_PATH="$temporary" python3 <<'PY'
import gzip
import os

with gzip.open(os.environ["DUMP_PATH"], "rb") as dump:
    first_line = dump.readline()
if not first_line.startswith(b"--"):
    raise RuntimeError("Passbolt dump does not look like SQL")
PY
  [[ -s "$temporary" ]] || {
    log ERROR "Passbolt dump does not look like SQL."
    return 1
  }
  mv "$temporary" "$destination"
}

backup_uptime_kuma() {
  local destination="$1"
  local temporary

  temporary="$(mktemp "${destination}.tmp.XXXXXX")"
  SOURCE_DB="$KUMA_DB" DESTINATION_DB="$temporary" python3 <<'PY'
import os
import sqlite3

source = sqlite3.connect(os.environ["SOURCE_DB"], timeout=30)
destination = sqlite3.connect(os.environ["DESTINATION_DB"])
with destination:
    source.backup(destination)
result = destination.execute("PRAGMA quick_check").fetchone()
source.close()
destination.close()
if result != ("ok",):
    raise RuntimeError(f"Uptime Kuma SQLite quick_check failed: {result}")
PY
  mv "$temporary" "$destination"
}

write_manifest() {
  local temporary
  temporary="$(mktemp "${STAGING_DIR}/SHA256SUMS.tmp.XXXXXX")"
  (
    cd "$STAGING_DIR"
    sha256sum core.dump saas.dump passbolt.sql.gz uptime-kuma.sqlite3
  ) >"$temporary"
  mv "$temporary" "${STAGING_DIR}/SHA256SUMS"
  printf 'created_at=%s\nhost=%s\n' \
    "$(date --iso-8601=seconds)" "$(hostname)" >"${STAGING_DIR}/metadata.txt"
}

notification_test() {
  case "${1:-}" in
    --notify-test-success)
      trap - EXIT
      notify_telegram TEST_SUCCESS "Controlled notification test: success channel is working."
      log OK "Success notification test sent."
      exit 0
      ;;
    --notify-test-failure)
      trap - EXIT
      notify_telegram TEST_FAILURE "Controlled notification test: failure channel is working."
      log OK "Failure notification test sent."
      exit 0
      ;;
    "") ;;
    *)
      log ERROR "Unknown argument: $1"
      return 2
      ;;
  esac
}

main() {
  notification_test "${1:-}"

  CURRENT_STEP="preflight"
  for command in date df docker find findmnt flock gzip mount mountpoint python3 restic sha256sum; do
    require_command "$command"
  done
  exec 9>/run/lock/restic-backup.lock
  flock -n 9 || {
    log ERROR "Another backup process is already running."
    return 1
  }
  ensure_backup_mount
  check_free_space
  [[ -r "$RESTIC_PASSWORD_FILE" ]] || {
    log ERROR "Restic password file is not readable: $RESTIC_PASSWORD_FILE"
    return 1
  }
  [[ -r "$RESTIC_REPOSITORY/config" ]] || {
    log ERROR "Restic repository not found: $RESTIC_REPOSITORY"
    return 1
  }
  [[ -r "$EXCLUDE_FILE" ]] || {
    log ERROR "Restic exclude file not found: $EXCLUDE_FILE"
    return 1
  }
  [[ -r "$KUMA_DB" ]] || {
    log ERROR "Uptime Kuma database is not readable: $KUMA_DB"
    return 1
  }
  for container in moneyplanner-prod-core_db-1 moneyplanner-prod-saas_db-1 passbolt-db uptime-kuma; do
    require_running_container "$container"
  done

  export RESTIC_REPOSITORY RESTIC_PASSWORD_FILE
  mkdir -p "$STAGING_DIR"
  find "$STAGING_DIR" -maxdepth 1 -type f -name '*.tmp.*' -delete

  CURRENT_STEP="Core PostgreSQL dump"
  log INFO "$CURRENT_STEP"
  dump_postgres moneyplanner-prod-core_db-1 "${STAGING_DIR}/core.dump"

  CURRENT_STEP="SaaS PostgreSQL dump"
  log INFO "$CURRENT_STEP"
  dump_postgres moneyplanner-prod-saas_db-1 "${STAGING_DIR}/saas.dump"

  CURRENT_STEP="Passbolt MariaDB dump"
  log INFO "$CURRENT_STEP"
  dump_passbolt "${STAGING_DIR}/passbolt.sql.gz"

  CURRENT_STEP="Uptime Kuma SQLite backup"
  log INFO "$CURRENT_STEP"
  backup_uptime_kuma "${STAGING_DIR}/uptime-kuma.sqlite3"
  write_manifest

  CURRENT_STEP="Restic snapshot"
  log INFO "$CURRENT_STEP"
  restic backup \
    --exclude-file "$EXCLUDE_FILE" \
    --tag automated \
    --tag arda \
    /datos/docker/compose \
    /datos/docker/data \
    /datos/docker/volumes/volumes/uptime-kuma_uptime-kuma-data/_data \
    "$STAGING_DIR"
  SNAPSHOT_ID="$(
    restic snapshots --host "$(hostname)" --latest 1 --json \
      | python3 -c 'import json,sys; print(json.load(sys.stdin)[0]["short_id"])'
  )"

  CURRENT_STEP="retention and prune"
  log INFO "$CURRENT_STEP"
  restic forget --keep-daily 14 --keep-weekly 8 --keep-monthly 12 --prune

  CURRENT_STEP="repository check"
  log INFO "$CURRENT_STEP"
  restic check --read-data-subset=5%
}

main "$@"
