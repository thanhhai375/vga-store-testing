# 📘 Hướng Dẫn Viết CodeceptJS E2E Test Cho Team

Chào các bạn, thư mục `E2E` này là nơi chứa toàn bộ kịch bản kiểm thử giao diện tự động (End-to-End UI Testing) sử dụng framework **CodeceptJS** và công cụ giả lập trình duyệt **Playwright**.

Để tránh việc các thành viên dẫm chân lên code của nhau (Merge Conflict) và giúp mã nguồn luôn gọn gàng, team chúng ta sẽ tuân thủ cấu trúc dưới đây.

---

## 📂 1. Cấu trúc thư mục

Toàn bộ code test của team nằm trong thư mục `automation/E2E/`. 

```text
automation/E2E/
├── README_TEAM_GUIDE.md    <-- File hướng dẫn (bạn đang đọc file này)
├── steps_file.js           <-- Nơi viết các hàm xài chung cho CẢ TEAM (hàm login nhanh, v.v.)
│
├── pages/                  <-- Nơi khai báo các locator (nút bấm, input) dùng chung (Page Object)
│   ├── authPage.js             
│   └── ...
│
└── modules/                <-- Từng cá nhân vào đúng thư mục của mình để code
    ├── 1_Auth/             (Ví dụ: Đăng nhập, Đăng ký, Quên mật khẩu)
    ├── 2_Admin/            (Ví dụ: Các chức năng quản lý tài khoản của Admin)
    ├── 3_Cart/             (Ví dụ: Giỏ hàng, Thêm/sửa/xoá giỏ hàng)
    ├── 4_Product_Admin/    (Ví dụ: Đăng sản phẩm mới, Chỉnh sửa sản phẩm)
    ├── 5_Product_User/     (Ví dụ: Tìm kiếm, lọc sản phẩm)
    ├── 6_Payment/          (Ví dụ: Điền form checkout, Thanh toán VNPay/Momo)
    └── 7_User/             (Ví dụ: Cập nhật thông tin cá nhân, Đổi mật khẩu)
```

---

## ⚠️ 2. Các quy tắc BẮT BUỘC

1. **Tên file kịch bản:** Bắt buộc phải có đuôi là `_test.js` (ví dụ: `login_test.js`, `cart_test.js`). Các file không có đuôi này Jenkins sẽ tự động bỏ qua và không chạy.
2. **Không code lộn xộn:** Nhận task ở module nào thì vào đúng thư mục của module đó trong `E2E/modules/` để tạo file mới.
3. **Các hàm tiện ích chung:** Nếu bạn viết một hàm hay (ví dụ: `I.loginAsAdmin()`), hãy đem nó bỏ vào file `steps_file.js` ở bên ngoài để bạn khác cũng có thể xài, thay vì mỗi người tự viết lại một hàm login.
4. **Data rác:** Đừng tải ảnh hay các file quá nặng vào thư mục code. Nếu cần data rác (mock data), hãy tạo một thư mục con `data/` ngay bên trong thư mục module của bạn.

---

## 🚀 3. Cách chạy Test trên máy cá nhân

Mở Terminal (hoặc CMD/Git Bash) và đi vào thư mục `automation`:

```bash
cd automation
```

- **Chạy TOÀN BỘ bài test của cả 7 module:**
  ```bash
  npx codeceptjs run
  ```

- **Chỉ chạy bài test của riêng bạn (ví dụ thư mục 1_Auth):**
  ```bash
  npx codeceptjs run ./E2E/modules/1_Auth/*_test.js
  ```

- **Chạy và TỰ ĐỘNG HIỂN THỊ TRÌNH DUYỆT (có UI để nhìn máy tự bấm):**
  Thêm cờ `--steps` để xem chi tiết từng thao tác:
  ```bash
  npx codeceptjs run --steps
  ```

Chúc các bạn code test vui vẻ và không bao giờ gặp thông báo đỏ chót trên Jenkins! 🎉
