# 🔧 Sửa lỗi CORS - Google Login

## Vấn đề

```
Access to fetch at 'http://localhost:8085/api/auth/google/callback' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

## Nguyên nhân

User service chưa có CORS configuration, không cho phép frontend (port 3000) gọi API.

## Giải pháp

### ✅ Đã hoàn thành

Đã tạo file `userservice/src/main/java/org/example/userservice/config/CorsConfig.java`

File này cho phép:
- Frontend từ `http://localhost:3000` gọi API
- Tất cả HTTP methods (GET, POST, PUT, DELETE, OPTIONS, PATCH)
- Tất cả headers
- Credentials (cookies, authorization headers)

### 🚀 Bạn cần làm gì

#### Bước 1: Stop User Service hiện tại

**Cách 1: Trong terminal đang chạy service**
- Nhấn `Ctrl + C`

**Cách 2: Task Manager**
1. Mở Task Manager (Ctrl+Shift+Esc)
2. Tìm process "java.exe"
3. Click chuột phải → End Task

#### Bước 2: Rebuild (ĐÃ HOÀN THÀNH ✅)

Build đã thành công với CORS config mới.

#### Bước 3: Start User Service

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice
./gradlew bootRun
```

Đợi đến khi thấy:
```
Started UserserviceApplication in X.XXX seconds
```

#### Bước 4: Test lại Google Login

1. Mở http://localhost:3000/login
2. Click "Đăng nhập bằng Google"
3. Chọn tài khoản Google
4. ✅ Thành công!

---

## Kiểm tra CORS đã hoạt động

### Test 1: Kiểm tra preflight request

Mở Browser Console (F12) → Network tab:
- Sẽ thấy request OPTIONS đến `/api/auth/google/callback`
- Response headers phải có:
  ```
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
  Access-Control-Allow-Headers: *
  Access-Control-Allow-Credentials: true
  ```

### Test 2: Kiểm tra POST request

- Request POST đến `/api/auth/google/callback` phải thành công
- Không còn lỗi CORS
- Response trả về JWT token

---

## Xử lý lỗi

### Lỗi: Vẫn bị CORS sau khi restart

**Giải pháp:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+Shift+R)
3. Restart frontend:
   ```bash
   cd my-app
   # Ctrl+C để stop
   npm run dev
   ```

### Lỗi: "Port 8085 already in use"

**Giải pháp:**
1. Kill tất cả Java processes trong Task Manager
2. Chạy lại `./gradlew bootRun`

### Lỗi: Build failed

**Giải pháp:**
```bash
cd userservice
./gradlew clean
./gradlew build
```

---

## Code đã thêm

### CorsConfig.java

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Cho phép frontend từ localhost:3000
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000"
        ));
        
        // Cho phép tất cả HTTP methods
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Cho phép tất cả headers
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Cho phép credentials
        config.setAllowCredentials(true);
        
        // Cache preflight 1 giờ
        config.setMaxAge(3600L);
        
        // Áp dụng cho tất cả endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

---

## Checklist

- [x] Tạo CorsConfig.java ✅
- [x] Build thành công ✅
- [ ] Stop user service cũ
- [ ] Start user service mới
- [ ] Test Google login
- [ ] Không còn lỗi CORS

---

## Tóm tắt nhanh

```bash
# 1. Stop service cũ (Ctrl+C hoặc Task Manager)

# 2. Start service mới
cd userservice
./gradlew bootRun

# 3. Test
# Mở http://localhost:3000/login
# Click "Đăng nhập bằng Google"
# ✅ Thành công!
```

---

## Lưu ý

- CORS config cho phép frontend từ port 3000, 3001
- Nếu frontend chạy ở port khác, thêm vào `allowedOrigins`
- Config này chỉ dùng cho development
- Production cần config CORS cụ thể hơn (không dùng `*`)

---

**CORS đã được sửa! Restart service và test lại! 🎉**
