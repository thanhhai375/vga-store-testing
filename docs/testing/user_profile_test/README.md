# User Profile Test Reports

Thu muc nay gom cac tai lieu test cho module User Profile theo cau truc tuong tu module Auth trong `docs/testing/auth_test`.

## 1. API/Postman black-box

Nam trong:

```text
docs/testing/user_profile_test/blackbox_user/postman/
```

Bao gom:

| File | Noi dung |
| --- | --- |
| `user_blackbox_assignment_report.md` | Bao cao tong hop black-box API cho User Profile |
| `User_profile_blackbox_report.md` | Report API View Profile |
| `User_address_blackbox_report.md` | Report API Add Address |
| `User_changePassword_blackbox_report.md` | Report API Change Password |
| `user_target_quality_requirements.md` | Chuan target quality cho User Profile |

Automation:

```text
automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA Store User Blackbox.postman_collection.json
automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv
```

Lenh chay:

```bash
cd automation
npm run test:user:blackbox
```

## 2. FE UI black-box

Nam trong:

```text
docs/testing/user_profile_test/blackbox_user/ui/
```

Automation:

```text
automation/E2E/modules/7_User_Profile/user_profile_test.js
```

Branch CI:

```text
fe/KCPM-116-profile
```

## 3. Backend white-box

Nam trong:

```text
docs/testing/user_profile_test/whitebox_user/
```

Automation:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/user_profile/integration/UserProfileIntegrationTest.java
```

Branch CI:

```text
whitebox/KCPM-88-profile
```

Lenh chay:

```powershell
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=UserProfileIntegrationTest test
```
