# Auth Test Reports

Thu muc nay tong hop tai lieu kiem thu cho module Auth cua VGA Store, bao gom black-box API Postman, black-box UI/E2E va white-box backend.

## Tong quan tai lieu

| Nhom test | File/Thu muc | Noi dung |
| :--- | :--- | :--- |
| Black-box API Postman | [blackbox_auth/postman](../testing/auth_test/blackbox_auth/postman/) | Thu muc chua cac report API Auth va data Postman/Newman |
| Black-box UI/E2E | [blackbox_auth/ui/ui_auth_report.md](../testing/auth_test/blackbox_auth/ui/ui_auth_report.md) | Testcase UI Auth theo hanh vi nguoi dung |
| White-box Backend | [whitebox_auth/Auth_whitebox_report.md](../testing/auth_test/whitebox_auth/Auth_whitebox_report.md) | Report white-box cho controller/service Auth |
| White-box Branch Matrix | [whitebox_auth/AUTH_BRANCH_MATRIX.csv](../testing/auth_test/whitebox_auth/AUTH_BRANCH_MATRIX.csv) | Ma tran branch/decision coverage |

## Black-box API Postman

| API | Report | CSV data | So testcase |
| :--- | :--- | :--- | ---: |
| Register | [Auth_register_blackbox_report.md](../testing/auth_test/blackbox_auth/postman/Auth_register_blackbox_report.md) | `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Register/Auth_Register_Testcase.csv` | 26 |
| Login | [Auth_login_blackbox_report.md](../testing/auth_test/blackbox_auth/postman/Auth_login_blackbox_report.md) | `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Login/Auth_Login_Testcase.csv` | 19 |
| Google Login | [Auth_google_login_blackbox_report.md](../testing/auth_test/blackbox_auth/postman/Auth_google_login_blackbox_report.md) | `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Google-Login/Auth_Google_Login_Testcase.csv` | 18 |
| Change Password | [Auth_changePassword_blackbox_report.md](../testing/auth_test/blackbox_auth/postman/Auth_changePassword_blackbox_report.md) | `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/ChangePassword/Auth_ChangePassword_Testcase.csv` | 16 |

Tong testcase Postman Auth: **79**.

Tai lieu chuan chat luong:

- [auth_target_quality_requirements.md](../testing/auth_test/blackbox_auth/postman/auth_target_quality_requirements.md)

## Black-box UI/E2E

Report UI:

- [ui_auth_report.md](../testing/auth_test/blackbox_auth/ui/ui_auth_report.md)

Automation source:

- `automation/E2E/modules/1_Authentication/login_test.js`
- `automation/E2E/modules/1_Authentication/register_test.js`
- `automation/E2E/modules/1_Authentication/logout_test.js`
- `automation/E2E/modules/1_Authentication/protected_route_test.js`
- `automation/E2E/modules/1_Authentication/change_password_test.js`
- `automation/E2E/modules/1_Authentication/auth_submit_blackbox_test.js`

## White-box Backend

Report white-box:

- [Auth_whitebox_report.md](../testing/auth_test/whitebox_auth/Auth_whitebox_report.md)
- [AUTH_BRANCH_MATRIX.csv](../testing/auth_test/whitebox_auth/AUTH_BRANCH_MATRIX.csv)

Test implementation:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/authentication/integration/AuthIntegrationTest.java`
- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/authentication/data/AuthIntegrationTestData.java`

## Cach chay nhanh

Chay Auth API black-box bang Newman:

```bash
cd automation
npm run test:auth:blackbox
```

Chay Auth UI/E2E:

```bash
cd automation
npx codeceptjs run "E2E/modules/1_Authentication" --steps
```

Chay white-box Auth backend:

```bash
cd backend/vgashop
./mvnw test -Dtest=AuthIntegrationTest
```
