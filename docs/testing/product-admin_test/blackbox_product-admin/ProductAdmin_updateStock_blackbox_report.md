# BLACK-BOX TEST REPORT: Product Admin - Update Stock

**Module:** Product Admin  
**Function/API:** Update Stock  
**Endpoint:** `PUT /api/admin/products/{productId}/stock?stock={stock}`  
**Loai kiem thu:** Black-box API test

---

## 1. Muc tieu kiem thu

Kiem tra admin cap nhat ton kho san pham theo bien `stock`.

---

## 2. Lop tuong duong

| Bien dau vao | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Admin token | Token ADMIN hop le | V1 | Thieu/sai token, token USER | X1 |
| ProductId | ID ton tai | V2 | Khong ton tai, da xoa, sai format | X2 |
| Stock | So nguyen >= 0 | V3 | Am, text, null, so thap phan neu khong cho phep | X3 |

---

## 3. BVA

| Bien | Min invalid | Min | Nominal | Max | Max invalid | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `stock` | -1 | 0 | 10/200 | 9999 | Vuot max neu co | B1-B5 |

---

## 4. Test cases

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| ---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | PA-US-001 | productId ton tai, stock=200 | 200 | Cap nhat stock thanh cong | V1,V2,V3 | High | Ready |
| 2 | PA-US-002 | Thieu token | 401/403 | Bi chan quyen | X1 | High | Ready |
| 3 | PA-US-003 | Token USER | 403 | Khong du quyen | X1 | High | Ready |
| 4 | PA-US-004 | productId khong ton tai | 404 | Bao khong tim thay | X2 | High | Ready |
| 5 | PA-US-005 | productId da xoa | 404 | Khong update product da xoa | X2 | High | Ready |
| 6 | PA-US-006 | stock=-1 | 400 | Bao loi stock am | X3,B1 | High | Ready |
| 7 | PA-US-007 | stock=0 | 200 | Cap nhat het hang | V3,B2 | High | Ready |
| 8 | PA-US-008 | stock=1 | 200 | Cap nhat min duong | V3 | Medium | Ready |
| 9 | PA-US-009 | stock la text | 400 | Bao loi sai kieu | X3 | Medium | Ready |
| 10 | PA-US-010 | stock rong/null | 400 | Bao loi required | X3 | Medium | Ready |
| 11 | PA-US-011 | stock=1.5 | 400 | Chi nhan integer neu rule yeu cau | X3 | Low | Ready |
| 12 | PA-US-012 | update xong GET detail | 200 | Detail hien stock moi | State | High | Ready |

---

## 5. Mapping automation

Request hien co:

`3. Product Management / TC_ADM_PRD_03 - Cap nhat ton kho`
