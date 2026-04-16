# 🔧 Sửa lỗi Google Login

## Vấn đề hiện tại

Lỗi hiển thị: `For input string: "1884ea16-19b6-4a0b-82c1-8c744ef56b20"`

**Nguyên nhân:**
1. ❌ Database vẫn chứa dữ liệu cũ với UUID
2. ❌ Frontend gọi sai port (8080 thay vì 8085)
3. ✅ Code backend đã được sửa đúng

---

## Giải pháp (3 bước)

### Bước 1: Sửa Frontend (ĐÃ HOÀN THÀNH ✅)

File `my-app/app/auth/google/callback/page.tsx` đã được sửa:
- Đổi từ `http://localhost:8080` → `http://localhost:8085`

### Bước 2: Dọn dẹp Database

**Quan trọng:** Bước này sẽ XÓA TẤT CẢ users hiện có!

#### Cách 1: Sử dụng phpMyAdmin (Dễ nhất)

1. Mở phpMyAdmin: http://localhost/phpmyadmin
2. Chọn database `anvi_db`
3. Click tab "SQL"
4. Copy toàn bộ nội dung file `fix_google_login.sql`
5. Paste vào và click "Go"

#### Cách 2: MySQL Command Line

```bash
mysql -u root -p anvi_db < fix_google_login.sql
```

#### Cách 3: Thủ công trong MySQL

```sql
USE anvi_db;

-- Xóa dữ liệu cũ
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE permission;
TRUNCATE TABLE account;
TRUNCATE TABLE user;
TRUNCATE TABLE storerole;
SET FOREIGN_KEY_CHECKS = 1;

-- Đảm bảo cấu trúc đúng
ALTER TABLE user MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE account MODIFY COLUMN user_id BIGINT DEFAULT NULL;
ALTER TABLE permission MODIFY COLUMN user_id BIGINT DEFAULT NULL;

-- Reset AUTO_INCREMENT
ALTER TABLE user AUTO_INCREMENT = 1;
```

### Bước 3: Restart Services

#### 3.1. Stop tất cả Java processes

Trong Task Manager (Ctrl+Shift+Esc):
- Tìm tất cả process "java.exe"
- Click chuột phải → End Task

#### 3.2. Rebuild User Service

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice
./gradlew clean build
```

#### 3.3. Start User Service

```bash
./gradlew bootRun
```

Đợi đến khi thấy:
```
Started UserserviceApplication in X.XXX seconds
```

#### 3.4. Start Frontend (nếu chưa chạy)

Mở terminal mới:
```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\my-app
npm run dev
```

---

## Kiểm tra kết quả

### Test 1: Kiểm tra Database

Chạy trong MySQL:

```sql
USE anvi_db;

-- Kiểm tra cấu trúc
DESCRIBE user;
-- Cột 'id' phải là: bigint(20) NOT NULL AUTO_INCREMENT

DESCRIBE account;
-- Cột 'user_id' phải là: bigint(20) DEFAULT NULL

-- Kiểm tra dữ liệu (phải rỗng)
SELECT COUNT(*) FROM user;
-- Kết quả: 0

SELECT COUNT(*) FROM account;
-- Kết quả: 0
```

### Test 2: Test Google Login

1. Mở trình duyệt: http://localhost:3000/login
2. Click nút "Đăng nhập bằng Google"
3. Chọn tài khoản Google
4. Đợi redirect về

**Kết quả mong đợi:**
- ✅ Đăng nhập thành công
- ✅ Redirect về trang chủ
- ✅ Hiển thị tên user

### Test 3: Kiểm tra Database sau khi login

```sql
USE anvi_db;

-- Kiểm tra user mới tạo
SELECT id, full_name, email, role, status FROM user;
-- id phải là số: 1, 2, 3... (KHÔNG phải UUID!)

-- Kiểm tra account
SELECT username, user_id, role FROM account;
-- user_id phải là số: 1, 2, 3...

