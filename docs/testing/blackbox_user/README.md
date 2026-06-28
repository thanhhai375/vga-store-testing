# BLACK-BOX USER REPORTS

Thu muc nay chua report black-box cho cac function chinh cua module User trong pham vi Profile/Address/Change Password.

| Function/API | Report | So test case lien quan |
| :--- | :--- | :---: |
| View Profile | `User_profile_blackbox_report.md` | 3 |
| Add Address | `User_address_blackbox_report.md` | 6 |
| Change Password | `User_changePassword_blackbox_report.md` | 18 |

Loai test: black-box API integration test, chay bang Postman/Newman voi file CSV:

`automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv`

Lenh chay:

```bash
cd automation
npm run test:user:blackbox
```

Pham vi bao phu:

- View Profile: xac thuc token hop le, thieu token, token sai.
- Add Address: them dia chi hop le, default/non-default, bien do dai dia chi, thieu/sai token.
- Change Password: token, old password, new password, confirm password, boundary length va complexity.

Ghi chu chat luong:

- Backend hien co validation manh cho `ChangePasswordRequest`.
- `UserProfileRequest` va `UserAddressDto` hien chua co annotation validation day du, nen report co ghi ro gap can bo sung neu muon reject cac input rong/sai format o muc DTO thay vi phu thuoc DB constraint.
