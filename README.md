# 🖥️ VGA Store — Cửa Hàng Card Màn Hình Online

<p align="center">
  <img src="fontend/user/public/images/logo.png" alt="VGA Store Logo" width="160"/>
</p>

<p align="center">
  <b>Ứng dụng Thương mại Điện tử chuyên về Card Đồ Họa (VGA) được xây dựng theo kiến trúc Client - Server (Khách - Chủ) hiện đại, hỗ trợ Docker Containerization.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.3.4-green?logo=springboot" />
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker" />
  <img src="https://img.shields.io/badge/Gemini_AI-1.5_Flash-orange?logo=google" />
</p>

---

## 📋 Tổng Quan Dự Án

**VGA Store** là một website bán hàng linh kiện máy tính (tập trung vào Card Đồ Họa) được xây dựng như một bài tập lớn môn học. Dự án bao gồm đầy đủ các tính năng của một nền tảng thương mại điện tử thực tế:

- 🛒 Giỏ hàng, Đặt hàng, Thanh toán
- ❤️ Danh sách yêu thích (Wishlist)
- ⚖️ So sánh thông số kỹ thuật sản phẩm
- 🤖 Trợ lý AI (Google Gemini) tư vấn mua hàng
- 👤 Xác thực người dùng (Email/Password + Google OAuth)
- 📊 Bảng quản trị Admin toàn diện

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                       │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │  User App    │    │  Admin App   │                   │
│  │  React 18    │    │  React 18    │                   │
│  │  Nginx       │    │  Nginx       │                   │
│  │  Port: 5173  │    │  Port: 5174  │                   │
│  └──────┬───────┘    └──────┬───────┘                   │
│         │                  │                            │
│         └────────┬─────────┘                            │
│                  ↓                                      │
│         ┌────────────────┐                              │
│         │   Backend API  │                              │
│         │  Spring Boot   │                              │
│         │  Port: 8080    │                              │
│         └───────┬────────┘                              │
│                 ↓                                       │
│         ┌────────────────┐                              │
│         │  PostgreSQL 17 │                              │
│         │  Port: 5433    │                              │
│         └────────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

| Thành phần      | Công nghệ        | Cổng  |
|-----------------|------------------|-------|
| Frontend User   | React 18 + Vite  | 5173  |
| Frontend Admin  | React 18 + Vite  | 5174  |
| Backend API     | Spring Boot 3.3  | 8080  |
| Database        | PostgreSQL 17    | 5433  |

---

## ✨ Tính Năng Nổi Bật

### 👤 Phía Khách Hàng (User)
- **Trang chủ:** Banner quảng cáo động, gợi ý sản phẩm nổi bật
- **Cửa hàng:** Lọc theo Hãng, Danh mục, Khoảng giá, Tìm kiếm
- **Chi tiết sản phẩm:** Thông số kỹ thuật đầy đủ, Hình ảnh, Đánh giá & Bình luận
- **Giỏ hàng & Thanh toán:** Quản lý số lượng, áp dụng thông tin giao hàng
- **Đơn hàng:** Theo dõi trạng thái đơn hàng theo thời gian thực
- **Tài khoản:** Thông tin cá nhân, Đổi mật khẩu, Địa chỉ giao hàng
- **So sánh sản phẩm:** So sánh thông số kỹ thuật tối đa 3 sản phẩm cùng lúc
- **Trợ lý AI (Gemini):** Chat tư vấn mua hàng thông minh, gợi ý sản phẩm phù hợp

### 🛠️ Phía Quản Trị (Admin)
- Quản lý Sản phẩm (CRUD đầy đủ, upload ảnh)
- Quản lý Đơn hàng (Xem chi tiết, Cập nhật trạng thái)
- Quản lý Người dùng
- Quản lý Danh mục & Thương hiệu
- Dashboard thống kê tổng quan

---

## 🚀 Hướng Dẫn Chạy Dự Án

### ✅ Phương Pháp 1: Chạy bằng Docker (Khuyến nghị — Không cần cài Java, Node, PostgreSQL)

**Yêu cầu duy nhất:** Cài [Docker Desktop](https://www.docker.com/products/docker-desktop/) và bật nó lên.

```bash
# Bước 1: Clone dự án về máy
git clone https://github.com/thanhhai375/vga-store.git
cd vga-store

# Bước 2: Khởi động toàn bộ hệ thống (lần đầu sẽ mất 2-5 phút để build)
docker-compose up --build -d

# Bước 3: Mở trình duyệt
# Trang khách hàng: http://localhost:5173
# Trang quản trị:   http://localhost:5174
```

> **Dừng hệ thống:** `docker-compose down`
> **Khởi động lại (không build lại):** `docker-compose up -d`

---

### 🔧 Phương Pháp 2: Chạy thủ công (Cần cài Java 17, Node 18+, PostgreSQL 17)

**Bước 1: Tạo Database**
```sql
-- Trong PostgreSQL, tạo database tên "vga_store"
CREATE DATABASE vga_store;
-- Chạy 2 file SQL theo thứ tự:
-- database/create_tables.sql
-- database/seed_vga.sql
```

**Bước 2: Khởi động Backend**
```bash
cd backend/vgashop
# Sửa application.properties nếu cần thay đổi thông tin kết nối DB
./mvnw spring-boot:run
# Backend chạy tại: http://localhost:8080
```

**Bước 3: Khởi động Frontend User**
```bash
cd fontend/user
npm install
npm run dev
# Truy cập: http://localhost:5173
```

**Bước 4: Khởi động Frontend Admin**
```bash
cd fontend/admin
npm install
npm run dev
# Truy cập: http://localhost:5174
```

---

## 🔑 Tài Khoản Mặc Định

| Vai trò  | Email                   | Mật khẩu    |
|----------|-------------------------|-------------|
| Admin    | hai123      | hai123     |
| Khách hàng | Đăng nhập gg hoặc tạo tk |

---

## 📂 Cấu Trúc Thư Mục

```
vga-store/
├── backend/
│   └── vgashop/              # Spring Boot API Server
│       ├── src/main/java/    # Source code Java
│       ├── src/main/resources/
│       │   └── application.properties
│       └── Dockerfile
├── database/
│   ├── create_tables.sql     # Script tạo toàn bộ bảng
│   └── seed_vga.sql          # Script nạp dữ liệu mẫu (79 sản phẩm)
├── fontend/
│   ├── user/                 # React App dành cho khách hàng
│   │   ├── src/
│   │   │   ├── pages/        # Các trang (Home, Shop, Cart...)
│   │   │   ├── components/   # Components dùng chung (ProductCard, Header...)
│   │   │   └── redux/        # State management (Cart, Auth, Compare...)
│   │   └── Dockerfile
│   └── admin/                # React App dành cho quản trị viên
│       └── Dockerfile
└── docker-compose.yml        # Orchestration toàn bộ hệ thống
```

---

## 🤖 Tính Năng AI Chat

Dự án tích hợp **Google Gemini 1.5 Flash** làm trợ lý tư vấn bán hàng. AI này hiểu toàn bộ danh mục sản phẩm của cửa hàng và có thể:
- Tư vấn chọn card màn hình phù hợp theo ngân sách
- So sánh các dòng GPU
- Trả lời câu hỏi về build PC, gaming

API Key đã được cấu hình sẵn trong file `fontend/user/.env`. Nếu hết quota, bạn có thể lấy key miễn phí tại [Google AI Studio](https://aistudio.google.com/).

---

## 👨‍💻 Thông Tin Nhóm

> Nhóm 9 - Môn Thiết Kế Cơ Sở Dữ Liệu

