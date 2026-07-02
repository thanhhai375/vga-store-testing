# BLACK-BOX TEST REPORT: Hien thi Danh sach San pham

**Module:** Product  
**Function/API:** Hien thi danh sach san pham  
**Endpoint:** `GET /api/products`  
**Loai kiem thu:** Black-box API test  
**Collection:** `automation/postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json`  
**Request:** `Danh sach san pham`

---

## 1. Muc tieu kiem thu

Kiem tra API hien thi danh sach san pham theo hanh vi dau vao/dau ra:

- Danh sach san pham hien thi day du cac truong can thiet.
- Cau truc response chua mang content va cac thong tin phan trang.
- Moi phan tu trong mang co du truong: name, price, imgUrl, brand.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Trang thai he thong | Co du lieu san pham trong DB | V1 | DB rong | X1 |
| Cau truc response | Co truong success, data, content | V2 | Thieu truong bat buoc | X2 |
| Du lieu san pham | Co name, price, imgUrl, brand | V3 | Thieu truong | X3 |

---

## 3. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_001 | GET /api/products (khong bo loc) | 200 | success=true, co mang content | V1,V2 | High | Pass |
| 2 | TC_PROD_002 | GET /api/products | 200 | Co truong tong so san pham | V1,V3 | Medium | Pass |
| 3 | TC_PROD_003 | GET /api/products | 200 | Co truong imgUrl | V1,V3 | Medium | Pass |
| 4 | TC_PROD_004 | GET /api/products | 200 | Co truong price kieu so | V1,V3 | Medium | Pass |
| 5 | TC_PROD_005 | GET /api/products | 200 | Co truong brand.name | V1,V3 | Low | Pass |

---

## 4. Mapping automation

Request "Danh sach san pham" trong collection kiem tra dong thoi TC_PROD_001 den TC_PROD_005 trong 1 request.

**Ket luan:** Hien thi danh sach san pham co 5 test case black-box, bao phu cau truc response va tinh day du cua du lieu. Tat ca PASS.
