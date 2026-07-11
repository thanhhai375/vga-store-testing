# Payment Target Quality Requirements

## 1. Muc tieu chat luong

Tai lieu nay mo ta cac yeu cau chat luong can dat duoc khi kiem thu module Payment.

## 2. Yeu cau chuc nang

| Ma | Yeu cau | Tieu chi dat |
| :--- | :--- | :--- |
| PAY-QR-001 | He thong cho phep tao thanh toan hop le | Tra ve 200 hoac 201 |
| PAY-QR-002 | He thong chan paymentMethod khong hop le | Tra ve 400 |
| PAY-QR-003 | He thong chan request thieu token | Tra ve 401 |
| PAY-QR-004 | He thong chan order khong ton tai | Tra ve 404 |
| PAY-QR-005 | He thong xu ly dung order da huy | Tra ve loi phu hop |
| PAY-QR-006 | He thong xu ly dung order da thanh toan | Khong cho thanh toan lai |
| PAY-QR-007 | He thong ho tro lay danh sach payment | Tra ve danh sach payment cua user |
| PAY-QR-008 | He thong validate page va size | Chan page/size khong hop le |

## 3. Yeu cau bao mat

| Ma | Yeu cau | Tieu chi dat |
| :--- | :--- | :--- |
| PAY-SEC-001 | API Payment can token hop le | Thieu token tra ve 401 |
| PAY-SEC-002 | Token sai khong duoc truy cap | Token sai tra ve 401 |
| PAY-SEC-003 | User chi xem payment cua minh | Khong lo du lieu cua user khac |

## 4. Yeu cau kiem thu

| Nhom | Yeu cau |
| :--- | :--- |
| Black-box API | Co testcase hop le va khong hop le |
| BVA | Co test gia tri bien cho page va size |
| EP | Co phan lop paymentMethod, token, orderId |
| Automation | Co the chay bang Newman |
| CI | Co the duoc tich hop vao pipeline kiem thu tu dong |

## 5. Ket luan

Module Payment can dam bao dung nghiep vu thanh toan, dung status code, khong lo du lieu nguoi dung va co the kiem thu tu dong.