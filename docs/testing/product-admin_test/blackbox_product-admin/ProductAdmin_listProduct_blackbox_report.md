# BLACK-BOX TEST REPORT: Product Admin - List/Search Product

**Module:** Product Admin  
**Function/API:** List/Search Product  
**Endpoint:** `GET /api/admin/products`  
**Loai kiem thu:** Black-box API test

---

## 1. Muc tieu kiem thu

Kiem tra admin lay danh sach san pham, phan trang, kich thuoc trang, sort/filter neu API ho tro.

---

## 2. Lop tuong duong va bien

| Bien dau vao | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Admin token | Token ADMIN hop le | V1 | Thieu/sai token, token USER | X1 |
| `page` | So nguyen >= 0 | V2 | -1, text, null sai rule | X2 |
| `size` | 1-100 | V3 | 0, am, >100, text | X3 |
| `sort` | Field duoc ho tro | V4 | Field khong ton tai | X4 |
| Keyword/filter | Chuoi hop le | V5 | Ky tu dac biet qua dai, filter khong ton tai | X5 |

---

## 3. BVA

| Bien | Min invalid | Min | Nominal | Max | Max invalid | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `page` | -1 | 0 | 1 | n | Qua lon | B1-B5 |
| `size` | 0 | 1 | 10/20 | 100 | 101 | B6-B10 |

---

## 4. Test cases

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| ---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | PA-LP-001 | Token ADMIN, khong query | 200 | Tra danh sach product | V1 | High | Ready |
| 2 | PA-LP-002 | Thieu token | 401/403 | Bi chan quyen | X1 | High | Ready |
| 3 | PA-LP-003 | Token USER | 403 | Khong du quyen | X1 | High | Ready |
| 4 | PA-LP-004 | page=0,size=1 | 200 | Tra 1 item/page metadata | V2,V3,B2,B7 | Medium | Ready |
| 5 | PA-LP-005 | page=-1 | 400 | Bao loi page | X2,B1 | Medium | Ready |
| 6 | PA-LP-006 | size=0 | 400 | Bao loi size | X3,B6 | Medium | Ready |
| 7 | PA-LP-007 | size=100 | 200 | Chap nhan max size | V3,B9 | Low | Ready |
| 8 | PA-LP-008 | size=101 | 400 | Bao loi size qua lon | X3,B10 | Low | Ready |
| 9 | PA-LP-009 | sort field hop le | 200 | Danh sach sap xep dung | V4 | Medium | Ready |
| 10 | PA-LP-010 | sort field khong ton tai | 400 | Bao loi sort/filter | X4 | Low | Ready |

---

## 5. Mapping automation

Request hien co:

`3. Product Management / TC_ADM_PRD_02 - Lay danh sach san pham`

Can mo rong CSV neu muon test page/size/sort data-driven.
