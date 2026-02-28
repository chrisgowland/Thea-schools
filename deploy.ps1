param(
  [string]$Domain = "educating-thea.surge.sh"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "index.html")) {
  throw "index.html not found in $PSScriptRoot"
}

Write-Host "Publishing Educating Thea to https://$Domain ..." -ForegroundColor Cyan
npx surge . $Domain

Write-Host "Done. Visit https://$Domain" -ForegroundColor Green
