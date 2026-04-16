# 🚀 BẮT ĐẦU SỬ DỤNG - ANVI SYSTEM

## ✅ ĐÃ FIX XONG TẤT CẢ LỖI!

Tất cả lỗi đã được fix triệt để:
- ✅ Lỗi `originalPrompt` has already been declared
- ✅ Lỗi `TypeError: Failed to fetch`
- ✅ Lỗi CORS
- ✅ Error handling được cải thiện
- ✅ Login page hoạt động
- ✅ Register page hoạt động

---

## 🎯 CÁCH SỬ DỤNG NHANH NHẤT

### Bước 1: Start tất cả services (1 lệnh duy nhất)

```bash
start-all-services.bat
```

Lệnh này sẽ tự động mở 4 cửa sổ terminal:
1. API Gateway (port 8080)
2. User Service (port 8085)
3. Livestream Service (port 8086)
4. Next.js Frontend (port 3000)

### Bước 2: Đợi services khởi động

Đợi khoảng 30-60 giây để tất cả services khởi động hoàn toàn.

### Bước 3: Kiểm tra status

```bash
check-services.bat
```

Kết quả mong đợi:
```
✓ API Gateway is RUNNING
✓ User Service is RUNNING
✓ Livestream Service is RUNNING
✓ Next.js Frontend is RUNNING
```

### Bước 4: Truy cập ứng dụng

Mở trình duyệt và truy cập:
- **Trang chủ:** http://localhost:3000
- **Đăng nhập:** http://localhost:3000/login
- **Đăng ký:** http://localhost:3000/register

---

## 🔧 CÁC LỆNH HỮU ÍCH

### Kiểm tra services
```bash
check-services.bat
```

### Test API endpoints
```bash
test-api.bat
```

### Clean và rebuild toàn bộ
```bash
clean-rebuild-all.bat
```

### Fix lỗi cache Next.js
```bash
cd my-app
fix-errors.bat
```

---

## 📋 YÊU CẦU HỆ THỐNG

Đảm bảo đã cài đặt:
- ✅ Java 17 hoặc cao hơn
- ✅ Node.js 18 hoặc cao hơn
- ✅ MySQL 8.0 hoặc cao hơn
- ✅ Gradle (hoặc dùng gradlew có sẵn)

### Kiểm tra database

Đảm bảo MySQL đang chạy và database đã được import:

```bash
mysql -u root -p anvi_db < anvi_db_updated.sql
```

---

## 🎨 TÍNH NĂNG ĐÃ CÓ

### 1. Authentication
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập với username/password
- ✅ Đăng nhập với Google OAuth2
- ✅ JWT Token authentication

### 2. Livestream
- ✅ Tạo phòng livestream
- ✅ Tham gia phòng livestream
- ✅ LiveKit integration

### 3. UI/UX
- ✅ Glassmorphism design
- ✅ Responsive layout
- ✅ Loading states
- ✅ Error messages chi tiết
- ✅ Success notifications

---

## 🐛 NẾU GẶP LỖI

### Lỗi: Services không start được

1. Kiểm tra port có bị chiếm không:
```bash
netstat -ano | findstr "8080"
netstat -ano | findstr "8085"
netstat -ano | findstr "8086"
netstat -ano | findstr "3000"
```

2. Kill process nếu cần:
```bash
taskkill /PID <PID_NUMBER> /F
```

### Lỗi: Database connection failed

1. Kiểm tra MySQL có chạy không:
```bash
mysql -u root -p -e "SELECT 1"
```

2. Kiểm tra database có tồn tại không:
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'anvi_db'"
```

3. Import lại database nếu cần:
```bash
mysql -u root -p anvi_db < anvi_db_updated.sql
```

### Lỗi: Next.js cache

```bash
cd my-app
rmdir /s /q .next
npm run dev
```

---

## 📖 TÀI LIỆU THAM KHẢO

- `README_FIX.md` - Tổng quan về các fix đã thực hiện
- `HUONG_DAN_FIX_LOI.md` - Hướng dẫn chi tiết troubleshooting
- `ARCHITECTURE_DIAGRAM.md` - Kiến trúc hệ thống

---

## 🎉 HOÀN THÀNH!

Bây giờ bạn có thể:
1. ✅ Đăng ký tài khoản mới
2. ✅ Đăng nhập vào hệ thống
3. ✅ Sử dụng các tính năng livestream
4. ✅ Phát triển thêm tính năng mới

**Chúc bạn code vui vẻ! 🚀**
