# User ID Migration Guide: UUID to BIGINT

## Tổng quan
Tài liệu này hướng dẫn chuyển đổi user ID từ UUID (String) sang BIGINT (Long) để đồng bộ giữa hai database:
- `anvi_db` (User Service) 
- `livestreamdb` (Livestream Service)

## Vấn đề hiện tại
- **anvi_db**: `user.id` = VARCHAR(50) với UUID
- **livestreamdb**: `livestream_rooms.host_id` và `livestream_participants.user_id` = BIGINT

## Giải pháp
Chuyển đổi tất cả user ID sang BIGINT với auto-increment.

---

## Bước 1: Backup Database

```bash
# Backup anvi_db
mysqldump -u root -p anvi_db > anvi_db_backup_$(date +%Y%m%d).sql

# Backup livestreamdb
mysqldump -u root -p livestreamdb > livestreamdb_backup_$(date +%Y%m%d).sql
```

---

## Bước 2: Chạy Migration Script cho anvi_db

### Option A: Nếu có dữ liệu cũ cần giữ lại

```bash
mysql -u root -p anvi_db < anvi_db_migration.sql
```

Script này sẽ:
1. Thêm cột mới `id_new` (BIGINT) vào bảng `user`
2. Tạo bảng mapping `user_id_mapping` để map UUID cũ sang ID mới
3. Gán ID số nguyên tuần tự cho các user hiện có
4. Cập nhật foreign keys trong `account` và `permission`
5. Xóa cột cũ và đổi tên cột mới

### Option B: Nếu có thể xóa dữ liệu và bắt đầu lại

```bash
# Drop và tạo lại database
mysql -u root -p -e "DROP DATABASE IF EXISTS anvi_db; CREATE DATABASE anvi_db;"
mysql -u root -p anvi_db < anvi_db_updated.sql
```

---

## Bước 3: Cập nhật Code

### User Service (đã hoàn thành)

Các file đã được cập nhật:

#### Entity Classes
- ✅ `User.java`: `id` từ String → Long với `@GeneratedValue`
- ✅ `Account.java`: `userId` từ String → Long
- ✅ `Permission.java`: `userId` từ String → Long

#### Repository
- ✅ `UserRepository.java`: `JpaRepository<User, Long>`

#### DTOs
- ✅ `LoginResponse.java`: `userId` từ String → Long
- ✅ `RegisterResponse.java`: `userId` từ String → Long

#### Services
- ✅ `AuthServiceImpl.java`: Xóa `UUID.randomUUID()`, dùng auto-generated ID
- ✅ `GoogleAuthServiceImpl.java`: Xóa `UUID.randomUUID()`, dùng auto-generated ID

### Livestream Service (không cần thay đổi)

Livestream service đã sử dụng Long cho user IDs:
- `LivestreamRoom.hostId`: Long ✅
- `LivestreamParticipant.userId`: Long ✅

---

## Bước 4: Kiểm tra Frontend

Frontend đã sử dụng numeric user IDs (dưới dạng string), không cần thay đổi:

```typescript
// my-app/app/livestream/page.tsx
const userId = '1'; // OK - sẽ được parse thành Long ở backend
const userId = Math.floor(Math.random() * 10000).toString(); // OK
```

---

## Bước 5: Testing

### Test User Service

```bash
# Start user service
cd userservice
./gradlew bootRun
```

#### Test Registration
```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "fullName": "Test User",
    "email": "test@example.com",
    "address": "Test Address"
  }'
```

Kết quả mong đợi:
```json
{
  "username": "testuser",
  "userId": 1,  // ← BIGINT, không phải UUID
  "fullName": "Test User",
  "email": "test@example.com",
  "role": "USER",
  "message": "Đăng ký thành công!"
}
```

#### Test Login
```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Kết quả mong đợi:
```json
{
  "username": "testuser",
  "userId": 1,  // ← BIGINT
  "fullName": "Test User",
  "email": "test@example.com",
  "role": "USER",
  "token": "eyJhbGc..."
}
```

### Test Livestream Service

```bash
# Start livestream service
cd livetreamservice
./gradlew bootRun
```

#### Test Create Room
```bash
curl -X POST http://localhost:8086/api/livestream/rooms \
  -H "Content-Type: application/json" \
  -H "userId: 1" \
  -H "username: testuser" \
  -d '{
    "title": "Test Stream",
    "description": "Testing",
    "maxViewers": 1000
  }'
```

#### Test Join Room
```bash
curl -X POST http://localhost:8086/api/livestream/rooms/{roomName}/join \
  -H "Content-Type: application/json" \
  -H "userId: 2" \
  -H "username: viewer1" \
  -d '{
    "userId": 2,
    "username": "viewer1"
  }'
```

---

## Bước 6: Đồng bộ dữ liệu giữa hai DB (nếu cần)

Nếu bạn đã có user trong `anvi_db` và muốn đồng bộ với `livestreamdb`:

```sql
-- Cập nhật host_id trong livestreamdb dựa trên username
UPDATE livestreamdb.livestream_rooms lr
INNER JOIN anvi_db.account a ON lr.host_name = a.username
SET lr.host_id = a.user_id;

-- Cập nhật user_id trong livestream_participants
UPDATE livestreamdb.livestream_participants lp
INNER JOIN anvi_db.account a ON lp.username = a.username
SET lp.user_id = a.user_id;
```

---

## Rollback Plan

Nếu có vấn đề, restore từ backup:

```bash
# Restore anvi_db
mysql -u root -p -e "DROP DATABASE IF EXISTS anvi_db; CREATE DATABASE anvi_db;"
mysql -u root -p anvi_db < anvi_db_backup_YYYYMMDD.sql

# Restore livestreamdb
mysql -u root -p -e "DROP DATABASE IF EXISTS livestreamdb; CREATE DATABASE livestreamdb;"
mysql -u root -p livestreamdb < livestreamdb_backup_YYYYMMDD.sql
```

---

## Checklist

- [ ] Backup cả hai databases
- [ ] Chạy migration script cho anvi_db
- [ ] Rebuild user service: `./gradlew clean build`
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Test Google OAuth (nếu sử dụng)
- [ ] Test livestream room creation
- [ ] Test joining rooms
- [ ] Kiểm tra frontend integration
- [ ] Đồng bộ dữ liệu cũ (nếu có)

---

## Lưu ý quan trọng

1. **Auto-increment**: User IDs giờ được tạo tự động bởi database, không cần UUID.randomUUID() nữa
2. **Compatibility**: Frontend đã sử dụng numeric IDs nên không cần thay đổi
3. **Foreign Keys**: Tất cả foreign keys đã được cập nhật trong migration script
4. **Mapping Table**: Bảng `user_id_mapping` giữ lại để reference (có thể xóa sau khi confirm)

---

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs của services
2. Verify database schema: `DESCRIBE user;`, `DESCRIBE account;`
3. Check foreign key constraints: `SHOW CREATE TABLE account;`
4. Restore từ backup nếu cần
