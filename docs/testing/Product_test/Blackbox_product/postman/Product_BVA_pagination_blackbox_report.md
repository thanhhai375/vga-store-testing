# BLACK-BOX TEST REPORT: BVA — Phan trang San pham (Boundary Value Analysis)

**Module:** Product  
**Function/API:** Phan trang san pham — gia tri bien  
**Endpoint:** `GET /api/products/filter`  
**Loai kiem thu:** Black-box API test  
**File data automation:** `automation/postman/VGA-store-product/product-user/PRODUCT_USER_BVA.csv`  
**CSV rows:** TC_PROD_038 den TC_PROD_042

---

## 1. Muc tieu kiem thu

Kiem tra API filter san pham voi cac gia tri bien cua tham so phan trang:

- page = 0 la bien min hop le.
- page am bi tu choi.
- size = 0 va size am bi tu choi.
- page lon vuot du lieu tra ve mang rong, khong crash.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `page` | >= 0 | V1 | < 0 | X1 |
| `size` (limit) | >= 1 | V2 | <= 0 | X2 |
| Ket qua | content hop le hoac rong | V3 | Crash, loi 500 | X3 |

---

## 3. Phan tich gia tri bien

| Bien | Min invalid | Min (bien) | Nominal | Max (bien) | Tag |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `page` | -5 | 0 | 1 | 9999 (vuot du lieu) | B1-B4 |
| `size` | -10 | 1 | 10 | - | B5-B8 |

---

## 4. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected message | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_038 | page=0, size=10 | 200 | success=true (page 0 la hop le) | V1,B1 | High | Pass |
| 2 | TC_PROD_039 | page=-5, size=10 | 400 | So trang phai lon hon hoac bang 1 | X1,B2 | High | Pass |
| 3 | TC_PROD_040 | page=1, size=0 | 400 | So luong hien thi phai lon hon hoac bang 1 | X2,B7 | High | Pass |
| 4 | TC_PROD_041 | page=1, size=-10 | 400 | So luong hien thi phai lon hon hoac bang 1 | X2,B5 | High | Pass |
| 5 | TC_PROD_042 | page=9999, size=10 | 200 | content=[] (trang rong, khong crash) | V1,V3,B4 | Medium | Pass |

---

## 5. Mapping automation

| Cot CSV | Mo ta |
| :--- | :--- |
| `tc_id` | Ma test case |
| `query_page` | Tham so page phan trang |
| `query_limit` | Tham so size/limit |
| `expected_status` | HTTP status mong doi |
| `expected_message` | Chuoi mong doi trong response body |

**Lenh chay:**

```bash
newman run "postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json" \
  -e "postman/env/VGA_Store_Environment.postman_environment.json" \
  -d "postman/VGA-store-product/product-user/PRODUCT_USER_BVA.csv" \
  --folder "Products User"
```

**Ket luan:** BVA phan trang co 5 test case. Tat ca 5 PASS. Backend xu ly dung: page am bi tu choi, size=0/am bi tu choi, page lon tra mang rong ma khong crash.
