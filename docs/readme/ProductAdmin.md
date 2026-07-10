# Product Admin Test Reports

Thu muc nay tong hop tai lieu kiem thu cho module Product Admin cua VGA Store, bao gom black-box API Postman, black-box UI/E2E Dashboard & User Management va white-box backend.

## Tong quan tai lieu

| Nhom test | File/Thu muc | Noi dung |
| :--- | :--- | :--- |
| Black-box API Postman | [blackbox_product-admin](../testing/product-admin_test/blackbox_product-admin/) | Thu muc chua cac report API Product Admin |
| Black-box UI/E2E | [ui-dashboard/DashboardUser_UI_blackbox_report.md](../testing/product-admin_test/ui-dashboard/DashboardUser_UI_blackbox_report.md) | Testcase UI Dashboard va User Management theo hanh vi nguoi dung |
| White-box Backend | [whitebox_product-admin/product_admin_whitebox_report.md](../testing/product-admin_test/whitebox_product-admin/product_admin_whitebox_report.md) | Report white-box cho Product Admin service/controller |

## Black-box API Postman

| API/Function | Report | So testcase |
| :--- | :--- | ---: |
| Create Product | [ProductAdmin_createProduct_blackbox_report.md](../testing/product-admin_test/blackbox_product-admin/ProductAdmin_createProduct_blackbox_report.md) | 18 |
| List/Search Product | [ProductAdmin_listProduct_blackbox_report.md](../testing/product-admin_test/blackbox_product-admin/ProductAdmin_listProduct_blackbox_report.md) | 10 |
| Product Detail | [ProductAdmin_productDetail_blackbox_report.md](../testing/product-admin_test/blackbox_product-admin/ProductAdmin_productDetail_blackbox_report.md) | 8 |
| Update Stock | [ProductAdmin_updateStock_blackbox_report.md](../testing/product-admin_test/blackbox_product-admin/ProductAdmin_updateStock_blackbox_report.md) | 12 |
| Delete Product | [ProductAdmin_deleteProduct_blackbox_report.md](../testing/product-admin_test/blackbox_product-admin/ProductAdmin_deleteProduct_blackbox_report.md) | 8 |

Tong testcase black-box API Product Admin trong report: **56**.

Automation source:

- `automation/postman/VGA-store-product/product-admin/VGA Store Product Admin Blackbox.postman_collection.json`
- `automation/postman/VGA-store-product/product-admin/VGA-Store-Product-Admin-Testcase.csv`
- `automation/reports/product-admin-blackbox-newman.json`

## Black-box UI/E2E

Report UI:

- [DashboardUser_UI_blackbox_report.md](../testing/product-admin_test/ui-dashboard/DashboardUser_UI_blackbox_report.md)

Pham vi UI:

| UI flow | So testcase |
| :--- | ---: |
| Dashboard | 4 |
| User Management | 10 |
| UX Enhancement checklist | 3 |

Tong testcase UI/E2E trong report: **17**.

Automation source:

- `automation/E2E/modules/6_Dashboard&User_Management/dashboard_test.js`
- `automation/E2E/modules/6_Dashboard&User_Management/users_list_test.js`
- `automation/E2E/modules/6_Dashboard&User_Management/users_add_test.js`

## White-box Backend

Report white-box:

- [product_admin_whitebox_report.md](../testing/product-admin_test/whitebox_product-admin/product_admin_whitebox_report.md)

Pham vi white-box:

| Function | So testcase |
| :--- | ---: |
| ProductService.createProduct | 4 |

Tong testcase white-box Product Admin trong report: **4**.

## Cach chay nhanh

Chay Product Admin API black-box bang Newman:

```bash
cd automation
npm run test:product-admin:blackbox
```

Chay UI/E2E Dashboard & User Management:

```bash
cd automation
npx codeceptjs run "E2E/modules/6_Dashboard&User_Management" --steps
```
