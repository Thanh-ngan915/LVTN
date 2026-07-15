@echo off
echo ============================================
echo   ANVI SHOP - Start Kafka Only
echo ============================================
echo.

set KAFKA_HOME=e:\tool\kafka_2.13-4.3.1\kafka_2.13-4.3.1

echo Starting Kafka (KRaft mode)...
cd /d %KAFKA_HOME%
bin\windows\kafka-server-start.bat config\server.properties
