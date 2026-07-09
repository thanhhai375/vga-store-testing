# User Profile Test Reports

Thu muc nay tong hop tai lieu kiem thu cho module User Profile cua VGA Store, bao gom black-box API Postman, black-box UI/E2E va white-box backend.

## Tong quan tai lieu

| Nhom test | File/Thu muc | Noi dung |
| :--- | :--- | :--- |
| Tong quan module | [User_profile_overview_report.md](../testing/user_profile_test/User_profile_overview_report.md) | Bao cao tong hop toan bo phan kiem thu User Profile |
| Black-box API Postman | [blackbox_user/postman](../testing/user_profile_test/blackbox_user/postman/) | Thu muc chua cac report API User Profile va data Postman/Newman |
| Black-box UI/E2E | [blackbox_user/ui/ui_user_profile_report.md](../testing/user_profile_test/blackbox_user/ui/ui_user_profile_report.md) | Testcase UI User Profile theo hanh vi nguoi dung |
| White-box Backend | [whitebox_user/User_profile_whitebox_report.md](../testing/user_profile_test/whitebox_user/User_profile_whitebox_report.md) | Report white-box cho controller/service User Profile |
| White-box Branch Matrix | [whitebox_user/USER_PROFILE_BRANCH_MATRIX.csv](../testing/user_profile_test/whitebox_user/USER_PROFILE_BRANCH_MATRIX.csv) | Ma tran branch/decision coverage |

## Black-box API Postman

| API | Report | CSV data | So testcase |
| :--- | :--- | :--- | ---: |
| View Profile | [User_profile_blackbox_report.md](../testing/user_profile_test/blackbox_user/postman/User_profile_blackbox_report.md) | `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv` | 3 |
| Add Address | [User_address_blackbox_report.md](../testing/user_profile_test/blackbox_user/postman/User_address_blackbox_report.md) | `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv` | 6 |
| Change Password | [User_changePassword_blackbox_report.md](../testing/user_profile_test/blackbox_user/postman/User_changePassword_blackbox_report.md) | `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv` | 18 |

Tong testcase Postman User Profile: **27**.

Tai lieu tong hop va chuan chat luong:

- [user_blackbox_assignment_report.md](../testing/user_profile_test/blackbox_user/postman/user_blackbox_assignment_report.md)
- [user_target_quality_requirements.md](../testing/user_profile_test/blackbox_user/postman/user_target_quality_requirements.md)

Postman collection:

- `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA Store User Blackbox.postman_collection.json`

## Black-box UI/E2E

Report UI:

- [ui_user_profile_report.md](../testing/user_profile_test/blackbox_user/ui/ui_user_profile_report.md)

Automation source:

- `automation/E2E/modules/7_User_Profile/user_profile_test.js`

Pham vi UI:

- Profile: cap nhat thong tin ca nhan, email readonly, validate fullname/phone/gender.
- Address Book: mo/huy form, them dia chi, validate recipient/phone/address.
- Change Password: confirm mismatch, old password sai, password moi yeu, doi thanh cong va revert.
- Logout/Protected Route: dang xuat, chua login vao profile, token sai trong localStorage.
- UX Enhancement: loi gan field, loading submit, giu du lieu sau fail, message de hieu.

## White-box Backend

Report white-box:

- [User_profile_whitebox_report.md](../testing/user_profile_test/whitebox_user/User_profile_whitebox_report.md)
- [USER_PROFILE_BRANCH_MATRIX.csv](../testing/user_profile_test/whitebox_user/USER_PROFILE_BRANCH_MATRIX.csv)

Test implementation:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/user_profile/integration/UserProfileIntegrationTest.java`

Ket qua ghi nhan:

- Tests run: 7
- Failures: 0
- Errors: 0
- Skipped: 0
- Branch matrix: 7/7 branch chinh

## Cach chay nhanh

Chay User Profile API black-box bang Newman:

```bash
cd automation
npm run test:user:blackbox
```

Chay User Profile UI/E2E:

```bash
cd automation
npx codeceptjs run "E2E/modules/7_User_Profile/user_profile_test.js" --steps
```

Chay white-box User Profile backend:

```powershell
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=UserProfileIntegrationTest test
```
