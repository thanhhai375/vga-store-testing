# Order Test Reports

Thư mục này tổng hợp tài liệu kiểm thử **White-box Order / Checkout** của VGA Store.

## Tổng quan tài liệu

| Nhóm test | File/Thư mục | Nội dung |
| :--- | :--- | :--- |
| White-box Backend | [Whitebox_Order_report.md](../testing/order_test/Whitebox_order/Whitebox_Order_report.md) | Báo cáo kiểm thử white-box cho Order / Checkout |
| Test implementation | `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/order/OrderServiceWhiteboxTest.java` | Bộ test JUnit 5 và Mockito cho `OrderService` |
| JaCoCo Coverage | `backend/vgashop/target/site/jacoco/index.html` | Báo cáo độ bao phủ mã nguồn |

## White-box Order / Checkout

Report chính:

- [Whitebox_Order_report.md](../testing/order_test/Whitebox_order/Whitebox_Order_report.md)

Jira task:

- `KCPM-132`

Nhánh thực hiện:

- `whitebox/KCPM-132-order`

File test:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/order/OrderServiceWhiteboxTest.java`

Luồng code được kiểm tra:

```text
OrderController
→ OrderService
→ OrderRepository
→ OrderItemRepository
→ CartRepository
→ ProductRepository
→ UserRepository
→ PaymentRepository
```

## Kỹ thuật kiểm thử

- State Transition Testing
- Path Testing
- Branch Coverage
- Data Flow Testing
- Exception Path Testing

## Kết quả thực thi

```text
Tests run: 30
Failures: 0
Errors: 0
Skipped: 0
BUILD SUCCESS
```

## Kết quả JaCoCo của OrderService

```text
Instruction Coverage: 98%
Branch Coverage: 78%
Line Coverage: 100%
Method Coverage: 100%
Class Coverage: 100%
```

## Cách chạy nhanh

Chạy White-box Order / Checkout:

```powershell
cd backend/vgashop
.\mvnw.cmd clean -Pwhitebox -Dtest=OrderServiceWhiteboxTest test
```

Mở báo cáo JaCoCo:

```powershell
start .\target\site\jacoco\index.html
```



