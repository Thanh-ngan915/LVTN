@echo off
echo ========================================
echo TESTING API ENDPOINTS
echo ========================================
echo.

echo Testing API Gateway Health...
curl -X GET http://localhost:8080/actuator/health
echo.
echo.

echo Testing User Service Health...
curl -X GET http://localhost:8085/actuator/health
echo.
echo.

echo Testing Login Endpoint...
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
echo.
echo.

echo ========================================
echo TEST COMPLETED
echo ========================================
pause
