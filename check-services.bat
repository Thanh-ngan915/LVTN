@echo off
echo ========================================
echo CHECKING ANVI SYSTEM SERVICES
echo ========================================
echo.

echo Checking API Gateway (port 8080)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -TimeoutSec 2 -UseBasicParsing; Write-Host '✓ API Gateway is RUNNING' -ForegroundColor Green } catch { Write-Host '✗ API Gateway is NOT running' -ForegroundColor Red }"
echo.

echo Checking User Service (port 8085)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8085/actuator/health' -TimeoutSec 2 -UseBasicParsing; Write-Host '✓ User Service is RUNNING' -ForegroundColor Green } catch { Write-Host '✗ User Service is NOT running' -ForegroundColor Red }"
echo.

echo Checking Livestream Service (port 8086)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8086/actuator/health' -TimeoutSec 2 -UseBasicParsing; Write-Host '✓ Livestream Service is RUNNING' -ForegroundColor Green } catch { Write-Host '✗ Livestream Service is NOT running' -ForegroundColor Red }"
echo.

echo Checking Next.js Frontend (port 3000)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 2 -UseBasicParsing; Write-Host '✓ Next.js Frontend is RUNNING' -ForegroundColor Green } catch { Write-Host '✗ Next.js Frontend is NOT running' -ForegroundColor Red }"
echo.

echo ========================================
echo.
pause
