# CART TARGET QUALITY REQUIREMENTS

## 1. Phạm vi

Tài liệu này xác định yêu cầu chất lượng mục tiêu cho module Cart khi kiểm thử black-box bằng Postman.

## 2. Yêu cầu chức năng

| Mã | Yêu cầu | TC liên quan |
|---|---|---|
| CART-FR-01 | Người dùng đã đăng nhập xem được giỏ hàng | TC_CART_001, TC_CART_021, TC_CART_031 |
| CART-FR-02 | Thêm sản phẩm hợp lệ vào giỏ thành công | TC_CART_003 |
| CART-FR-03 | Thêm sản phẩm trùng phải cộng dồn số lượng | TC_CART_004 |
| CART-FR-04 | Cập nhật số lượng item hợp lệ thành công | TC_CART_012 |
| CART-FR-05 | Xóa 1 item hợp lệ thành công | TC_CART_028 |
| CART-FR-06 | Xóa toàn bộ giỏ hàng thành công | TC_CART_030 |


## 3. Yêu cầu validation

| Mã | Điều kiện lỗi | Kết quả mong đợi | TC liên quan |
|---|---|---|---|
| CART-VAL-01 | quantity = 0 hoặc âm | HTTP 400, không cập nhật giỏ | TC_CART_005, TC_CART_006, TC_CART_013, TC_CART_014 |
| CART-VAL-02 | Thiếu productId hoặc quantity | HTTP 400 | TC_CART_007, TC_CART_015 |
| CART-VAL-03 | productId/cartItemId không tồn tại | HTTP 404 | TC_CART_008, TC_CART_017, TC_CART_024, TC_CART_029 |
| CART-VAL-04 | quantity vượt tồn kho | HTTP 400 | TC_CART_009, TC_CART_016 |
| CART-VAL-05 | cartItemId sai kiểu dữ liệu | HTTP 400 | TC_CART_018, TC_CART_025 |


## 4. Yêu cầu bảo mật

| Mã | Yêu cầu | TC liên quan |
|---|---|---|
| CART-SEC-01 | Không có token thì không được thêm/cập nhật/xem/xóa giỏ | TC_CART_010, TC_CART_019, TC_CART_022, TC_CART_026 |
| CART-SEC-02 | Token sai thì request bị từ chối | TC_CART_011, TC_CART_020, TC_CART_023, TC_CART_027 |


## 5. Tiêu chí pass/fail

- Pass khi status code và message đúng expected result.
- Pass khi state của giỏ hàng đúng sau chuỗi thao tác add → update → delete → clear.
- Fail khi API trả sai status, sai message, hoặc state giỏ hàng không thay đổi đúng kỳ vọng.
