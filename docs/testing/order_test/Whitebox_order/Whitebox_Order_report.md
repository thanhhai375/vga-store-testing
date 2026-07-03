# BÁO CÁO AUTO TEST WHITE-BOX VỚI ORDER / CHECKOUT

## 1. Thông tin chung

- **Jira task:** KCPM-132
- **Tên task:** `[Auto test] White-box test với Order / Checkout`
- **Trạng thái:** In Progress
- **Module:** Order / Checkout
- **Loại kiểm thử:** White-box Testing
- **Ngôn ngữ:** Java 17
- **Framework:** Spring Boot
- **Công cụ kiểm thử:** JUnit 5, Mockito, Maven Surefire
- **Công cụ đo độ bao phủ:** JaCoCo
- **Nhánh Git:** `whitebox/KCPM-132-order`
- **Commit đề xuất:** `KCPM-132 add Order Checkout white-box tests`
- **File test chính:**

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/order/OrderServiceWhiteboxTest.java
```

---

## 2. Mục tiêu của bài kiểm thử

Mục tiêu của bài là kiểm tra logic bên trong của module Order / Checkout thay vì chỉ kiểm tra đầu vào và đầu ra như kiểm thử hộp đen.

Bộ test tập trung vào các luồng xử lý chính:

- Tạo đơn hàng trực tiếp.
- Tạo đơn hàng từ giỏ hàng.
- Kiểm tra giỏ hàng rỗng.
- Kiểm tra user không tồn tại.
- Kiểm tra sản phẩm không tồn tại.
- Kiểm tra tồn kho.
- Lấy lịch sử đơn hàng.
- Lấy chi tiết đơn hàng.
- Kiểm tra quyền sở hữu đơn hàng.
- User yêu cầu hủy đơn.
- Admin cập nhật trạng thái đơn.
- Hoàn lại tồn kho khi hủy đơn.
- Cập nhật trạng thái thanh toán.
- Xử lý các đường ngoại lệ.

---

## 3. Luồng code đã đọc

Luồng xử lý chính của module:

```text
OrderController
    ↓
OrderService
    ↓
