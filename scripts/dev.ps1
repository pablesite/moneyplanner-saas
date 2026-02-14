param(
    [Parameter(Position=0)]
    [string]$Command,

    [Parameter(Position=1)]
    [string]$Arg1
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$CoreDir = Join-Path $Root "core"

function Show-Help {
    @"
Uso:
  .\scripts\dev.ps1 <comando> [args]

Comandos:
  up-core                 Levanta stack core (build + detached)
  up-saas                 Levanta stack saas (build + detached)
  up-all                  Levanta core y luego saas
  ps                      Muestra estado de core y saas
  logs <servicio>         Muestra logs --tail 100 de un servicio conocido
  health                  Verificación rápida de endpoints
  help                    Muestra esta ayuda

Servicios válidos para logs:
  core-backend | core-frontend | core-db
  saas-backend | saas-frontend | saas-db
"@
}

function Run-Compose {
    param(
        [string]$Workdir,
        [string[]]$Args
    )
    Push-Location $Workdir
    try {
        docker compose @Args
    }
    finally {
        Pop-Location
    }
}

function Cmd-UpCore {
    Run-Compose -Workdir $CoreDir -Args @("up", "--build", "-d")
}

function Cmd-UpSaas {
    Run-Compose -Workdir $Root -Args @("up", "--build", "-d")
}

function Cmd-UpAll {
    Cmd-UpCore
    Cmd-UpSaas
}

function Cmd-Ps {
    Write-Host "== CORE =="
    Run-Compose -Workdir $CoreDir -Args @("ps")
    Write-Host ""
    Write-Host "== SAAS =="
    Run-Compose -Workdir $Root -Args @("ps")
}

function Cmd-Logs {
    param([string]$ServiceAlias)

    if (-not $ServiceAlias) {
        throw "Debes indicar un servicio. Ejemplo: .\\scripts\\dev.ps1 logs core-backend"
    }

    switch ($ServiceAlias) {
        "core-backend"  { Run-Compose -Workdir $CoreDir -Args @("logs", "--tail", "100", "backend") }
        "core-frontend" { Run-Compose -Workdir $CoreDir -Args @("logs", "--tail", "100", "frontend") }
        "core-db"       { Run-Compose -Workdir $CoreDir -Args @("logs", "--tail", "100", "db") }
        "saas-backend"  { Run-Compose -Workdir $Root -Args @("logs", "--tail", "100", "saas_backend") }
        "saas-frontend" { Run-Compose -Workdir $Root -Args @("logs", "--tail", "100", "saas_frontend") }
        "saas-db"       { Run-Compose -Workdir $Root -Args @("logs", "--tail", "100", "saas_db") }
        default {
            throw "Servicio no reconocido: $ServiceAlias"
        }
    }
}

function Cmd-Health {
    $urls = @(
        "http://localhost:5173",
        "http://localhost:8000/api/docs/",
        "http://localhost:5174",
        "http://localhost:8001/api/docs/"
    )

    foreach ($url in $urls) {
        try {
            $res = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5 -UseBasicParsing
            Write-Host "OK   $url [$($res.StatusCode)]"
        }
        catch {
            Write-Host "FAIL $url"
        }
    }
}

if (-not $Command) {
    Show-Help
    exit 0
}

switch ($Command.ToLowerInvariant()) {
    "up-core" { Cmd-UpCore }
    "up-saas" { Cmd-UpSaas }
    "up-all"  { Cmd-UpAll }
    "ps"      { Cmd-Ps }
    "logs"    { Cmd-Logs -ServiceAlias $Arg1 }
    "health"  { Cmd-Health }
    "help"    { Show-Help }
    default {
        Show-Help
        throw "Comando no reconocido: $Command"
    }
}
