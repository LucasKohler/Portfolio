# Automated checklist for MCP flow health.
$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BrokerDir = Join-Path $HOME "mcp-servers\plan-broker"
$GlobalMcp = Join-Path $HOME ".cursor\mcp.json"
$passed = 0
$failed = 0
$warned = 0

function Test-Check {
    param([string]$Name, [scriptblock]$Block)
    Write-Host -NoNewline "  $Name ... "
    try {
        $result = & $Block
        if ($result -eq $true -or $null -eq $result) {
            Write-Host "OK" -ForegroundColor Green
            $script:passed++
        } elseif ($result -eq "warn") {
            Write-Host "WARN" -ForegroundColor Yellow
            $script:warned++
        } else {
            Write-Host "FAIL" -ForegroundColor Red
            $script:failed++
        }
    } catch {
        Write-Host "FAIL ($($_.Exception.Message))" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host "=== MCP Flow Verification ===" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host ""

Test-Check "Broker directory exists" {
    Test-Path (Join-Path $BrokerDir "plan_broker.py")
}

Test-Check "Broker importable" {
    $env:WORKSPACE_FOLDER = $ProjectRoot
    Push-Location $BrokerDir
    python -c "from plan_broker import list_plans; print('ok')" 2>$null | Out-Null
    Pop-Location
    $LASTEXITCODE -eq 0
}

Test-Check "publish_plan round-trip" {
    $env:WORKSPACE_FOLDER = $ProjectRoot
    $taskId = "verify-mcp-$(Get-Date -Format 'HHmmss')"
    Push-Location $BrokerDir
    $py = "from plan_broker import publish_plan,get_plan; t='$taskId'; r=publish_plan('# Verify', t, {'source':'verify'}); assert r['status']=='ok'; assert get_plan(t)['status']=='ok'"
    python -c $py 2>$null | Out-Null
    $ok = $LASTEXITCODE -eq 0
    Pop-Location
    Remove-Item (Join-Path $ProjectRoot ".cursor\plans\$taskId.md") -ErrorAction SilentlyContinue
    $ok
}

Test-Check "Global mcp.json has plan-broker" {
    if (-not (Test-Path $GlobalMcp)) { return $false }
    $json = Get-Content $GlobalMcp -Raw | ConvertFrom-Json
    $null -ne $json.mcpServers.'plan-broker'
}

Test-Check "Project permissions.json" {
    Test-Path (Join-Path $ProjectRoot ".cursor\permissions.json")
}

Test-Check "Watcher dry-run" {
    $taskId = "verify-watch-$(Get-Date -Format 'HHmmss')"
    $planPath = Join-Path $ProjectRoot ".cursor\plans\$taskId.md"
    "# Watch test" | Set-Content $planPath
    Push-Location $ProjectRoot
    python watch_plans.py --once $taskId --dry-run 2>$null | Out-Null
    $ok = $LASTEXITCODE -eq 0
    Pop-Location
    Remove-Item $planPath -ErrorAction SilentlyContinue
    $ok
}

Test-Check "Cursor CLI (agent)" {
    $agent = Get-Command agent -ErrorAction SilentlyContinue
    if (-not $agent) { return "warn" }
    & agent status 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { $true } else { "warn" }
}

Write-Host ""
Write-Host "Results: $passed passed, $failed failed, $warned warnings" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
if ($failed -gt 0) { exit 1 }
