# SHOPPING BLACKBOX UI REPORT

## 1. Thông tin chung

- **Module:** Shopping Experience / Product / Cart UI / Checkout UI
- **Loại kiểm thử:** Black-box UI/E2E
- **Framework:** CodeceptJS + Playwright
- **File nguồn:** `Shopping_Experience_test.js`
- **Tổng số test case:** 18
- **Base URL:** `http://localhost:5173`

## 2. Phạm vi kiểm thử

Bộ test kiểm tra hành vi giao diện người dùng cho trải nghiệm mua sắm: tìm kiếm, lọc sản phẩm, xem chi tiết sản phẩm, thêm vào giỏ, cập nhật giỏ, checkout validation và responsive mobile.

## 3. Cấu trúc test theo nhóm

| Nhóm | Số TC | Mục tiêu |
|---|---|---|
| A. Search & Filter | 5 | Kiểm tra các scenario thuộc nhóm A. Search & Filter |
| B. Product Detail — Dynamic UI | 2 | Kiểm tra các scenario thuộc nhóm B. Product Detail — Dynamic UI |
| C. Giỏ hàng — UI Behavior | 5 | Kiểm tra các scenario thuộc nhóm C. Giỏ hàng — UI Behavior |
| D. Checkout — Form Validation UI | 6 | Kiểm tra các scenario thuộc nhóm D. Checkout — Form Validation UI |


## 4. Danh sách test case chi tiết

| ID | Nhóm | Mô tả | Kỹ thuật/loại kiểm thử |
|---|---|---|---|
| SH-001 | A. Search & Filter | Tìm kiếm tên hợp lệ → hiện danh sách sản phẩm phù hợp | EP/Functional |
| SH-002 | A. Search & Filter | Tìm kiếm từ khóa KHÔNG tồn tại → hiện trạng thái không tìm thấy | EP/Functional |
| SH-003 | A. Search & Filter | Lọc giá thấp → cao → danh sách sản phẩm vẫn hiển thị | EP/Functional |
| SH-004 | A. Search & Filter | Lọc giá cao → thấp → danh sách sản phẩm vẫn hiển thị | EP/Functional |
| SH-005 | A. Search & Filter | Lọc hãng NVIDIA → danh sách sản phẩm được cập nhật | EP/Functional |
| SH-006 | B. Product Detail — Dynamic UI | Product Detail hiển thị đúng giá | Functional |
| SH-007 | B. Product Detail — Dynamic UI | Thay đổi số lượng → Giá tổng phải nhảy theo | Functional |
| SH-008 | C. Giỏ hàng — UI Behavior | Giỏ hàng rỗng → Hiển thị màn hình trống + nút Tiếp tục mua sắm | Negative/Validation |
| SH-009 | C. Giỏ hàng — UI Behavior | Thêm vào giỏ → Có phản hồi UI sau thao tác | Functional |
| SH-010 | C. Giỏ hàng — UI Behavior | Tăng số lượng vượt tồn kho → UI không bị crash | Robust BVA |
| SH-011 | C. Giỏ hàng — UI Behavior | Nút Thêm vào giỏ có phản hồi khi gọi API | Functional |
| SH-012 | C. Giỏ hàng — UI Behavior | Xóa 1 sản phẩm khỏi giỏ → UI phản hồi sau khi xóa | Functional |
| SH-013 | D. Checkout — Form Validation UI | Điền SĐT sai định dạng → hiện validation hoặc field bị invalid | Negative/Validation |
| SH-014 | D. Checkout — Form Validation UI | Để trống Tên → submit bị chặn hoặc hiện lỗi validation | Negative/Validation |
| SH-015 | D. Checkout — Form Validation UI | Để trống SĐT → submit bị chặn hoặc hiện lỗi validation | Negative/Validation |
| SH-016 | D. Checkout — Form Validation UI | Giỏ hàng rỗng → Checkout bị chặn | Functional |
| SH-017 | D. Checkout — Form Validation UI | Bấm Đặt hàng → nút disabled/spinner hoặc có phản hồi validation | Functional |
| SH-018 | D. Checkout — Form Validation UI | Responsive Mobile 375px không tràn nút Mua ngay | Non-functional UI |


## 5. Tiền điều kiện

- Frontend user chạy ở `http://localhost:5173`.
- Backend API chạy ổn định, có dữ liệu sản phẩm.
- Một số case tự tạo user mới qua helper `registerByUi` và `loginByUi`.
- Trang sản phẩm phải có selector `.product-card` và input tìm kiếm có placeholder chứa `Tìm kiếm`.

## 6. Cách chạy đề xuất

```bash
cd automation
npx codeceptjs run E2E/modules/2_Shopping_Experience/Shopping_Experience_test.js --steps
```

## 7. Kết luận

Bộ test Shopping black-box tập trung vào hành vi nhìn thấy trên UI. Các test quan trọng là SH-001 đến SH-005 cho tìm kiếm/lọc, SH-007 đến SH-012 cho giỏ hàng, SH-013 đến SH-017 cho checkout validation và SH-018 cho responsive mobile.
