# Export full Core PostgreSQL database to a validated custom dump (.dump).
# Usage:
#   .\scripts\db-export.cmd
#   .\scripts\db-export.cmd -OutputDir .\backups
#   .\scripts\db-export.cmd -OutputFile .\backups\core_db_manual.dump

param(
    [string]$OutputDir = ".\backups",
    [string]$OutputFile = ""
)

$ErrorActionPreference = "Stop"

$ComposeFile = "core/docker-compose.yml"
$Container = "core_db"
$Database = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "core" }
$User = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "core" }
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$TmpDump = "/tmp/core_db_export_$Timestamp.dump"

if ([string]::IsNullOrWhiteSpace($OutputFile)) {
    $OutputFile = Join-Path $OutputDir "core_db_$Timestamp.dump"
}

$OutputDirResolved = Split-Path -Parent $OutputFile
if ([string]::IsNullOrWhiteSpace($OutputDirResolved)) {
    $OutputDirResolved = "."
}
New-Item -ItemType Directory -Force -Path $OutputDirResolved | Out-Null
$OutputFileAbs = [System.IO.Path]::GetFullPath($OutputFile)

$running = docker inspect -f '{{.State.Running}}' $Container 2>$null
if ($running -ne "true") {
    Write-Host "Core DB no estaba levantada. Arrancando contenedor db..."
    docker compose -f $ComposeFile up -d db | Out-Null
    $running = docker inspect -f '{{.State.Running}}' $Container 2>$null
    if ($running -ne "true") {
        throw "No se pudo arrancar '$Container'."
    }
}

try {
    Write-Host "Creando dump completo (.dump) de '$Database'..."
    docker exec $Container sh -lc "pg_dump -U '$User' -d '$Database' -Fc --no-owner --no-privileges -f '$TmpDump'"
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump fallo."
    }

    Write-Host "Validando dump en contenedor..."
    docker exec $Container sh -lc "pg_restore -l '$TmpDump' > /dev/null"
    if ($LASTEXITCODE -ne 0) {
        throw "La validacion del dump fallo (pg_restore -l)."
    }

    Write-Host "Copiando dump a host..."
    docker cp "${Container}:${TmpDump}" "$OutputFileAbs"
    if ($LASTEXITCODE -ne 0) {
        throw "docker cp fallo al copiar el dump."
    }

    Write-Host ""
    Write-Host "Export completado"
    Write-Host "Archivo: $OutputFileAbs"
}
finally {
    docker exec $Container sh -lc "rm -f '$TmpDump'" | Out-Null
}
