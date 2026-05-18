# Tài liệu Đặc tả Yêu cầu Hệ thống (SRS) - VGA Store

## 1. Giới thiệu (Introduction)
### 1.1. Mục đích
Tài liệu này đặc tả các yêu cầu chức năng và phi chức năng của hệ thống thương mại điện tử **VGA Store**. Hệ thống cho phép người dùng (khách hàng) tìm kiếm, xem và đặt mua Card màn hình (VGA), đồng thời cung cấp giao diện quản trị (Admin) để quản lý sản phẩm, đơn hàng và người dùng.

### 1.2. Đối tượng người dùng (User Roles)
- **Khách hàng (User/Customer):** Người truy cập website để mua hàng.
- **Quản trị viên (Admin):** Người quản lý kho hàng, xác nhận đơn hàng và quản lý hệ thống.

---

## 2. Mô tả Chức năng (Functional Requirements)

### 2.1. Module Xác thực & Người dùng (Auth & User)
- **Đăng ký / Đăng nhập:** Người dùng có thể tạo tài khoản và đăng nhập vào hệ thống.
- **Phân quyền (Role):** Hệ thống phân biệt rõ ràng giữa quyền `USER` và quyền `ADMIN`.
- **Quản lý hồ sơ:** Quản lý thông tin cá nhân cơ bản của người dùng.

### 2.2. Module Sản phẩm (Product & Brand)
- **Danh mục Thương hiệu (Brands):** Phân loại VGA theo hãng sản xuất.
- **Danh sách Sản phẩm:** Hiển thị danh sách VGA kèm thông tin: Tên, Hãng, Giá tiền (price), Tồn kho (stock) và Hình ảnh (img_url).
- **Chi tiết Sản phẩm:** Xem mô tả chi tiết (description) của từng VGA.

### 2.3. Module Giỏ hàng (Cart)
- **Giỏ hàng cá nhân:** Mỗi User được cấp 1 giỏ hàng (Cart) duy nhất liên kết với tài khoản.
- **Quản lý Items (Cart Items):** Thêm sản phẩm vào giỏ, điều chỉnh số lượng (quantity) hoặc xóa sản phẩm khỏi giỏ hàng.

### 2.4. Module Đơn hàng (Order & Checkout)
- **Thanh toán (Checkout):** Chuyển đổi các sản phẩm từ Giỏ hàng sang Đơn hàng (Order) và tính tổng tiền (total_price).
- **Chi tiết Đơn hàng (Order Items):** Lưu lại chính xác mức giá (price) và số lượng (quantity) của sản phẩm ngay tại thời điểm mua.
- **Trạng thái (Order Status):** Theo dõi tiến trình và trạng thái xử lý của đơn hàng.

---

## 3. Lược đồ Dữ liệu (Database Schema)
Hệ thống sử dụng cơ sở dữ liệu quan hệ (PostgreSQL) với 7 bảng (Tables) cốt lõi:
- **USERS:** `id, username, password, email, role`
- **BRANDS:** `id, name`
- **PRODUCTS:** `id, name, brand_id, price, stock, description, img_url`
- **CART:** `id, user_id`
- **CART_ITEMS:** `id, cart_id, product_id, quantity`
- **ORDERS:** `id, user_id, total_price, status`
- **ORDER_ITEMS:** `id, order_id, product_id, quantity, price`

---

## 4. Kiến trúc & Công nghệ (Architecture & Tech Stack)
- **Backend:** Java Spring Boot, cung cấp RESTful APIs.
- **Frontend:** ReactJS (Vite), tách biệt 2 luồng giao diện: `/user` và `/admin`.
- **Cơ sở dữ liệu:** PostgreSQL.
- **Bảo mật:** Sử dụng Spring Security để mã hóa và phân quyền.
- **Triển khai:** Hệ thống được đóng gói và vận hành qua Docker & Docker Compose.
