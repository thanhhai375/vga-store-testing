# BLACK-BOX TEST REPORT: Change Password

**Module:** Auth/User  
**Function/API:** Change Password  
**Endpoint:** `PUT /api/users/change-password`  
**Loai kiem thu:** Black-box API test  
**File data automation:** `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/ChangePassword/Auth_ChangePassword_Testcase.csv`  
**CSV filter:** `testType=CHANGE_PWD`

---

## 1. Muc tieu kiem thu

Kiem tra API doi mat khau theo hanh vi dau vao/dau ra:

- User da dang nhap moi duoc doi mat khau.
- Old password phai dung.
- New password phai dat chuan manh.
- Confirm password phai khop.
- New password khong duoc trung old password.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| Authentication | Co token hop le | V1 | Thieu token, token sai, token het han | X1 |
| `oldPassword` | Khong rong, dung voi mat khau hien tai | V2 | Rong, sai, co khoang trang dau/cuoi | X2 |
| `newPassword` | 8-64 ky tu, co chu hoa, chu thuong, so, ky tu dac biet, khac old password | V3 | Rong, <8, >64, thieu nhom ky tu, trung old password, co khoang trang dau/cuoi | X3 |
| `confirmPassword` | Khop `newPassword` | V4 | Rong, khong khop | X4 |

---

## 3. Phan tich gia tri bien

| Bien | min- | min | nominal | max | max+ | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `newPassword.length` | 7 | 8 | 10-16 | 64 | 65 | B1-B5 |
| `newPassword.complexity` | Thieu 1 nhom | Du 4 nhom | Password manh | Du 4 nhom | Thieu nhom ky tu | B6-B9 |
| `oldPassword` | Rong/sai | Dung | Dung | Co khoang trang | Sai | B10-B12 |
| `confirmPassword` | Rong | Khop | Khop | Khong khop | Khong khop | B13-B14 |

---

## 4. Ma tran do bao phu testcase

| Rule/Input can bao phu | Ky thuat | Testcase bao phu | So case | Ly do can co |
| :--- | :--- | :--- | ---: | :--- |
| Doi mat khau hop le | Positive/Happy path | C-001 | 1 | Xac nhan user co token hop le doi mat khau thanh cong. |
| Old password validation | Equivalence Partitioning | C-002, C-005, C-011 | 3 | Bao phu old password rong, sai, va co khoang trang dau/cuoi. |
| New password required/length | Boundary Value Analysis | C-003, C-006, C-007, C-008 | 4 | Bao phu new password rong, <8, =8, >64 ky tu. |
| Confirm password | Equivalence Partitioning | C-004, C-009 | 2 | Bao phu confirm rong va confirm khong khop. |
| Password business rule | Business Rule/Negative Validation | C-010, C-012 | 2 | Bao phu new password trung old password va co khoang trang dau/cuoi. |
| Password complexity | Equivalence Partitioning | C-013, C-014, C-015, C-016 | 4 | Bao phu thieu chu hoa, thieu chu thuong, thieu so, thieu ky tu dac biet. |

**Tong coverage hien tai:** 6 nhom rule, 16 testcase. Day la bo gan voi muc toi thieu can co cho Change Password vi moi nhom loi chinh da co it nhat mot testcase dai dien.

---

## 5. Thiet ke test case

| STT | Test ID | Old password | New password | Confirm password | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | C-001 | Dung | `Password@1` | `Password@1` | 200 | Doi mat khau thanh cong | V1,V2,V3,V4 | High | Ready |
| 2 | C-002 | Rong | Hop le | Hop le | 400 | Bao loi old password | X2 | High | Ready |
| 3 | C-003 | Dung | Rong | Rong | 400 | Bao loi new password | X3 | High | Ready |
| 4 | C-004 | Dung | Hop le | Rong | 400 | Bao loi confirm password | X4 | High | Ready |
| 5 | C-005 | Sai | Hop le | Hop le | 400 | Bao loi old password sai | X2 | High | Ready |
| 6 | C-006 | Dung | Duoi 8 ky tu | Duoi 8 ky tu | 400 | Password qua ngan | X3,B1 | High | Ready |
| 7 | C-007 | Dung | 8 ky tu, du 4 nhom | Khop | 200 | Password tai min | V3,B2 | High | Ready |
| 8 | C-008 | Dung | >64 ky tu | Khop | 400 | Password qua dai | X3,B5 | High | Ready |
| 9 | C-009 | Dung | `Password@1` | `Password@2` | 400 | Confirm khong khop | X4,B14 | High | Ready |
| 10 | C-010 | Dung | Trung old password | Trung old password | 400 | New password khong duoc trung old password | X3 | Medium | Ready |
| 11 | C-011 | Co khoang trang dau/cuoi | Hop le | Hop le | 400 | Old password khong duoc trim de bypass | X2,B12 | Medium | Ready |
| 12 | C-012 | Dung | Co khoang trang dau/cuoi | Khop | 400 | New password sai validation | X3 | Medium | Ready |
| 13 | C-013 | Dung | Thieu chu hoa | Khop | 400 | Password yeu | X3,B6 | High | Ready |
| 14 | C-014 | Dung | Thieu chu thuong | Khop | 400 | Password yeu | X3,B7 | High | Ready |
| 15 | C-015 | Dung | Thieu chu so | Khop | 400 | Password yeu | X3,B8 | High | Ready |
| 16 | C-016 | Dung | Thieu ky tu dac biet | Khop | 400 | Password yeu | X3,B9 | High | Ready |

---

## 6. Mapping automation

| Cot CSV | Cach dung |
| :--- | :--- |
| `testId` | Ma test case |
| `testType` | Phai bang `CHANGE_PWD` |
| `oldPassword`, `newPassword`, `confirmPassword` | Body request change password |
| `expectedStatus` | HTTP status mong doi |
| `expectedMessage` | Message loi/thanh cong mong doi |

**Ket luan:** Change Password co 16 test case black-box, bao phu positive, negative, equivalence partitioning, boundary value analysis va password quality.
