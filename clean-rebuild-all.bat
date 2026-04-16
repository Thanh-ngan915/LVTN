@echo off
echo ========================================
echo CLEAN AND REBUILD ALL - ANVI SYSTEM
echo ========================================
echo.
echo This will:
echo   - Clean all Next.js cache
echo   - Clean all Gradle build folders
echo   - Rebuild all projects
echo.
echo WARNING: This may take 5-10 minutes!
echo.
pause

echo.
echo [1/5] Cleaning Next.js...
cd my-app
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ Next.js cleaned!
cd ..

echo.
echo [2/5] Cleaning API Gateway...
cd apigatewway
call gradlew clean
echo ✓ API Gateway cleaned!
cd ..

echo.
echo [3/5] Cleaning User Service...
cd userservice
call gradlew clean
echo ✓ User Service cleaned!
cd ..

echo.
echo [4/5] Cleaning Livestream Service...
cd livetreamservice
call gradlew clean
echo ✓ Livestream Service cleaned!
cd ..

echo.
echo [5/5] Rebuilding Next.js...
cd my-app
call npm run build
echo ✓ Next.js rebuilt!
cd ..

echo.
echo ========================================
echo CLEAN AND REBUILD COMPLETED!
echo ========================================
echo.
echo You can now start all services using:
echo   start-all-services.bat
echo.
pause
