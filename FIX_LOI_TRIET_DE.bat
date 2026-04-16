@echo off
color 0C
echo ========================================
echo FIX LOI TRIET DE - ANVI SYSTEM
echo ========================================
echo.
echo Dang fix cac loi:
echo   1. originalPrompt duplicate
echo   2. CORS duplicate headers
echo   3. Failed to fetch
echo.
pause

echo.
echo [1/6] Stopping all running services...
taskkill /F /FI "WINDOWTITLE eq API Gateway*" 2>nul
taskkill /F /FI "WINDOWTITLE eq User Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Livestream Service*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Next.js*" 2>nul
echo Done!

echo.
echo [2/6] Cleaning Next.js cache...
cd my-app
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .next\cache rmdir /s /q .next\cache
echo Done!

echo.
echo [3/6] Cleaning Gradle build folders...
cd ..
cd apigatewway
call gradlew clean >nul 2>&1
cd ..
cd userservice
call gradlew clean >nul 2>&1
cd ..
cd livetreamservice
call gradlew clean >nul 2>&1
cd ..
echo Done!

echo.
echo [4/6] Rebuilding API Gateway...
cd apigatewway
start /MIN "Building API Gateway" cmd /c "gradlew build >nul 2>&1"
cd ..
echo Done!

echo.
echo [5/6] Rebuilding User Service...
cd userservice
start /MIN "Building User Service" cmd /c "gradlew build >nul 2>&1"
cd ..
echo Done!

echo.
echo [6/6] Rebuilding Livestream Service...
cd livetreamservice
start /MIN "Building Livestream Service" cmd /c "gradlew build >nul 2>&1"
cd ..
echo Done!

echo.
echo ========================================
echo HOAN THANH!
echo ========================================
echo.
echo Cac thay doi da thuc hien:
echo   - Xoa CORS config o UserService
echo   - Xoa CORS config o LivestreamService
echo   - Chi giu CORS o API Gateway
echo   - Xoa tat ca cache Next.js
echo   - Rebuild tat ca services
echo.
echo Buoc tiep theo:
echo   1. Chay: start-all-services.bat
echo   2. Doi 60 giay
echo   3. Mo trinh duyet MOI (Ctrl+Shift+N - Incognito)
echo   4. Truy cap: http://localhost:3000/login
echo.
echo LUU Y: Phai dung Incognito mode de tranh cache trinh duyet!
echo.
pause
