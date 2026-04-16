# 🚀 Quick Start - User ID Migration

## Bạn cần làm gì tiếp theo?

### Bước 1: Chọn phương án migration

#### 🆕 Phương án A: Database mới (Khuyến nghị cho development)
Nếu bạn có thể xóa dữ liệu hiện tại:

```bash
# Chạy lệnh này trong MySQL
mysql -u root -p -e "DROP DATABASE IF EXISTS anvi_db; CREATE DATABASE anvi_db;"
mysql -u root -p anvi_db < anvi_db_updated.sql
```

#### 💾 Phương án B: Giữ lại dữ liệu cũ
Nếu cần giữ users hiện có:

```bash
# 1. Backup trước
mysqldump -u root -p anvi_db > backup.sql

# 2. Chạy migration
mysql -u root -p anvi_db < anvi_db_migration.sql

# 3. Verify
mysql -u root -p anvi_db < verify_migration.sql
```

---

### Bước 2: Rebuild User Service

```bash
cd userservice
./gradlew clean build
```

Nếu có lỗi compile, check lại các file đã được update đúng chưa.

---

### Bước 3: Chạy services

#### Terminal 1 - User Service
```bash
cd userservice
./gradlew bootRun
```

Đợi đến khi thấy: `Started UserserviceApplication`

#### Terminal 2 - Livestream Service
```bash
cd livetreamservice
./gradlew bootRun
```

Đợi đến khi thấy: `Started LivetreamserviceApplication`

#### Terminal 3 - Frontend (nếu cần)
```bash
cd my-app
npm run dev
```

---

### Bước 4: Test

#### Tự động (Khuyến nghị)
```bash
# Windows
test_integration.bat

# Linux/Mac
chmod +x test_integration.sh
./test_integration.sh
```

#### Thủ công
```bash
# Test đăng ký
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "fullName": "Test User",
    "email": "test@example.com"
  }'

# Kết quả mong đợi: userId là số (ví dụ: 1), không phải UUID
```

---

## 📁 Files quan trọng

### Cần đọc ngay:
1. **THAY_DOI_USER_ID.md** - Tóm tắt các thay đổi (Tiếng Việt)
2. **MIGRATION_SUMMARY.md** - Tổng quan chi tiết

### Khi cần:
3. **USER_ID_MIGRATION_GUIDE.md** - Hướng dẫn từng bước chi tiết
4. **anvi_db_migration.sql** - Script migration (giữ data cũ)
5. **anvi_db_updated.sql** - Schema mới (fresh install)
6. **verify_migration.sql** - Kiểm tra migration
7. **test_integration.bat/sh** - Test tự động

---

## ✅ Checklist

Làm theo thứ tự:

- [ ] Đọc THAY_DOI_USER_ID.md
- [ ] Backup database (nếu có data quan trọng)
- [ ] Chọn phương án A hoặc B và chạy SQL
- [ ] Rebuild userservice: `./gradlew clean build`
- [ ] Start userservice: `./gradlew bootRun`
- [ ] Start livetreamservice: `./gradlew bootRun`
- [ ] Chạy test: `test_integration.bat`
- [ ] Verify kết quả: userId phải là số

---

## 🎯 Kết quả mong đợi

### Trước migration:
```json
{
  "userId": "023dc255-bc27-4ed2-ae81-a69fccb724eb"  // UUID string
}
```

### Sau migration:
```json
{
  "userId": 1  // BIGINT number
}
```

---

## ❓ Gặp vấn đề?

### Lỗi compile
```
Error: incompatible types: String cannot be converted to Long
```
**Giải pháp**: Một số file chưa được update. Check lại:
- User.java
- Account.java
- Permission.java
- LoginResponse.java
- RegisterResponse.java

### Database lỗi
```
Error: Column 'id' cannot be null
```
**Giải pháp**: 
1. Check schema: `DESCRIBE user;`
2. Verify id là BIGINT AUTO_INCREMENT
3. Chạy lại migration script

### Service không start
**Giải pháp**:
1. Check port 8085, 8086 có bị chiếm không
2. Check MySQL đang chạy
3. Check application.properties có đúng không

---

## 📞 Cần trợ giúp?

1. Đọc **USER_ID_MIGRATION_GUIDE.md** - hướng dẫn chi tiết
2. Chạy **verify_migration.sql** - kiểm tra database
3. Check logs của services
4. Chạy test script để xem lỗi ở đâu

---

## 🎉 Hoàn thành!

Khi test pass, bạn đã thành công:
- ✅ User IDs giờ là số nguyên (BIGINT)
- ✅ Cả hai database đã đồng bộ
- ✅ Performance được cải thiện
- ✅ Code đơn giản hơn (không cần UUID)

**Chúc mừng! Migration hoàn tất! 🚀**
