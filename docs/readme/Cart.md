# Cart Test Reports

Thư mục này tổng hợp tài liệu kiểm thử cho module Cart của VGA Store, bao gồm black-box API Postman, black-box UI/E2E và white-box backend.

## Tổng quan tài liệu

| Nhóm test | File/Thư mục | Nội dung |
|------------|--------------|----------|
| Black-box API Postman | [blackbox_cart/postman](../testing/cart_test/blackbox_cart/postman/) | Thư mục chứa report API Cart và dữ liệu Postman/Newman |
| Black-box UI/E2E | [blackbox_shopping/ui](../testing/cart_test/blackbox_shopping/ui/) | Báo cáo Shopping Experience & Cart UI |
| White-box Backend | [whitebox_cart](../testing/cart_test/whitebox_cart/) | Report White-box và Branch Coverage |

---

## Black-box API Postman

API | Report | Test data
---|---|---
Cart API | [Cart_blackbox_report.md](../testing/cart_test/blackbox_cart/postman/Cart_blackbox_report.md) | [VGA_Store_Cart_TestCases.csv](../../automation/postman/VGA-Store-Cart/VGA_Store_Cart_TestCases.csv)

Tài liệu chuẩn chất lượng:

- [cart_target_quality_requirements.md](../testing/cart_test/blackbox_cart/postman/cart_target_quality_requirements.md)

Automation source:

- [VGA Store Cart.postman_collection.json](../../automation/postman/VGA-Store-Cart/VGA%20Store%20Cart.postman_collection.json)
- [VGA_Store_Cart_TestCases.csv](../../automation/postman/VGA-Store-Cart/VGA_Store_Cart_TestCases.csv)

---

## Black-box UI/E2E

Report:

- [Shopping_blackbox_ui_report.md](../testing/cart_test/blackbox_shopping/ui/Shopping_blackbox_ui_report.md)

Automation source:

- [Shopping_Experience_test.js](../../automation/E2E/modules/2_Shopping_Experience/Shopping_Experience_test.js)

---

## White-box Backend

Report:

- [Cart_whitebox_report.md](../testing/cart_test/whitebox_cart/Cart_whitebox_report.md)

Branch Matrix:

- [CART_BRANCH_MATRIX.csv](../testing/cart_test/whitebox_cart/CART_BRANCH_MATRIX.csv)

Test implementation:

- [CartServiceWhiteboxTest.java](../../backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/cart/CartServiceWhiteboxTest.java)

---

## Cách chạy nhanh

### Chạy Cart API Black-box

```bash
cd automation
npm run test:cart:blackbox
```

### Chạy Shopping & Cart UI

```bash
cd automation
npx codeceptjs run "E2E/modules/2_Shopping_Experience/Shopping_Experience_test.js" --steps
```

### Chạy White-box Cart

```bash
cd backend/vgashop
./mvnw test -Dtest=CartServiceWhiteboxTest
```