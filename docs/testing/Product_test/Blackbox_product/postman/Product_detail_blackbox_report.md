# BLACK-BOX TEST REPORT: Chi tiet San pham

**Module:** Product  
**Function/API:** Xem chi tiet san pham  
**Endpoint:** `GET /api/products/{id}`  
**Loai kiem thu:** Black-box API test  
**Collection:** `automation/postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json`  
**Request:** `Chi tiet san pham`

---

## 1. Muc tieu kiem thu

Kiem tra API xem chi tiet san pham:

- Tra ve day du thong tin san pham khi ID hop le.
- Tra ve loi ro rang khi ID khong ton tai.
- Thoi gian phan hoi hop le duoi 3000ms.
- San pham tra ve co du truong: id, name, price.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `product_id` | So nguyen duong, ton tai trong DB, chua bi xoa | V1 | Am, bang 0, khong ton tai, da xoa | X1 |
| Cau truc response | Co id, name, price kieu so | V2 | Thieu truong bat buoc | X2 |
| Thoi gian | < 3000ms | V3 | >= 3000ms | X3 |

---

## 3. Phan tich gia tri bien

| Bien | Min invalid | Min/Nominal | Max invalid | Tag |
| :--- | :---: | :---: | :---: | :--- |
| `product_id` | <= 0 | ID nho nhat trong DB | ID khong ton tai (99999) | B1-B3 |

---

## 4. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_018 | GET /api/products/9 | 200 | success=true, co id/name/price | V1,V2 | High | Pass |
| 2 | TC_PROD_020 | GET /api/products/9 | 200 | Object san pham day du thong tin | V1,V2 | High | Pass |
| 3 | TC_PROD_021 | GET /api/products/9 | 200 | Co truong specifications/thong so ky thuat | V1 | Medium | Pass |
| 4 | TC_PROD_022 | GET /api/products/9 | 200 | Co truong hinh anh san pham | V1 | Medium | Pass |
| 5 | TC_PROD_023 | GET /api/products/9 | 200 | Co truong price dung | V1,V2 | Medium | Pass |
| 6 | TC_PROD_024 | GET /api/products/99999 | 404 | Tra loi loi, khong crash | X1,B3 | Medium | Pass |
| 7 | TC_PROD_020_PERF | GET /api/products/9 | 200 | Thoi gian phan hoi < 3000ms | V3 | Medium | Pass |

---

## 4. Mapping automation

Request "Chi tiet san pham" trong collection dung ID co dinh (9) de test. TC_PROD_024 can dung ID khong ton tai (99999).

**Ket luan:** Chi tiet san pham co 7 test case, bao phu positive (ID hop le), negative (ID khong ton tai), kiem tra truong du lieu va performance. Tat ca PASS.
