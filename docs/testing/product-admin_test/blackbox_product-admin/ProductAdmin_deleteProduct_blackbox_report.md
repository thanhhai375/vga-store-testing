# BLACK-BOX TEST REPORT: Product Admin - Delete Product

**Module:** Product Admin  
**Function/API:** Delete Product  
**Endpoint:** `DELETE /api/admin/products/{productId}`  
**Loai kiem thu:** Black-box API test

---

## 1. Muc tieu kiem thu

Kiem tra admin xoa san pham va trang thai sau khi xoa.

---

## 2. Lop tuong duong

| Bien dau vao | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Admin token | Token ADMIN hop le | V1 | Thieu/sai token, token USER | X1 |
| ProductId | Product ton tai, co the xoa | V2 | Khong ton tai, da xoa, dang bi rang buoc order/cart, sai format | X2 |

---

## 3. State transition

| Test ID | Start state | Event | Expected output/end state |
| :--- | :--- | :--- | :--- |
| PA-DP-ST-001 | Created | DELETE product | Deleted |
| PA-DP-ST-002 | Deleted | GET detail | 404/NotFound |
| PA-DP-ST-003 | Deleted | DELETE again | 404/NotFound hoac idempotent theo rule |

---

## 4. Test cases

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| ---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | PA-DP-001 | productId ton tai | 200 | Xoa product thanh cong | V1,V2,State | High | Ready |
| 2 | PA-DP-002 | Thieu token | 401/403 | Bi chan quyen | X1 | High | Ready |
| 3 | PA-DP-003 | Token USER | 403 | Khong du quyen | X1 | High | Ready |
| 4 | PA-DP-004 | productId khong ton tai | 404 | Bao khong tim thay | X2 | High | Ready |
| 5 | PA-DP-005 | productId da xoa | 404 | Khong xoa thanh cong lan 2 | X2,State | Medium | Ready |
| 6 | PA-DP-006 | productId la text | 400 | Bao loi sai kieu | X2 | Medium | Ready |
| 7 | PA-DP-007 | product dang nam trong order/cart | 400/409 | Bao loi rang buoc, khong crash | X2 | High | Ready |
| 8 | PA-DP-008 | Sau delete, GET detail | 404 | Product khong con truy cap | State | High | Ready |

---

## 5. Mapping automation

Request hien co:

`6. Dashboard & Cleanup / TC_ADM_CLN_01 - Xoa San pham`
