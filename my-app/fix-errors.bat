@echo off
echo ========================================
echo FIX ALL ERRORS - ANVI SYSTEM
echo ========================================
echo.

echo [1/4] Cleaning Next.js cache...
cd my-app
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ Cache cleared!
echo.

echo [2/4] Rebuilding Next.js...
call npm run build
echo ✓ Build completed!
echo.

echo [3/4] Checking backend services...
echo Please make sure these services are running:
echo   - API Gateway (port 8080)
echo   - User Service (port 8085)
echo   - Livestream Service (port 8086)
echo.

echo [4/4] Starting Next.js dev server...
call npm run dev