OrderRepository
OrderItemRepository
CartRepository
ProductRepository
UserRepository
PaymentRepository
```

### 3.1. OrderController

`OrderController` tiếp nhận request từ phía client và gọi các hàm trong `OrderService`.

Các chức năng liên quan:

```text
POST /api/orders
POST /api/orders/checkout
GET  /api/orders/my
GET  /api/orders/{orderId}
PUT  /api/orders/{id}/cancel
GET  /api/orders/admin/all
PUT  /api/orders/admin/{orderId}/status
```

Controller không chứa toàn bộ nghiệp vụ. Phần nghiệp vụ chính nằm trong `OrderService`.

### 3.2. OrderService

Các hàm chính được kiểm thử:

```java
placeOrder(...)
getUserOrders(...)
createOrderFromCart(...)
getMyOrders(...)
getOrderById(...)
cancelOrder(...)
updateOrderStatus(...)
getAllOrders(...)
```

### 3.3. Repository

Các repository được mock bằng Mockito:

```text
OrderRepository
OrderItemRepository
CartRepository
ProductRepository
UserRepository
PaymentRepository
```

Mục đích mock repository:

- Không cần kết nối database thật.
- Chủ động tạo dữ liệu cho từng nhánh.
- Mô phỏng trường hợp tìm thấy hoặc không tìm thấy dữ liệu.
- Mô phỏng repository ném exception.
- Kiểm tra repository có được gọi `save()` hay không.

---

# 4. KỸ THUẬT WHITE-BOX ĐƯỢC SỬ DỤNG

## 4.1. State Transition Testing

State Transition Testing dùng để kiểm tra trạng thái đơn hàng và các đường chuyển trạng thái.

Các trạng thái chính:

```text
PENDING
CONFIRMED
SHIPPING
DELIVERED
CANCEL_REQUESTED
CANCELLED
```

Các đường chuyển được kiểm tra:

```text
PENDING → CANCEL_REQUESTED
CONFIRMED → CANCEL_REQUESTED
PENDING → CONFIRMED
CONFIRMED → SHIPPING
SHIPPING → DELIVERED
CANCEL_REQUESTED → CANCELLED
```

Đường chuyển không hợp lệ được kiểm tra:

```text
SHIPPING → CANCEL_REQUESTED bởi user
```

Kết quả mong đợi:

- User chỉ được yêu cầu hủy khi đơn đang `PENDING` hoặc `CONFIRMED`.
- Khi Admin xác nhận đơn, trạng thái chuyển sang `CONFIRMED`.
- Khi giao hàng, trạng thái chuyển sang `SHIPPING`.
- Khi giao thành công, trạng thái chuyển sang `DELIVERED`.
- Khi duyệt hủy, trạng thái chuyển sang `CANCELLED`.
- Không hoàn kho hai lần nếu đơn đã ở trạng thái `CANCELLED`.

---

## 4.2. Path Testing

Path Testing kiểm tra các đường thực thi khác nhau trong `OrderService`.

### Đường tạo đơn trực tiếp thành công

```text
User tồn tại
→ Phone hợp lệ
→ Product tồn tại
→ Stock hợp lệ
→ Tạo OrderItem
→ Giảm stock
→ Lưu Product
→ Lưu Order
→ Trả kết quả
```

### Đường checkout từ cart thành công

```text
Lấy current user
→ Tìm cart
→ Kiểm tra cart không rỗng
→ Duyệt CartItem
→ Kiểm tra stock
→ Tạo OrderItem
→ Tính tổng tiền
→ Giảm stock
→ Lưu Order
→ Đánh dấu CartItem deleted
→ Xóa dữ liệu Cart
→ Trả OrderResponse
```

### Đường xem chi tiết đơn

```text
Lấy current user
→ Tìm order theo orderId và userId
→ Lấy danh sách OrderItem
→ Lấy Payment mới nhất
→ Ánh xạ sang OrderResponse
```

### Đường hủy đơn

```text
Lấy current user
→ Tìm order thuộc user
→ Kiểm tra trạng thái
→ Chuyển sang CANCEL_REQUESTED
→ Ghi lý do hủy
→ Lưu Order
```

### Đường Admin cập nhật trạng thái

```text
Tìm order
→ Lưu oldStatus
→ Cập nhật trạng thái mới
→ Chạy switch theo trạng thái
→ Cập nhật thời gian
→ Cập nhật payment
→ Cập nhật stock nếu CANCELLED
→ Lưu Order
```

---

## 4.3. Branch Coverage

Branch Coverage dùng để kiểm tra các nhánh `if/else`, điều kiện đúng/sai, `switch` và exception path.

Các nhánh chính đã kiểm tra:

| Điều kiện | Nhánh đúng | Nhánh sai |
|---|---|---|
| User tồn tại | Có | Không |
| Phone hợp lệ | Có | Không |
| Product tồn tại | Có | Không |
| Stock bằng null | Có | Không |
| Stock đủ | Có | Không |
| Cart tồn tại | Có | Không |
| Cart rỗng | Có | Không |
| Full name rỗng | Có | Không |
| Note bằng null | Có | Không |
| Order thuộc user | Có | Không |
| Payment tồn tại | Có | Không |
| Payment repository lỗi | Có | Không |
| Trạng thái được phép hủy | Có | Không |
| Reason rỗng | Có | Không |
| Payment là UNPAID | Có | Không |
| Old status là CANCELLED | Có | Không |
| Sort direction là desc | Có | Không |

Công thức:

```text
Branch Coverage =
(Số nhánh đã thực thi / Tổng số nhánh) × 100%
```

Kết quả JaCoCo của `OrderService`:

```text
Branch Coverage: 78%
```

Điều này có nghĩa phần lớn các nhánh xử lý chính đã được thực thi bởi bộ test.

---

## 4.4. Data Flow Testing

Data Flow Testing kiểm tra dữ liệu được truyền và thay đổi qua các lớp.

Luồng dữ liệu chính:

```text
CartItem.product
CartItem.quantity
Product.price
        ↓
OrderItem.product
OrderItem.quantity
OrderItem.price
        ↓
