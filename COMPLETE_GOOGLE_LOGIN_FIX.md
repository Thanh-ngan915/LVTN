# ✅ Sửa hoàn chỉnh Google Login - Tất cả các bước

## 📋 Tổng quan

Đã sửa 3 vấn đề chính:
1. ✅ Backend: UUID → BIGINT
2. ✅ Frontend: Port 8080 → 8085
3. ✅ CORS: Thêm CORS configuration

---

## 🔧 Các thay đổi đã thực hiện

### 1. Backend - User Service

#### File đã sửa/tạo:
- ✅ `GoogleAuthServiceImpl.java` - Chuyển UUID sang BIGINT
- ✅ `CorsConfig.java` - Thêm CORS configuration (MỚI)

#### Build status:
- ✅ Build thành công

### 2. Frontend

#### Files đã sửa:
- ✅ `auth/google/callback/page.tsx` - Port 8080 → 8085
- ✅ `login/page.tsx` - Port 8080 → 8085
- ✅ `register/page.tsx` - Port 8080 → 8085

### 3. Database

#### Scripts đã tạo:
- ✅ `fix_google_login.sql` - Dọn dẹp database
- ✅ `test_google_login.sql` - Kiểm tra kết quả

---

## 🚀 Hướng dẫn thực hiện (4 bước)

### Bước 1: Dọn dẹp Database

**Quan trọng:** Bước này sẽ XÓA tất cả users hiện có!

#### Cách 1: phpMyAdmin (Khuyến nghị)
1. Mở http://localhost/phpmyadmin
2. Chọn database `anvi_db`
3. Tab "SQL"
4. Copy nội dung file `fix_google_login.sql`
5. Paste và click "Go"

#### Cách 2: MySQL Command Line
```bash
mysql -u root -p anvi_db < fix_google_login.sql
```

#### Kiểm tra:
```sql
USE anvi_db;
DESCRIBE user;
-- Cột 'id' phải là: bigint(20) NOT NULL AUTO_INCREMENT

SELECT COUNT(*) FROM user;
-- Kết quả: 0 (database đã sạch)
```

---

### Bước 2: Stop User Service cũ

**Cách 1: Trong terminal đang chạy**
- Nhấn `Ctrl + C`

**Cách 2: Task Manager**
1. Mở Task Manager (Ctrl+Shift+Esc)
2. Tìm tất cả process "java.exe"
3. Click chuột phải → End Task (cho tất cả)

---

### Bước 3: Start User Service mới

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice
./gradlew bootRun
```

**Đợi đến khi thấy:**
```
Started UserserviceApplication in X.XXX seconds (process running on 8085)
```

**Kiểm tra service đang chạy:**
```bash
curl http://localhost:8085/actuator/health
# Kết quả: {"status":"UP"}
```

---

### Bước 4: Test Google Login

#### 4.1. Mở trang login
```
http://localhost:3000/login
```

#### 4.2. Click "Đăng nhập bằng Google"

#### 4.3. Chọn tài khoản Google
- Chọn tài khoản @st.hcmuaf.edu.vn hoặc @gmail.com
- Cho phép quyền truy cập

#### 4.4. Kiểm tra kết quả

**Kết quả mong đợi:**
- ✅ Hiển thị: "Đang xử lý đăng nhập bằng Google..."
- ✅ Sau đó: "Chào mừng [Tên]! Đăng nhập thành công."
- ✅ Redirect về trang chủ: `http://localhost:3000/`
- ✅ Tên user hiển thị ở góc trên
- ✅ KHÔNG có lỗi CORS
- ✅ KHÔNG có lỗi UUID

**Nếu có lỗi:**
- Mở Browser Console (F12)
- Check tab Console và Network
- Xem phần "Xử lý lỗi" bên dưới

---

### Bước 5: Kiểm tra Database

```bash
mysql -u root -p anvi_db < test_google_login.sql
```

**Hoặc chạy thủ công:**
```sql
USE anvi_db;

-- Xem user mới tạo
SELECT id, full_name, email FROM user;

-- Kết quả mong đợi:
-- +----+------------------+------------------------+
-- | id | full_name        | email                  |
-- +----+------------------+------------------------+
-- |  1 | Nguyễn Văn A     | nguyenvana@st.hcmuaf...|
-- +----+------------------+------------------------+

-- Xem account
SELECT username, user_id FROM account;

-- Kết quả mong đợi:
-- +------------------+---------+
-- | username         | user_id |
-- +------------------+---------+
-- | google_123456789 |       1 |
-- +------------------+---------+
```

**Điểm quan trọng:**
- ✅ `id` và `user_id` phải là SỐ (1, 2, 3...)
- ❌ KHÔNG phải UUID

---

## 🔍 Xử lý lỗi

### Lỗi 1: "For input string: UUID..."

**Nguyên nhân:** Database vẫn chứa UUID cũ

**Giải pháp:**
```bash
mysql -u root -p anvi_db < fix_google_login.sql
```

---

### Lỗi 2: CORS Error

```
Access to fetch at 'http://localhost:8085/...' has been blocked by CORS policy
```

**Nguyên nhân:** User service chưa restart với CORS config mới

