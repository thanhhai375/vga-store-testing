# BLACK-BOX TEST REPORT: BVA — Loc Gia San pham (Boundary Value Analysis)

**Module:** Product  
**Function/API:** Loc san pham theo khoang gia — gia tri bien  
**Endpoint:** `GET /api/products/filter`  
**Loai kiem thu:** Black-box API test  
**File data automation:** `automation/postman/VGA-store-product/product-user/PRODUCT_USER_BVA.csv`  
**CSV rows:** TC_PROD_031 den TC_PROD_037

---

## 1. Muc tieu kiem thu

Kiem tra API loc san pham voi cac gia tri bien cua tham so gia:

- Bien min hop le: minPrice = 0.
- Gia am bi tu choi voi thong bao loi ro rang.
- Overflow bi tu choi.
- Logic sai (min > max) bi tu choi.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `minPrice` | >= 0, <= 10^10 | V1 | < 0, > 10^10 (Overflow) | X1 |
| `maxPrice` | >= 0, <= 10^10, >= minPrice | V2 | < 0, > 10^10 (Overflow) | X2 |
| Logic khoang gia | minPrice <= maxPrice | V3 | minPrice > maxPrice | X3 |

---

## 3. Phan tich gia tri bien

| Bien | Min invalid | Min (bien) | Nominal | Max (bien) | Max invalid | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `minPrice` | -1.500.000 | 0 | 5.000.000 | 10.000.000.000 | 9.999.999.999.999.999 | B1-B5 |
| `maxPrice` | -5.000.000 | 0 | 20.000.000 | 10.000.000.000 | 9.999.999.999.999.999 | B6-B10 |

---

## 4. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected message | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_031 | minPrice=0, maxPrice=20.000.000 | 200 | content (co ket qua) | V1,V2,B1,B6 | High | Pass |
| 2 | TC_PROD_032 | minPrice=-1.500.000 | 400 | Gia khong duoc nho hon 0 | X1,B2 | High | **FAIL (BUG)** |
| 3 | TC_PROD_033 | maxPrice=-5.000.000 | 400 | Gia khong duoc nho hon 0 | X2,B7 | High | **FAIL (BUG)** |
| 4 | TC_PROD_034 | minPrice=20.000.000, maxPrice=5.000.000 | 400 | Khoang gia minPrice khong duoc lon hon maxPrice | X3 | High | **FAIL (BUG)** |
| 5 | TC_PROD_035 | minPrice=0, maxPrice=0 | 200 | content (rong hoac gia 0d) | V1,V2,B1,B6 | Medium | Pass |
| 6 | TC_PROD_036 | minPrice=9999999999999999 | 400 | Gia tri vuot qua gioi han cho phep | X1,B5 | High | Pass |
| 7 | TC_PROD_037 | maxPrice=9999999999999999 | 400 | Gia tri vuot qua gioi han cho phep | X2,B10 | High | Pass |

---

## 5. Bug phat hien

| Bug ID | Input | Expected | Actual | Mo ta | Priority |
| :--- | :--- | :---: | :---: | :--- | :---: |
| BUG-PROD-003 | minPrice=-1.500.000 | 400 | 200 | Backend khong validate minPrice am, tra tat ca san pham | High |
| BUG-PROD-004 | maxPrice=-5.000.000 | 400 | 200 | Backend khong validate maxPrice am, tra tat ca san pham | High |
| BUG-PROD-005 | minPrice=20tr > maxPrice=5tr | 400 | 200 | Backend khong validate logic min>max, tra ket qua sai | High |

**Fix khuyen nghi:** Bo sung validation trong `ProductController.filter()` hoac `ProductService.filterProducts()` cho cac truong hop gia am va min > max.

---

## 6. Mapping automation

| Cot CSV | Mo ta |
| :--- | :--- |
| `tc_id` | Ma test case |
| `query_minPrice` | Tham so minPrice |
| `query_maxPrice` | Tham so maxPrice |
| `expected_status` | HTTP status mong doi |
| `expected_message` | Chuoi mong doi trong response body |

**Ket luan:** BVA loc gia co 7 test case. 4 test PASS (bien 0, maxPrice=0, Overflow). 3 test FAIL do bug backend chua validate gia am va logic min>max.
