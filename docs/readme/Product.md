# Product Test Reports

Thu muc nay tong hop tai lieu kiem thu cho module Product / Category / Brand cua VGA Store, bao gom black-box API Postman, black-box UI/E2E va white-box backend.

## Tong quan tai lieu

| Nhom test | File/Thu muc | Noi dung |
| :--- | :--- | :--- |
| Black-box API Postman | [Blackbox_product/postman](../testing/Product_test/Blackbox_product/postman/) | Thu muc chua cac report API Product va data Postman/Newman |
| Black-box UI/E2E | [Blackbox_product/UI](../testing/Product_test/Blackbox_product/UI/) | Testcase UI Product/Category theo hanh vi nguoi dung |
| White-box Backend | [Whitebox_product/Product_whitebox_report.md](../testing/Product_test/Whitebox_product/Product_whitebox_report.md) | Report white-box cho controller/service Product, Category, Brand |
| White-box Branch Matrix | [Whitebox_product/PRODUCT_BRANCH_MATRIX.csv](../testing/Product_test/Whitebox_product/PRODUCT_BRANCH_MATRIX.csv) | Ma tran branch/decision coverage |

---

## Black-box API Postman

| API/Function | Report | So testcase | Trang thai |
| :--- | :--- | ---: | :--- |
| Hien thi danh sach san pham | [Product_list_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_list_blackbox_report.md) | 5 | Pass |
| Phan trang san pham | [Product_pagination_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_pagination_blackbox_report.md) | 2 | Pass |
| Tim kiem san pham | [Product_search_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_search_blackbox_report.md) | 2 | Pass |
| Loc san pham theo gia va hang | [Product_filter_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_filter_blackbox_report.md) | 2 | Pass |
| Chi tiet san pham | [Product_detail_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_detail_blackbox_report.md) | 7 | Pass |
| Tao san pham (Admin Upload) | [Product_upload_admin_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_upload_admin_blackbox_report.md) | 2 | Pass |
| Bao mat — Role-based access | [Product_security_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_security_blackbox_report.md) | 1 | Pass |
| BVA — Loc gia bien | [Product_BVA_price_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_BVA_price_blackbox_report.md) | 7 | 4 Pass / **3 FAIL (BUG)** |
| BVA — Phan trang bien | [Product_BVA_pagination_blackbox_report.md](../testing/Product_test/Blackbox_product/postman/Product_BVA_pagination_blackbox_report.md) | 5 | Pass |

Tong testcase Postman Product: **33**.

**Bug phat hien:**

- **BUG-PROD-003**: `minPrice` am khong bi validate — backend tra 200 thay vi 400.
- **BUG-PROD-004**: `maxPrice` am khong bi validate — backend tra 200 thay vi 400.
- **BUG-PROD-005**: `minPrice > maxPrice` khong bi validate — backend tra ket qua sai.

---

## Black-box UI/E2E

| Function | Report | So testcase |
| :--- | :--- | ---: |
| Product User (Hien thi, Tim kiem, Loc, Chi tiet) | [ui_product_report.md](../testing/Product_test/Blackbox_product/UI/ui_product_report.md) | 24 |
| Category & Product Management Admin | [ui_category_management_report.md](../testing/Product_test/Blackbox_product/UI/ui_category_management_report.md) | 18 |

Tong testcase UI/E2E: **42**.

Automation source:

- `automation/E2E/modules/4_Product&Category_Management/product_test.js`
- `automation/E2E/modules/4_Product&Category_Management/Category_Management_test.js`

---

## White-box Backend

Report white-box:

- [Product_whitebox_report.md](../testing/Product_test/Whitebox_product/Product_whitebox_report.md)
- [PRODUCT_BRANCH_MATRIX.csv](../testing/Product_test/Whitebox_product/PRODUCT_BRANCH_MATRIX.csv)

Test implementation:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/product/ProductServiceWhiteboxTest.java`

Tong testcase white-box: **41** (27 Pass, 14 ghi nhan bug BUG-PROD-001/002).

**Bug phat hien trong white-box:**

- **BUG-PROD-001**: `POST /api/products` tra HTTP 500 do `ProductDTO.categoryID` co annotation `@NotBlank` tren kieu `Long`.
- **BUG-PROD-002**: `PUT /api/products/{id}` tra HTTP 500 cung nguyen nhan tren.

---

## Cach chay nhanh

Chay Product API black-box bang Newman:

```bash
cd automation
npm run test:product:blackbox
```

Chay Product UI/E2E:

```bash
cd automation
npx codeceptjs run "E2E/modules/4_Product&Category_Management/product_test.js" --steps
npx codeceptjs run "E2E/modules/4_Product&Category_Management/Category_Management_test.js" --steps
```

Chay white-box Product backend:

```bash
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=ProductServiceWhiteboxTest -DforkCount=0 -Djacoco.skip=true test
```