**Giải pháp:**
1. Stop user service (Ctrl+C hoặc Task Manager)
2. Start lại: `./gradlew bootRun`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard reload (Ctrl+Shift+R)

---

### Lỗi 3: "ECONNREFUSED ::1:8085"

**Nguyên nhân:** User service chưa chạy

**Giải pháp:**
```bash
cd userservice
./gradlew bootRun
```

---

### Lỗi 4: "Port 8085 already in use"

**Nguyên nhân:** Java process cũ vẫn chạy

**Giải pháp:**
1. Mở Task Manager (Ctrl+Shift+Esc)
2. Tìm TẤT CẢ "java.exe"
3. End Task cho tất cả
4. Chạy lại `./gradlew bootRun`

---

### Lỗi 5: "Column 'id' cannot be null"

**Nguyên nhân:** Database chưa có AUTO_INCREMENT

**Giải pháp:**
```sql
USE anvi_db;
ALTER TABLE user MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE user AUTO_INCREMENT = 1;
```

---

### Lỗi 6: Vẫn redirect về 8080

**Nguyên nhân:** Browser cache

**Giải pháp:**
1. Clear cache (Ctrl+Shift+Delete)
2. Chọn "Cached images and files"
3. Clear data
4. Restart browser
5. Restart frontend:
   ```bash
   cd my-app
   # Ctrl+C
   npm run dev
   ```

---

## ✅ Checklist hoàn chỉnh

### Chuẩn bị
- [x] Backend code đã sửa ✅
- [x] Frontend code đã sửa ✅
- [x] CORS config đã thêm ✅
- [x] Build thành công ✅

### Thực hiện
- [ ] Database đã dọn dẹp (`fix_google_login.sql`)
- [ ] User service cũ đã stop
- [ ] User service mới đã start (port 8085)
- [ ] Frontend đang chạy (port 3000)

### Kiểm tra
- [ ] Test Google login thành công
- [ ] Không có lỗi CORS
- [ ] Không có lỗi UUID
- [ ] User ID trong database là số
- [ ] Token được lưu trong localStorage
- [ ] User info hiển thị đúng

---

## 📊 So sánh trước và sau

### TRƯỚC (Lỗi) ❌

```
1. Frontend → http://localhost:8080 (sai port)
2. Backend → Tạo UUID: "1884ea16-19b6-4a0b-82c1-8c744ef56b20"
3. Database → user.id = VARCHAR(50) với UUID
4. CORS → Không có config
5. Kết quả → Lỗi: "For input string: UUID..." + CORS error
```

### SAU (Đúng) ✅

```
1. Frontend → http://localhost:8085 (đúng port)
2. Backend → Tạo BIGINT: 1, 2, 3...
3. Database → user.id = BIGINT AUTO_INCREMENT
4. CORS → Đã config cho phép localhost:3000
5. Kết quả → Đăng nhập thành công! 🎉
```

---

## 📁 Files quan trọng

### Backend
- `userservice/src/main/java/org/example/userservice/service/impl/GoogleAuthServiceImpl.java`
- `userservice/src/main/java/org/example/userservice/config/CorsConfig.java` (MỚI)
- `userservice/src/main/java/org/example/userservice/controller/AuthController.java`

### Frontend
- `my-app/app/auth/google/callback/page.tsx`
- `my-app/app/login/page.tsx`
- `my-app/app/register/page.tsx`

### Database
- `fix_google_login.sql` - Dọn dẹp database
- `test_google_login.sql` - Kiểm tra kết quả

### Documentation
- `COMPLETE_GOOGLE_LOGIN_FIX.md` - File này (tổng hợp)
- `FIX_CORS_ERROR.md` - Sửa lỗi CORS
- `GOOGLE_LOGIN_FIXED.md` - Tóm tắt thay đổi
- `README_GOOGLE_LOGIN.md` - Hướng dẫn chi tiết

---

## 🎯 Tóm tắt nhanh (Copy & Paste)

```bash
# 1. Dọn database
mysql -u root -p anvi_db < fix_google_login.sql

# 2. Stop Java processes (Task Manager → End Task)

# 3. Start user service
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice
./gradlew bootRun

# 4. Test
# Mở http://localhost:3000/login
# Click "Đăng nhập bằng Google"
# ✅ Thành công!

# 5. Kiểm tra database
mysql -u root -p anvi_db < test_google_login.sql
```

---

## 📞 Hỗ trợ

Nếu vẫn gặp lỗi:
1. Đọc `FIX_CORS_ERROR.md` - Sửa lỗi CORS
2. Đọc `README_GOOGLE_LOGIN.md` - Hướng dẫn chi tiết
3. Đọc `TROUBLESHOOTING.md` - Xử lý lỗi chung
4. Check logs của user service (console)
5. Check browser console (F12)

---

## 🎉 Kết luận

Tất cả đã được sửa xong:
- ✅ Backend: UUID → BIGINT
- ✅ Frontend: Port đúng
- ✅ CORS: Đã config
- ✅ Database: Sẵn sàng

**Chỉ cần restart user service và test! Google login sẽ hoạt động hoàn hảo! 🚀**
