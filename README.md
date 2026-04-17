# 🚀 ANVI SYSTEM - Microservices Platform

Hệ thống vi dịch vụ (microservices) với Spring Boot backend và Next.js frontend, hỗ trợ authentication và livestream.

## ✅ Trạng Thái

**Tất cả lỗi đã được fix triệt để!**

- ✅ Login/Register hoạt động
- ✅ Google OAuth2 integration
- ✅ Livestream với LiveKit
- ✅ CORS đã được cấu hình
- ✅ Error handling hoàn chỉnh

## 🎯 Quick Start

### Cách nhanh nhất (Khuyến nghị)

```bash
QUICK_START.bat
```

Chọn `[1]` để start tất cả services, sau đó truy cập http://localhost:3000

### Hoặc chạy từng lệnh

```bash
# Start tất cả services
start-all-services.bat

# Kiểm tra status
check-services.bat

# Truy cập ứng dụng
# http://localhost:3000
```

## 🏗️ Kiến Trúc

```
┌─────────────────┐
│   Next.js       │  Port 3000
│   Frontend      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │  Port 8080
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────────┐
│  User  │ │  Livestream  │
│Service │ │   Service    │
│  8085  │ │     8086     │
└────────┘ └──────────────┘
```

## 📦 Services

### 1. API Gateway (Port 8080)
- Spring Cloud Gateway
- CORS configuration
- Route management

### 2. User Service (Port 8085)
- Authentication (JWT)
- User management
- Google OAuth2
- MySQL database

### 3. Livestream Service (Port 8086)
- LiveKit integration
- Room management
- Participant management
- MySQL database

### 4. Next.js Frontend (Port 3000)
- React 18
- TypeScript
- Tailwind CSS
- Glassmorphism UI

## 🛠️ Công Nghệ

### Backend
- Java 17
- Spring Boot 3.x
- Spring Cloud Gateway
- Spring Security
- MySQL 8.0
- JWT Authentication
- LiveKit SDK

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- LiveKit Client

## 📋 Yêu Cầu Hệ Thống

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Gradle (hoặc dùng gradlew)

## 🔧 Cài Đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd anvi-system
```

### 2. Setup Database

```bash
mysql -u root -p
CREATE DATABASE anvi_db;
USE anvi_db;
SOURCE anvi_db_updated.sql;
```

### 3. Install Dependencies

```bash
# Frontend
cd my-app
npm install
cd ..
```

### 4. Start Services

```bash
start-all-services.bat
```

## 📖 Tài Liệu

- [BAT_DAU_SU_DUNG.md](BAT_DAU_SU_DUNG.md) - Hướng dẫn bắt đầu
- [README_FIX.md](README_FIX.md) - Các fix đã thực hiện
- [HUONG_DAN_FIX_LOI.md](HUONG_DAN_FIX_LOI.md) - Troubleshooting
- [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) - Kiến trúc chi tiết

## 🎨 Tính Năng

### Authentication
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập username/password
- ✅ Đăng nhập Google OAuth2
- ✅ JWT Token
- ✅ Session management

### Livestream
- ✅ Tạo phòng livestream
- ✅ Tham gia phòng
- ✅ Video/Audio streaming
- ✅ LiveKit integration

### UI/UX
- ✅ Responsive design
- ✅ Glassmorphism effects
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications

## 🔍 API Endpoints

### Authentication
```
POST /api/auth/register    - Đăng ký
POST /api/auth/login       - Đăng nhập
GET  /api/auth/google      - Google OAuth2
```

### Livestream
```
POST /api/livestream/rooms        - Tạo phòng
GET  /api/livestream/rooms        - Danh sách phòng
POST /api/livestream/join         - Tham gia phòng
GET  /api/livestream/participants - Danh sách người tham gia
```

## 🐛 Troubleshooting

### Services không start

```bash
# Kiểm tra port
netstat -ano | findstr "8080"

# Kill process nếu cần
taskkill /PID <PID> /F
```

### Database lỗi

```bash
# Import lại database
mysql -u root -p anvi_db < anvi_db_updated.sql
```

### Cache lỗi

```bash
cd my-app
fix-errors.bat
```

## 📊 Scripts Hữu Ích

| Script | Mô tả |
|--------|-------|
| `QUICK_START.bat` | Menu chính |
| `start-all-services.bat` | Start tất cả services |
| `check-services.bat` | Kiểm tra status |
| `test-api.bat` | Test API endpoints |
| `clean-rebuild-all.bat` | Clean và rebuild |

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License

## 👥 Team

Anvi System Development Team

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Đọc [HUONG_DAN_FIX_LOI.md](HUONG_DAN_FIX_LOI.md)
2. Chạy `check-services.bat`
3. Kiểm tra logs trong terminal
4. Tạo issue trên GitHub

---

**Made with ❤️ by Anvi Team**
