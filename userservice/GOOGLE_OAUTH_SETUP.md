# Hướng dẫn cấu hình Google OAuth 2.0

## 1. Tạo Google OAuth Client ID

### Bước 1: Truy cập Google Cloud Console
- Truy cập: https://console.cloud.google.com/
- Đăng nhập bằng tài khoản Google của bạn

### Bước 2: Tạo hoặc chọn Project
- Tạo project mới hoặc chọn project hiện có
- Tên project: `Anvi System` (hoặc tên bạn muốn)

### Bước 3: Kích hoạt Google+ API
- Vào menu **APIs & Services** > **Library**
- Tìm kiếm "Google+ API" hoặc "Google OAuth2 API"
- Click **Enable**

### Bước 4: Tạo OAuth 2.0 Credentials
- Vào **APIs & Services** > **Credentials**
- Click **Create Credentials** > **OAuth client ID**
- Chọn **Application type**: Web application
- Điền thông tin:
  - **Name**: Anvi System Web Client
  - **Authorized JavaScript origins**:
    - `http://localhost:3000`
    - `http://localhost:8080`
  - **Authorized redirect URIs**:
    - `http://localhost:3000/auth/google/callback`

### Bước 5: Lấy Client ID và Client Secret
- Sau khi tạo, bạn sẽ nhận được:
  - **Client ID**: `262862647958-7g338hg8pm0e617d0dk4c67jqumhr2nu.apps.googleusercontent.com`
  - **Client Secret**: `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`

## 2. Cấu hình trong application.properties

Mở file `userservice/src/main/resources/application.properties` và cập nhật:

```properties
# Google OAuth2
google.client-id=YOUR_CLIENT_ID_HERE
google.client-secret=YOUR_CLIENT_SECRET_HERE
google.redirect-uri=http://localhost:3000/auth/google/callback
```

## 3. Cấu hình Frontend (my-app)

Mở file `my-app/app/login/page.tsx` và cập nhật:

```typescript
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE";
const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";
```

## 4. Luồng hoạt động Google OAuth

```
1. User click "Đăng nhập với Google" trên frontend
   ↓
2. Frontend redirect đến Google Authorization URL
   ↓
3. User đăng nhập và cho phép quyền truy cập
   ↓
4. Google redirect về: http://localhost:3000/auth/google/callback?code=AUTHORIZATION_CODE
   ↓
5. Frontend gửi code đến backend: POST /api/auth/google/callback
   ↓
6. Backend trao đổi code lấy access_token từ Google
   ↓
7. Backend lấy user info từ Google API
   ↓
8. Backend tìm hoặc tạo user trong database
   ↓
9. Backend tạo JWT token và trả về cho frontend
   ↓
10. Frontend lưu token và redirect đến trang chủ
```

## 5. API Endpoints

### POST /api/auth/google/callback
Xử lý callback từ Google OAuth

**Request Body:**
```json
{
  "code": "4/0AeanS0ZZ9X...",
  "redirectUri": "http://localhost:3000/auth/google/callback"
}
```

**Response:**
```json
{
  "username": "google_123456789",
  "userId": "uuid-here",
  "fullName": "Nguyễn Văn A",
  "email": "user@gmail.com",
  "role": "USER",
  "message": "Đăng nhập bằng Google thành công!",
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

## 6. Database Schema

Khi user đăng nhập bằng Google lần đầu, hệ thống tự động tạo:

### Table: user
```sql
INSERT INTO user (id, full_name, email, image, role, status, permission)
VALUES (uuid, 'Nguyễn Văn A', 'user@gmail.com', 'https://...', 'USER', 'ACTIVE', 'READ');
```

### Table: account
```sql
INSERT INTO account (username, password, user_id, role)
VALUES ('google_123456789', 'random-uuid', user_id, 'USER');
```

### Table: storerole
```sql
INSERT INTO storerole (id, store_role, status, role)
VALUES (uuid, 'DEFAULT', 'ACTIVE', 'USER');
```

### Table: permission
```sql
INSERT INTO permission (id, instance, permission, user_id)
VALUES (uuid, 'DEFAULT', 'READ', user_id);
```

## 7. Testing

### Test 1: Kiểm tra Google Login Button
1. Chạy frontend: `cd my-app && npm run dev`
2. Truy cập: http://localhost:3000/login
3. Click nút "Đăng nhập với Google"
4. Kiểm tra redirect đến Google

### Test 2: Kiểm tra Backend API
```bash
curl -X POST http://localhost:8080/api/auth/google/callback \
  -H "Content-Type: application/json" \
  -d '{
    "code": "YOUR_CODE_FROM_GOOGLE",
    "redirectUri": "http://localhost:3000/auth/google/callback"
  }'
```

### Test 3: Kiểm tra Database
```sql
-- Kiểm tra user được tạo
SELECT * FROM user WHERE email = 'your-email@gmail.com';

-- Kiểm tra account
SELECT * FROM account WHERE username LIKE 'google_%';
```

## 8. Troubleshooting

### Lỗi: "redirect_uri_mismatch"
- Kiểm tra redirect URI trong Google Console khớp với frontend
- Đảm bảo không có dấu `/` thừa ở cuối URL

### Lỗi: "invalid_client"
- Kiểm tra Client ID và Client Secret trong application.properties
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "Không thể lấy access_token từ Google"
- Kiểm tra code có hết hạn không (code chỉ dùng được 1 lần)
- Kiểm tra network connection

### Lỗi: "Email đã được sử dụng"
- User đã đăng ký bằng email thông thường
- Hệ thống sẽ tự động link account nếu email trùng

## 9. Security Notes

⚠️ **QUAN TRỌNG:**
- KHÔNG commit Client Secret vào Git
- Sử dụng environment variables cho production
- Thêm `.env` vào `.gitignore`
- Sử dụng HTTPS cho production

## 10. Production Deployment

Khi deploy lên production, cập nhật:

1. **Google Console:**
   - Thêm production domain vào Authorized origins
   - Thêm production callback URL

2. **Backend:**
   ```properties
   google.redirect-uri=https://yourdomain.com/auth/google/callback
   ```

3. **Frontend:**
   ```typescript
   const GOOGLE_REDIRECT_URI = "https://yourdomain.com/auth/google/callback";
   ```
