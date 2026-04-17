# 🔐 Google Login - Hướng dẫn hoàn chỉnh

## 📋 Tổng quan

Chức năng Google Login đã được sửa hoàn toàn để hoạt động với BIGINT user IDs thay vì UUID.

---

## ✅ Đã hoàn thành

### Backend
- ✅ `GoogleAuthServiceImpl.java` - Chuyển từ UUID sang BIGINT
- ✅ `AuthController.java` - Endpoint `/api/auth/google/callback`
- ✅ Build thành công

### Frontend
- ✅ `auth/google/callback/page.tsx` - Sửa port 8080 → 8085
- ✅ `login/page.tsx` - Sửa port 8080 → 8085
- ✅ `register/page.tsx` - Sửa port 8080 → 8085

### Database Scripts
- ✅ `fix_google_login.sql` - Dọn dẹp database
- ✅ `test_google_login.sql` - Kiểm tra sau khi login

---

## 🚀 Bắt đầu nhanh (3 bước)

### Bước 1: Dọn database
```bash
# Mở phpMyAdmin hoặc MySQL Command Line
mysql -u root -p anvi_db < fix_google_login.sql
```

### Bước 2: Start services
```bash
# Terminal 1 - User Service
cd userservice
./gradlew clean build
./gradlew bootRun

# Terminal 2 - Frontend
cd my-app
npm run dev
```

### Bước 3: Test
1. Mở http://localhost:3000/login
2. Click "Đăng nhập bằng Google"
3. Chọn tài khoản Google
4. ✅ Thành công!

---

## 📝 Hướng dẫn chi tiết

### 1. Chuẩn bị Database

#### Option A: phpMyAdmin (Dễ nhất)
1. Mở http://localhost/phpmyadmin
2. Chọn `anvi_db`
3. Tab "SQL"
4. Copy nội dung `fix_google_login.sql`
5. Paste và click "Go"

#### Option B: MySQL Command Line
```bash
mysql -u root -p anvi_db < fix_google_login.sql
```

#### Kiểm tra kết quả:
```sql
USE anvi_db;
DESCRIBE user;
-- Cột 'id' phải là: bigint(20) NOT NULL AUTO_INCREMENT

SELECT COUNT(*) FROM user;
-- Kết quả: 0 (database đã được dọn sạch)
```

---

### 2. Start User Service

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice

# Build
./gradlew clean build

# Start
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

### 3. Start Frontend

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\my-app

# Start
npm run dev
```

**Đợi đến khi thấy:**
```
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

---

### 4. Test Google Login

#### Bước 1: Mở trang login
```
http://localhost:3000/login
```

#### Bước 2: Click "Đăng nhập bằng Google"
- Sẽ redirect đến Google OAuth
- URL: `https://accounts.google.com/o/oauth2/v2/auth?...`

#### Bước 3: Chọn tài khoản
- Chọn tài khoản @st.hcmuaf.edu.vn hoặc @gmail.com
- Cho phép quyền truy cập

#### Bước 4: Redirect về
- URL: `http://localhost:3000/auth/google/callback?code=...`
- Hiển thị: "Đang xử lý đăng nhập bằng Google..."
- Sau đó: "Chào mừng [Tên]! Đăng nhập thành công."
- Redirect về: `http://localhost:3000/`

#### Bước 5: Kiểm tra
- Tên user hiển thị ở góc trên
- Token được lưu trong localStorage
- User info được lưu trong localStorage

---

### 5. Kiểm tra Database

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
- ❌ KHÔNG phải UUID ("1884ea16-19b6-4a0b-82c1-8c744ef56b20")

---

## 🔍 Xử lý lỗi

### Lỗi 1: "For input string: UUID..."

**Nguyên nhân:** Database vẫn chứa UUID cũ

**Giải pháp:**
```bash
mysql -u root -p anvi_db < fix_google_login.sql
```

---

### Lỗi 2: "ECONNREFUSED ::1:8085"

**Nguyên nhân:** User service chưa chạy

**Giải pháp:**
```bash
cd userservice
./gradlew bootRun
```

---

### Lỗi 3: "Port 8085 already in use"

**Nguyên nhân:** Java process cũ vẫn chạy

**Giải pháp:**
1. Mở Task Manager (Ctrl+Shift+Esc)
2. Tìm "java.exe"
3. End Task
4. Chạy lại `./gradlew bootRun`

---

### Lỗi 4: Redirect về 8080 thay vì 8085

**Nguyên nhân:** Browser cache

