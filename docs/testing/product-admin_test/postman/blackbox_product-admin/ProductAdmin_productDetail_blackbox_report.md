# BLACK-BOX TEST REPORT: Product Admin - Product Detail

**Module:** Product Admin  
**Function/API:** Product Detail  
**Endpoint:** `GET /api/admin/products/{productId}`  
**Loai kiem thu:** Black-box API test

---

## 1. Muc tieu kiem thu

Kiem tra xem chi tiet product theo ID, bao gom product ton tai, khong ton tai, da xoa va sai kieu ID.

---

## 2. Lop tuong duong

| Bien dau vao | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Admin token | Token ADMIN hop le | V1 | Thieu/sai token, token USER | X1 |
| ProductId | ID ton tai | V2 | Khong ton tai, da xoa, sai format, null | X2 |

---

## 3. State transition

| Test ID | Start state | Event | Expected output/end state |
| :--- | :--- | :--- | :--- |
| PA-PD-ST-001 | Created | GET detail | 200, DetailViewed |
| PA-PD-ST-002 | Deleted | GET detail | 404/NotFound |
| PA-PD-ST-003 | NotCreated | GET detail unknown id | 404/NotFound |

---

## 4. Test cases

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| ---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | PA-PD-001 | productId ton tai | 200 | Tra dung id, name, price, stock | V1,V2 | High | Ready |
| 2 | PA-PD-002 | Thieu token | 401/403 | Bi chan quyen | X1 | High | Ready |
| 3 | PA-PD-003 | Token USER | 403 | Khong du quyen | X1 | High | Ready |
| 4 | PA-PD-004 | productId khong ton tai | 404 | Bao khong tim thay | X2 | High | Ready |
| 5 | PA-PD-005 | productId da xoa | 404 | Khong tra product da xoa | X2,State | High | Ready |
| 6 | PA-PD-006 | productId la text | 400 | Bao loi sai kieu | X2 | Medium | Ready |
| 7 | PA-PD-007 | productId = 0 | 400/404 | Khong tim thay/validation | X2 | Medium | Ready |
| 8 | PA-PD-008 | productId am | 400/404 | Khong crash | X2 | Low | Ready |

---

## 5. Mapping automation

Request hien co:

`3. Product Management / TC_ADM_PRD_04 - Chi tiet san pham`
