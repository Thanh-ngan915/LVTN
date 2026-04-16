# 🔍 Debug lỗi 500 Internal Server Error - Google Login

## Lỗi hiện tại

```
POST http://localhost:8085/api/auth/google/callback 500 (Internal Server Error)
```

## Nguyên nhân có thể

1. ❌ Database vẫn chứa UUID cũ
2. ❌ Database structure không đúng
3. ❌ Backend code có exception
4. ❌ Google OAuth config sai

---

## Bước 1: Kiểm tra Backend Logs

### Cách xem logs:

Trong terminal đang chạy `./gradlew bootRun`, tìm dòng lỗi màu đỏ khi bạn click "Đăng nhập bằng Google".

**Các lỗi thường gặp:**

### Lỗi A: Data truncation
```
Data truncation: Incorrect integer value: '1884ea16-...' for column 'user_id'
```

**Nguyên nhân:** Database vẫn chứa UUID cũ

**Giải pháp:**
```bash
mysql -u root -p anvi_db < fix_database_complete.sql
```

---

### Lỗi B: Column 'id' cannot be null
```
Column 'id' cannot be null
```

**Nguyên nhân:** User.id không có AUTO_INCREMENT

**Giải pháp:**
```sql
USE anvi_db;
ALTER TABLE user MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE user AUTO_INCREMENT = 1;
```

---

### Lỗi C: NullPointerException
```
java.lang.NullPointerException: Cannot invoke "getId()" because "user" is null
```

**Nguyên nhân:** User không được save đúng cách

**Giải pháp:** Đã sửa trong code, rebuild:
```bash
cd userservice
./gradlew clean build
./gradlew bootRun
```

---

### Lỗi D: Foreign key constraint
```
Cannot add or update a child row: a foreign key constraint fails
```

**Nguyên nhân:** store_role_id không tồn tại

**Giải pháp:** Chạy script dọn dẹp:
```bash
mysql -u root -p anvi_db < fix_database_complete.sql
```

---

## Bước 2: Kiểm tra Database

### Test 1: Kiểm tra cấu trúc
```sql
USE anvi_db;

-- Kiểm tra user table
DESCRIBE user;
-- Cột 'id' phải là: bigint(20) NOT NULL AUTO_INCREMENT

-- Kiểm tra account table
DESCRIBE account;
-- Cột 'user_id' phải là: bigint(20) DEFAULT NULL

-- Kiểm tra permission table
DESCRIBE permission;
-- Cột 'user_id' phải là: bigint(20) DEFAULT NULL
```

### Test 2: Kiểm tra dữ liệu
```sql
-- Phải trả về 0
SELECT COUNT(*) FROM user;
SELECT COUNT(*) FROM account;
SELECT COUNT(*) FROM permission;

-- Nếu > 0, có dữ liệu cũ, cần xóa:
TRUNCATE TABLE permission;
TRUNCATE TABLE account;
TRUNCATE TABLE user;
TRUNCATE TABLE storerole;
```

### Test 3: Kiểm tra AUTO_INCREMENT
```sql
SELECT AUTO_INCREMENT 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'anvi_db' 
AND TABLE_NAME = 'user';
-- Phải trả về: 1
```

---

## Bước 3: Chạy Script Sửa Hoàn Chỉnh

### Cách 1: phpMyAdmin
1. Mở http://localhost/phpmyadmin
2. Chọn `anvi_db`
3. Tab "SQL"
4. Copy nội dung `fix_database_complete.sql`
5. Paste và click "Go"

### Cách 2: MySQL Command Line
```bash
mysql -u root -p anvi_db < fix_database_complete.sql
```

### Kiểm tra kết quả:
Script sẽ hiển thị:
- Cấu trúc các bảng
- Số lượng records (phải = 0)
- AUTO_INCREMENT (phải = 1)

---

## Bước 4: Restart Backend

### Stop service cũ
1. Trong terminal: `Ctrl + C`
2. Hoặc Task Manager: End Task "java.exe"

### Rebuild và start
```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice
./gradlew clean build
./gradlew bootRun
```

### Đợi thấy:
```
Started UserserviceApplication in X.XXX seconds
```

---

## Bước 5: Test Backend Health

### Test 1: Health check
```bash
curl http://localhost:8085/actuator/health
```
Kết quả mong đợi: `{"status":"UP"}`

### Test 2: Register endpoint
```bash
curl -X POST http://localhost:8085/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"password\":\"password123\",\"fullName\":\"Test User\",\"email\":\"test@example.com\"}"
```

Kết quả mong đợi:
```json
{
  "userId": 1,  // ← Phải là số!
  "username": "testuser",
  "fullName": "Test User"
}
```

### Test 3: Check database
```sql
SELECT * FROM user;
-- Phải có 1 user với id = 1

SELECT * FROM account;
-- Phải có 1 account với user_id = 1
```

---

## Bước 6: Test Google Login Lại

1. Clear browser cache (Ctrl+Shift+Delete)
2. Mở http://localhost:3000/login
3. Click "Đăng nhập bằng Google"
4. Chọn tài khoản Google

### Nếu vẫn lỗi 500:

**Xem logs backend ngay lúc click:**
- Trong terminal đang chạy `./gradlew bootRun`
- Tìm stack trace màu đỏ
- Copy toàn bộ error message

**Các thông tin cần:**
```
java.lang.XXXException: ...
  at org.example.userservice.service.impl.GoogleAuthServiceImpl.loginWithGoogle(...)
  at ...
```

---

## Debug Checklist

- [ ] Database đã chạy `fix_database_complete.sql`
- [ ] User table có AUTO_INCREMENT
- [ ] account.user_id là BIGINT
- [ ] permission.user_id là BIGINT
- [ ] Tất cả tables đều rỗng (COUNT = 0)
- [ ] Backend đã rebuild
- [ ] Backend đang chạy (port 8085)
- [ ] Health check trả về UP
- [ ] Register endpoint hoạt động
- [ ] Browser cache đã clear

---

## Các lệnh hữu ích

### Xem logs backend real-time
```bash
# Trong terminal đang chạy ./gradlew bootRun
# Logs sẽ hiển thị tự động
```

### Kiểm tra port 8085
```bash
# Windows
netstat -ano | findstr :8085

# Nếu có process, kill nó:
taskkill /PID <PID> /F
```

### Reset hoàn toàn database
```sql
DROP DATABASE IF EXISTS anvi_db;
CREATE DATABASE anvi_db;
USE anvi_db;
SOURCE D:/HK2_2025_2026/TestKLTN/anvi/anvi_db_updated.sql;
```

---

## Nếu vẫn lỗi

Cung cấp thông tin sau:

1. **Backend logs** (stack trace đầy đủ)
2. **Database structure:**
   ```sql
   DESCRIBE user;
   DESCRIBE account;
   DESCRIBE permission;
   ```
3. **Data count:**
   ```sql
   SELECT COUNT(*) FROM user;
   SELECT COUNT(*) FROM account;
   ```
4. **Browser console error** (F12 → Console tab)

---

## Tóm tắt nhanh

```bash
# 1. Dọn database
mysql -u root -p anvi_db < fix_database_complete.sql

# 2. Stop backend (Ctrl+C hoặc Task Manager)

# 3. Rebuild
cd userservice
./gradlew clean build

# 4. Start
./gradlew bootRun

# 5. Test health
curl http://localhost:8085/actuator/health

# 6. Test Google login
# Mở http://localhost:3000/login
```

---

**Nếu làm đúng các bước trên, lỗi 500 sẽ được fix! 🎯**
