@echo off
REM Script test backend health

echo ==========================================
echo Testing Backend Health
echo ==========================================
echo.

REM Test 1: Health check
echo [Test 1] Checking if user service is running...
curl -s http://localhost:8085/actuator/health
echo.
echo.

REM Test 2: Test register endpoint
echo [Test 2] Testing register endpoint...
curl -X POST http://localhost:8085/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser_%RANDOM%\",\"password\":\"password123\",\"fullName\":\"Test User\",\"email\":\"test%RANDOM%@example.com\",\"address\":\"Test\"}"
echo.
echo.

REM Test 3: Check database connection
echo [Test 3] Checking database...
echo Run this in MySQL:
echo mysql -u root -p anvi_db -e "SELECT COUNT(*) FROM user; DESCRIBE user;"
echo.

echo ==========================================
echo Test complete!
echo ==========================================
echo.
echo If you see errors, check:
echo 1. User service is running (port 8085)
echo 2. Database is accessible
echo 3. Database structure is correct
echo.

pause
