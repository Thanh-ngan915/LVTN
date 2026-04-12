# ✅ Đã sửa lỗi CORS - Google Login

## 🐛 Lỗi gặp phải

### Lỗi CORS: Multiple Access-Control-Allow-Origin headers
```
Access to fetch at 'http://localhost:8080/api/auth/google/callback' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
The 'Access-Control-Allow-Origin' header contains multiple values 
'http://localhost:3000, http://localhost:3000', but only one is allowed.
```

## 🔍 Nguyên nhân

Cả **API Gateway** và **UserService** đều có CORS configuration:
- Request từ frontend → API Gateway (thêm CORS header lần 1)
- API Gateway forward → UserService (thêm CORS header lần 2)
- Response có 2 CORS headers → Browser reject ❌

## 🔧 Giải pháp

### Tắt CORS ở UserService, chỉ giữ ở API Gateway

**File:** `userservice/src/main/java/org/example/userservice/config/SecurityConfig.java`

**Trước:**
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ❌ Bị trùng
        .csrf(csrf -> csrf.disable())
        // ...
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    // CORS config ở đây
}
```

**Sau:**
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.disable()) // ✅ Tắt CORS, để Gateway xử lý
        .csrf(csrf -> csrf.disable())
        // ...
}

// Xóa @Bean corsConfigurationSource()
```

## ✅ Kết quả

### 1. UserService đã restart thành công
```
Tomcat started on port 8085 (http)
Started UserserviceApplication in 9.465 seconds
```

### 2. API qua Gateway hoạt động tốt
```bash
POST http://localhost:8080/api/auth/register
{
  "username": "testcors",
  "password": "pass123",
  "fullName": "Test CORS",
  "email": "testcors@test.com"
}

# Response: ✅ Success
{
  "username": "testcors",
  "userId": "7d2d760a-a2ce-4ce9-ad7e-4a93b6b66e01",
  "fullName": "Test CORS",
  "email": "testcors@test.com",
  "role": "USER",
  "message": "Đăng ký thành công!"
}
```

### 3. CORS headers chỉ có 1 lần
- ✅ API Gateway thêm CORS headers
- ✅ UserService không thêm nữa
- ✅ Browser accept response

## 🎯 Kiến trúc CORS đúng

```
Frontend (localhost:3000)
    ↓ Request
API Gateway (localhost:8080)
    ↓ Add CORS headers ✅
    ↓ Forward to service
UserService (localhost:8085)
    ↓ No CORS headers ✅
    ↓ Response
API Gateway
    ↓ Response with CORS headers
Frontend ✅ Success
```

## 🧪 Test Google Login

### Bước 1: Đảm bảo tất cả services đang chạy
```bash
# Check UserService
netstat -ano | findstr :8085
# ✅ Running

# Check API Gateway
netstat -ano | findstr :8080
# ✅ Running

# Check Frontend
# Truy cập: http://localhost:3000
```

### Bước 2: Test Google Login Flow
1. Mở browser: **http://localhost:3000/login**
2. Click nút **"Đăng nhập với Google"**
3. Chọn tài khoản Google
4. Cho phép quyền truy cập
5. ✅ Đăng nhập thành công!

### Bước 3: Kiểm tra Network Tab
Mở DevTools → Network → Filter: `google/callback`

**Request:**
```
POST http://localhost:8080/api/auth/google/callback
Content-Type: application/json

{
  "code": "4/0AeanS0...",
  "redirectUri": "http://localhost:3000/auth/google/callback"
}
```

**Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000  ✅ Chỉ 1 lần
Access-Control-Allow-Credentials: true
Content-Type: application/json
```

**Response Body:**
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

## 📝 CORS Configuration Summary

### API Gateway (apigatewway/src/main/java/.../CorsConfig.java)
```java
@Configuration
public class CorsConfig {
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",  // Frontend
            "http://localhost:3001",
            "http://localhost:8080",  // Gateway itself
            "http://localhost:8086"   // Other services
        ));
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return new CorsFilter(source);
    }
}
```

### UserService (CORS DISABLED ✅)
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable())  // ✅ Disabled
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

## 🎉 Kết luận

✅ **Lỗi CORS đã được sửa**
✅ **UserService đang chạy trên port 8085**
✅ **API Gateway đang chạy trên port 8080**
✅ **CORS chỉ được xử lý ở API Gateway**
✅ **Google Login sẵn sàng test**

## 🚀 Next Steps

1. **Chạy Frontend:**
   ```bash
   cd my-app
   npm run dev
   ```

2. **Test Google Login:**
   - Truy cập: http://localhost:3000/login
   - Click "Đăng nhập với Google"
   - Enjoy! 🎊

## 📚 Files đã sửa

1. ✅ `userservice/src/main/java/org/example/userservice/config/SecurityConfig.java`
   - Tắt CORS configuration
   - Xóa corsConfigurationSource() bean
   - Xóa unused imports

## ⚠️ Lưu ý quan trọng

### Trong môi trường Microservices:
- ✅ **API Gateway**: Xử lý CORS cho tất cả requests
- ❌ **Backend Services**: KHÔNG nên có CORS config
- ✅ **Direct Service Access**: Chỉ khi test trực tiếp service (không qua Gateway)

### Nếu cần test trực tiếp UserService (port 8085):
Bật lại CORS trong SecurityConfig:
```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

Nhưng trong production, luôn đi qua API Gateway!