Order.totalAmount
```

Các dữ liệu được kiểm tra:

- Product trong CartItem được giữ đúng trong OrderItem.
- Quantity được sao chép đúng.
- Price tại thời điểm đặt hàng được lưu đúng.
- Total amount được tính đúng.
- Stock bị giảm theo quantity.
- CartItem bị đánh dấu deleted sau checkout.
- Cart bị làm rỗng.
- Cart total được đưa về 0.

Ví dụ:

```text
Product A: 100.000 × 2 = 200.000
Product B: 250.000 × 1 = 250.000
Tổng Order = 450.000
```

---

## 4.5. Exception Path Testing

Exception Path Testing kiểm tra các đường lỗi và exception.

Các trường hợp đã kiểm tra:

```text
User không tồn tại
Product không tồn tại
Phone không hợp lệ
Stock bằng null
Stock không đủ
Cart không tồn tại
Cart rỗng
Order ID không tồn tại
Order không thuộc user
User hủy đơn khi đang SHIPPING
PaymentRepository ném exception
Admin cập nhật order không tồn tại
```

Các exception chính:

```text
ResourceNotFoundException
IllegalArgumentException
RuntimeException
```

---

# 5. THIẾT KẾ 30 TEST CASE

## Nhóm 1: Tạo đơn trực tiếp

### WB-ORDER-001

**Tên:** Tạo order thành công, lưu OrderItem và giảm stock.

**Mục tiêu:**

- Kiểm tra luồng tạo đơn trực tiếp thành công.
- Kiểm tra dữ liệu product được sao chép đúng sang OrderItem.
- Kiểm tra stock bị giảm đúng.

**Điều kiện:**

- User tồn tại.
- Product tồn tại.
- Stock đủ.
- Phone hợp lệ.

**Kết quả mong đợi:**

```text
Order ID được tạo
Status = PENDING
Payment Status = UNPAID
Total Price đúng
Stock giảm đúng
OrderItem lưu đúng Product, Quantity và Price
```

---

### WB-ORDER-002

**Tên:** User không tồn tại khi tạo order.

**Mục tiêu:**

Kiểm tra exception path khi username không tồn tại.

**Kết quả mong đợi:**

```text
Ném ResourceNotFoundException
Không lưu Order
```

---

### WB-ORDER-003

**Tên:** Số điện thoại không hợp lệ.

**Mục tiêu:**

Kiểm tra nhánh validation phone.

**Dữ liệu:**

```text
Phone = "123"
```

**Kết quả mong đợi:**

```text
Ném IllegalArgumentException
Không tìm Product
```

---

### WB-ORDER-004

**Tên:** Product không tồn tại.

**Mục tiêu:**

Kiểm tra exception path khi productId sai.

**Kết quả mong đợi:**

```text
Ném ResourceNotFoundException
Không lưu Order
```

---

### WB-ORDER-005

**Tên:** Stock bằng null.

**Mục tiêu:**

Kiểm tra nhánh short-circuit khi stock chưa được thiết lập.

**Kết quả mong đợi:**

```text
Ném IllegalArgumentException
Không lưu Product
```

---

### WB-ORDER-006

**Tên:** Quantity lớn hơn stock.

**Dữ liệu:**

```text
Stock = 1
Quantity = 2
```

**Kết quả mong đợi:**

```text
Ném IllegalArgumentException
Không lưu Order
```

---

## Nhóm 2: Lấy lịch sử đơn hàng

### WB-ORDER-007

**Tên:** Lấy lịch sử và ánh xạ đầy đủ dữ liệu.

**Mục tiêu:**

Kiểm tra:

```text
itemCount
productIds
createdAt
```

**Kết quả mong đợi:**

```text
Danh sách có đúng dữ liệu của Order
```

---

### WB-ORDER-008

**Tên:** Lịch sử có items null và createdAt null.

**Mục tiêu:**

Kiểm tra các nhánh null.

**Kết quả mong đợi:**

```text
itemCount = 0
productIds = []
createdAt = ""
```

---

### WB-ORDER-009

**Tên:** Lấy lịch sử của user không tồn tại.

**Kết quả mong đợi:**

```text
Ném ResourceNotFoundException
Không gọi OrderRepository
```

---

## Nhóm 3: Checkout từ Cart

### WB-ORDER-010

**Tên:** Checkout thành công, lưu order và xóa cart.

**Mục tiêu:**

Kiểm tra toàn bộ data flow:

```text
CartItem → OrderItem → Order
```

**Kết quả mong đợi:**

```text
Order được lưu
Total amount đúng
Stock giảm đúng
CartItem deleted
Cart rỗng
Cart total = 0
```

---

### WB-ORDER-011

**Tên:** Cart không tồn tại.

**Kết quả mong đợi:**

```text
Ném ResourceNotFoundException
Không lưu Order
```

---

### WB-ORDER-012

**Tên:** Cart rỗng.

**Kết quả mong đợi:**

```text
Ném IllegalArgumentException
Thông báo: Cart is empty
Không lưu Order
```

---

### WB-ORDER-013

**Tên:** Sản phẩm trong Cart không đủ stock.

**Kết quả mong đợi:**

```text
Ném IllegalArgumentException
Stock không thay đổi
Không lưu Order
```

---

### WB-ORDER-014

**Tên:** Note null và fullName rỗng.

**Mục tiêu:**

Kiểm tra fallback:

```text
fullName rỗng → dùng username
note null → dùng ""
```

---

## Nhóm 4: Xem chi tiết và quyền sở hữu

### WB-ORDER-015

**Tên:** User xem đúng order của mình.

**Mục tiêu:**

Kiểm tra:

```text
Order thuộc đúng user
Payment method lấy đúng
Email đúng
Danh sách item đúng
```

---

### WB-ORDER-016

**Tên:** User xem order sai ID hoặc không thuộc mình.

**Kết quả mong đợi:**

```text
Ném ResourceNotFoundException
```

---

### WB-ORDER-017

**Tên:** PaymentRepository xảy ra lỗi.

**Mục tiêu:**

Kiểm tra exception được giữ bên trong service.

**Kết quả mong đợi:**

```text
OrderResponse vẫn được trả về
paymentMethod = UNKNOWN
```

---

## Nhóm 5: User yêu cầu hủy đơn

### WB-ORDER-018

**Tên:** PENDING chuyển sang CANCEL_REQUESTED có lý do.

**Kết quả mong đợi:**

```text
Status = CANCEL_REQUESTED
Lý do hủy được nối vào note
```

---

### WB-ORDER-019

**Tên:** CONFIRMED chuyển sang CANCEL_REQUESTED không có lý do.

**Kết quả mong đợi:**

```text
Status = CANCEL_REQUESTED
Note không bị thêm lý do rỗng
```

---

### WB-ORDER-020

**Tên:** User hủy đơn đang SHIPPING.

**Kết quả mong đợi:**

```text
Ném IllegalArgumentException
Không lưu Order
```

---

### WB-ORDER-021

**Tên:** User hủy order sai ID hoặc sai chủ đơn.

**Kết quả mong đợi:**

```text
Ném ResourceNotFoundException
```

---

## Nhóm 6: Admin cập nhật trạng thái

### WB-ORDER-022

**Tên:** PENDING → CONFIRMED.

**Kết quả mong đợi:**

```text
Status = CONFIRMED
confirmedAt được cập nhật
Payment Status = PAID
```

---

### WB-ORDER-023

**Tên:** CONFIRMED → SHIPPING khi payment UNPAID.

**Kết quả mong đợi:**

```text
Status = SHIPPING
shippedAt được cập nhật
Payment Status = PAID
```

---

### WB-ORDER-024

**Tên:** SHIPPING khi payment đã PAID.

**Kết quả mong đợi:**

```text
Payment vẫn PAID
shippedAt được cập nhật
```

---

### WB-ORDER-025

**Tên:** SHIPPING → DELIVERED.

**Kết quả mong đợi:**

```text
Status = DELIVERED
deliveredAt được cập nhật
Payment Status = PAID
```

---

### WB-ORDER-026

**Tên:** Chuyển sang CANCELLED lần đầu.

**Mục tiêu:**

Kiểm tra hoàn kho.

**Kết quả mong đợi:**

```text
Product stock tăng theo quantity của OrderItem
ProductRepository.save() được gọi
```

---

### WB-ORDER-027

**Tên:** Cập nhật CANCELLED lần thứ hai.

**Mục tiêu:**

Kiểm tra chống hoàn kho trùng.

**Kết quả mong đợi:**

```text
Stock không thay đổi
ProductRepository.save() không được gọi
```

---

### WB-ORDER-028

**Tên:** Admin cập nhật order ID không tồn tại.

**Kết quả mong đợi:**

```text
Ném ResourceNotFoundException
Không lưu Order
```

---

## Nhóm 7: Phân trang

### WB-ORDER-029

**Tên:** Lịch sử user sắp xếp DESC.

**Kết quả mong đợi:**

```text
Pageable sử dụng createdAt DESC
Total items được tính đúng
```

---

### WB-ORDER-030

**Tên:** Danh sách Admin sắp xếp ASC.

**Kết quả mong đợi:**

```text
Pageable sử dụng orderCode ASC
Page rỗng được xử lý đúng
```

---

# 6. CẤU TRÚC FILE TEST

File sử dụng:

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceWhiteboxTest {
```

