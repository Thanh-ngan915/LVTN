$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ANVI Shop - One Click K8s Deploy"          -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Building Docker Images..." -ForegroundColor Yellow
cd k8s
.\build-all.ps1
cd ..

Write-Host "`n[2/2] Deploying to Kubernetes..." -ForegroundColor Yellow
kubectl apply -f k8s/

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Deployment Initiated!"                      -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "You can check the status of your pods by running:" -ForegroundColor White
Write-Host "  kubectl get pods -n anvi-dev -w" -ForegroundColor Cyan
Write-Host "`nLưu ý: Bạn có thể cần đợi vài phút ở lần chạy đầu tiên để MySQL khởi tạo xong database." -ForegroundColor White
