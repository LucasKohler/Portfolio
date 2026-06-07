# Stop PlanBroker HTTP and watcher started by start-mcp-flow.ps1.
param(
    [string]$ProjectRoot = ""
)

if (-not $ProjectRoot) {
    $ProjectRoot = Split-Path -Parent $PSScriptRoot
}

$PidsFile = Join-Path $ProjectRoot ".cursor\plans\.mcp-flow.pids"

if (-not (Test-Path $PidsFile)) {
    Write-Host "No MCP flow processes recorded (.mcp-flow.pids missing)."
    return
}

$data = Get-Content $PidsFile -Raw | ConvertFrom-Json
$stopped = 0

foreach ($key in @("watcher_pid", "broker_pid")) {
    $pidVal = $data.$key
    if ($pidVal) {
        $proc = Get-Process -Id $pidVal -ErrorAction SilentlyContinue
        if ($proc) {
            Stop-Process -Id $pidVal -Force -ErrorAction SilentlyContinue
            Write-Host "[OK] Stopped $key ($pidVal)"
            $stopped++
        }
    }
}

Remove-Item $PidsFile -Force -ErrorAction SilentlyContinue
if ($stopped -eq 0) {
    Write-Host "Processes already stopped."
}
