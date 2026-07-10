# Admin Test Reports

Thư mục này tổng hợp tài liệu kiểm thử cho module Admin của VGA Store, bao gồm báo cáo black-box API Postman/Newman, danh sách testcase và mã nguồn automation liên quan.

## Tổng quan tài liệu

| Nhóm test | File/Thư mục | Nội dung |
| :--- | :--- | :--- |
| Black-box API Admin | [Admin_blackbox_report.md](../testing/blackbox_admin/Admin_blackbox_report.md) | Báo cáo kiểm thử black-box cho module Admin |
| Testcase Admin | [VGA_Store_Admin_TestCases.csv](../testing/blackbox_admin/VGA_Store_Admin_TestCases.csv) | Danh sách 25 testcase, endpoint, dữ liệu và kết quả mong đợi |
| Postman Collection | `automation/postman/VGA-Store-Admin/VGA Store Admin Blackbox.postman_collection.json` | Collection chạy tự động bằng Postman/Newman |
| Postman Environment | `automation/postman/env/VGA_Store_Environment.postman_environment.json` | Biến môi trường dùng khi chạy Newman |
| Newman JSON Report | `automation/reports/admin-blackbox-newman.json` | Kết quả chạy tự động được xuất dưới dạng JSON |

## Black-box API Postman

| Module | Report | CSV testcase | Số testcase |
| :--- | :--- | :--- | ---: |
| Admin | [Admin_blackbox_report.md](../testing/blackbox_admin/Admin_blackbox_report.md) | [VGA_Store_Admin_TestCases.csv](../testing/blackbox_admin/VGA_Store_Admin_TestCases.csv) | 25 |

Các nhóm chức năng được kiểm thử:

- Auth Admin
- Brand Management
- Category Management
- Product Management
- User Management
- Order Management
- Dashboard
- Cleanup dữ liệu test

Tổng số testcase Black-box Admin: **25**.

## Tài liệu chi tiết

Báo cáo:

- [Admin_blackbox_report.md](../testing/blackbox_admin/Admin_blackbox_report.md)

Dữ liệu testcase:

- [VGA_Store_Admin_TestCases.csv](../testing/blackbox_admin/VGA_Store_Admin_TestCases.csv)

## Automation source

Postman collection:

- `automation/postman/VGA-Store-Admin/VGA Store Admin Blackbox.postman_collection.json`

Environment:

- `automation/postman/env/VGA_Store_Environment.postman_environment.json`

Newman report:

- `automation/reports/admin-blackbox-newman.json`

Script trong `automation/package.json`:

```json
"test:admin:blackbox": "newman run \"postman/VGA-Store-Admin/VGA Store Admin Blackbox.postman_collection.json\" -e \"postman/env/VGA_Store_Environment.postman_environment.json\" --reporters cli,json --reporter-json-export \"reports/admin-blackbox-newman.json\""
```

## Nhánh và Jira

- Jira task: `KCPM-93`
- Nhánh thực hiện: `feature/KCPM-93-admin-api`

Commit tham khảo:

```text
KCPM-93 update blackbox-admin
```

## Cách chạy nhanh

Khởi động hệ thống:

```bash
docker compose up -d
```

Chạy Admin API black-box bằng Newman:

```bash
cd automation
npm run test:admin:blackbox
```

Hoặc chạy trực tiếp:

```bash
cd automation
npx newman run "postman/VGA-Store-Admin/VGA Store Admin Blackbox.postman_collection.json" -e "postman/env/VGA_Store_Environment.postman_environment.json" --reporters cli,json --reporter-json-export "reports/admin-blackbox-newman.json"
```


