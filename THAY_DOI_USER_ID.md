# Tóm tắt thay đổi: Chuyển User ID từ UUID sang BIGINT

## Vấn đề đã giải quyết

Trước đây hai database không đồng bộ:
- `anvi_db`: user.id = UUID string (ví dụ: "023dc255-bc27-4ed2-ae81-a69fccb724eb")
- `livestreamdb`: host_id/user_id = bigint (ví dụ: 1, 2, 3)

Giờ đã thống nhất: **TẤT CẢ user ID đều là BIGINT (số nguyên)**

---

## Files đã tạo mới

### 1. `anvi_db_migration.sql`
Script để migrate database hiện có từ UUID sang BIGINT (giữ lại dữ liệu cũ)

### 2. `anvi_db_updated.sql`
Schema mới cho fresh installation (không có dữ liệu cũ)

### 3. `USER_ID_MIGRATION_GUIDE.md`
Hướng dẫn chi tiết từng bước migration

### 4. `THAY_DOI_USER_ID.md`
File này - tóm tắt các thay đổi

---

## Files code đã sửa

### User Service

#### Entities
1. **User.java**
   ```java
   // Trước
   @Id
   @Column(name = "id", length = 50)
   private String id;
   
   // Sau
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "id")
   private Long id;
   ```

2. **Account.java**
   ```java
   // Trước
   @Column(name = "user_id", length = 50)
   private String userId;
   
   // Sau
   @Column(name = "user_id")
   private Long userId;
   ```

3. **Permission.java**
   ```java
   // Trước
   @Column(name = "user_id", length = 50)
   private String userId;
   
   // Sau
   @Column(name = "user_id")
   private Long userId;
   ```

#### Repository
4. **UserRepository.java**
   ```java
   // Trước
   public interface UserRepository extends JpaRepository<User, String>
   
   // Sau
   public interface UserRepository extends JpaRepository<User, Long>
   ```

#### DTOs
5. **LoginResponse.java**
   ```java
   // Trước
   private String userId;
   
   // Sau
   private Long userId;
   ```

6. **RegisterResponse.java**
   ```java
   // Trước
   private String userId;
   
   // Sau
   private Long userId;
   ```

#### Services
7. **AuthServiceImpl.java**
   ```java
   // Trước
   String userId = UUID.randomUUID().toString();
   User user = User.builder()
       .id(userId)
       .fullName(...)
       .build();
   userRepository.save(user);
   
   // Sau
   User user = User.builder()
       .fullName(...)
       .build();
   user = userRepository.save(user);
   Long userId = user.getId(); // Auto-generated
   ```

8. **GoogleAuthServiceImpl.java**
   - Tương tự AuthServiceImpl
   - Xóa UUID generation
   - Dùng auto-generated ID

### Livestream Service
**Không cần thay đổi** - đã dùng Long từ đầu ✅

### Frontend
**Không cần thay đổi** - đã dùng numeric IDs ✅

---

## Cách sử dụng

### Nếu database đang trống hoặc có thể xóa dữ liệu:

```bash
# 1. Drop và tạo lại database
mysql -u root -p -e "DROP DATABASE IF EXISTS anvi_db; CREATE DATABASE anvi_db;"

# 2. Import schema mới
mysql -u root -p anvi_db < anvi_db_updated.sql

# 3. Rebuild và chạy services
cd userservice
./gradlew clean build
./gradlew bootRun
```

### Nếu cần giữ lại dữ liệu cũ:

```bash
# 1. Backup
mysqldump -u root -p anvi_db > backup.sql

# 2. Chạy migration
mysql -u root -p anvi_db < anvi_db_migration.sql

# 3. Rebuild và chạy services
cd userservice
./gradlew clean build
./gradlew bootRun
```

---

## Kiểm tra kết quả

### Test đăng ký user mới:
```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "fullName": "Test User",
    "email": "test@example.com"
  }'
```

**Kết quả mong đợi:**
```json
{
  "userId": 1,  // ← Số nguyên, không phải UUID!
  "username": "testuser",
  "fullName": "Test User",
  "email": "test@example.com"
}
```

### Test tạo livestream room:
```bash
curl -X POST http://localhost:8086/api/livestream/rooms \
  -H "userId: 1" \
  -H "username: testuser" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Stream",
    "description": "Test"
  }'
```

**Kết quả mong đợi:**
```json
{
  "hostId": 1,  // ← Khớp với userId từ anvi_db!
  "hostName": "testuser",
  "roomName": "room_1_1234567890",
  "title": "My Stream"
}
```

---

## Lợi ích

✅ **Đồng bộ**: Cả hai database dùng cùng kiểu dữ liệu  
✅ **Hiệu suất**: BIGINT nhanh hơn VARCHAR trong joins và indexes  
✅ **Đơn giản**: Không cần generate UUID, database tự động tạo ID  
✅ **Tiết kiệm**: BIGINT (8 bytes) < UUID string (36-50 bytes)  
✅ **Dễ debug**: ID số nguyên dễ đọc hơn UUID  

---

## Lưu ý

- User IDs giờ là số tuần tự: 1, 2, 3, 4...
- Không thể dùng UUID nữa
- Database tự động tạo ID khi insert user mới
- Frontend không cần thay đổi (đã dùng numeric IDs)
- Livestream service không cần thay đổi (đã dùng Long)

---

## Hỗ trợ

Đọc chi tiết trong `USER_ID_MIGRATION_GUIDE.md`
