# BLACK-BOX TEST REPORT: Loc San pham

**Module:** Product  
**Function/API:** Loc san pham theo gia va thuong hieu  
**Endpoint:** `GET /api/products/filter`  
**Loai kiem thu:** Black-box API test  
**Collection:** `automation/postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json`  
**Request:** `Loc san pham`

---

## 1. Muc tieu kiem thu

Kiem tra chuc nang loc san pham theo gia va thuong hieu:

- Loc theo khoang gia tra ve san pham trong khoang do.
- Loc theo brandId tra ve san pham dung hang.
- Ket hop loc gia va hang hoat dong chinh xac.
- Thoi gian phan hoi hop le duoi 3000ms.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `minPrice`, `maxPrice` | >= 0, min <= max | V1 | < 0, min > max, Overflow | X1 |
| `brandId` | ID thuong hieu ton tai trong DB | V2 | ID khong ton tai, null | X2 |
| Ket qua loc gia | Gia nam trong [minPrice, maxPrice] | V3 | Gia ngoai khoang | X3 |
| Thoi gian phan hoi | < 3000ms | V4 | >= 3000ms | X4 |

---

## 3. Thiet ke test case

| STT | Test ID | Input | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_PROD_015 | brandId=1, minPrice=5tr, maxPrice=20tr | 200 | success=true, gia san pham trong [5tr, 20tr] | V1,V2,V3 | High | Pass |
| 2 | TC_PROD_017 | brandId=1, minPrice=5tr, maxPrice=20tr | 200 | Phan hoi nhanh duoi 3000ms | V4 | Medium | Pass |

---

## 4. Mapping automation

Request "Loc san pham" trong collection truyen brandId, minPrice, maxPrice qua query params. Test script kiem tra:
- HTTP 200
- `success = true`
- Gia san pham dau tien nam trong khoang loc
- Thoi gian phan hoi duoi 3000ms

**Ket luan:** Loc san pham co 2 test case happy path. BVA loc gia bien (am, Overflow, min>max) nam o bao cao rieng `Product_BVA_price_blackbox_report.md`. Tat ca PASS.
