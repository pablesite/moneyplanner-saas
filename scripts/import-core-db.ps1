# Import a SQL dump into the Core PostgreSQL database (full replace).
# Usage:
#   .\scripts\import-core-db.ps1 -DumpFile .\backups\core_db_20260331_120000.sql
#   .\scripts\import-core-db.ps1 -DumpFile .\backups\core.sql -Force

param(
    [Parameter(Mandatory = $true)]
    [string]$DumpFile,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$Container = "core_db"
$DB = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "core" }
$User = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "core" }
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$SafetyBackupDir = ".\backups"
$SafetyBackupFile = Join-Path $SafetyBackupDir "core_db_pre_import_$Timestamp.sql"

if (-not (Test-Path -LiteralPath $DumpFile)) {
    Write-Error "File not found: $DumpFile"
    exit 1
}

$running = docker inspect -f '{{.State.Running}}' $Container 2>$null
if ($running -ne "true") {
    Write-Error "Container '$Container' is not running. Start it with: docker compose -f core/docker-compose.yml up -d db"
    exit 1
}

$AbsPath = (Resolve-Path -LiteralPath $DumpFile).Path

if (-not $Force) {
    Write-Host "This will REPLACE database '$DB' in container '$Container'."
    $confirmation = Read-Host "Type REPLACE to continue"
    if ($confirmation -ne "REPLACE") {
        Write-Host "Import cancelled."
        exit 0
    }
}

New-Item -ItemType Directory -Force -Path $SafetyBackupDir | Out-Null

$ContainerImportFile = "/tmp/core_db_import.sql"
$ContainerSafetyFile = "/tmp/core_db_pre_import_$Timestamp.sql"

try {
    Write-Host "Creating safety backup before import..."
    docker exec $Container sh -lc "pg_dump -U '$User' -d '$DB' --no-owner --no-privileges > '$ContainerSafetyFile'"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create safety backup inside container."
    }

    docker cp "${Container}:${ContainerSafetyFile}" "$SafetyBackupFile"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to copy safety backup to host."
    }

    Write-Host "Safety backup saved at: $SafetyBackupFile"
    Write-Host "Copying import file into container..."
    docker cp "$AbsPath" "${Container}:${ContainerImportFile}"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to copy import file into container."
    }

    Write-Host "Dropping and recreating database '$DB'..."
    docker exec $Container psql -U $User -d postgres -c "DROP DATABASE IF EXISTS $DB WITH (FORCE);"
    if ($LASTEXITCODE -ne 0) { throw "DROP DATABASE failed." }
    docker exec $Container psql -U $User -d postgres -c "CREATE DATABASE $DB OWNER $User;"
    if ($LASTEXITCODE -ne 0) { throw "CREATE DATABASE failed." }

    Write-Host "Importing SQL..."
    docker exec $Container sh -lc "psql -U '$User' -d '$DB' -f '$ContainerImportFile'"
    if ($LASTEXITCODE -ne 0) {
        throw "psql import failed."
    }

    Write-Host "Restarting core backend..."
    docker compose -f core/docker-compose.yml restart backend | Out-Null

    Write-Host "Done."
}
finally {
    docker exec $Container sh -lc "rm -f '$ContainerImportFile' '$ContainerSafetyFile'" | Out-Null
}
