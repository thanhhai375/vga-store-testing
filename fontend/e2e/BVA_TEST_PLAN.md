# 🎯 Kế Hoạch Kiểm Thử BVA (Boundary Value Analysis)

## 📌 Tổng Quan
Phương pháp Phân tích giá trị biên (BVA) tập trung vào các ranh giới (chặn trên/chặn dưới) của các trường nhập liệu có giới hạn (giá cả, số lượng, độ dài chuỗi, ngày tháng, file size) nhằm tìm ra các lỗi ẩn trong hệ thống.

---

## 👥 Phân Công Nhiệm Vụ (7 Thành Viên)

### 🧑‍💻 Thành viên 1: Module Xác thực & Hồ sơ (User Auth & Profile)
- [ ] **Đăng ký / Đăng nhập:** Kiểm tra độ dài của Username và Password.
  *VD: Nếu Pass từ 6-20 ký tự -> Test với các độ dài: 5, 6, 7 và 19, 20, 21.*
- [ ] **Cập nhật hồ sơ:** Kiểm tra tuổi/ngày sinh (biên 18 tuổi nếu có giới hạn), kiểm tra ô nhập số điện thoại (chiều dài 9, 10, 11 chữ số).

### 🧑‍💻 Thành viên 2: Module Tìm kiếm & Lọc Sản phẩm (Search & Filter)
- [ ] **Lọc theo giá (Price Filter):** Kiểm tra giá trị biên của `min_price` và `max_price`.
  *VD: Nhập giá âm (-1), giá bằng 0, và số tiền cực lớn.*
- [ ] **Ô Tìm kiếm từ khóa:** Kiểm tra khi nhập 0 ký tự (để trống), 1 ký tự, và chuỗi ký tự dài vượt quá giới hạn database.
- [ ] **Phân trang (Pagination):** Kiểm tra khi ở trang đầu (nhập trang 0, trang 1, trang 2) và trang cuối (trang `max - 1`, trang `max`, trang `max + 1`).

### 🧑‍💻 Thành viên 3: Module Giỏ Hàng (Shopping Cart)
- [ ] **Số lượng mua (Quantity):** Kiểm tra các biên số lượng sản phẩm thêm vào giỏ.
  *VD: Nhập tay số 0, số 1, và giới hạn tồn kho (Ví dụ kho có 10 VGA -> Test: 9, 10, 11).*
- [ ] **Cập nhật giỏ hàng:** Giảm số lượng từ 1 xuống 0 (có xóa sản phẩm khỏi giỏ không?). Tăng số lượng kịch trần hệ thống.

### 🧑‍💻 Thành viên 4: Module Thanh Toán & Đơn Hàng (Checkout)
- [ ] **Nhập địa chỉ giao hàng:** Kiểm tra giới hạn ký tự cực đại của các trường Tên, Địa chỉ, Mã Zip.
- [ ] **Thanh toán (Credit Card / ATM):** 
  * Số thẻ: test 15, 16, 17 số.
  * CVV: test 2, 3, 4 số.
  * Ngày hết hạn: Test ngày trong quá khứ gần nhất, tháng hiện tại, tương lai.

### 🧑‍💻 Thành viên 5: Module Admin - Quản lý Sản Phẩm (Admin Product)
- [ ] **Thêm/Sửa Card đồ họa (VGA):** 
  * Giá (Price): Biên `-1`, `0`, `1`, và giá trị max của kiểu int/bigint.
  * Tồn kho (Stock): Biên âm `-1`, `0`, `1`.
- [ ] **Upload hình ảnh:** Kiểm tra kích thước file tải lên.
  *VD: Giới hạn 2MB -> Test file 1.9MB, đúng 2.0MB, 2.1MB.*

### 🧑‍💻 Thành viên 6: Module Admin - Quản lý Khuyến Mãi (Admin Promotions)
- [ ] **Mã giảm giá theo phần trăm (%):** 
  * Biên logic: `-1%`, `0%`, `1%`, và `99%`, `100%`, `101%`.
- [ ] **Sử dụng mã:** Số lần áp dụng tối đa (VD: Voucher dùng được 100 lần -> Test người thứ 99, 100, 101 dùng).
- [ ] **Thời hạn Coupon:** Đặt thời gian bắt đầu/kết thúc trùng nhau, khoảng cách 1 phút, hoặc thời gian kết thúc trước thời gian bắt đầu.

### 🧑‍💻 Thành viên 7: Module Admin - Người dùng & Báo cáo (Admin Users & Reports)
- [ ] **Quản lý danh sách người dùng:** Kiểm tra BVA trên các bộ lọc (chọn số record hiển thị: 10, 20, 50 - thay đổi param url thành 0 hoặc số siêu lớn).
- [ ] **Báo cáo/Thống kê doanh thu:** Lọc doanh thu theo khoảng thời gian.
  * Từ ngày A đến ngày B -> Test khi `A = B`, `A` trước `B` 1 ngày, `A` sau `B` (Lỗi logic).
- [ ] **Giới hạn xuất file Excel/CSV:** Lượng data tối đa có thể tải xuống.

---

## 💡 Mẹo nhỏ cho Trưởng Nhóm khi viết CodeceptJS BVA
Vì BVA đòi hỏi kiểm tra nhiều giá trị lặp đi lặp lại trên cùng 1 flow, bạn nên hướng dẫn team sử dụng **Data-Driven Tests** bằng `Data()` table trong CodeceptJS.

**Ví dụ:**
```javascript
let accounts = new DataTable(['username', 'password', 'isValid']);
accounts.add(['user1', '12345', false]); // Dưới biên (5 ký tự)
accounts.add(['user2', '123456', true]); // Ngay biên (6 ký tự)
accounts.add(['user3', '1234567', true]); // Trên biên (7 ký tự)

Data(accounts).Scenario('Test BVA Password Length', ({ I, current }) => {
  I.amOnPage('/login');
  I.fillField('Username', current.username);
  I.fillField('Password', current.password);
  I.click('Login');
  
  if (current.isValid) {
    I.see('Đăng nhập thành công');
  } else {
    I.see('Mật khẩu phải từ 6 ký tự');
  }
});
```
