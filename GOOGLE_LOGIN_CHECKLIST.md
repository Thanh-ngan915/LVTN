# ✅ Checklist - Chức năng Đăng nhập Google

## 🎯 Tổng quan
Hệ thống đăng nhập Google OAuth 2.0 đã được tích hợp đầy đủ vào dự án Anvi System.

---

## 📋 Backend (UserService) - ✅ HOÀN THÀNH

### 1. ✅ Entities
- [x] `User.java` - Lưu thông tin người dùng
- [x] `Account.java` - Lưu thông tin đăng nhập
- [x] `Permission.java` - Quản lý quyền
- [x] `StoreRole.java` - Quản lý vai trò

### 2. ✅ Repositories
- [x] `UserRepository.java` - Tìm user theo email
- [x] `AccountRepository.java` - Tìm account theo username
- [x] `PermissionRepository.java`
- [x] `StoreRoleRepository.java`

### 3. ✅ DTOs
- [x] `GoogleAuthRequest.java` - Nhận code từ frontend
- [x] `GoogleUserInfo.java` - Parse thông tin từ Google API
- [x] `LoginResponse.java` - Trả về JWT token

### 4. ✅ Services
- [x] `GoogleAuthService.java` (Interface)
- [x] `GoogleAuthServiceImpl.java` - Logic xử lý Google OAuth
  - [x] Exchange code for access token
  - [x] Get user info from Google
  - [x] Find or create user
  - [x] Generate JWT token

### 5. ✅ Controllers
- [x] `AuthController.java`
  - [x] `POST /api/auth/google/callback` - Xử lý callback

### 6. ✅ Configuration
- [x] `SecurityConfig.java` - Cho phép public access `/api/auth/**`
- [x] `JwtTokenProvider.java` - Tạo và validate JWT
- [x] `RestTemplateConfig.java` - Bean để gọi Google API ⭐ MỚI THÊM
- [x] CORS configuration

### 7. ✅ Exception Handling
- [x] `GlobalExceptionHandler.java` - Xử lý lỗi toàn cục
- [x] `InvalidCredentialsException.java`
- [x] `UsernameAlreadyExistsException.java`

### 8. ✅ Properties
```properties
# application.properties
google.client-id=262862647958-7g338hg8pm0e617d0dk4c67jqumhr2nu.apps.googleusercontent.com
google.client-secret=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
google.redirect-uri=http://localhost:3000/auth/google/callback
app.jwt.secret=...
app.jwt.expiration-ms=86400000
```

---

## 🎨 Frontend (my-app) - ✅ HOÀN THÀNH

### 1. ✅ Login Page
- [x] `my-app/app/login/page.tsx`
  - [x] Form đăng nhập thông thường
  - [x] Nút "Đăng nhập với Google" ⭐ MỚI THÊM
  - [x] Redirect đến Google Authorization URL
  - [x] Google Client ID configuration

### 2. ✅ Google Callback Page
- [x] `my-app/app/auth/google/callback/page.tsx`
  - [x] Nhận authorization code từ URL
  - [x] Gửi code đến backend
  - [x] Lưu JWT token vào localStorage
  - [x] Redirect về trang chủ
  - [x] UI loading/success/error states

### 3. ✅ Styling
- [x] `my-app/app/login/login.module.css`
  - [x] Style cho nút Google ⭐ MỚI THÊM
  - [x] Divider "HOẶC" ⭐ MỚI THÊM
  - [x] Glassmorphism design
  - [x] Responsive layout

---

## 🌐 API Gateway - ✅ HOÀN THÀNH

### 1. ✅ Routing
```properties
# application.properties
spring.cloud.gateway.server.webmvc.routes[0].id=userservice-auth
spring.cloud.gateway.server.webmvc.routes[0].uri=http://localhost:8085
spring.cloud.gateway.server.webmvc.routes[0].predicates[0]=Path=/api/auth/**
```

### 2. ✅ CORS Configuration
- [x] `CorsConfig.java` - Cho phép localhost:3000

---

## 🔧 Dependencies - ✅ ĐẦY ĐỦ

### Backend (build.gradle)
```gradle
✅ spring-boot-starter-web
✅ spring-boot-starter-data-jpa
✅ spring-boot-starter-security
✅ spring-boot-starter-validation
✅ mysql-connector-j
✅ lombok
✅ jjwt-api:0.11.5
✅ jjwt-impl:0.11.5
✅ jjwt-jackson:0.11.5
```

