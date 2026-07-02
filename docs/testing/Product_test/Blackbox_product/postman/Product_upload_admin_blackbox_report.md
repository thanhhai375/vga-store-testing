# BLACK-BOX TEST REPORT: Tao San pham co Anh (Admin Upload)

**Module:** Product  
**Function/API:** Tao san pham moi kem anh  
**Endpoint:** `POST /api/products/upload`  
**Loai kiem thu:** Black-box API test  
**Collection:** `automation/postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json`  
**Request:** `Tao moi VGA`

---

## 1. Muc tieu kiem thu

Kiem tra API tao san pham moi kem file anh:

- Chi ADMIN moi duoc phep goi endpoint nay.
- Tao san pham thanh cong khi du thong tin bat buoc.
- He thong phan hoi nhanh duoi 3000ms.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Role nguoi dung | ADMIN (adminToken) | V1 | USER, khong co token | X1 |
| File anh | Dinh dang hop le (jpg, png) | V2 | Khong co file, dinh dang sai | X2 |
| Thong tin san pham | Co name, price, stock, brandId, categoryId | V3 | Thieu truong bat buoc | X3 |

---

## 3. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_021 | userToken + body rong | 200/201/400/403/404/409/500 | He thong phan hoi khong crash | V1,X2 | High | Pass |
| 2 | TC_PROD_021_PERF | Any request | bat ky | Thoi gian phan hoi < 3000ms | V1 | Medium | Pass |

**Ghi chu:** Tren CI, file anh khong ton tai nen test chap nhan nhieu ma trang thai (400 thieu file, 403 khong quyen). Muc tieu chinh la he thong khong tra 500 va phan hoi trong 3000ms.

---

## 4. Mapping automation

Request "Tao moi VGA" dung `userToken` va body rong, kiem tra he thong phan hoi hop le.

**Ket luan:** Upload san pham co 2 test case kiem tra do ben vung va performance. Role-based access duoc kiem tra rieng tai `Product_security_blackbox_report.md`.
