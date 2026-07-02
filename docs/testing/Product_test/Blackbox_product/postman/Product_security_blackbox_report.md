# BLACK-BOX TEST REPORT: Bao mat — Kiem soat Quyen Tao San pham

**Module:** Product  
**Function/API:** Bao mat endpoint tao san pham (Role-based access control)  
**Endpoint:** `POST /api/products/upload`  
**Loai kiem thu:** Black-box API test  
**Collection:** `automation/postman/VGA-store-product/product-user/VGA Store Product User.postman_collection.json`  
**Request:** `Bao mat - User thuong tao duoc san pham (thieu @PreAuthorize)`

---

## 1. Muc tieu kiem thu

Kiem tra co che kiem soat truy cap role-based:

- User thuong (role=USER) phai bi tu choi 403 khi goi endpoint tao san pham.
- Endpoint nay PHAI yeu cau role ADMIN.
- Neu backend thieu `@PreAuthorize` thi day la lo hong bao mat nghiem trong.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Role nguoi dung | ADMIN | V1 | USER (role khong du quyen) | X1 |
| Token | adminToken hop le | V2 | userToken (role=USER) | X2 |

---

## 3. Thiet ke test case

| STT | Test ID | Token | Role | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | TC_SEC_001 | userToken | USER | 403 | He thong tu choi, khong cho tao san pham | X1,X2 | High | Pass |

---

## 4. Bug da duoc phat hien

| Bug ID | Mo ta | Nguyen nhan | Trang thai |
| :--- | :--- | :--- | :--- |
| BUG-001 | User thuong (role=USER) co the tao san pham qua `/api/products/upload` | `ProductController.java` thieu `@PreAuthorize("hasRole('ADMIN')")` tren endpoint upload | Da duoc sua — hien tai PASS |

---

## 5. Mapping automation

Request "Bao mat - User thuong tao duoc san pham" dung `userToken` (role=USER) va assert phan hoi phai la 403:

```javascript
pm.test('API khong chan quyen nguoi dung thuong - Phai tra ve 403', function () {
    pm.expect(pm.response.code).to.equal(403, 'LOI BAO MAT: User co the tao san pham!');
});
```

**Ket luan:** Bao mat endpoint tao san pham co 1 test case. Bug bao mat da duoc phat hien truoc do (thieu `@PreAuthorize`) va da duoc fix. Test hien tai PASS.
