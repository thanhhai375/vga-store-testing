# BÁO CÁO KIỂM THỬ BLACK-BOX MODULE ADMIN

## 1. Thông tin chung

| Nội dung | Thông tin |
|---|---|
| Dự án | VGA Store |
| Module kiểm thử | Admin |
| Jira task | `KCPM-93` |
| Người thực hiện | Phan Nguyễn Thom My |
| Loại kiểm thử | Black-box API |
| Công cụ | Postman, Newman, GitHub Actions, Jira, Docker |
| Nhánh thực hiện | `feature/KCPM-93-admin-api` |
| Ngày lập báo cáo | 02/07/2026 |

---

## 2. Mục tiêu kiểm thử

Bộ kiểm thử được xây dựng nhằm kiểm tra các chức năng quản trị chính của hệ thống VGA Store thông qua API mà không phụ thuộc vào mã nguồn xử lý bên trong.

Các mục tiêu chính:

1. Kiểm tra khả năng xác thực và phân quyền tài khoản Admin.
2. Kiểm tra nghiệp vụ quản lý thương hiệu và danh mục.
3. Kiểm tra nghiệp vụ quản lý sản phẩm.
4. Kiểm tra nghiệp vụ quản lý người dùng.
5. Kiểm tra nghiệp vụ quản lý đơn hàng.
6. Kiểm tra dữ liệu Dashboard.
7. Kiểm tra thao tác dọn dữ liệu sau khi chạy test.
8. Tự động hóa bằng Postman/Newman.
9. Tích hợp với GitHub Actions và Jira để ghi nhận lỗi tự động.

---

## 3. Phạm vi kiểm thử

Bộ kiểm thử gồm **25 request**, được chia thành 6 nhóm chức năng:

| Nhóm | Nội dung | Số request |
|---|---|---:|
| 1 | Auth Admin | 2 |
| 2 | Brand & Category Management | 5 |
| 3 | Product Management | 4 |
| 4 | User Management | 5 |
| 5 | Order Management | 5 |
| 6 | Dashboard & Cleanup | 4 |
| **Tổng cộng** |  | **25** |

---

## 4. Các file sử dụng

### 4.1 Postman Collection

```text
automation/postman/VGA-Store-Admin/VGA Store Admin Blackbox.postman_collection.json
```

### 4.2 File đặc tả test case

```text
automation/postman/VGA-Store-Admin/VGA_Store_Admin_TestCases.csv
```

File CSV được dùng để lưu tài liệu test case, bao gồm mã test, module, endpoint, dữ liệu đầu vào, kết quả mong đợi và kỹ thuật kiểm thử.

### 4.3 File Environment

```text
automation/postman/env/VGA_Store_Environment.postman_environment.json
```

### 4.4 Báo cáo Newman

```text
automation/reports/admin-blackbox-newman.json
```

---

## 5. Cấu hình chạy tự động

Trong file:

```text
automation/package.json
```

đã bổ sung script:

```json
"test:admin:blackbox": "newman run \"postman/VGA-Store-Admin/VGA Store Admin.postman_collection.json\" -e \"postman/env/VGA_Store_Environment.postman_environment.json\" --reporters cli,json --reporter-json-export \"reports/admin-blackbox-newman.json\""
```

Lệnh chạy:

```bash
cd automation
npm run test:admin:blackbox
```

---

## 6. Tiền điều kiện

Trước khi chạy bộ kiểm thử cần bảo đảm:

1. Docker Desktop đang hoạt động.
2. Database và backend VGA Store đã được khởi động.
3. Backend có thể truy cập tại:

```text
http://localhost:8080
```

4. Node.js và npm đã được cài đặt.
5. Thư mục `automation` đã cài dependency bằng:

```bash
npm install
```

6. Collection và Environment nằm đúng đường dẫn.
7. Không sửa file cấu hình CI dùng chung của nhóm.

---

## 7. Kỹ thuật kiểm thử black-box được áp dụng

