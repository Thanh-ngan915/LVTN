@echo off
color 0A
echo.
echo  ╔═══════════════════════════════════════════════════════╗
echo  ║                                                       ║
echo  ║           ANVI SYSTEM - QUICK START                  ║
echo  ║                                                       ║
echo  ╚═══════════════════════════════════════════════════════╝
echo.
echo  Chon mot trong cac lua chon sau:
echo.
echo  [1] Start tat ca services (Khoi dong he thong)
echo  [2] Kiem tra status cua services
echo  [3] Test API endpoints
echo  [4] Clean va rebuild tat ca
echo  [5] Fix loi cache Next.js
echo  [6] Xem huong dan chi tiet
echo  [7] FIX LOI TRIET DE (originalPrompt + CORS)
echo  [0] Thoat
echo.
set /p choice="Nhap lua chon cua ban (0-7): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto check_status
if "%choice%"=="3" goto test_api
if "%choice%"=="4" goto clean_rebuild
if "%choice%"=="5" goto fix_cache
if "%choice%"=="6" goto show_docs
if "%choice%"=="7" goto fix_triet_de
if "%choice%"=="0" goto exit
goto invalid

:start_all
echo.
echo Starting all services...
call start-all-services.bat
goto end

:check_status
echo.
echo Checking services status...
call check-services.bat
goto menu

:test_api
echo.
echo Testing API endpoints...
call test-api.bat
goto menu

:clean_rebuild
echo.
echo Cleaning and rebuilding...
call clean-rebuild-all.bat
goto menu

:fix_cache
echo.
echo Fixing Next.js cache...
cd my-app
call fix-errors.bat
cd ..
goto menu

:show_docs
echo.
echo Opening documentation...
start FIX_NGAY_BAY_GIO.md
start BAT_DAU_SU_DUNG.md
start README_FIX.md
goto menu

:fix_triet_de
echo.
color 0C
echo ========================================
echo FIX LOI TRIET DE
echo ========================================
echo.
echo Script nay se fix:
echo   - Loi originalPrompt
echo   - Loi CORS duplicate headers
echo   - Loi Failed to fetch
echo.
echo Sau khi chay xong, hay:
echo   1. Chay lai option [1] de start services
echo   2. Mo trinh duyet INCOGNITO mode
echo   3. Truy cap http://localhost:3000/login
echo.
pause
call FIX_LOI_TRIET_DE.bat
goto menu

:invalid
echo.
echo Lua chon khong hop le! Vui long chon lai.
timeout /t 2 /nobreak >nul
goto menu

:menu
echo.
pause
cls
goto :eof

:exit
echo.
echo Tam biet!
timeout /t 1 /nobreak >nul
exit

:end
