# Start PlanBroker HTTP + optional watch_plans.py in background.
param(
    [string]$Workspace = "",
    [int]$Port = 8765,
    [string]$BindHost = "127.0.0.1",
    [switch]$Watch,
    [switch]$NoWatch,
    [switch]$DryRunWatch,
    [switch]$RunAgent
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BrokerDir = Join-Path $HOME "mcp-servers\plan-broker"
$RunBroker = Join-Path $BrokerDir "run-broker.ps1"
$PidsFile = Join-Path $ProjectRoot ".cursor\plans\.mcp-flow.pids"
$ActiveWs = Join-Path $ProjectRoot ".cursor\plans\.active-workspace"

if (-not $Workspace) {
    if (Test-Path (Join-Path $ProjectRoot ".cursor")) {
        $Workspace = $ProjectRoot
    } else {
        Write-Error "Specify -Workspace or run from a project with .cursor/"
    }
}
$Workspace = (Resolve-Path $Workspace).Path

if (-not (Test-Path $RunBroker)) {
    Write-Error "PlanBroker not found. Run .\scripts\setup-mcp-flow.ps1 first."
}

# Stop existing if running
$stopScript = Join-Path $PSScriptRoot "stop-mcp-flow.ps1"
if (Test-Path $PidsFile) {
    & $stopScript -ProjectRoot $ProjectRoot 2>$null
}

$enableWatch = $Watch -or (-not $NoWatch)

Write-Host "Starting MCP flow for: $Workspace" -ForegroundColor Cyan

# Broker HTTP
$brokerProc = Start-Process -FilePath "powershell" `
    -ArgumentList @(
        "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $RunBroker,
        "-Http", "-BindHost", $BindHost, "-Port", $Port, "-Workspace", $Workspace
    ) `
    -WorkingDirectory $BrokerDir `
    -WindowStyle Hidden `
    -PassThru

$pids = @{
    broker_pid  = $brokerProc.Id
    broker_port = $Port
    workspace   = $Workspace
    started_at  = (Get-Date).ToString("o")
}

Write-Host "[OK] PlanBroker HTTP PID $($brokerProc.Id) → http://${BindHost}:${Port}/mcp"

# Watcher
if ($enableWatch) {
    $watchArgs = @("watch_plans.py", "--workspace", $Workspace)
    if ($DryRunWatch) { $watchArgs += "--dry-run" }
    if ($RunAgent) { $watchArgs += "--run-agent" }

    $watchMode = if ($RunAgent) { "run-agent" } else { "notify-only" }
    # notify-only: janela visível para ver o banner quando plano chegar
    $windowStyle = if ($RunAgent) { "Hidden" } else { "Normal" }

    $watchProc = Start-Process -FilePath "python" `
        -ArgumentList $watchArgs `
        -WorkingDirectory $ProjectRoot `
        -WindowStyle $windowStyle `
        -PassThru

    $pids.watcher_pid = $watchProc.Id
    $pids.watcher_mode = $watchMode
    $pids.watcher_dry_run = [bool]$DryRunWatch
    Write-Host "[OK] Watcher PID $($watchProc.Id) ($watchMode)$(if ($DryRunWatch) { ', dry-run' })"
}

$pids | ConvertTo-Json | Set-Content $PidsFile -Encoding UTF8
$Workspace | Set-Content $ActiveWs -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "Grok Build MCP URL: http://${BindHost}:${Port}/mcp" -ForegroundColor Green
Write-Host "Stop with: .\scripts\stop-mcp-flow.ps1"