### 7.1 Phân hoạch lớp tương đương

Dữ liệu được chia thành các lớp hợp lệ và không hợp lệ:

| Điều kiện | Lớp hợp lệ | Lớp không hợp lệ |
|---|---|---|
| Token Admin | Token hợp lệ, role ADMIN | Thiếu token, token USER, token sai |
| ID tài nguyên | ID tồn tại | ID không tồn tại, rỗng hoặc sai định dạng |
| Dữ liệu tạo Brand/Category/Product | Đầy đủ và đúng định dạng | Thiếu trường, sai kiểu, giá trị không hợp lệ |
| Khoảng ngày Dashboard | `startDate <= endDate` | `startDate > endDate` |
| Quyền tạo Admin | Người có quyền phù hợp | Người chưa xác thực gọi endpoint công khai |

### 7.2 Phân tích giá trị biên

Một số giá trị biên được áp dụng:

- Tồn kho sản phẩm.
- Giá sản phẩm.
- Giá trị phân trang `page` và `size`.
- Khoảng ngày Dashboard.
- Trạng thái kích hoạt người dùng.
- Trạng thái đơn hàng.

### 7.3 Kiểm thử chuyển trạng thái

Các luồng chuyển trạng thái chính:

```text
Tạo Brand → Cập nhật Brand → Xóa Brand
Tạo Product → Cập nhật Stock → Xem chi tiết → Xóa Product
Tạo User → Đăng nhập → Đổi role/trạng thái
Tạo Cart → Checkout → Xem Order → Cập nhật trạng thái Order
```

### 7.4 Kiểm thử phân quyền

Bộ test kiểm tra:

- Người chưa xác thực không được tự tạo tài khoản ADMIN.
- USER không được truy cập API `/api/admin/**`.
- ADMIN hợp lệ được thực hiện các thao tác quản trị.

---

## 8. Danh sách test case

