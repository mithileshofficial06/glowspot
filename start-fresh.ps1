# PowerShell script to start dev server fresh
# Kills any process on port 3000 and starts clean

Write-Host "🔍 Checking for processes on port 3000..." -ForegroundColor Cyan

# Find process on port 3000
$port3000 = netstat -ano | Select-String ':3000.*LISTENING'
if ($port3000) {
    $pid = ($port3000 -split '\s+')[-1]
    Write-Host "Found process $pid on port 3000. Stopping..." -ForegroundColor Yellow
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "✓ Process stopped" -ForegroundColor Green
} else {
    Write-Host "✓ Port 3000 is available" -ForegroundColor Green
}

# Kill all node processes as backup
Write-Host "`n🧹 Cleaning up Node processes..." -ForegroundColor Cyan
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Clean build cache
Write-Host "`n🗑️  Removing .next folder..." -ForegroundColor Cyan
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ .next folder removed" -ForegroundColor Green
} else {
    Write-Host "✓ .next folder already clean" -ForegroundColor Green
}

Write-Host "`n🚀 Starting dev server..." -ForegroundColor Cyan
npm run dev
