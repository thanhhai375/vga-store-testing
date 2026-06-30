# BLACK-BOX TEST REPORT: Product Admin - Create Product

**Module:** Product Admin  
**Function/API:** Create Product  
**Endpoint:** `POST /api/admin/products`  
**Loai kiem thu:** Black-box API test  
**File automation:** `automation/postman/VGA-Store-Admin/VGA Store Admin.postman_collection.json`  
**CSV lien quan:** `automation/postman/VGA-Store-Admin/VGA_Admin_BVA_TestCases.csv`

---

## 1. Muc tieu kiem thu

Kiem tra API tao san pham bang tai khoan ADMIN. Test tap trung vao authorization, validate ten san pham, gia, ton kho, brand/category va payload bat thuong.

---

## 2. Lop tuong duong

| Bien dau vao | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Admin token | Token ADMIN hop le | V1 | Thieu token, token sai, token USER | X1 |
| Product name | 3-255 ky tu, khong rong | V2 | Rong, chi khoang trang, qua dai | X2 |
| Price | So duong, >= 1 | V3 | 0, am, text, null | X3 |
| Stock | So nguyen >= 0 | V4 | Am, text, sai kieu | X4 |
| BrandId | Ton tai | V5 | Khong ton tai, null | X5 |
| CategoryId | Ton tai | V6 | Khong ton tai, null | X6 |

---

## 3. Phan tich gia tri bien

| Bien | Min invalid | Min | Nominal | Max | Max invalid | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `name.length` | 0/1/2 | 3 | 20 | 255 | 256 | B1-B5 |
| `price` | 0 | 1 | 1000000 | Theo rule | Vuot max neu co | B6-B10 |
| `stock` | -1 | 0 | 10 | 9999 | Vuot max neu co | B11-B15 |

---

## 4. Decision table

| Rule | Token ADMIN | Name valid | Price valid | Stock valid | Brand/Category valid | Expected |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| R1 | Y | Y | Y | Y | Y | 200/201, tao product |
| R2 | N | Y | Y | Y | Y | 401/403 |
| R3 | Y | N | Y | Y | Y | 400 |
| R4 | Y | Y | N | Y | Y | 400 |
| R5 | Y | Y | Y | N | Y | 400 |
| R6 | Y | Y | Y | Y | N | 400/404 |

---

## 5. Test cases

| STT | Test ID | Input chinh | Expected status | Expected result | Tag | Priority | Status |
| ---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | PA-CP-001 | Payload hop le | 200/201 | Tao product thanh cong, co `productId` | V1-V6,R1 | High | Ready |
| 2 | PA-CP-002 | Thieu admin token | 401/403 | Bi chan quyen | X1,R2 | High | Ready |
| 3 | PA-CP-003 | Token USER | 403 | Khong du quyen admin | X1,R2 | High | Ready |
| 4 | PA-CP-004 | Name rong | 400 | Bao loi name | X2,R3,B1 | High | Ready |
| 5 | PA-CP-005 | Name 3 ky tu | 200/201 | Name tai min hop le | V2,B2 | Medium | Ready |
| 6 | PA-CP-006 | Name 256 ky tu | 400 | Bao loi name qua dai | X2,B5 | Medium | Ready |
| 7 | PA-CP-007 | Price = 0 | 400 | Bao loi price | X3,R4,B6 | High | Ready |
| 8 | PA-CP-008 | Price = 1 | 200/201 | Price tai min hop le | V3,B7 | High | Ready |
| 9 | PA-CP-009 | Price = -1 | 400 | Bao loi price am | X3,R4 | High | Ready |
| 10 | PA-CP-010 | Price la text | 400 | Bao loi sai kieu | X3 | High | Ready |
| 11 | PA-CP-011 | Stock = -1 | 400 | Bao loi stock | X4,R5,B11 | High | Ready |
| 12 | PA-CP-012 | Stock = 0 | 200/201 | Product het hang hop le neu business cho phep | V4,B12 | Medium | Ready |
| 13 | PA-CP-013 | Stock la text | 400 | Bao loi sai kieu | X4 | High | Ready |
| 14 | PA-CP-014 | BrandId khong ton tai | 400/404 | Khong tao product | X5,R6 | High | Ready |
| 15 | PA-CP-015 | CategoryId khong ton tai | 400/404 | Khong tao product | X6,R6 | High | Ready |
| 16 | PA-CP-016 | Thieu anh/form-data optional | 200/400 theo rule | Khong crash, response ro rang | V/X | Medium | Ready |
| 17 | PA-CP-017 | Payload rong | 400 | Bao loi validation tong hop | X2-X6 | High | Ready |
| 18 | PA-CP-018 | Payload co field thua | 200/400 theo rule | Khong crash, khong luu field la | Robustness | Low | Ready |

---

## 6. Mapping automation

Request hien co trong collection:

`3. Product Management / TC_ADM_PRD_01 - Tao san pham bang Form Data`

CSV BVA lien quan:

- `TC_ADM_PRD_BVA_01`: price=1.
- `TC_ADM_PRD_BVA_02`: price=0.
- `TC_ADM_PRD_BVA_03`: price=-1.
- `TC_ADM_PRD_BVA_04`: quantity=1.
- `TC_ADM_PRD_BVA_05`: quantity=0.

Can chuan hoa CSV them `testId`, `function`, `endpoint`, `expectedStatus`, `expectedMessage`, `priority`, `status` de Jira log du thong tin.
