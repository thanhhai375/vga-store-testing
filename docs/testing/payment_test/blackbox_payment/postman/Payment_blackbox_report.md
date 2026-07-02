# Payment API Black-box Test Report

## 1. Thông tin chung

| Nội dung | Chi tiết |
|---|---|
| Jira task | KCPM-92 |
| Module | Payment |
| Loại kiểm thử | Black-box API Testing |
| Công cụ | Postman, Newman |
| Backend | Spring Boot |
| Người thực hiện | Nguyễn Ngọc Thanh |

## 2. Mục tiêu kiểm thử

Kiểm tra chức năng Payment API của hệ thống VGA Store, bao gồm:

- Tạo thanh toán bằng COD.
- Tạo thanh toán bằng chuyển khoản ngân hàng.
- Tạo thanh toán bằng VNPAY.
- Tạo thanh toán bằng MOMO.
- Kiểm tra dữ liệu đầu vào không hợp lệ.
- Kiểm tra đơn hàng không tồn tại.
- Kiểm tra xác thực bằng Bearer Token.
- Kiểm tra chức năng lấy danh sách thanh toán của người dùng.
- Kiểm tra các tham số phân trang không hợp lệ.
- Kiểm tra HTTP status và nội dung response.

## 3. Các file liên quan

| File | Vai trò |
|---|---|
| `automation/postman/VGAShop_Payment/VGAShop Payment.postman_collection.json` | Postman Collection chứa các request và test script |
| `automation/postman/VGAShop_Payment/TC_Payment_Blackbox_KCPM-92.csv` | Dữ liệu và tài liệu test case Payment |
| `docs/testing/test_cases/TC_Payment_Blackbox.csv` | Danh sách test case dùng cho tài liệu kiểm thử |
| `automation/package.json` | Chứa script chạy Newman |
| `automation/reports/payment-blackbox-newman.json` | Báo cáo Newman được sinh tự động |

> File trong thư mục `automation/reports` là file sinh tự động và không nên commit lên Git.

## 4. Cấu trúc Postman Collection

Collection có tổng cộng 24 request:

- 7 request chuẩn bị dữ liệu.
- 17 request kiểm thử Payment.

### 4.1. Setup requests

| STT | Request | Mục đích |
|---:|---|---|
| 1 | Register User | Tạo tài khoản dùng để kiểm thử |
| 2 | Login User | Lấy Bearer Token |
| 3 | Create Order - COD | Tạo đơn hàng dùng cho PAY-001 |
| 4 | Create Order - BANK_TRANSFER | Tạo đơn hàng dùng cho PAY-002 |
| 5 | Create Order - VNPAY | Tạo đơn hàng dùng cho PAY-003 |
| 6 | Create Order - MOMO | Tạo đơn hàng dùng cho PAY-004 |
| 7 | Create Order - Validation | Tạo đơn hàng dùng cho các test validation |

### 4.2. Payment test cases

| Test ID | Nội dung kiểm thử | Expected Status | Kết quả |
|---|---|---:|---|
| PAY-001 | Tạo Payment bằng COD | 200 | PASS |
| PAY-002 | Tạo Payment bằng BANK_TRANSFER | 200 | PASS |
| PAY-003 | Tạo Payment bằng VNPAY | 200 | PASS |
| PAY-004 | Tạo Payment bằng MOMO | 200 | PASS |
| PAY-005 | Thiếu `paymentMethod` | 400 | PASS |
| PAY-006 | `paymentMethod` bằng `null` | 400 | PASS |
| PAY-007 | `paymentMethod` là chuỗi rỗng | 400 | PASS |
| PAY-008 | Phương thức thanh toán không được hỗ trợ | 400 | PASS |
| PAY-009 | Thiếu request body | 400 | PASS |
| PAY-010 | JSON sai cú pháp | 400 | PASS |
| PAY-011 | Order không tồn tại | 404 | PASS |
| PAY-012 | Order ID sai kiểu dữ liệu | 400 | PASS |
| PAY-013 | Thiếu Bearer Token | 401 | PASS |
| PAY-014 | Bearer Token không hợp lệ | 401 | PASS |
| PAY-015 | Lấy danh sách Payment của người dùng | 200 | PASS |
| PAY-016 | Lấy danh sách Payment khi không có Token | 401 | PASS |
| PAY-017 | Tham số `page` có giá trị âm | 400 | PASS |

## 5. Cách tổ chức test

Mỗi test case Payment được tạo thành một request riêng trong Postman Collection.

Ví dụ:

```text
PAY-001 - Create Payment COD
PAY-002 - Create Payment BANK_TRANSFER
PAY-003 - Create Payment VNPAY
PAY-004 - Create Payment MOMO
```

Collection hiện không chạy theo kiểu Data Driven bằng tham số:

```text
-d file.csv
```

