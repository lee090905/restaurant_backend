# 🍽️ Restaurant Backend API - Hệ thống Quản lý Nhà hàng

Chào mừng bạn đến với dự án **Restaurant Backend API**. Đây là hệ thống quản trị phía Server được xây dựng chuyên nghiệp dành cho các mô hình nhà hàng, quán ăn, hỗ trợ quản lý sơ đồ bàn, gọi món (POS), gộp/tách bàn và thanh toán hóa đơn.

---

## 🏗️ Kiến trúc Hệ thống (Architecture)

Dự án được xây dựng dựa trên nguyên lý **Clean Architecture** kết hợp với **Dependency Injection (DI)** thông qua thư viện `Awilix`, giúp mã nguồn dễ bảo trì, dễ mở rộng và dễ dàng viết unit test. Hệ thống được chia thành 5 tầng (layers) rạch ròi:

1.  **Entities**: Chứa các thực thể Domain, quy tắc nghiệp vụ cốt lõi (User, Order, Dish, Table, etc.).
2.  **Application**: Chứa các Use Cases xử lý logic nghiệp vụ cụ thể của hệ thống.
3.  **Contracts**: Định nghĩa các Interface cho Repositories và Services, đảm bảo tính trừu tượng.
4.  **Infrastructure**: Cài đặt chi tiết các công nghệ cụ thể (MySQL Repositories, JWT Authentication, Bcrypt Encryption).
5.  **Presentation**: Tầng giao tiếp với người dùng qua Express.js (Controllers & Routes).

---

## 🛠️ Tech Stack (Công nghệ sử dụng)

- **Runtime**: [Node.js](https://nodejs.org/) (phiên bản v20.x trở lên).
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode).
- **Framework**: [Express.js](https://expressjs.com/).
- **Database**: [MySQL](https://www.mysql.com/) (v8.0+).
- **Security**: 
    - Xác thực: **JWT** (jsonwebtoken).
    - Mã hóa: **Bcrypt** (bcryptjs).
- **Dev Tools**: `ts-node-dev` cho việc hot-reload.
- **Deployment**: [Docker](https://www.docker.com/) & Docker Compose.

---

## 📋 Yêu cầu Môi trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
- **Node.js**: >= 20.0.0
- **npm** hoặc **yarn**
- **MySQL**: >= 8.0

---

## 🚀 Hướng dẫn Cài đặt & Chạy Local

### 1. Clone dự án và cài đặt Package
```bash
git clone https://github.com/your-username/restaurant-backend.git
cd restaurant-backend
npm install
```

### 2. Cấu hình biến môi trường
Sao chép file `.env.example` thành `.env` và cập nhật thông tin kết nối Database của bạn:
```bash
cp .env.example .env
```

### 3. Thiết lập Database
- Đăng nhập vào MySQL Console hoặc sử dụng công cụ như MySQL Workbench.
- Tạo một database mới:
```sql
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Chạy Migrations & Seeders
Khởi tạo cấu trúc bảng và dữ liệu mẫu (Dishes, Tables, Admin user):
```bash
npm run migrate
npm run seed
```

### 5. Chạy dự án
- **Chế độ Phát triển (Development)**:
```bash
npm run dev
```
- **Chế độ Sản xuất (Production)**:
```bash
npm run build
npm start
```

---

## ⚙️ Biến môi trường (Environment Variables)

Dưới đây là các biến môi trường cần thiết trong file `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=restaurant_db

# Security
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=1d
```

---

## 📖 Tài liệu API (API Documentation)

Hệ thống hỗ trợ tài liệu hóa API tự động:
- **Swagger UI**: Sau khi khởi chạy server, truy cập tại [http://localhost:3000/api-docs](http://localhost:3000/api-docs) để xem chi tiết các endpoint.
- **Postman**: Bạn có thể tìm thấy file `postman_collection.json` trong thư mục `docs/` để import vào Postman.

---

## ⌨️ Các Scripts hữu ích

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Chạy Server ở chế độ dev với hot-reload. |
| `npm run build` | Biên dịch TypeScript sang JavaScript trong thư mục `dist/`. |
| `npm start` | Chạy ứng dụng đã được biên dịch từ thư mục `dist/`. |
| `npm run migrate` | Khởi tạo cấu trúc các bảng dữ liệu trong MySQL. |
| `npm run seed` | Đổ dữ liệu mẫu vào database. |

---

## 🐳 Triển khai với Docker (Deployment)

Dự án đã sẵn sàng để chạy trong môi trường Docker:

1. **Build và chạy Container**:
```bash
docker-compose up -d --build
```

2. **Dừng hệ thống**:
```bash
docker-compose down
```

---

## 👨‍💻 Tác giả
- **Team Backend** - [Your Restaurant Project]
- Liên hệ: support@example.com

---
*Dự án này được phát triển cho mục đích quản lý nhà hàng chuyên nghiệp.*
