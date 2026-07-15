$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ANVI Shop - Building Docker Images"        -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$services = @(
    @{ Name = "anvi-mysql";             Context = "docker" },
    @{ Name = "anvi-userservice";       Context = "userservice" },
    @{ Name = "anvi-productservice";    Context = "productservice" },
    @{ Name = "anvi-orderservice";      Context = "orderservice" },
    @{ Name = "anvi-store-service";     Context = "store-service" },
    @{ Name = "anvi-livestreamservice"; Context = "livetreamservice" },
    @{ Name = "anvi-chatbot-service";   Context = "chatbot-service" },
    @{ Name = "anvi-fastapi";           Context = "fastapi" },
    @{ Name = "anvi-apigateway";        Context = "apigatewway" },
    @{ Name = "anvi-frontend";          Context = "my-app" }
)

$failed = @()
$succeeded = @()

foreach ($svc in $services) {
    $tag = "$($svc.Name):local"
    $ctx = $svc.Context
    Write-Host ""
    Write-Host ">> Building $tag from ./$ctx ..." -ForegroundColor Yellow

    try {
        docker build -t $tag "./$ctx"
        if ($LASTEXITCODE -ne 0) { throw "docker build failed" }
        $succeeded += $tag
        Write-Host "   OK: $tag" -ForegroundColor Green
    } catch {
        $failed += $tag
        Write-Host "   FAILED: $tag" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Build Summary"                              -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Succeeded: $($succeeded.Count) / $($services.Count)" -ForegroundColor Green
foreach ($s in $succeeded) { Write-Host "    OK  $s" -ForegroundColor Green }

if ($failed.Count -gt 0) {
    Write-Host "  Failed: $($failed.Count) / $($services.Count)" -ForegroundColor Red
    foreach ($f in $failed) { Write-Host "    ERR $f" -ForegroundColor Red }
    Write-Host "Fix errors above and re-run this script." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All images built! Next steps:" -ForegroundColor Green
Write-Host "  kubectl apply -f k8s/" -ForegroundColor White
Write-Host "  kubectl get pods -n anvi-dev -w" -ForegroundColor White