| STT | Test ID | Module | Test case | Method | Endpoint | Expected HTTP | Kỹ thuật |
|---:|---|---|---|---|---|---|---|
| 1 | `TC_ADM_AUTH_01` | 1. Auth Admin | Kiểm tra đăng ký tài khoản ADMIN từ endpoint công khai | `POST` | `/api/auth/register-admin` | `401/403` | Negative authorization |
| 2 | `TC_ADM_AUTH_02` | 1. Auth Admin | Đăng nhập bằng tài khoản Admin có sẵn | `POST` | `/api/auth/login` | `200` | Positive test |
| 3 | `TC_ADM_BRND_01` | 2. Brand & Category Management | Tạo thương hiệu để test | `POST` | `/api/admin/brands` | `200` | Equivalence partitioning |
| 4 | `TC_ADM_CAT_01` | 2. Brand & Category Management | Tạo danh mục để test | `POST` | `/api/admin/categories` | `200` | Equivalence partitioning |
| 5 | `TC_ADM_BRND_02` | 2. Brand & Category Management | Lấy danh sách thương hiệu | `GET` | `/api/admin/brands?page=0&size=12` | `200` | Positive test |
| 6 | `TC_ADM_BRND_03` | 2. Brand & Category Management | Sửa thương hiệu | `PUT` | `/api/admin/brands/{{brandId}}` | `200` | State transition |
| 7 | `TC_ADM_CAT_02` | 2. Brand & Category Management | Lấy danh sách danh mục | `GET` | `/api/admin/categories?page=0&size=12` | `200` | Positive test |
| 8 | `TC_ADM_PRD_01` | 3. Product Management | Tạo sản phẩm bằng Form Data | `POST` | `/api/admin/products` | `200` | Equivalence partitioning |
| 9 | `TC_ADM_PRD_02` | 3. Product Management | Lấy danh sách sản phẩm | `GET` | `/api/admin/products?page=0&size=12` | `200` | Positive test |
| 10 | `TC_ADM_PRD_03` | 3. Product Management | Cập nhật tồn kho sản phẩm | `PUT` | `/api/admin/products/{{productId}}/stock?stock=200` | `200` | Boundary/valid value |
| 11 | `TC_ADM_PRD_04` | 3. Product Management | Xem chi tiết sản phẩm | `GET` | `/api/admin/products/{{productId}}` | `200` | Positive test |
| 12 | `TC_ADM_USR_01` | 4. User Management | Tạo User ảo làm dữ liệu tiền đề | `POST` | `/api/auth/register` | `200` | Equivalence partitioning |
| 13 | `TC_ADM_USR_02` | 4. User Management | Đăng nhập User lấy Token | `POST` | `/api/auth/login` | `200` | Positive test |
| 14 | `TC_ADM_USR_03` | 4. User Management | Admin lấy danh sách người dùng | `GET` | `/api/admin/users?page=0&size=12` | `200` | Positive test |
| 15 | `TC_ADM_USR_04` | 4. User Management | Cập nhật vai trò người dùng thành USER | `GET` | `/api/admin/users/{{userId}}/role?role=USER` | `200` | State transition |
| 16 | `TC_ADM_USR_05` | 4. User Management | Đảo trạng thái hoạt động của người dùng | `PUT` | `/api/admin/users/{{userId}}/status` | `200` | State transition |
| 17 | `TC_ADM_ORD_00` | 5. Order Management | User thêm sản phẩm vào giỏ hàng | `POST` | `/api/cart/add` | `200` | Positive test |
| 18 | `TC_ADM_ORD_01` | 5. Order Management | User tạo đơn hàng từ giỏ hàng | `POST` | `/api/orders/checkout` | `200` | Positive test |
| 19 | `TC_ADM_ORD_02` | 5. Order Management | Admin lấy danh sách đơn hàng | `GET` | `/api/admin/orders?page=0&size=12` | `200` | Positive test |
| 20 | `TC_ADM_ORD_03` | 5. Order Management | Admin xem chi tiết đơn hàng | `GET` | `/api/admin/orders/{{orderId}}` | `200` | Positive test |
| 21 | `TC_ADM_ORD_04` | 5. Order Management | Admin cập nhật trạng thái đơn hàng | `PUT` | `/api/admin/orders/{{orderId}}/status` | `200` | State transition |
| 22 | `TC_ADM_DASH_01` | 6. Dashboard & Cleanup | Kiểm tra Dashboard với khoảng ngày sai logic | `GET` | `/api/admin/dashboard` | `400` | Negative/date logic |
| 23 | `TC_ADM_CLN_01` | 6. Dashboard & Cleanup | Xóa mềm sản phẩm | `DELETE` | `/api/admin/products/{{productId}}` | `200` | Cleanup |
| 24 | `TC_ADM_CLN_02` | 6. Dashboard & Cleanup | Xóa mềm danh mục | `DELETE` | `/api/admin/categories/{{categoryId}}` | `200` | Cleanup |
| 25 | `TC_ADM_CLN_03` | 6. Dashboard & Cleanup | Xóa mềm thương hiệu | `DELETE` | `/api/admin/brands/{{brandId}}` | `200` | Cleanup |

---

## 9. Luồng thực thi tự động

Collection sử dụng các biến động để liên kết dữ liệu giữa các request:

| Biến | Mục đích |
|---|---|
| `adminToken` | Xác thực các API Admin |
| `userToken` | Xác thực các API User/Cart/Order |
| `brandId` | Cập nhật và xóa Brand |
| `categoryId` | Tạo Product và xóa Category |
| `productId` | Cập nhật tồn kho, tạo Cart và Cleanup |
| `userId` | Cập nhật role và trạng thái User |
| `orderId` | Xem chi tiết và cập nhật trạng thái Order |

Luồng chính:

```text
Đăng ký/đăng nhập Admin
        ↓
Tạo Brand và Category
        ↓
Tạo Product
        ↓
Tạo và đăng nhập User
        ↓
Thêm Cart và Checkout
        ↓
Admin quản lý Order
        ↓
Kiểm tra Dashboard
        ↓
Cleanup dữ liệu
```

