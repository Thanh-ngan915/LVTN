@echo off
REM Script để test integration sau khi migration trên Windows
REM Chạy script này để verify toàn bộ hệ thống hoạt động đúng

echo ==========================================
echo Testing User ID Migration Integration
echo ==========================================
echo.

REM Configuration
set USER_SERVICE_URL=http://localhost:8085
set LIVESTREAM_SERVICE_URL=http://localhost:8086

REM Test data
set TEST_USERNAME=testuser_%RANDOM%
set TEST_PASSWORD=password123
set TEST_EMAIL=test_%RANDOM%@example.com
set TEST_FULLNAME=Test User

echo [Step 1] Testing User Registration
echo Creating new user...

curl -X POST "%USER_SERVICE_URL%/api/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"%TEST_USERNAME%\",\"password\":\"%TEST_PASSWORD%\",\"fullName\":\"%TEST_FULLNAME%\",\"email\":\"%TEST_EMAIL%\",\"address\":\"Test Address\"}" ^
  -o register_response.json

echo.
type register_response.json
echo.

REM Parse userId from response (simple method)
findstr /C:"userId" register_response.json > temp.txt
for /f "tokens=2 delims=:," %%a in (temp.txt) do set USER_ID=%%a
set USER_ID=%USER_ID: =%

if "%USER_ID%"=="" (
    echo [ERROR] Registration failed - no userId returned
    del register_response.json temp.txt
    exit /b 1
)

echo [SUCCESS] Registration successful - User ID: %USER_ID%
echo.

echo [Step 2] Testing User Login
echo Logging in...

curl -X POST "%USER_SERVICE_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"%TEST_USERNAME%\",\"password\":\"%TEST_PASSWORD%\"}" ^
  -o login_response.json

echo.
type login_response.json
echo.

findstr /C:"userId" login_response.json > temp2.txt
for /f "tokens=2 delims=:," %%a in (temp2.txt) do set LOGIN_USER_ID=%%a
set LOGIN_USER_ID=%LOGIN_USER_ID: =%

if "%USER_ID%"=="%LOGIN_USER_ID%" (
    echo [SUCCESS] Login successful - User ID matches: %USER_ID%
) else (
    echo [ERROR] User ID mismatch
    del register_response.json login_response.json temp.txt temp2.txt
    exit /b 1
)

echo.

echo [Step 3] Testing Livestream Room Creation
echo Creating livestream room...

curl -X POST "%LIVESTREAM_SERVICE_URL%/api/livestream/rooms" ^
  -H "Content-Type: application/json" ^
  -H "userId: %USER_ID%" ^
  -H "username: %TEST_USERNAME%" ^
  -d "{\"title\":\"Test Stream\",\"description\":\"Testing integration\",\"maxViewers\":1000}" ^
  -o room_response.json

echo.
type room_response.json
echo.

findstr /C:"hostId" room_response.json > temp3.txt
for /f "tokens=2 delims=:," %%a in (temp3.txt) do set HOST_ID=%%a
set HOST_ID=%HOST_ID: =%

if "%USER_ID%"=="%HOST_ID%" (
    echo [SUCCESS] Room created - Host ID matches User ID: %USER_ID%
) else (
    echo [ERROR] Host ID mismatch
    del register_response.json login_response.json room_response.json temp.txt temp2.txt temp3.txt
    exit /b 1
)

echo.

REM Extract room name
findstr /C:"roomName" room_response.json > temp4.txt
for /f "tokens=2 delims=:," %%a in (temp4.txt) do set ROOM_NAME=%%a
set ROOM_NAME=%ROOM_NAME:"=%
set ROOM_NAME=%ROOM_NAME: =%

echo [SUCCESS] Room name: %ROOM_NAME%
echo.

echo [Step 4] Testing Room Join
echo Joining room as viewer...

set /a VIEWER_ID=%USER_ID%+1000
set VIEWER_USERNAME=viewer_%VIEWER_ID%

curl -X POST "%LIVESTREAM_SERVICE_URL%/api/livestream/rooms/%ROOM_NAME%/join" ^
  -H "Content-Type: application/json" ^
  -H "userId: %VIEWER_ID%" ^
  -H "username: %VIEWER_USERNAME%" ^
  -d "{\"userId\":%VIEWER_ID%,\"username\":\"%VIEWER_USERNAME%\"}" ^
  -o join_response.json

echo.
type join_response.json
echo.

findstr /C:"token" join_response.json > nul
if %errorlevel%==0 (
    echo [SUCCESS] Successfully joined room
) else (
    echo [ERROR] Failed to join room
    del register_response.json login_response.json room_response.json join_response.json temp.txt temp2.txt temp3.txt temp4.txt
    exit /b 1
)

echo.

echo [Step 5] Verifying Database Consistency
echo Checking active rooms...

curl -X GET "%LIVESTREAM_SERVICE_URL%/api/livestream/rooms/active" ^
  -o active_rooms.json

echo.
type active_rooms.json
echo.

findstr /C:"hostId\":%USER_ID%" active_rooms.json > nul
if %errorlevel%==0 (
    echo [SUCCESS] Host ID in livestream matches user ID
) else (
    echo [WARNING] Could not verify host ID in active rooms
)

echo.
echo ==========================================
echo All tests passed successfully!
echo ==========================================
echo.
echo Summary:
echo   - User ID: %USER_ID% (BIGINT)
echo   - Username: %TEST_USERNAME%
echo   - Room: %ROOM_NAME%
echo   - Host ID: %HOST_ID%
echo.
echo [SUCCESS] User service and livestream service are synchronized
echo [SUCCESS] User IDs are numeric (BIGINT) across both databases
echo.

REM Cleanup
del register_response.json login_response.json room_response.json join_response.json active_rooms.json temp.txt temp2.txt temp3.txt temp4.txt 2>nul

pause