-- Kiểm tra permission
SELECT id, user_id, permission FROM permission;
-- user_id phải là số: 1, 2, 3...
```

**Ví dụ kết quả đúng:**
```
+----+-----------+----------------------+------+--------+
| id | full_name | email                | role | status |
+----+-----------+----------------------+------+--------+
|  1 | John Doe  | john@st.hcmuaf.edu.vn| USER | ACTIVE |
+----+-----------+----------------------+------+--------+

+------------------+---------+------+
| username         | user_id | role |
+------------------+---------+------+
| google_123456789 |       1 | USER |
+------------------+---------+------+
```

---

## Xử lý lỗi

### Lỗi: "Port 8085 already in use"

**Giải pháp:**
1. Mở Task Manager (Ctrl+Shift+Esc)
2. Tìm process "java.exe"
3. End Task
4. Chạy lại `./gradlew bootRun`

### Lỗi: "Table 'anvi_db.user' doesn't exist"

**Giải pháp:**
```sql
-- Tạo lại database
DROP DATABASE IF EXISTS anvi_db;
CREATE DATABASE anvi_db;
USE anvi_db;
SOURCE D:/HK2_2025_2026/TestKLTN/anvi/anvi_db_updated.sql;
```

### Lỗi: "Column 'id' cannot be null"

**Giải pháp:**
```sql
-- Kiểm tra cấu trúc
DESCRIBE user;

-- Nếu id không có AUTO_INCREMENT, sửa lại:
ALTER TABLE user MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;
```

### Lỗi: Vẫn hiển thị UUID

**Giải pháp:**
1. Xóa toàn bộ dữ liệu: chạy `fix_google_login.sql`
2. Restart user service
3. Clear browser cache (Ctrl+Shift+Delete)
4. Test lại

### Lỗi: "ECONNREFUSED ::1:8085"

**Giải pháp:**
- User service chưa chạy
- Chạy: `cd userservice && ./gradlew bootRun`

---

## Checklist hoàn chỉnh

- [x] Frontend đã sửa port 8085 ✅
- [ ] Database đã dọn dẹp (chạy fix_google_login.sql)
- [ ] User service đã rebuild
- [ ] User service đang chạy (port 8085)
- [ ] Frontend đang chạy (port 3000)
- [ ] Test Google login thành công
- [ ] User ID trong database là số (không phải UUID)

---

## Lưu ý quan trọng

1. **Dữ liệu cũ sẽ bị xóa**: Script `fix_google_login.sql` sẽ xóa tất cả users hiện có
2. **Backup trước**: Nếu có dữ liệu quan trọng, export trước khi chạy script
3. **Port đúng**: User service chạy ở port 8085, không phải 8080
4. **Auto-increment**: User IDs giờ là số tuần tự: 1, 2, 3...
5. **Google accounts**: Username sẽ có dạng `google_123456789`

---

## Kết quả cuối cùng

Sau khi hoàn thành:
- ✅ Google login hoạt động bình thường
- ✅ User IDs là số nguyên (BIGINT)
- ✅ Không còn lỗi UUID
- ✅ Database đồng bộ với code mới

---

## Hỗ trợ thêm

Nếu vẫn gặp lỗi:
1. Kiểm tra logs của user service (console nơi chạy `./gradlew bootRun`)
2. Kiểm tra browser console (F12)
3. Kiểm tra database schema: `DESCRIBE user;`
4. Đọc file `TROUBLESHOOTING.md` để biết thêm chi tiết

---

## Tóm tắt nhanh

```bash
# 1. Dọn database
mysql -u root -p anvi_db < fix_google_login.sql

# 2. Rebuild service
cd userservice
./gradlew clean build

# 3. Start service
./gradlew bootRun

# 4. Test
# Mở http://localhost:3000/login
# Click "Đăng nhập bằng Google"
# Kiểm tra database: SELECT * FROM user;
```

**Hoàn thành! Google login giờ sẽ hoạt động với BIGINT user IDs! 🎉**