Các dependency được mock:

```java
@Mock
private OrderRepository orderRepository;

@Mock
private OrderItemRepository orderItemRepository;

@Mock
private CartRepository cartRepository;

@Mock
private ProductRepository productRepository;

@Mock
private UserRepository userRepository;

@Mock
private UserService userService;

@Mock
private PaymentRepository paymentRepository;
```

Trong `setUp()`:

```java
orderService = new OrderService(
    orderRepository,
    orderItemRepository,
    cartRepository,
    productRepository,
    userRepository,
    userService,
    paymentRepository
);
```

Mockito giúp kiểm soát dữ liệu cho từng testcase.

---

# 7. KẾT QUẢ THỰC THI

Lệnh chạy:

```powershell
cd C:\Users\Thommy31\vga-store-testing\backend\vgashop
.\mvnw.cmd clean -Pwhitebox -Dtest=OrderServiceWhiteboxTest test
```

Kết quả:

```text
Tests run: 30
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

Điều này chứng minh:

- File test được Maven nhận diện đúng.
- Cả 30 testcase đều chạy.
- Không có testcase thất bại.
- Không có lỗi khi thực thi.
- Không có testcase bị bỏ qua.

---

# 8. KẾT QUẢ JACOCO

Kết quả riêng của `OrderService`:

| Loại coverage | Kết quả |
|---|---:|
| Instruction Coverage | 98% |
| Branch Coverage | 78% |
| Line Coverage | 100% |
| Method Coverage | 100% |
| Class Coverage | 100% |

Chi tiết:

```text
Line Coverage: 175/175
Method Coverage: 25/25
Class Coverage: 1/1
```

## Ý nghĩa

### Instruction Coverage 98%

Gần như toàn bộ câu lệnh bytecode trong `OrderService` đã được thực thi.

### Branch Coverage 78%

Phần lớn các nhánh `if/else`, `switch`, short-circuit và exception đã được kiểm tra.

### Line Coverage 100%

Toàn bộ 175 dòng code có thể thực thi trong `OrderService` đã chạy ít nhất một lần.

### Method Coverage 100%

Tất cả 25 phương thức trong `OrderService` đã được thực thi.

### Class Coverage 100%

Lớp `OrderService` đã được bao phủ.

Lưu ý:

```text
Coverage 100% không có nghĩa phần mềm hoàn toàn không còn lỗi.
```

Coverage chỉ chứng minh code đã được thực thi, không chứng minh tất cả yêu cầu nghiệp vụ đều đúng.

---

# 9. PHÁT HIỆN QUAN TRỌNG TRONG CODE

Trong hàm:

```java
updateOrderStatus(Long orderId, OrderStatusUpdateRequest request)
```

service cập nhật trạng thái trực tiếp:

```java
order.setStatus(request.getStatus());
```

sau đó thực hiện `switch`.

Hiện tại code chưa có bảng validation toàn bộ ma trận chuyển trạng thái.

Một số đường chuyển có thể được backend chấp nhận nếu gọi trực tiếp API:

```text
DELIVERED → PENDING
CANCELLED → SHIPPING
PENDING → DELIVERED
```

Dù frontend có thể khóa thao tác, backend vẫn nên kiểm tra nghiệp vụ.

Đề xuất:

```text
Tạo hàm validateStatusTransition(oldStatus, newStatus)
```

Ví dụ:

```java
private void validateStatusTransition(OrderStatus oldStatus, OrderStatus newStatus) {
    // Chỉ cho phép các đường chuyển hợp lệ
}
```

Sau đó bổ sung testcase cho các đường chuyển không hợp lệ.

---

# 10. NHÁNH GIT VÀ QUY TẮC CI

Nhánh đúng:

```text
whitebox/KCPM-132-order
```

Thư mục đúng:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/order/
```

