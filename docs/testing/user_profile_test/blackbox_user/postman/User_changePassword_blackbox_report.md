# Black-box Report: User Change Password

**Function/API:** Change Password  
**Endpoint:** `PUT /api/users/change-password`  
**Automation:** `test:user:blackbox`  
**CSV:** `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv`

## 1. Lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| --- | --- | --- | --- | --- |
| Authentication | Token hop le | CV1 | Thieu token/token sai | CX1 |
| Old password | Dung mat khau hien tai | CV2 | Rong, sai, co khoang trang dau/cuoi | CX2,CX3,CX4 |
| New password | 8-64 ky tu, du complexity | CV3 | Rong, <8, >64, thieu nhom ky tu, co khoang trang | CX5-CX9 |
| Confirm password | Khop new password | CV4 | Rong, khong khop | CX10 |
| Business rule | New password khac old password | CV5 | New password trung old password | CX11 |

## 2. Phan tich gia tri bien

| Bien dau vao | min | min+ | nominal | max | Ngoai bien | Tag |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| newPassword length | 8 | 9 | 10-16 | 64 | 0, 7, 65+ | CB1-CB7 |
| newPassword complexity | Du 4 nhom |  | Password manh | Du 4 nhom | Thieu hoa/thuong/so/ky tu dac biet | CB8-CB11 |
| confirmPassword | Khop |  | Khop | Khop | Rong/khong khop | CB12-CB13 |

## 3. Test cases

| STT | Test ID | Ten test case | Old password | New password | Confirm password | Auth | Expected status | Ket qua mong doi | Tag | Priority | Status |
| ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | CP-001 | Doi mat khau thanh cong | dung | Password@1 | Password@1 | valid | 200 | Doi thanh cong | CV1-CV5 | High | Ready |
| 2 | CP-002 | Old password rong | rong | Password@1 | Password@1 | valid | 400 | Bao loi old password | CX2 | High | Ready |
| 3 | CP-003 | New password rong | dung | rong | rong | valid | 400 | Bao loi new password | CX5 | High | Ready |
| 4 | CP-004 | Confirm password rong | dung | Password@1 | rong | valid | 400 | Bao loi confirm | CX10 | High | Ready |
| 5 | CP-005 | Old password sai | sai | Password@1 | Password@1 | valid | 400 | Bao loi old password | CX3 | High | Ready |
| 6 | CP-006 | New password qua ngan | dung | Pass@1 | Pass@1 | valid | 400 | Bao loi length | CX6,CB1 | High | Ready |
| 7 | CP-007 | New password dat min | dung | Pass@123 | Pass@123 | valid | 200 | Doi thanh cong | CV3,CB2 | High | Ready |
| 8 | CP-008 | New password qua dai | dung | >64 ky tu | >64 ky tu | valid | 400 | Bao loi max length | CX7,CB7 | High | Ready |
| 9 | CP-009 | Confirm khong khop | dung | Password@1 | Password@2 | valid | 400 | Bao loi mismatch | CX10,CB13 | High | Ready |
| 10 | CP-010 | New password trung old | dung | Oldpass@1 | Oldpass@1 | valid | 400 | Bao loi trung mat khau cu | CX11 | High | Ready |
| 11 | CP-011 | Old password co khoang trang | co space | Password@1 | Password@1 | valid | 400 | Khong trim de bypass | CX4 | Medium | Ready |
| 12 | CP-012 | New password co khoang trang | dung | co space | co space | valid | 400 | Bao loi pattern | CX9 | Medium | Ready |
| 13 | CP-013 | Thieu chu hoa | dung | password@1 | password@1 | valid | 400 | Bao loi complexity | CX8,CB8 | High | Ready |
| 14 | CP-014 | Thieu chu thuong | dung | PASSWORD@1 | PASSWORD@1 | valid | 400 | Bao loi complexity | CX8,CB9 | High | Ready |
| 15 | CP-015 | Thieu chu so | dung | Password@ | Password@ | valid | 400 | Bao loi complexity | CX8,CB10 | High | Ready |
| 16 | CP-016 | Thieu ky tu dac biet | dung | Password1 | Password1 | valid | 400 | Bao loi complexity | CX8,CB11 | High | Ready |
| 17 | CP-017 | Thieu token | dung | Password@1 | Password@1 | none | 403 | Bi tu choi truy cap | CX1 | High | Ready |
| 18 | CP-018 | Token sai | dung | Password@1 | Password@1 | invalid | 403 | Bi tu choi truy cap | CX1 | High | Ready |

## 4. Mapping automation

| Report | CSV/Postman |
| --- | --- |
| Test ID | `testId` |
| Loai function | `testType=CHANGE_PWD` |
| Token | `authMode` |
| Old password | `oldPassword` |
| New password | `newPassword` |
| Confirm password | `confirmPassword` |
| Expected HTTP status | `expectedStatus` |
| Expected message | `expectedMessage` |
