# BLACK-BOX PRODUCT ADMIN REPORTS

Thu muc nay chua report black-box cho module Product Admin trong pham vi API quan tri san pham.

| Function/API | Report | Ky thuat chinh | So test case de xuat |
| :--- | :--- | :--- | :---: |
| Create Product | `ProductAdmin_createProduct_blackbox_report.md` | EP, BVA, Decision Table | 18 |
| List/Search Product | `ProductAdmin_listProduct_blackbox_report.md` | EP, BVA | 10 |
| Product Detail | `ProductAdmin_productDetail_blackbox_report.md` | EP, State Transition | 8 |
| Update Stock | `ProductAdmin_updateStock_blackbox_report.md` | EP, BVA | 12 |
| Delete Product | `ProductAdmin_deleteProduct_blackbox_report.md` | EP, State Transition | 8 |

Loai test: black-box API integration test, chay bang Postman/Newman.

File automation hien co:

- Collection: `automation/postman/VGA-Store-Admin/VGA Store Admin.postman_collection.json`
- CSV tong hop: `automation/postman/VGA-Store-Admin/VGA_Store_Admin_TestCases.csv`
- CSV BVA: `automation/postman/VGA-Store-Admin/VGA_Admin_BVA_TestCases.csv`

Pham vi bao phu:

- Product Admin duoc test qua cac endpoint admin product.
- Brand/Category/Admin login la tien dieu kien de tao product hop le.
- Report nay thiet ke theo muc tieu chat luong mong muon, khong chi ghi lai behavior hien tai.
