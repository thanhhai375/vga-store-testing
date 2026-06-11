# ⚙️ Kế Hoạch Kiểm Thử BVA bằng Postman (Dựa Trên Cấu Trúc Thực Tế)

Dựa trên cấu trúc thực tế của thư mục `automation/postman`, toàn bộ test scripts và data (CSV) đã được chia ra làm 5 cụm Collection chính. Để phân bổ khối lượng công việc cân bằng cho **7 thành viên**, dưới đây là danh sách nhiệm vụ chi tiết và API cụ thể mà từng người sẽ phải run test.

---

## 👥 Phân Công Nhiệm Vụ Cho 7 Thành Viên

### 🧑‍💻 Thành viên 1: Module Authentication (Collection: `VGA-AUTH-USER`)
* **Nhiệm vụ:** Chạy Automation Test cho luồng Xác thực (Đăng ký/Đăng nhập/Đổi mật khẩu).
* **Data File tham chiếu:** `Authentication.csv`
* **API thực thi:** 
  - `POST /api/auth/register`, `POST /api/auth/login`
* **Mục tiêu test:** Kiểm thử các biên giới hạn (ngắn, dài, rỗng) của `username` và `password` dựa theo đúng file data có sẵn.

### 🧑‍💻 Thành viên 2: Module User Profile & Address (Collection: `VGA-AUTH-USER`)
* **Nhiệm vụ:** Chạy Automation Test cho tính năng Quản lý thông tin hồ sơ và địa chỉ giao hàng của User.
* **Data File tham chiếu:** `UserProfile.csv`, `Addresses.csv`
* **API thực thi:** 
  - `PUT /api/users/profile`, `POST/PUT /api/addresses`
* **Mục tiêu test:** Đảm bảo validate đúng thông tin ngày sinh (`dob`), giới hạn độ dài số điện thoại, và số lượng ký tự nhập vào mục Địa chỉ (Address) theo file CSV.

### 🧑‍💻 Thành viên 3: Module Product Catalog (Collection: `VGA-store-product`)
* **Nhiệm vụ:** Test các luồng tìm kiếm, lấy danh sách Sản phẩm hiển thị cho người dùng.
* **Data File tham chiếu:** `VGA-store_product_AutoTest.csv` (hoặc `.xlsx`)
* **API thực thi:** 
  - `GET /api/products` (Search, Filter by Category, Pagination)
* **Mục tiêu test:** Test các tham số Query như `minPrice`, `maxPrice` (các giá trị âm, 0, hoặc tràn số), cũng như tính hợp lệ của phân trang (số lượng page).

### 🧑‍💻 Thành viên 4: Module Product Admin (Collection: `VGA-store-product` & `VGA-Store-Admin`)
* **Nhiệm vụ:** Test luồng Thêm/Sửa/Xóa sản phẩm của Admin (liên quan đến Stock, Giá).
* **Data File tham chiếu:** `VGA-store_product_AutoTest.csv`
* **API thực thi:** 
  - `POST/PUT /api/admin/products`
* **Mục tiêu test:** Chặn việc Admin nhập tồn kho (`stock`) âm, hay set giá (`price`) âm/không hợp lệ. Đảm bảo file cấu hình csv chạy qua được các case boundary này.

### 🧑‍💻 Thành viên 5: Module Shopping Cart (Collection: `VGA-Store-Cart`)
* **Nhiệm vụ:** Test luồng quản lý Giỏ hàng của User.
* **Data File tham chiếu:** `CART_AUTOTEST.csv`
* **API thực thi:** 
  - `POST /api/cart/items`, `PUT /api/cart/items`
* **Mục tiêu test:** Test việc add sản phẩm với `quantity = 0`, `quantity < 0` hoặc thêm một số lượng vượt quá tổng Stock hiện có trong kho.

### 🧑‍💻 Thành viên 6: Module Thanh Toán & Đơn Hàng (Collection: `VGAShop_Payment`)
* **Nhiệm vụ:** Test luồng tạo đơn (Checkout) và thanh toán.
* **Data File tham chiếu:** `payment-test-data-from-TC_Payment_71.csv`
* **API thực thi:** 
  - `POST /api/orders`, `POST /api/payments/...`
* **Mục tiêu test:** Bypass validate của FE bằng Postman để truyền vào các thông tin thẻ tín dụng/CVV/Ngày hết hạn bị sai, hoặc mảng giỏ hàng rỗng. 

### 🧑‍💻 Thành viên 7: Module Admin Quản trị chung (Collection: `VGA-Store-Admin`)
* **Nhiệm vụ:** Chạy test các tính năng Quản lý User, Danh mục, Brands và Order Management của Admin.
* **Data File tham chiếu:** `VGA_Store_Admin_TestCases.csv`
* **API thực thi:** 
  - Các endpoint `/api/admin/*`
* **Mục tiêu test:** Kiểm tra quyền (Role) xem có bị vượt rào không. Lọc thống kê với khoảng thời gian sai logic (`startDate` > `endDate`) xem hệ thống BE có văng exception 500 hay bắt lỗi 400 chuẩn chỉ.

---

## 🛠️ Hướng Dẫn Trưởng Nhóm
Vì file test data (`.csv` / `.xlsx`) và Collection đã có sẵn trong folder `automation/postman`, trưởng nhóm chỉ việc:
1. Giao folder cho đúng người.
2. Member import file `Collection.json` + `Environment.json` vào Postman.
3. Member sử dụng **Postman Runner**, chọn đúng file `.csv` tương ứng bên trên, ấn nút RUN và chụp màn hình kết quả Export ra báo cáo HTML/PDF.
