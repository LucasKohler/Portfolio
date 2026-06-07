# One-time MCP flow setup: broker install, watcher deps, global mcp.json.
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BrokerDir = Join-Path $HOME "mcp-servers\plan-broker"
$CursorDir = Join-Path $HOME ".cursor"
$GlobalMcp = Join-Path $CursorDir "mcp.json"
$RunBroker = Join-Path $BrokerDir "run-broker.ps1"

Write-Host "=== MCP Flow Setup ===" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"

if (-not (Test-Path $BrokerDir)) {
    Write-Error "PlanBroker not found at $BrokerDir"
}

& (Join-Path $BrokerDir "install.ps1")

Write-Host ""
Write-Host "Installing watcher dependencies..."
Set-Location $ProjectRoot
python -m pip install -r requirements-watch.txt --quiet
Write-Host "[OK] watchdog installed"

if (-not (Test-Path $CursorDir)) {
    New-Item -ItemType Directory -Path $CursorDir -Force | Out-Null
}

$planBrokerEntry = @{
    type    = "stdio"
    command = "powershell"
    args    = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $RunBroker)
    env     = @{ WORKSPACE_FOLDER = "`${workspaceFolder}" }
}

$config = @{ mcpServers = @{} }

if (Test-Path $GlobalMcp) {
    Copy-Item $GlobalMcp "$GlobalMcp.bak" -Force
    Write-Host "[OK] Backed up to mcp.json.bak"
    $existing = Get-Content $GlobalMcp -Raw | ConvertFrom-Json
    if ($existing.mcpServers) {
        $existing.mcpServers.PSObject.Properties | ForEach-Object {
            $config.mcpServers[$_.Name] = $_.Value
        }
    }
}

$config.mcpServers["plan-broker"] = $planBrokerEntry
$config | ConvertTo-Json -Depth 10 | Set-Content $GlobalMcp -Encoding UTF8
Write-Host "[OK] plan-broker configured in $GlobalMcp"

$agent = Get-Command agent -ErrorAction SilentlyContinue
if ($agent) {
    Write-Host ""
    try { & agent status } catch { Write-Host "[WARN] Run: agent login" -ForegroundColor Yellow }
} else {
    Write-Host "[WARN] Cursor CLI not installed" -ForegroundColor Yellow
    Write-Host "  irm 'https://cursor.com/install?win32=true' | iex"
}

Write-Host ""
Write-Host "=== Setup complete ===" -ForegroundColor Green
Write-Host "  1. Restart Cursor IDE"
Write-Host "  2. Settings → Run Mode → Auto-review (for permissions.json)"
Write-Host "  3. .\scripts\verify-mcp-flow.ps1"
Write-Host "  4. .\scripts\start-mcp-flow.ps1"
