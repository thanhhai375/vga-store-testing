# CART BLACKBOX TEST REPORT

## 1. Thông tin chung

- **Module:** Cart / Giỏ hàng
- **Loại kiểm thử:** Black-box testing
- **Nguồn test:** Postman collection `VGA Store Cart`, file test case `VGA_Store_Cart_TestCases.csv`
- **Tổng số test case:** 31
- **API chính:** `/api/cart`, `/api/cart/add`, `/api/cart/items/{cartItemId}`

Dự án: VGA Store
Phạm vi: 5 chức năng nghiệp vụ — Xem giỏ hàng, Thêm sản phẩm, Cập nhật số lượng, Xóa 1 sản phẩm, Xóa toàn bộ giỏ
Kỹ thuật áp dụng: Equivalence Partitioning (EP), Boundary Value Analysis (BVA), State Testing, Security Testing (Black-box) + Statement/Branch Coverage (White-box)
Công cụ: Postman/Newman (Black-box API), JUnit 5 + Mockito (White-box Service Layer), CodeceptJS + Playwright (E2E UI)

---

## Bài toán cốt lõi

Module Cart quản lý giỏ hàng của người dùng đã đăng nhập, gồm 5 API:

| # | Chức năng | Method | Endpoint |
|---|---|---|---|
| 1 | Xem giỏ hàng | GET | `/api/cart` |
| 2 | Thêm sản phẩm vào giỏ | POST | `/api/cart/add` |
| 3 | Cập nhật số lượng | PUT | `/api/cart/items/{cartItemId}` |
| 4 | Xóa 1 sản phẩm khỏi giỏ | DELETE | `/api/cart/items/{cartItemId}` |
| 5 | Xóa toàn bộ giỏ hàng | DELETE | `/api/cart` |

**Điều kiện nghiệp vụ chính**

- Người dùng phải có token hợp lệ (đã đăng nhập) cho mọi thao tác.
- `addToCart`: `quantity` phải ≥ 1, `productId` phải tồn tại và chưa bị xóa, tổng số lượng (item cũ + mới) không được vượt tồn kho (`stock`).
- `updateCartItem`: cart phải tồn tại, `cartItemId` phải hợp lệ; nếu `quantity` ≤ 0 → **xóa item** (không phải lỗi, theo code thực tế); nếu `quantity` > tồn kho → lỗi; ngược lại cập nhật số lượng.
- `removeCartItem`: item phải tồn tại trong giỏ, nếu không → lỗi "Không tìm thấy item trong giỏ".
- `clearCart`: đánh dấu toàn bộ item là `deleted=true`, đưa `totalAmount` về 0.
- `convertToCartResponse`: chỉ tính các item có `deleted=false` vào `totalItems`/danh sách trả về.

---

## Xác định lớp tương đương (Equivalence Partitioning)

| Input | Lớp hợp lệ | Tag | Lớp không hợp lệ | Tag |
|---|---|---|---|---|
| `productId` (Add) | Tồn tại, `deleted=false` | V1 | Không tồn tại | X1 |
| | | | Thiếu trường (null) | X2 |
| `quantity` (Add) | 1 ≤ quantity ≤ tồn kho khả dụng | V2 | quantity ≤ 0 | X3 |
| | | | quantity > tồn kho | X4 |
| `quantity` (Update) | 1 ≤ quantity ≤ tồn kho | V3 | quantity ≤ 0 | X5 |
| | | | quantity > tồn kho | X6 |
| `cartItemId` (Update/Delete) | Tồn tại, thuộc giỏ hiện tại | V4 | Không tồn tại | X7 |
| | | | Sai kiểu dữ liệu (không phải số) | X8 |
| Token xác thực | Hợp lệ, còn hạn | V5 | Không gửi token | X9 |
| | | | Token sai/hết hạn | X10 |

Tổng: 5 lớp hợp lệ (V1–V5), 10 lớp không hợp lệ (X1–X10) — toàn bộ đều xuất hiện trong bộ 31 test case của file `VGA_Store_Cart_TestCases.csv`.

---

## Phân tích giá trị biên (BVA) cho `quantity`

