param(
  [switch]$Apply
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$coreSrc = Join-Path $repoRoot "core/frontend/src"
$saasSrc = Join-Path $repoRoot "frontend/src"
$manifestPath = Join-Path $PSScriptRoot "frontend-sync-manifest.txt"

if (-not (Test-Path $manifestPath)) {
  throw "Manifest not found: $manifestPath"
}

$entries = Get-Content $manifestPath |
  Where-Object { $_.Trim() -and -not $_.Trim().StartsWith("#") } |
  ForEach-Object { $_.Trim().Replace("/", [IO.Path]::DirectorySeparatorChar) }

if (-not $entries) {
  throw "Manifest is empty: $manifestPath"
}

$drifts = @()
$copied = @()

foreach ($entry in $entries) {
  $from = Join-Path $coreSrc $entry
  $to = Join-Path $saasSrc $entry

  if (-not (Test-Path $from)) {
    throw "Missing source file in core: $entry"
  }

  $toDir = Split-Path -Parent $to
  if (-not (Test-Path $toDir)) {
    New-Item -ItemType Directory -Path $toDir | Out-Null
  }

  if (-not (Test-Path $to)) {
    $drifts += $entry
    if ($Apply) {
      Copy-Item -Path $from -Destination $to -Force
      $copied += $entry
    }
    continue
  }

  $fromHash = (Get-FileHash -Path $from -Algorithm SHA256).Hash
  $toHash = (Get-FileHash -Path $to -Algorithm SHA256).Hash

  if ($fromHash -ne $toHash) {
    $drifts += $entry
    if ($Apply) {
      Copy-Item -Path $from -Destination $to -Force
      $copied += $entry
    }
  }
}

if ($Apply) {
  if ($copied.Count -eq 0) {
    Write-Output "Frontend sync: no changes."
  } else {
    Write-Output "Frontend sync: copied $($copied.Count) file(s):"
    $copied | ForEach-Object { Write-Output " - $_" }
  }
  exit 0
}

if ($drifts.Count -eq 0) {
  Write-Output "Frontend sync check: OK (no drift)."
  exit 0
}

Write-Output "Frontend sync check: drift detected in $($drifts.Count) file(s):"
$drifts | ForEach-Object { Write-Output " - $_" }
exit 1