---

## 10. Tích hợp GitHub Actions và Jira

### 10.1 Nhánh làm việc

```text
feature/KCPM-93-admin-api
```

### 10.2 Commit

Ví dụ:

```bash
git commit -m "KCPM-93 add Admin API Postman blackbox tests"
```

### 10.3 Push

```bash
git push -u origin feature/KCPM-93-admin-api
```

CI đọc Jira key và module từ tên branch, commit hoặc Pull Request.

Khi Newman phát hiện lỗi, GitHub Actions tạo hoặc cập nhật subtask Jira dưới task cha `KCPM-93`.

Subtask lỗi Admin đã được ghi nhận với fingerprint:

```text
KCPM-93:API_POSTMAN_GENERAL
```

Script gây lỗi được nhận diện là:

```text
test:admin:blackbox
```

---

---

## 11. Kết quả kiểm thử và hai lỗi phát hiện

Sau khi cấu hình đúng Collection, Environment và chạy bộ kiểm thử bằng Newman, toàn bộ **25 request** đã được thực thi.

Kết quả tổng hợp:

| Kết quả | Số lượng |
|---|---:|
| Testcase đạt | 23 |
| Testcase không đạt | 2 |
| Tổng testcase | 25 |

Hai testcase không đạt là:

| Test ID | Chức năng | Kết quả mong đợi | Kết quả thực tế |
|---|---|---|---|
| `TC_ADM_AUTH_01` | Đăng ký tài khoản ADMIN từ endpoint công khai | `401/403` | `200 OK` |
| `TC_ADM_DASH_01` | Dashboard với `startDate > endDate` | `400 Bad Request` | `200 OK` |

Hai lỗi trên là lỗi nghiệp vụ của backend vì request đã được gửi thành công, dữ liệu môi trường hợp lệ và kết quả thực tế không đúng với yêu cầu kiểm thử.

### 11.1. Lỗi phân quyền khi đăng ký ADMIN

**Test case:**

```text
TC_ADM_AUTH_01
```

**Request:**

```http
POST /api/auth/register-admin
```

**Kết quả mong đợi:**

```text
401 Unauthorized hoặc 403 Forbidden
```

**Kết quả thực tế:**

```text
200 OK
```

**Phân tích:**

Người dùng chưa xác thực vẫn có thể gọi endpoint công khai để tạo tài khoản có quyền `ADMIN`. Đây là lỗi phân quyền nghiêm trọng vì có thể dẫn đến việc người dùng tự nâng quyền và truy cập các chức năng quản trị.

**Đề xuất sửa:**

- Không cho phép đăng ký ADMIN từ endpoint công khai.
- Chỉ tài khoản ADMIN đã xác thực mới được tạo tài khoản quản trị mới.
- Kiểm tra token và role trước khi xử lý yêu cầu.
- Trả về `401` khi chưa đăng nhập và `403` khi không đủ quyền.

### 11.2. Lỗi kiểm tra khoảng ngày Dashboard

**Test case:**

```text
TC_ADM_DASH_01
```

**Dữ liệu kiểm thử:**

```text
startDate = 2026-12-31
endDate   = 2026-01-01
```

**Kết quả mong đợi:**

```text
400 Bad Request
```

**Kết quả thực tế:**

```text
200 OK
```

**Phân tích:**

Backend chưa kiểm tra điều kiện:

```text
startDate <= endDate
```

Do đó hệ thống vẫn chấp nhận khoảng thời gian không hợp lệ và trả về `200 OK`.

**Đề xuất sửa:**

- Kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc.
- Trả về `400 Bad Request` khi khoảng ngày không hợp lệ.
- Trả thông báo rõ ràng, ví dụ:

```text
startDate must be before or equal to endDate
```

---

## 12. Đánh giá kết quả

### Điểm đạt được