`quantity` là input số nguyên duy nhất trong module có kiểu kiểm tra dạng khoảng (biên dưới = 1, biên trên = `stock`). Trong bộ test hiện có, biên được kiểm tra như sau:

| Trường hợp | Giá trị được test | Tag | TC tương ứng |
|---|---|---|---|
| Add — quantity = 1 (min) | 1 | B1 | TC_CART_003 |
| Add — quantity = 0 (dưới min) | 0 | X3 | TC_CART_005 |
| Add — quantity = -1 (dưới min) | -1 | X3 | TC_CART_006 |
| Add — quantity vượt xa tồn kho | 999999 | X4 | TC_CART_009 |
| Update — quantity = 1 | 1 | B2 | TC_CART_012 |
| Update — quantity = 0 (dưới min) | 0 | X5 | TC_CART_013 |
| Update — quantity = -1 (dưới min) | -1 | X5 | TC_CART_014 |
| Update — quantity vượt xa tồn kho | 999999 | X6 | TC_CART_016 |

Ghi chú: bộ test hiện tại tập trung vào biên dưới (min, min-1) và giá trị vượt xa biên trên, chưa có test tại đúng giá trị `stock` (max) hay `stock-1` (max-) do `stock` là giá trị động phụ thuộc dữ liệu sản phẩm tại thời điểm test.

---

## Bảng test case 

| TC ID | Kỹ thuật | Chức năng | Method | Input trọng tâm | Expected | Tag bao phủ |
|---|---|---|---|---|---|---|
| TC_CART_001 | Functional | Xem giỏ hàng | GET /api/cart | token hợp lệ | 200 | V5 |
| TC_CART_002 | State | Xóa giỏ (setup) | DELETE /api/cart | token hợp lệ | 200 | V5 |
| TC_CART_003 | EP+BVA | Thêm sp, quantity=1 | POST /api/cart/add | quantity=1 | 200 | V1,V2,V5,B1 |
| TC_CART_004 | State | Thêm lại sp đã có | POST /api/cart/add | quantity=1 (cộng dồn) | 200 | V1,V2 |
| TC_CART_005 | Robust BVA | quantity=0 | POST /api/cart/add | quantity=0 | 400 | X3 |
| TC_CART_006 | Robust BVA | quantity âm | POST /api/cart/add | quantity=-1 | 400 | X3 |
| TC_CART_007 | EP | Thiếu productId | POST /api/cart/add | không có productId | 400 | X2 |
| TC_CART_008 | EP | productId không tồn tại | POST /api/cart/add | productId ảo | 404 | X1 |
| TC_CART_009 | BVA | Vượt tồn kho | POST /api/cart/add | quantity=999999 | 400 | X4 |
| TC_CART_010 | Security | Không có token | POST /api/cart/add | không header Auth | 403 | X9 |
| TC_CART_011 | Security | Token sai | POST /api/cart/add | token invalid | 403 | X10 |
| TC_CART_012 | BVA | Update quantity hợp lệ | PUT /api/cart/items/{id} | quantity=1 | 200 | V3,V4,B2 |
| TC_CART_013 | Robust BVA | Update quantity=0 | PUT /api/cart/items/{id} | quantity=0 | 400* | X5* |
| TC_CART_014 | Robust BVA | Update quantity âm | PUT /api/cart/items/{id} | quantity=-1 | 400* | X5* |
| TC_CART_015 | EP | Thiếu quantity khi update | PUT /api/cart/items/{id} | body rỗng | 400 | X5 |
| TC_CART_016 | BVA | Update vượt tồn kho | PUT /api/cart/items/{id} | quantity=999999 | 400 | X6 |
| TC_CART_017 | EP | cartItemId không tồn tại | PUT /api/cart/items/{id} | id ảo | 404 | X7 |
| TC_CART_018 | EP | cartItemId sai kiểu | PUT /api/cart/items/abc | id="abc" | 400 | X8 |
| TC_CART_019 | Security | Update không token | PUT /api/cart/items/{id} | không token | 403 | X9 |
| TC_CART_020 | Security | Update token sai | PUT /api/cart/items/{id} | token invalid | 403 | X10 |
| TC_CART_021 | State | Xem giỏ sau add/update | GET /api/cart | — | 200 | V5 |
| TC_CART_022 | Security | Xem giỏ không token | GET /api/cart | không token | 403 | X9 |
| TC_CART_023 | Security | Xem giỏ token sai | GET /api/cart | token invalid | 403 | X10 |
| TC_CART_024 | EP | Xóa item không tồn tại | DELETE /api/cart/items/{id} | id ảo | 404 | X7 |
| TC_CART_025 | EP | Xóa cartItemId sai kiểu | DELETE /api/cart/items/abc | id="abc" | 400 | X8 |
| TC_CART_026 | Security | Xóa không token | DELETE /api/cart/items/{id} | không token | 403 | X9 |
| TC_CART_027 | Security | Xóa token sai | DELETE /api/cart/items/{id} | token invalid | 403 | X10 |
| TC_CART_028 | State | Xóa item hợp lệ | DELETE /api/cart/items/{id} | id hợp lệ | 200 | V4 |
| TC_CART_029 | State | Xóa lại item đã xóa | DELETE /api/cart/items/{id} | id đã xóa | 404 | X7 |
| TC_CART_030 | State | Xóa toàn bộ giỏ | DELETE /api/cart | — | 200 | V5 |
| TC_CART_031 | State | Xem giỏ sau clear | GET /api/cart | — | 200 | V5 |

