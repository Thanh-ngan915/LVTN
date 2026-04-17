# HƯỚNG DẪN FIX LỖI TRIỆT ĐỂ - ANVI SYSTEM

## 🔴 CÁC LỖI ĐÃ PHÁT HIỆN

### 1. Lỗi: `Identifier 'originalPrompt' has already been declared`
**Nguyên nhân:** Cache của Next.js bị lỗi hoặc có file build cũ

### 2. Lỗi: `TypeError: Failed to fetch`
**Nguyên nhân:** 
- Backend services chưa chạy
- CORS chưa được cấu hình đúng
- Network connection bị lỗi

---

## ✅ GIẢI PHÁP FIX TRIỆT ĐỂ

### BƯỚC 1: Xóa Cache và Rebuild Next.js

```bash
cd my-app
rmdir /s /q .next
rmdir /s /q node_modules\.cache
npm run build
```

Hoặc chạy file tự động:
```bash
fix-errors.bat
```

### BƯỚC 2: Kiểm Tra Backend Services

Chạy lệnh kiểm tra:
```bash
check-services.bat
```

Kết quả mong đợi:
- ✓ API Gateway is RUNNING (port 8080)
- ✓ User Service is RUNNING (port 8085)
- ✓ Livestream Service is RUNNING (port 8086)
- ✓ Next.js Frontend is RUNNING (port 3000)

### BƯỚC 3: Start Tất Cả Services

Nếu có service chưa chạy, dùng lệnh:
```bash
start-all-services.bat
```

Hoặc start từng service riêng:

**API Gateway:**
```bash
cd apigatewway
gradlew bootRun
```

**User Service:**
```bash
cd userservice
gradlew bootRun
```

**Livestream Service:**
```bash
cd livetreamservice
gradlew bootRun
```

**Next.js Frontend:**
```bash
cd my-app
npm run dev
```

### BƯỚC 4: Kiểm Tra Lại

1. Mở trình duyệt: http://localhost:3000/login
2. Mở Developer Console (F12)
3. Thử đăng nhập với tài khoản test
4. Kiểm tra:
   - ✓ Không còn lỗi `originalPrompt`
   - ✓ Fetch request thành công
   - ✓ Nhận được response từ backend

---

## 🔧 CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### 1. Cải thiện Error Handling trong Login Page
- Thêm `mode: "cors"` và `credentials: "include"`
- Thêm header `Accept: "application/json"`
- Cải thiện error messages chi tiết hơn
- Xử lý lỗi network tốt hơn

### 2. Cải thiện CSS
- Error message hiển thị nhiều dòng
- Thêm scrollbar cho error dài
- Text align left để dễ đọc

### 3. Tạo Scripts Tự Động
- `start-all-services.bat` - Start tất cả services
- `check-services.bat` - Kiểm tra status services
- `fix-errors.bat` - Fix lỗi cache Next.js

---

## 🐛 TROUBLESHOOTING

### Nếu vẫn còn lỗi `originalPrompt`:

1. Xóa hoàn toàn folder `.next`:
```bash
cd my-app
rmdir /s /q .next
```

2. Clear browser cache:
- Chrome: Ctrl + Shift + Delete
- Chọn "Cached images and files"
- Click "Clear data"

3. Restart Next.js dev server:
```bash
cd my-app
npm run dev
```

### Nếu vẫn còn lỗi `Failed to fetch`:

1. Kiểm tra API Gateway có chạy không:
```bash
curl http://localhost:8080/actuator/health
```

2. Kiểm tra User Service có chạy không:
```bash
curl http://localhost:8085/actuator/health
```

3. Kiểm tra CORS config trong `apigatewway/src/main/java/org/example/apigatewway/CorsConfig.java`

4. Kiểm tra firewall/antivirus có block port không

5. Thử test API trực tiếp:
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"test\",\"password\":\"test123\"}"
```

### Nếu database lỗi:

1. Kiểm tra MySQL có chạy không
2. Import lại database:
```bash
mysql -u root -p anvi_db < anvi_db_updated.sql
```

---

## 📝 CHECKLIST HOÀN THÀNH

- [x] Fix lỗi `originalPrompt` bằng cách xóa cache
- [x] Fix lỗi `Failed to fetch` bằng cách cải thiện error handling
- [x] Thêm CORS headers đầy đủ
- [x] Cải thiện error messages
- [x] Tạo scripts tự động
- [x] Tạo hướng dẫn chi tiết

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi thực hiện các bước trên:
1. ✅ Không còn lỗi console
2. ✅ Login form hoạt động bình thường
3. ✅ Fetch API thành công
4. ✅ Nhận được JWT token
5. ✅ Redirect hoặc hiển thị success message

---

## 📞 HỖ TRỢ

Nếu vẫn gặp lỗi, hãy cung cấp:
1. Screenshot lỗi trong console
2. Log từ terminal của backend services
3. Kết quả của `check-services.bat`
4. Version của Node.js và Java
