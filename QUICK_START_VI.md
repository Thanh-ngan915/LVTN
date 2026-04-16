# 🚀 Hướng dẫn nhanh - Bắt đầu ngay

## ✅ Build đã thành công!

Code đã được sửa và build thành công. Bây giờ cần migrate database.

---

## Bước 1: Migrate Database

### Cách 1: Sử dụng phpMyAdmin (Dễ nhất)

1. Mở phpMyAdmin: http://localhost/phpmyadmin
2. Chọn database `anvi_db`
3. Click tab "SQL"
4. Copy toàn bộ nội dung file `anvi_db_updated.sql` và paste vào
5. Click "Go" để chạy

**Hoặc nếu muốn giữ dữ liệu cũ:**
- Dùng file `anvi_db_migration.sql` thay vì `anvi_db_updated.sql`

### Cách 2: Sử dụng MySQL Command Line

1. Mở MySQL Command Line Client
2. Nhập password root
3. Chạy lệnh:

```sql
-- Nếu muốn xóa và tạo mới (khuyến nghị cho test)
DROP DATABASE IF EXISTS anvi_db;
CREATE DATABASE anvi_db;
USE anvi_db;
SOURCE D:/HK2_2025_2026/TestKLTN/anvi/anvi_db_updated.sql;

-- Hoặc nếu muốn giữ dữ liệu cũ
USE anvi_db;
SOURCE D:/HK2_2025_2026/TestKLTN/anvi/anvi_db_migration.sql;
```

**Lưu ý**: Thay đường dẫn cho đúng với thư mục của bạn.

---

## Bước 2: Kiểm tra Database

Sau khi chạy migration, kiểm tra xem đã đúng chưa:

```sql
USE anvi_db;

-- Kiểm tra cấu trúc bảng user
DESCRIBE user;
-- Cột 'id' phải là: bigint(20) NOT NULL AUTO_INCREMENT

-- Kiểm tra cấu trúc bảng account
DESCRIBE account;
-- Cột 'user_id' phải là: bigint(20) DEFAULT NULL

-- Kiểm tra cấu trúc bảng permission
DESCRIBE permission;
-- Cột 'user_id' phải là: bigint(20) DEFAULT NULL
```

**Kết quả mong đợi:**
```
Field      | Type        | Null | Key | Default | Extra
-----------+-------------+------+-----+---------+----------------
id         | bigint(20)  | NO   | PRI | NULL    | auto_increment
```

---

## Bước 3: Chạy User Service

Mở terminal mới và chạy:

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice
./gradlew bootRun
```

Đợi đến khi thấy dòng:
```
Started UserserviceApplication in X.XXX seconds
```

---

## Bước 4: Test

### Test 1: Đăng ký user mới

Mở terminal mới và chạy:

```bash
curl -X POST http://localhost:8085/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"password\":\"password123\",\"fullName\":\"Test User\",\"email\":\"test@example.com\"}"
```

**Kết quả mong đợi:**
```json
{
  "username": "testuser",
  "userId": 1,          ← Phải là số, không phải UUID!
  "fullName": "Test User",
  "email": "test@example.com",
  "role": "USER",
  "message": "Đăng ký thành công!"
}
```

### Test 2: Đăng nhập

```bash
curl -X POST http://localhost:8085/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"password\":\"password123\"}"
```

**Kết quả mong đợi:**
```json
{
  "username": "testuser",
  "userId": 1,          ← Phải là số!
  "fullName": "Test User",
  "email": "test@example.com",
  "role": "USER",
  "token": "eyJhbGc...",
  "message": "Đăng nhập thành công!"
}
```

---

## Bước 5: Chạy Livestream Service (nếu cần)

Mở terminal mới:

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\livetreamservice
./gradlew bootRun
```

---

## Bước 6: Test Integration (tùy chọn)

Chạy script test tự động:

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi
test_integration.bat
```

---

## ✅ Checklist

- [x] Code đã build thành công
- [ ] Database đã migrate (chạy SQL script)
- [ ] User service đang chạy (port 8085)
- [ ] Test đăng ký thành công (userId là số)
- [ ] Test đăng nhập thành công (userId là số)
- [ ] Livestream service đang chạy (port 8086) - nếu cần
- [ ] Test integration pass - nếu cần

---

## 🎯 Kết quả

Sau khi hoàn thành:
- ✅ User IDs giờ là số nguyên (1, 2, 3...) thay vì UUID
- ✅ Cả hai database đã đồng bộ
- ✅ Services hoạt động bình thường

---

## ❓ Gặp vấn đề?

### Lỗi: "Table 'anvi_db.user' doesn't exist"
→ Bạn chưa chạy migration script. Quay lại Bước 1.

### Lỗi: "Column 'id' cannot be null"
→ Database chưa được migrate đúng. Chạy lại migration script.

### Lỗi: userId vẫn là UUID
→ Database chưa được migrate. Kiểm tra lại Bước 2.

### Lỗi: "Port 8085 already in use"
→ Service đã chạy rồi. Kill process hoặc dùng port khác.

---

## 📞 Cần trợ giúp thêm?

Đọc các file sau:
- `THAY_DOI_USER_ID.md` - Tóm tắt thay đổi
- `TROUBLESHOOTING.md` - Giải quyết vấn đề
- `USER_ID_MIGRATION_GUIDE.md` - Hướng dẫn chi tiết

---

## 🎉 Hoàn thành!

Khi test pass, migration đã thành công! Chúc mừng! 🚀
