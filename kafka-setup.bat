@echo off
echo ============================================
echo   KAFKA KRAFT - First Time Setup (PowerShell)
echo ============================================

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$env:KAFKA_HOME='C:\kafka_2.13-4.2.0\kafka_2.13-4.2.0'; ^
   $libs = (Get-ChildItem \"$env:KAFKA_HOME\libs\*.jar\" | ForEach-Object { $_.FullName }) -join ';'; ^
   $env:CLASSPATH = $libs; ^
   Write-Host 'Generating Cluster UUID...'; ^
   $uuid = java -cp $libs kafka.tools.StorageTool random-uuid 2>&1 | Select-String -Pattern '^[a-zA-Z0-9_-]+$' | ForEach-Object { $_.Line.Trim() }; ^
   Write-Host \"Cluster ID: $uuid\"; ^
   if ($uuid) { ^
     Write-Host 'Formatting storage...'; ^
     java -cp $libs kafka.tools.StorageTool format --standalone -t $uuid -c \"$env:KAFKA_HOME\config\server.properties\"; ^
     Write-Host ''; ^
     Write-Host 'Setup complete!'; ^
   } else { ^
     Write-Host 'ERROR: Could not generate UUID'; ^
   }"

pause
