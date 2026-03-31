# Import full Core PostgreSQL database from custom dump (.dump).
# Safety:
# - Creates automatic pre-import backup (.dump)
# - Validates input dump before destructive operations
# - Recreates database and restores in clean state
#
# Usage:
#   .\scripts\db-import.cmd
#   .\scripts\db-import.cmd -DumpFile .\backups\core_db_20260331_120000.dump
#   .\scripts\db-import.cmd -DumpFile .\backups\core_db_20260331_120000.dump -Force

param(
    [string]$DumpFile = "",
    [string]$BackupDir = ".\backups",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$ComposeFile = "core/docker-compose.yml"
$Container = "core_db"
$Database = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "core" }
$User = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "core" }
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if ([string]::IsNullOrWhiteSpace($DumpFile)) {
    $latest = Get-ChildItem -Path ".\backups" -Filter "*.dump" -File -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
    if ($null -eq $latest) {
        throw "No se encontro ningun .dump en .\backups. Indica -DumpFile."
    }
    $DumpFile = $latest.FullName
    Write-Host "Usando ultimo dump encontrado: $DumpFile"
}

if (-not (Test-Path -LiteralPath $DumpFile)) {
    throw "No existe el archivo: $DumpFile"
}

$DumpFileAbs = (Resolve-Path -LiteralPath $DumpFile).Path

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
$PreImportBackupAbs = [System.IO.Path]::GetFullPath((Join-Path $BackupDir "core_db_pre_import_$Timestamp.dump"))
$TmpRestore = "/tmp/core_db_restore_$Timestamp.dump"
$TmpSafety = "/tmp/core_db_pre_import_$Timestamp.dump"

$running = docker inspect -f '{{.State.Running}}' $Container 2>$null
if ($running -ne "true") {
    Write-Host "Core DB no estaba levantada. Arrancando contenedor db..."
    docker compose -f $ComposeFile up -d db | Out-Null
    $running = docker inspect -f '{{.State.Running}}' $Container 2>$null
    if ($running -ne "true") {
        throw "No se pudo arrancar '$Container'."
    }
}

if (-not $Force) {
    Write-Host "Se va a REEMPLAZAR completamente la base de datos '$Database'."
    Write-Host "Dump origen: $DumpFileAbs"
    Write-Host "Backup de seguridad previo: $PreImportBackupAbs"
    $confirm = Read-Host "Escribe REPLACE para continuar"
    if ($confirm -ne "REPLACE") {
        Write-Host "Import cancelado."
        exit 0
    }
}

try {
    Write-Host "Creando backup automatico previo a import..."
    docker exec $Container sh -lc "pg_dump -U '$User' -d '$Database' -Fc --no-owner --no-privileges -f '$TmpSafety'"
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo crear backup de seguridad dentro del contenedor."
    }

    docker cp "${Container}:${TmpSafety}" "$PreImportBackupAbs"
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo copiar el backup de seguridad al host."
    }

    Write-Host "Copiando dump al contenedor..."
    docker cp "$DumpFileAbs" "${Container}:${TmpRestore}"
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo copiar dump de entrada al contenedor."
    }

    Write-Host "Validando dump de entrada..."
    docker exec $Container sh -lc "pg_restore -l '$TmpRestore' > /dev/null"
    if ($LASTEXITCODE -ne 0) {
        throw "El dump de entrada no es valido (pg_restore -l)."
    }

    Write-Host "Reseteando base de datos '$Database'..."
    docker exec $Container psql -U $User -d postgres -c "DROP DATABASE IF EXISTS $Database WITH (FORCE);"
    if ($LASTEXITCODE -ne 0) { throw "DROP DATABASE fallo." }
    docker exec $Container psql -U $User -d postgres -c "CREATE DATABASE $Database OWNER $User;"
    if ($LASTEXITCODE -ne 0) { throw "CREATE DATABASE fallo." }

    Write-Host "Restaurando dump..."
    docker exec $Container sh -lc "pg_restore -U '$User' -d '$Database' --no-owner --no-privileges '$TmpRestore'"
    if ($LASTEXITCODE -ne 0) {
        throw "pg_restore fallo."
    }

    Write-Host "Reiniciando backend Core..."
    docker compose -f $ComposeFile restart backend | Out-Null

    Write-Host ""
    Write-Host "Import completado"
    Write-Host "Backup previo guardado en: $PreImportBackupAbs"
}
finally {
    docker exec $Container sh -lc "rm -f '$TmpRestore' '$TmpSafety'" | Out-Null
}