File phải kết thúc bằng:

```text
*Test.java
```

File hiện tại:

```text
OrderServiceWhiteboxTest.java
```

Commit:

```text
KCPM-132 add Order Checkout white-box tests
```

Push:

```bash
git push -u origin whitebox/KCPM-132-order
```

CI sẽ đọc:

```text
branch name
commit message
PR title
```

để xác định:

```text
Jira key: KCPM-132
Module: order
```

---

# 11. CHECKLIST TRƯỚC KHI PUSH

- [x] Có thư mục `whitebox_test/order`.
- [x] Có file `OrderServiceWhiteboxTest.java`.
- [x] Tên class trùng tên file.
- [x] File kết thúc bằng `Test.java`.
- [x] Nhánh là `whitebox/KCPM-132-order`.
- [x] Module trong branch là `order`.
- [x] Test chạy pass local.
- [x] 30 testcase pass.
- [x] JaCoCo tạo báo cáo.
- [x] Không đưa thư mục `target` lên Git.
- [x] Commit có Jira key KCPM-132.

---

# 12. HẠN CHẾ

- Test sử dụng Mockito nên không kiểm tra database thật.
- Test tập trung nhiều vào `OrderService`.
- Chưa kiểm tra controller bằng MockMvc.
- Branch Coverage chưa đạt 100%.
- Chưa kiểm tra đầy đủ mọi đường chuyển trạng thái sai.
- Chưa kiểm tra transaction rollback với database thật.
- Chưa kiểm tra concurrency khi nhiều user cùng mua một sản phẩm.

