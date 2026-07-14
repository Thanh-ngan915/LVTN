@echo off
echo ============================================
echo   ANVI SHOP - Start All Services
echo ============================================
echo.

set KAFKA_HOME=e:\tool\kafka_2.13-4.3.1\kafka_2.13-4.3.1
set PROJECT_HOME=e:\20252026\KLTN_Ecommerce\LVTN

echo [1/5] Starting Kafka (KRaft mode)...
start "Kafka Broker" cmd /k "cd /d %KAFKA_HOME% && bin\windows\kafka-server-start.bat config\server.properties"
echo      Waiting 15 seconds for Kafka to start...
timeout /t 15 /nobreak >nul

echo [2/5] Starting UserService (port 8085)...
start "UserService" cmd /k "cd /d %PROJECT_HOME%\userservice && gradlew.bat bootRun"
echo      Waiting 20 seconds for UserService to start...
timeout /t 20 /nobreak >nul

echo [3/5] Starting OrderService (port 8088)...
start "OrderService" cmd /k "cd /d %PROJECT_HOME%\orderservice && gradlew.bat bootRun"
echo      Waiting 20 seconds for OrderService to start...
timeout /t 20 /nobreak >nul

echo [4/5] Starting API Gateway (port 8080)...
start "API Gateway" cmd /k "cd /d %PROJECT_HOME%\apigatewway && gradlew.bat bootRun"
echo      Waiting 15 seconds for Gateway to start...
timeout /t 15 /nobreak >nul

echo [5/5] Starting Frontend (port 3000)...
start "Frontend" cmd /k "cd /d %PROJECT_HOME%\my-app && npm run dev"

echo.
echo ============================================
echo   All services started!
echo   - Kafka:        localhost:9092
echo   - UserService:  localhost:8085
echo   - OrderService: localhost:8088
echo   - API Gateway:  localhost:8080
echo   - Frontend:     localhost:3000
echo ============================================
echo.
echo Press any key to exit this launcher...
pause >nul
