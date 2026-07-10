# BLACK-BOX TEST REPORT: Tim kiem San pham

**Module:** Product  
**Function/API:** Tim kiem san pham theo tu khoa  
**Endpoint:** `GET /api/products/search`  
**Loai kiem thu:** Black-box API test  
**Collection:** `automation/postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json`  
**Request:** `Tim kiem san pham`

---

## 1. Muc tieu kiem thu

Kiem tra API tim kiem san pham theo tu khoa:

- Tim kiem dung tu khoa tra ve ket qua khop.
- He thong khong crash khi nhan tu khoa co ky tu dac biet.
- Ket qua tim kiem chua san pham co ten khop tu khoa.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `keyWord` | Khong rong, khop ten san pham trong DB | V1 | Rong, khong khop, ky tu dac biet | X1 |
| Ket qua tim kiem | Co it nhat 1 san pham khop | V2 | Khong co ket qua | X2 |
| He thong | Khong tra HTTP 500 | V3 | Crash 500 | X3 |

---

## 3. Phan tich gia tri bien

| Bien | Min invalid | Min/Nominal | Max/Edge | Tag |
| :--- | :---: | :---: | :---: | :--- |
| `keyWord.length` | Rong ("") | 1 ky tu | Chuoi dai | B1-B3 |
| `keyWord.content` | Ky tu dac biet | Ten chinh xac | Ten viet thuong | B4-B6 |

---

## 4. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_013 | keyWord=ASUS Dual, page=0, size=10 | 200 | Ket qua chua san pham co ten "asus" | V1,V2 | High | Pass |
| 2 | TC_PROD_014 | keyWord co ky tu dac biet | 200 | Khong crash (not 500), ket qua hop le | V3,X1,B4 | Low | Pass |

---

## 4. Mapping automation

Request "Tim kiem san pham" trong collection su dung Bearer Token (adminToken) va truyen keyWord qua query param.

**Ket luan:** Tim kiem co 2 test case. TC_PROD_013 kiem tra ket qua chinh xac, TC_PROD_014 kiem tra do ben vung. Tat ca PASS.
