## 1. Muc tieu

Tai lieu nay bao cao kiem thu white-box cho PaymentService.

White-box testing tap trung vao logic ben trong service, cac nhanh dieu kien va cac truong hop nghiep vu quan trong.

## 2. File test lien quan

| Loai | Duong dan |
| :--- | :--- |
| White-box Test | `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/payment/PaymentServiceWhiteboxTest.java` |

## 3. Cong cu va ky thuat

| Cong cu/Ky thuat | Vai tro |
| :--- | :--- |
| JUnit | Viet va chay unit test |
| Mockito | Mock repository/service |
| ReflectionTestUtils | Gan gia tri cau hinh gia cho VNPay/MoMo |
| Branch Testing | Kiem tra cac nhanh logic trong PaymentService |

## 4. Mock duoc su dung

| Mock | Vai tro |
| :--- | :--- |
| PaymentRepository | Gia lap truy van va luu payment |
| OrderRepository | Gia lap truy van order |
| UserService | Gia lap lay thong tin user hien tai |

## 5. Pham vi test

| Nhom logic | Noi dung |
| :--- | :--- |
| Create Payment | Tao COD, BANK_TRANSFER, VNPAY, MOMO |
| Business Rule | Order khong ton tai, order da huy, order da thanh toan |
| Existing Payment | Payment FAILED cho phep tao lai |
| Update Status | SUCCESS, FAILED, PENDING |
| Transaction Code | transactionCode null va empty |
| Query Payment | getPaymentByOrderId, getPaymentById |
| Pagination | getMyPayments, getAllPayments |
| Filter | getPaymentsByStatus |

## 6. So luong testcase

Tong so testcase white-box PaymentService: **20**.

| Nhom | So testcase |
| :--- | ---: |
| Create Payment va business rule | 8 |
| Update payment status | 5 |
| Query payment | 4 |
| Pagination va filter | 3 |
| Tong | 20 |

## 7. Cach chay

Tren Windows PowerShell:

    cd D:\vga-store-testing-deploy\backend\vgashop
    .\mvnw.cmd "-Dtest=PaymentServiceWhiteboxTest" test

Ket qua mong doi:

    Tests run: 20
    Failures: 0
    Errors: 0
    Skipped: 0
    BUILD SUCCESS

## 8. Ket luan

White-box PaymentService giup kiem tra cac nhanh logic quan trong cua module Payment ma black-box API khong nhin thay truc tiep.