File CSV được sử dụng để lưu tài liệu và dữ liệu test case, không dùng để lặp toàn bộ collection.

## 6. Lệnh chạy test

Từ thư mục gốc của dự án:

```powershell
cd automation
npm run test:payment:blackbox
```

Hoặc chạy bằng một dòng:

```powershell
cd automation; npm run test:payment:blackbox
```

Script trong `automation/package.json`:

```json
"test:payment:blackbox": "newman run \"postman/VGAShop_Payment/VGAShop Payment.postman_collection.json\" --reporters cli,json --reporter-json-export \"reports/payment-blackbox-newman.json\""
```

## 7. Các kỹ thuật kiểm thử đã áp dụng

### 7.1. Equivalence Partitioning

Chia dữ liệu thành các nhóm hợp lệ và không hợp lệ.

Dữ liệu hợp lệ:

- `COD`
- `BANK_TRANSFER`
- `VNPAY`
- `MOMO`

Dữ liệu không hợp lệ:

- Chuỗi rỗng.
- Giá trị `null`.
- Phương thức không được hỗ trợ.
- Thiếu trường dữ liệu.

### 7.2. Boundary Value Analysis

Kiểm tra các giá trị nằm tại hoặc ngoài giới hạn cho phép.

Ví dụ:

- `page = -1`.
- Order ID không đúng kiểu dữ liệu.
- Request body rỗng.

### 7.3. Negative Testing

Kiểm tra hệ thống với dữ liệu không hợp lệ:

- Thiếu `paymentMethod`.
- `paymentMethod` bằng `null`.
- `paymentMethod` rỗng.
- JSON sai cú pháp.
- Thiếu request body.
- Order không tồn tại.
- Thiếu Bearer Token.
- Bearer Token không hợp lệ.

### 7.4. State-based Testing

Kiểm tra trạng thái Payment sau khi tạo.

Payment mới được tạo phải có trạng thái:

```text
PENDING
```

Response phải chứa:

- `paymentId`
- `orderId`
- `paymentMethod`
- `paymentStatus`

### 7.5. Authentication Testing

Kiểm tra quyền truy cập API:

- Bearer Token hợp lệ.
- Thiếu Bearer Token.
- Bearer Token không hợp lệ.

## 8. Bug phát hiện trong quá trình kiểm thử

### 8.1. KCPM-169 – Payment API response errors

Các test sau ban đầu trả HTTP `500` thay vì HTTP `400`:

- PAY-007.
- PAY-008.
- PAY-009.
- PAY-010.

Nguyên nhân:

Backend chưa xử lý riêng exception xảy ra khi request body hoặc giá trị enum không hợp lệ.

Đã bổ sung xử lý:

```java
HttpMessageNotReadableException
```

trong file:

```text
GlobalExceptionHandler.java
```

Các test sau ban đầu trả HTTP `403` thay vì HTTP `401`:

- PAY-013.
- PAY-014.
- PAY-016.

Đã bổ sung:

```text
AuthenticationEntryPoint
```

trong file:

```text
SecurityConfig.java
```

Kết quả sau khi sửa:

- Request không hợp lệ trả HTTP `400`.
- Thiếu hoặc sai Bearer Token trả HTTP `401`.

### 8.2. KCPM-170 – CI chạy sai module

CI ban đầu không nhận diện được module Payment và chạy nhầm các script khác.

Đã bổ sung selector Payment trong:

```text
.github/workflows/ci.yml
```

```bash
if echo "$selector_text" | grep -Eq 'payment|kcpm-92'; then
  selected_scripts="$(printf '%s\n%s\n' "$selected_scripts" "test:payment:blackbox")"
fi
```

Sau khi sửa, branch Payment chỉ chạy:

```text
test:payment:blackbox
```

## 9. Kết quả kiểm thử cuối cùng

| Chỉ số | Kết quả |
|---|---:|
| Setup requests | 7 |
| Payment test cases | 17 |
| Tổng request | 24 |
| Tổng assertion | 56 |
| Request thất bại | 0 |
| Assertion thất bại | 0 |
| Kết quả chung | PASS |

Kết quả Newman:

```text
requests:   24 executed, 0 failed
assertions: 56 executed, 0 failed
```

Toàn bộ test case từ `PAY-001` đến `PAY-017` đều Pass.

## 10. Kết luận

Payment API đã đáp ứng các trường hợp kiểm thử chính:

- Tạo Payment thành công với các phương thức được hỗ trợ.
- Validation dữ liệu đầu vào hoạt động đúng.
- Order không tồn tại trả HTTP `404`.
- Request không hợp lệ trả HTTP `400`.
- Thiếu hoặc sai Token trả HTTP `401`.
- Lấy danh sách Payment hoạt động đúng.
- CI nhận diện và chạy đúng module Payment.

Kết quả cuối cùng:

```text
24 requests
56 assertions
0 failures