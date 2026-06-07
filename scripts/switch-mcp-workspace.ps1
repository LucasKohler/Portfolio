# Switch active workspace for PlanBroker HTTP (restarts broker + watcher).
param(
    [Parameter(Mandatory = $true)]
    [string]$Workspace,
    [int]$Port = 8765,
    [switch]$NoWatch,
    [switch]$DryRunWatch
)

$ErrorActionPreference = "Stop"
$resolved = (Resolve-Path $Workspace).Path

if (-not (Test-Path (Join-Path $resolved ".cursor"))) {
    Write-Error "Not a valid project (missing .cursor/): $resolved"
}

$startArgs = @{
    Workspace   = $resolved
    Port        = $Port
    DryRunWatch = $DryRunWatch
}
if ($NoWatch) { $startArgs.NoWatch = $true }

Write-Host "Switching MCP flow to: $resolved" -ForegroundColor Cyan
& (Join-Path $PSScriptRoot "start-mcp-flow.ps1") @startArgs