### Frontend (package.json)
```json
✅ next: 16.2.2
✅ react: 19.2.4
✅ react-dom: 19.2.4
```

---

## 🗄️ Database Schema - ✅ TỰ ĐỘNG TẠO

Khi user đăng nhập Google lần đầu, hệ thống tự động tạo:

```sql
✅ INSERT INTO user (id, full_name, email, image, role, status)
✅ INSERT INTO account (username, password, user_id, role)
✅ INSERT INTO storerole (id, store_role, status, role)
✅ INSERT INTO permission (id, instance, permission, user_id)
```

---

## 🚀 Cách chạy hệ thống

### 1. Khởi động Backend
```bash
# Terminal 1 - API Gateway
cd apigatewway
./gradlew bootRun
# Chạy trên port 8080

# Terminal 2 - UserService
cd userservice
./gradlew bootRun
# Chạy trên port 8085
```

### 2. Khởi động Frontend
```bash
# Terminal 3 - Next.js App
cd my-app
npm run dev
# Chạy trên port 3000
```

### 3. Khởi động MySQL
```bash
# Đảm bảo MySQL đang chạy trên port 3306
# Database: anvi_db
```

---

## 🧪 Test Flow

### Bước 1: Truy cập trang login
```
http://localhost:3000/login
```

### Bước 2: Click "Đăng nhập với Google"
- Redirect đến Google
- Chọn tài khoản Google
- Cho phép quyền truy cập

### Bước 3: Google redirect về callback
```
http://localhost:3000/auth/google/callback?code=...
```

### Bước 4: Frontend gửi code đến backend
```
POST http://localhost:8080/api/auth/google/callback
{
  "code": "...",
  "redirectUri": "http://localhost:3000/auth/google/callback"
}
```

### Bước 5: Backend trả về JWT token
```json
{
  "username": "google_123456789",
  "userId": "uuid",
  "fullName": "Nguyễn Văn A",
  "email": "user@gmail.com",
  "role": "USER",
  "message": "Đăng nhập bằng Google thành công!",
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

### Bước 6: Frontend lưu token và redirect
```javascript
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data));
router.push("/");
```

---

## 📝 Files đã tạo/cập nhật

### ⭐ Files mới tạo:
1. `userservice/src/main/java/org/example/userservice/config/RestTemplateConfig.java`
2. `userservice/GOOGLE_OAUTH_SETUP.md`
3. `userservice/test-google-oauth.http`
4. `GOOGLE_LOGIN_CHECKLIST.md` (file này)

### ⭐ Files đã cập nhật:
1. `my-app/app/login/page.tsx` - Thêm nút Google login
2. `my-app/app/login/login.module.css` - Thêm style cho nút Google

---

## ⚠️ Lưu ý quan trọng

### 1. Google OAuth Credentials
- Client ID và Secret hiện tại là của môi trường development
- Cần tạo credentials mới cho production
- Xem hướng dẫn chi tiết trong `userservice/GOOGLE_OAUTH_SETUP.md`

### 2. Security
- ❌ KHÔNG commit Client Secret vào Git trong production
- ✅ Sử dụng environment variables
- ✅ Thêm HTTPS cho production

### 3. Database
- Đảm bảo MySQL đang chạy
- Database `anvi_db` sẽ tự động tạo nếu chưa có
- Tables sẽ tự động tạo nhờ `spring.jpa.hibernate.ddl-auto=update`

### 4. Ports
- Frontend: 3000
- API Gateway: 8080
- UserService: 8085
- MySQL: 3306

---

## 🎉 Kết luận

✅ Chức năng đăng nhập Google đã được tích hợp HOÀN TOÀN vào hệ thống!

### Những gì đã có:
- ✅ Backend API hoàn chỉnh
- ✅ Frontend UI với nút Google login
- ✅ Google OAuth flow đầy đủ
- ✅ JWT token authentication
- ✅ Auto create user on first login
- ✅ CORS configuration
- ✅ Exception handling
- ✅ Database integration

### Có thể test ngay:
1. Chạy MySQL
2. Chạy UserService (port 8085)
3. Chạy API Gateway (port 8080)
4. Chạy Frontend (port 3000)
5. Truy cập http://localhost:3000/login
6. Click "Đăng nhập với Google"

---

## 📚 Tài liệu tham khảo

- `userservice/GOOGLE_OAUTH_SETUP.md` - Hướng dẫn setup chi tiết
- `userservice/test-google-oauth.http` - Test API endpoints
- Google OAuth 2.0 Docs: https://developers.google.com/identity/protocols/oauth2
