# BLACK-BOX AUTH REPORTS

Thu muc nay chua report black-box cho cac function chinh cua module Auth trong pham vi Login/Register/ChangePassword.

| Function/API | Report | So test case lien quan |
| :--- | :--- | :---: |
| Login | `Auth_login_blackbox_report.md` | 19 |
| Register | `Auth_register_blackbox_report.md` | 23 |
| Change Password | `Auth_changePassword_blackbox_report.md` | 16 |

Loai test: black-box API integration test, chay bang Postman/Newman voi file CSV:

`automation/postman/VGA-AUTH-USER/VGA-Store-Auth/VGA-Store-Auth-Testcase.csv`

Pham vi bao phu:

- Login/Register/ChangePassword: 3 function/API chinh duoc bao phu.
- Toan module Auth neu tinh ca Google Login va Register Admin: chua bao phu day du vi chua co report rieng cho cac function do.
