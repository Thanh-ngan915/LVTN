$ErrorActionPreference = "Stop"

# ============================================================
# Export all MySQL databases from K8s to local dump files
# Usage: .\k8s\export-db.ps1
# ============================================================

$namespace = "anvi-dev"
$deployment = "deployment/mysql-host"
$dbUser = "root"
$dbPass = "anvi@root2025"
$dumpDir = "$PSScriptRoot\..\docker\mysql-init\dumps"
$date = Get-Date -Format "ddMM"

# Databases to export
$databases = @("usersdb", "storesdb", "ordersdb", "livestreamdb", "chatbot_db", "productdb")

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ANVI Shop - Exporting MySQL Databases"     -ForegroundColor Cyan
Write-Host "  Date: $date"                                -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Check if MySQL pod is running
Write-Host "`nChecking MySQL pod status..." -ForegroundColor Yellow
kubectl get pods -n $namespace -l app=mysql-host --no-headers
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: MySQL pod is not running!" -ForegroundColor Red
    exit 1
}

# Export each database
$failed = @()
$succeeded = @()

foreach ($db in $databases) {
    $filename = "${db}_${date}.sql"
    $filepath = Join-Path $dumpDir $filename

    Write-Host "`n>> Exporting $db -> $filename ..." -ForegroundColor Yellow

    try {
        kubectl exec $deployment -n $namespace -- mysqldump -u $dbUser -p"$dbPass" --single-transaction --routines --triggers $db > $filepath
        if ($LASTEXITCODE -ne 0) { throw "mysqldump failed" }

        $size = (Get-Item $filepath).Length / 1KB
        $succeeded += $db
        Write-Host "   OK: $filename ($([math]::Round($size, 1)) KB)" -ForegroundColor Green
    } catch {
        $failed += $db
        Write-Host "   FAILED: $db - $_" -ForegroundColor Red
    }
}

# Update 01-import-dumps.sh with new filenames
$importScript = Join-Path $PSScriptRoot "..\docker\mysql-init\01-import-dumps.sh"
$scriptContent = @"
#!/bin/bash
echo "Starting database dump import..."

echo "Importing usersdb..."
mysql -u root -p"`$MYSQL_ROOT_PASSWORD" usersdb < /docker-entrypoint-initdb.d/dumps/usersdb_${date}.sql

echo "Importing storesdb..."
mysql -u root -p"`$MYSQL_ROOT_PASSWORD" storesdb < /docker-entrypoint-initdb.d/dumps/storesdb_${date}.sql

echo "Importing ordersdb..."
mysql -u root -p"`$MYSQL_ROOT_PASSWORD" ordersdb < /docker-entrypoint-initdb.d/dumps/ordersdb_${date}.sql

echo "Importing livestreamdb..."
mysql -u root -p"`$MYSQL_ROOT_PASSWORD" livestreamdb < /docker-entrypoint-initdb.d/dumps/livestreamdb_${date}.sql

echo "Importing chatbot_db..."
mysql -u root -p"`$MYSQL_ROOT_PASSWORD" chatbot_db < /docker-entrypoint-initdb.d/dumps/chatbot_db_${date}.sql

echo "Importing productdb..."
mysql -u root -p"`$MYSQL_ROOT_PASSWORD" productdb < /docker-entrypoint-initdb.d/dumps/productdb_${date}.sql

echo "All database dumps imported successfully!"
"@

$scriptContent | Set-Content -Path $importScript -Encoding UTF8 -NoNewline
Write-Host "`n>> Updated 01-import-dumps.sh with new filenames (_${date}.sql)" -ForegroundColor Green

# Summary
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Export Summary"                               -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Succeeded: $($succeeded.Count) / $($databases.Count)" -ForegroundColor Green
foreach ($s in $succeeded) { Write-Host "    OK  $s" -ForegroundColor Green }

if ($failed.Count -gt 0) {
    Write-Host "  Failed: $($failed.Count) / $($databases.Count)" -ForegroundColor Red
    foreach ($f in $failed) { Write-Host "    ERR $f" -ForegroundColor Red }
    exit 1
}

Write-Host "`nDone! Next steps:" -ForegroundColor Green
Write-Host "  1. git add docker/mysql-init/dumps/" -ForegroundColor White
Write-Host "  2. git commit -m 'Update DB dumps $date'" -ForegroundColor White
Write-Host "  3. Rebuild: docker build -t anvi-mysql:local ./docker" -ForegroundColor White
