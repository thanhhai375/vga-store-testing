# Payment Test Reports

Thu muc nay tong hop tai lieu kiem thu cho module Payment cua VGA Store, bao gom black-box API Postman, black-box UI/E2E, BVA/EP va white-box backend.

## Tong quan tai lieu

| Nhom test | File/Thu muc | Noi dung |
| :--- | :--- | :--- |
| Black-box API Postman | [blackbox_payment/postman](../testing/payment_test/blackbox_payment/postman/) | Thu muc chua report API Payment va tai lieu chat luong Postman/Newman |
| Black-box UI/E2E | [blackbox_payment/ui/Payment_blackbox_ui_report.md](../testing/payment_test/blackbox_payment/ui/Payment_blackbox_ui_report.md) | Test UI Payment theo hanh vi nguoi dung |
| White-box Backend | [whitebox_payment/Payment_whitebox_report.md](../testing/payment_test/whitebox_payment/Payment_whitebox_report.md) | Report white-box cho PaymentService |
| White-box Branch Matrix | [whitebox_payment/PAYMENT_BRANCH_MATRIX.csv](../testing/payment_test/whitebox_payment/PAYMENT_BRANCH_MATRIX.csv) | Ma tran branch/decision coverage |

## Black-box API Postman

| API/Module | Report | CSV data | Noi dung |
| :--- | :--- | :--- | :--- |
| Payment | [Payment_blackbox_report.md](../testing/payment_test/blackbox_payment/postman/Payment_blackbox_report.md) | `automation/postman/VGAShop_Payment/TC_Payment_Blackbox_KCPM-92.csv` | Kiem thu API Payment bang Postman/Newman |
| Payment Quality Requirements | [payment_target_quality_requirements.md](../testing/payment_test/blackbox_payment/postman/payment_target_quality_requirements.md) | - | Tai lieu muc tieu chat luong cho module Payment |

Automation source:

- `automation/postman/VGAShop_Payment/VGAShop Payment.postman_collection.json`
- `automation/postman/VGAShop_Payment/TC_Payment_Blackbox_KCPM-92.csv`

Noi dung black-box API Payment:

- Tao thanh toan voi COD, BANK_TRANSFER, VNPAY, MOMO.
- Kiem tra validation: sai paymentMethod, thieu paymentMethod, sai orderId.
- Kiem tra business rule: order khong ton tai, order da huy, order da thanh toan.
- Kiem tra authentication: thieu token, token sai, token hop le.
- Kiem tra pagination: page va size.
- Kiem tra payment status: SUCCESS, FAILED, PENDING.

## BVA/EP Payment

Payment black-box ap dung BVA va EP de chon du lieu test co co so.

| Input | Mien hop le | Mien khong hop le | Gia tri dai dien |
| :--- | :--- | :--- | :--- |
| orderId | Order ton tai | Order khong ton tai, sai kieu | validOrderId, 999999, abc |
| paymentMethod | COD, BANK_TRANSFER, VNPAY, MOMO | INVALID, empty | COD, BANK_TRANSFER, VNPAY, MOMO, INVALID |
| token | Token hop le | Thieu token, token sai | validUserToken, empty, invalidToken |
| page | page >= 0 | page < 0 | -1, 0 |
| size | size >= 1 | size <= 0 | 0, 1, 10 |
| transactionCode | Co ma giao dich | null, empty | TX-001, null, empty |
| paymentStatus | SUCCESS, FAILED, PENDING | Trang thai khong hop le | SUCCESS, FAILED, PENDING |

## Black-box UI/E2E

Report UI:

- [Payment_blackbox_ui_report.md](../testing/payment_test/blackbox_payment/ui/Payment_blackbox_ui_report.md)

Automation source:

- `automation/E2E/modules/3_Cart&Payment/payment_test.js`

Noi dung UI/E2E:

- Kiem tra luong nguoi dung tu gio hang den thanh toan.
- Kiem tra hien thi form thanh toan.
- Kiem tra validate du lieu tren giao dien.
- Kiem tra thanh toan thanh cong va that bai.

## White-box Backend

Report white-box:

- [Payment_whitebox_report.md](../testing/payment_test/whitebox_payment/Payment_whitebox_report.md)
- [PAYMENT_BRANCH_MATRIX.csv](../testing/payment_test/whitebox_payment/PAYMENT_BRANCH_MATRIX.csv)

Test implementation:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/payment/PaymentServiceWhiteboxTest.java`

Noi dung white-box:

| Nhom logic | Noi dung |
| :--- | :--- |
| Create Payment | Kiem tra tao COD, BANK_TRANSFER, VNPAY, MOMO |
| Business Rule | Kiem tra order khong ton tai, order da huy, order da thanh toan |
| Existing Payment | Payment FAILED cho phep tao lai |
| Update Status | Kiem tra SUCCESS, FAILED, PENDING |
| Transaction Code | Kiem tra transactionCode null va empty |
| Query Payment | Kiem tra getPaymentByOrderId va getPaymentById |
| Pagination | Kiem tra getMyPayments va getAllPayments |
| Filter | Kiem tra getPaymentsByStatus |

Tong so white-box testcase PaymentService: **20**.

## Cach chay nhanh

Chay Payment API black-box bang Newman:

```bash
cd automation
npm run test:payment:blackbox
```

Chay Payment UI/E2E:
```bash
cd automation
npx codeceptjs run "E2E/modules/3_Cart&Payment/payment_test.js" --steps
```
Chay white-box Payment backend tren Windows PowerShell:
```bash
cd D:\vga-store-testing-deploy\backend\vgashop
.\mvnw.cmd "-Dtest=PaymentServiceWhiteboxTest" test
```
Ket luan

Module Payment da co tai lieu tong hop cho:

Black-box API Postman.
Black-box UI/E2E.
White-box backend.
Branch matrix.
Cach chay nhanh cac nhom test.