---

# 13. ĐỀ XUẤT CẢI TIẾN

1. Bổ sung test cho `OrderController`.
2. Bổ sung integration test với H2.
3. Bổ sung validation ma trận trạng thái.
4. Bổ sung test rollback khi save Order lỗi.
5. Bổ sung test khi ProductRepository.save() lỗi.
6. Bổ sung test khi CartRepository.save() lỗi.
7. Bổ sung test nhiều sản phẩm có một sản phẩm lỗi.
8. Bổ sung test race condition tồn kho.
9. Tăng Branch Coverage từ 78% lên trên 85%.
10. Tạo báo cáo JaCoCo artifact trong GitHub Actions.

---

# 14. KẾT LUẬN

Bộ Auto Test White-box cho module Order / Checkout đã được xây dựng với 30 testcase.

Các kỹ thuật đã áp dụng:

```text
State Transition Testing
Path Testing
Branch Coverage
Data Flow Testing
Exception Path Testing
```

Kết quả thực thi:

```text
30 testcase
30 passed
0 failures
0 errors
0 skipped
BUILD SUCCESS
```

Kết quả JaCoCo:

```text
Instruction Coverage: 98%
Branch Coverage: 78%
Line Coverage: 100%
Method Coverage: 100%
Class Coverage: 100%
```

Bộ test đã kiểm tra được các luồng quan trọng của Order / Checkout, bao gồm tạo đơn, checkout, lịch sử đơn hàng, quyền sở hữu, hủy đơn, cập nhật trạng thái, tồn kho, payment và các đường ngoại lệ.

Kết quả cho thấy `OrderService` đã được bao phủ tốt về dòng code, phương thức và các nhánh xử lý chính. Bộ test có thể được sử dụng làm nền tảng cho kiểm thử hồi quy backend trong các lần cập nhật sau.
