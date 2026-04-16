# ⚡ Sửa nhanh lỗi 500 - Google Login

## 🎯 Làm theo thứ tự (5 phút)

### 1️⃣ Dọn database (1 phút)

**phpMyAdmin:**
- Mở http://localhost/phpmyadmin
- Chọn `anvi_db` → Tab "SQL"
- Copy `fix_database_complete.sql` → Paste → Go

**Hoặc MySQL:**
```bash
mysql -u root -p anvi_db < fix_database_complete.sql
```

---

### 2️⃣ Stop backend (10 giây)

**Task Manager:**
- Ctrl+Shift+Esc
- Tìm "java.exe"
- End Task (tất cả)

---

### 3️⃣ Start backend (2 phút)

```bash
cd D:\HK2_2025_2026\TestKLTN\anvi\userservice
./gradlew bootRun
```

Đợi thấy: `Started UserserviceApplication`

---

### 4️⃣ Clear browser cache (30 giây)

- Ctrl+Shift+Delete
- Chọn "Cached images and files"
- Clear data

---

### 5️⃣ Test (1 phút)

1. Mở http://localhost:3000/login
2. Click "Đăng nhập bằng Google"
3. Chọn tài khoản
4. ✅ Thành công!

---

## ❌ Nếu vẫn lỗi 500

### Xem logs backend:

Trong terminal đang chạy `./gradlew bootRun`, tìm dòng lỗi màu đỏ.

**Copy và gửi cho tôi:**
- Stack trace đầy đủ
- Dòng có "Exception" hoặc "Error"

---

## 🔍 Kiểm tra nhanh

### Database OK?
```sql
USE anvi_db;
DESCRIBE user;
-- id phải là: bigint(20) NOT NULL AUTO_INCREMENT

SELECT COUNT(*) FROM user;
-- Phải = 0
```

### Backend OK?
```bash
curl http://localhost:8085/actuator/health
# Phải trả về: {"status":"UP"}
```

---

## 📝 Checklist

- [ ] Database đã chạy `fix_database_complete.sql`
- [ ] Backend đã stop
- [ ] Backend đã start lại
- [ ] Browser cache đã clear
- [ ] Test Google login

---

## 💡 Lưu ý

- Lỗi `prompt.js` - BỎ QUA (từ browser extension)
- Lỗi 500 - Từ backend, cần fix database + restart
- Nếu vẫn lỗi - Xem logs backend và báo cho tôi

---

**Làm đúng 5 bước trên, lỗi 500 sẽ hết! 🚀**
