@echo off
echo ========================================
echo STARTING ALL ANVI SYSTEM SERVICES
echo ========================================
echo.

echo This will start:
echo   1. API Gateway (port 8080)
echo   2. User Service (port 8085)
echo   3. Livestream Service (port 8086)
echo   4. Next.js Frontend (port 3000)
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo [1/4] Starting API Gateway...
start "API Gateway - Port 8080" cmd /k "cd apigatewway && gradlew bootRun"
timeout /t 5 /nobreak >nul

echo [2/4] Starting User Service...
start "User Service - Port 8085" cmd /k "cd userservice && gradlew bootRun"
timeout /t 5 /nobreak >nul

echo [3/4] Starting Livestream Service...
start "Livestream Service - Port 8086" cmd /k "cd livetreamservice && gradlew bootRun"
timeout /t 5 /nobreak >nul

echo [4/4] Starting Next.js Frontend...
start "Next.js Frontend - Port 3000" cmd /k "cd my-app && npm run dev"

echo.
echo ========================================
echo ALL SERVICES STARTED!
echo ========================================
echo.
echo Check the opened windows for each service status.
echo Wait 30-60 seconds for all services to fully start.
echo.
echo Access the application at: http://localhost:3000
echo.
pause
