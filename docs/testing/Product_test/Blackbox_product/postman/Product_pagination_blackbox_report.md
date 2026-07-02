# BLACK-BOX TEST REPORT: Phan trang San pham

**Module:** Product  
**Function/API:** Phan trang san pham (happy path)  
**Endpoint:** `GET /api/products`  
**Loai kiem thu:** Black-box API test  
**Collection:** `automation/postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json`

---

## 1. Muc tieu kiem thu

Kiem tra chuc nang phan trang cua danh sach san pham:

- Trang dau tra dung so luong san pham.
- Chuyen sang trang tiep theo tra du lieu khac.
- Tham so page va size hoat dong dung.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `page` | >= 0 | V1 | < 0 | X1 |
| `size` | >= 1 | V2 | <= 0 | X2 |
| Ket qua phan trang | Co currentPage, totalPages, content | V3 | Thieu truong | X3 |

---

## 3. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_006 | page=1, size=10 | 200 | currentPage dung, so san pham <= size | V1,V2,V3 | High | Pass |
| 2 | TC_PROD_007 | page=2, size=10 | 200 | Du lieu trang 2 khac trang 1 | V1,V2,V3 | High | Pass |

---

## 4. Mapping automation

Cac tham so page va size duoc truyen qua URL query string. Request "Danh sach san pham" ho tro page/size params.

**Ket luan:** Phan trang co 2 test case happy path. Tat ca PASS. BVA phan trang bien (page am, size=0) nam o bao cao rieng `Product_BVA_pagination_blackbox_report.md`.
