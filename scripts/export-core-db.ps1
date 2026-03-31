# Export the Core PostgreSQL database to a timestamped .sql file.
# Usage:
#   .\scripts\export-core-db.ps1
#   .\scripts\export-core-db.ps1 -OutputDir .\backups
#   .\scripts\export-core-db.ps1 -OutputFile .\backups\core_manual.sql

param(
    [string]$OutputDir = ".\backups",
    [string]$OutputFile = ""
)

$ErrorActionPreference = "Stop"

$Container = "core_db"
$DB = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "core" }
$User = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "core" }

$running = docker inspect -f '{{.State.Running}}' $Container 2>$null
if ($running -ne "true") {
    Write-Error "Container '$Container' is not running. Start it with: docker compose -f core/docker-compose.yml up -d db"
    exit 1
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

if ([string]::IsNullOrWhiteSpace($OutputFile)) {
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $OutputFile = Join-Path $OutputDir "core_db_$Timestamp.sql"
}

$OutputFileAbs = (Resolve-Path -LiteralPath (Split-Path -Parent $OutputFile) -ErrorAction SilentlyContinue)
if (-not $OutputFileAbs) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutputFile) | Out-Null
}
$OutputFile = [System.IO.Path]::GetFullPath($OutputFile)

$ContainerTmpFile = "/tmp/core_db_export.sql"

try {
    Write-Host "Generating SQL dump inside container '$Container'..."
    docker exec $Container sh -lc "pg_dump -U '$User' -d '$DB' --no-owner --no-privileges > '$ContainerTmpFile'"
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump failed."
    }

    Write-Host "Copying dump to '$OutputFile'..."
    docker cp "${Container}:${ContainerTmpFile}" "$OutputFile"
    if ($LASTEXITCODE -ne 0) {
        throw "docker cp failed while exporting dump."
    }

    Write-Host "Done: $OutputFile"
}
finally {
    docker exec $Container sh -lc "rm -f '$ContainerTmpFile'" | Out-Null
}