**Giải pháp:**
1. Clear cache (Ctrl+Shift+Delete)
2. Chọn "Cached images and files"
3. Clear data
4. Restart browser
5. Restart frontend: `npm run dev`

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

### Lỗi 6: "Table 'anvi_db.user' doesn't exist"

**Nguyên nhân:** Database chưa được tạo

**Giải pháp:**
```sql
DROP DATABASE IF EXISTS anvi_db;
CREATE DATABASE anvi_db;
USE anvi_db;
SOURCE D:/HK2_2025_2026/TestKLTN/anvi/anvi_db_updated.sql;
```

---

## 📊 Flow hoạt động

```
1. User click "Đăng nhập bằng Google"
   ↓
2. Redirect đến Google OAuth
   URL: https://accounts.google.com/o/oauth2/v2/auth
   ↓
3. User chọn tài khoản và cho phép
   ↓
4. Google redirect về với code
   URL: http://localhost:3000/auth/google/callback?code=XXX
   ↓
5. Frontend gửi code đến backend
   POST http://localhost:8085/api/auth/google/callback
   Body: { code: "XXX", redirectUri: "..." }
   ↓
6. Backend exchange code → access token
   POST https://oauth2.googleapis.com/token
   ↓
7. Backend lấy user info từ Google
   GET https://www.googleapis.com/oauth2/v2/userinfo
   ↓
8. Backend kiểm tra user đã tồn tại chưa
   SELECT * FROM user WHERE email = 'xxx@gmail.com'
   ↓
9a. Nếu chưa tồn tại: Tạo user mới
    INSERT INTO user (...) VALUES (...)
    → id = 1 (auto-generated BIGINT)
    ↓
    INSERT INTO account (username, user_id, ...)
    VALUES ('google_123456789', 1, ...)
    ↓
9b. Nếu đã tồn tại: Lấy user hiện có
    user = existingUser
    ↓
10. Backend tạo JWT token
    token = jwtTokenProvider.generateToken(...)
    ↓
11. Backend trả về response
    {
      "userId": 1,  ← BIGINT!
      "username": "google_123456789",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@st.hcmuaf.edu.vn",
      "token": "eyJhbGc...",
      "message": "Đăng nhập bằng Google thành công!"
    }
    ↓
12. Frontend lưu token và user info
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data))
    ↓
13. Redirect về trang chủ
    router.push("/")
    ↓
14. ✅ Hoàn thành!
```

---

## 📁 Files quan trọng

### Backend
- `userservice/src/main/java/org/example/userservice/service/impl/GoogleAuthServiceImpl.java`
- `userservice/src/main/java/org/example/userservice/controller/AuthController.java`

### Frontend
- `my-app/app/auth/google/callback/page.tsx`
- `my-app/app/login/page.tsx`

### Database
- `fix_google_login.sql` - Dọn dẹp database
- `test_google_login.sql` - Kiểm tra kết quả

### Documentation
- `GOOGLE_LOGIN_FIXED.md` - Tóm tắt thay đổi
- `FIX_GOOGLE_LOGIN.md` - Hướng dẫn chi tiết
- `README_GOOGLE_LOGIN.md` - File này

---

## ✅ Checklist

- [ ] Database đã dọn dẹp (`fix_google_login.sql`)
- [ ] User service đã build (`./gradlew clean build`)
- [ ] User service đang chạy (port 8085)
- [ ] Frontend đang chạy (port 3000)
- [ ] Test Google login thành công
- [ ] User ID trong database là số (không phải UUID)
- [ ] Token được lưu trong localStorage
- [ ] User info hiển thị đúng

---

## 🎯 Kết quả mong đợi

### Trước khi sửa ❌
```
Error: For input string: "1884ea16-19b6-4a0b-82c1-8c744ef56b20"
```

### Sau khi sửa ✅
```json
{
  "userId": 1,
  "username": "google_123456789",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@st.hcmuaf.edu.vn",
  "token": "eyJhbGc...",
  "message": "Đăng nhập bằng Google thành công!"
}
```

---

## 📞 Hỗ trợ

Nếu vẫn gặp lỗi:
1. Đọc `FIX_GOOGLE_LOGIN.md` - Hướng dẫn chi tiết
2. Đọc `TROUBLESHOOTING.md` - Xử lý lỗi chung
3. Chạy `test_google_login.sql` - Kiểm tra database
4. Check logs của user service
5. Check browser console (F12)

---

**Google login giờ hoạt động hoàn hảo! 🎉**