- Xây dựng đủ 25 request cho module Admin.
- Bao phủ 6 nhóm chức năng quản trị.
- Có chuỗi dữ liệu tự động giữa các request.
- Có kiểm thử tích cực, tiêu cực, phân quyền và chuyển trạng thái.
- Tích hợp Newman vào `package.json`.
- Có thể chạy tự động bằng lệnh `npm run test:admin:blackbox`.
- 23/25 testcase đạt kết quả mong đợi.
- Phát hiện được 2 lỗi nghiệp vụ thực tế của backend.
- Xác định được một lỗi phân quyền nghiêm trọng tại endpoint đăng ký Admin.
- Xác định được lỗi validation khoảng ngày của Dashboard.

### Hạn chế

- Một số request phụ thuộc dữ liệu được tạo từ các bước trước.
- Khi bước tạo dữ liệu tiền đề thất bại, các testcase phía sau có thể bị ảnh hưởng.
- Bộ test hiện tập trung vào API và chưa thay thế hoàn toàn kiểm thử giao diện.
- Chưa kiểm tra đầy đủ tất cả trường hợp token hết hạn, token bị sửa hoặc tài khoản bị khóa.
- Cần duy trì dữ liệu test ổn định để kết quả CI có thể lặp lại.

---

## 13. Đề xuất cải tiến

1. Sửa phân quyền endpoint `/api/auth/register-admin`.
2. Chỉ cho phép ADMIN hợp lệ tạo tài khoản quản trị mới.
3. Bổ sung validation `startDate <= endDate` cho Dashboard.
4. Trả về status code và thông báo lỗi nhất quán.
5. Bổ sung testcase cho token thiếu, token sai, token hết hạn và role USER.
6. Tách các luồng phụ thuộc lớn thành các nhóm nhỏ để dễ xác định lỗi.
7. Kiểm tra biến tiền điều kiện trước khi thực hiện request tiếp theo.
8. Sử dụng dữ liệu có hậu tố thời gian để tránh trùng username, email, SKU và tên tài nguyên.
9. Luôn Cleanup dữ liệu test sau khi chạy.
10. Chạy lại toàn bộ 25 testcase sau khi backend sửa hai lỗi để thực hiện regression test.

---

## 14. Kết luận

Bộ kiểm thử black-box module Admin của VGA Store gồm **25 testcase**, bao phủ các nghiệp vụ xác thực Admin, quản lý Brand, Category, Product, User, Order, Dashboard và Cleanup.

Kết quả thực thi:

```text
Tổng testcase: 25
Đạt: 23
Không đạt: 2
```

Hai lỗi được phát hiện:

```text
1. Người chưa xác thực có thể đăng ký tài khoản ADMIN.
2. Dashboard chấp nhận startDate lớn hơn endDate.
```

Lỗi thứ nhất liên quan trực tiếp đến bảo mật và phân quyền nên cần được ưu tiên xử lý. Lỗi thứ hai liên quan đến validation dữ liệu đầu vào và có thể làm kết quả thống kê không chính xác.

Sau khi backend sửa lỗi, cần chạy lại toàn bộ collection bằng Newman để xác nhận hai testcase đã pass và bảo đảm các chức năng Admin khác không bị ảnh hưởng.

---

## Phụ lục: Các lệnh thường dùng

### Chạy Docker

```bash
docker compose up -d
```

### Chạy bộ test Admin

```bash
cd automation
npm run test:admin:blackbox
```

### Kiểm tra Git

```bash
git status
git branch --show-current
```

### Commit và push

```bash
git add automation/package.json
git add "automation/postman/VGA-Store-Admin/VGA Store Admin Blackbox.postman_collection.json"
git add "automation/postman/VGA-Store-Admin/VGA_Store_Admin_TestCases.csv"
git add "docs/testing/blackbox_admin/Admin_blackbox_report.md"

git commit -m "KCPM-93 update Admin blackbox test report"
git push origin sprint7
```
``