`*` — xem mục "Đối chiếu Black-box vs White-box": kết quả mong đợi 400 của TC_CART_013/014 **mâu thuẫn** với hành vi thực tế của `CartService.updateCartItem` (xác nhận qua WB-CART-009).

### Bảng ánh xạ độ bao phủ tag

| Nhóm tag | Số tag trong nhóm | Được bao phủ bởi | Số tag được test | % bao phủ |
|---|---:|---|---:|---:|
| V1, V2, X1–X4 (Add) | 6 | TC_CART_003–011 | 6/6 | 100% |
| V3, V4, X5–X8 (Update/Delete) | 6 | TC_CART_012–020, 024–025 | 6/6 | 100% |
| V5, X9, X10 (Auth) | 3 | TC_CART_010,011,019,020,022,023,026,027 | 3/3 | 100% |
| State (thứ tự thao tác) | — | TC_CART_002,004,021,028–031 | — | — |
| B1 (min, Add) | 1 | TC_CART_003 | 1/1 | 100% |
| B2 (min, Update) | 1 | TC_CART_012 | 1/1 | 100% |
| **Tổng tag EP + BVA (V1–V5, X1–X10, B1–B2)** | **17** | | **17/17** | **100%** |

### Phân bố kỹ thuật trong 31 test case

| Kỹ thuật | Số TC | % trên tổng 31 TC |
|---|---:|---:|
| Security (auth: thiếu/sai token) | 8 | 25.8% |
| EP (Equivalence Partitioning) | 7 | 22.6% |
| State (chuỗi trạng thái phụ thuộc) | 7 | 22.6% |
| Robust BVA (giá trị ngoài biên: 0, âm) | 4 | 12.9% |
| BVA (giá trị biên / vượt tồn kho) | 3 | 9.7% |
| EP + BVA (kết hợp) | 1 | 3.2% |
| Functional (cơ bản) | 1 | 3.2% |
| **Tổng** | **31** | **100%** |

---
## 6. Cách chạy đề xuất

```bash
newman run "docs/testing/cart_shopping_test/blackbox_cart/postman/VGA Store Cart.postman_collection.json"   -e "environment.json"
```

Các biến cần có trong environment:

- `baseUrl`: ví dụ `http://localhost:8080`
- `validProductId`: ID sản phẩm tồn tại
- `invalidProductId`: ID sản phẩm không tồn tại
- `loginUsername`, `loginPassword`: tài khoản test nếu không dùng auto-register

## 7. Kết luận

Bộ test Cart black-box đã bao phủ các luồng positive, negative, security, boundary và state transition cơ bản của giỏ hàng. Các test quan trọng nhất là TC_CART_003, TC_CART_004, TC_CART_009, TC_CART_012, TC_CART_028 và TC_CART_031 vì chúng kiểm tra trực tiếp trạng thái dữ liệu của giỏ hàng.
