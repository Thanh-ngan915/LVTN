# Test UserService API

Write-Host "=== Testing UserService API ===" -ForegroundColor Cyan

# Test 1: Register a new user
Write-Host "`n1. Testing Register..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser123"
    password = "password123"
    fullName = "Test User"
    email = "testuser123@example.com"
    address = "Test Address"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8085/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody
    Write-Host "✓ Register Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "✗ Register Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login
Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    username = "testuser123"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8085/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    Write-Host "✓ Login Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
    $token = $response.token
    Write-Host "`nJWT Token: $token" -ForegroundColor Magenta
} catch {
    Write-Host "✗ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
