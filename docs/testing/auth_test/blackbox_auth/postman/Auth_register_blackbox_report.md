# BLACK-BOX TEST REPORT: Register

**Module:** Auth  
**Function/API:** Register  
**Endpoint:** `POST /api/auth/register`  
**Loai kiem thu:** Black-box API test  
**File data automation:** `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Register/Auth_Register_Testcase.csv`  
**CSV filter:** `testType=REGISTER`

---

## 1. Muc tieu kiem thu

Kiem tra API dang ky tai khoan theo chuan Auth muc tieu, khong chi theo behavior hien tai. Test tap trung vao:

- Dang ky thanh cong khi input hop le.
- Validate username/email/password/fullName.
- Chan username/email trung.
- Password phai dat chuan manh: 8-64 ky tu, co chu hoa, chu thuong, so va ky tu dac biet.

---

## 2. Xac dinh lop tuong duong

| Bien dau vao | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `username` | 3-50 ky tu, chi gom chu/so/gach duoi, chua ton tai | V1 | Rong, <3, >50, co khoang trang, ky tu dac biet, da ton tai | X1 |
| `email` | Khong rong, dung format, chua ton tai | V2 | Rong, sai format, co khoang trang dau/cuoi, da ton tai | X2 |
| `password` | 8-64 ky tu, co chu hoa, chu thuong, so, ky tu dac biet | V3 | Rong, <8, >64, thieu chu hoa/thuong/so/ky tu dac biet | X3 |
| `fullName` | Hop le hoac optional theo rule he thong | V4 | Neu backend quy dinh required thi rong la invalid | X4 |

---

## 3. Phan tich gia tri bien

| Bien | min- | min | nominal | max | max+ | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `username.length` | 2 | 3 | 8-12 | 50 | 51 | B1-B5 |
| `password.length` | 7 | 8 | 10-16 | 64 | 65 | B6-B10 |
| `password.complexity` | Thieu 1 nhom ky tu | Du 4 nhom | Password manh | Du 4 nhom | Thieu nhom ky tu | B11-B14 |
| `email.format` | Khong co `@` | Email hop le | Email hop le | Email dai hop le | Sai format | B15-B18 |
| `email.length` |  | Email hop le | Email thong dung | 254 | >254 | B19-B20 |
| `fullName` | Rong/toan khoang trang | Ten hop le | Ten nguoi dung |  |  | B21-B22 |

---

## 4. Ma tran do bao phu testcase

| Rule/Input can bao phu | Ky thuat | Testcase bao phu | So case | Ly do can co |
| :--- | :--- | :--- | ---: | :--- |
| Dang ky hop le | Positive/Happy path | R-001 | 1 | Xac nhan bo input hop le tao user va tra token. |
| Truong bat buoc | Equivalence Partitioning | R-002, R-003, R-004, R-005 | 4 | Bao phu thieu username, email, password va thieu tat ca field bat buoc. |
| Username length | Boundary Value Analysis | R-006, R-007, R-008, R-009 | 4 | Bao phu <3, =3, =50 va >50 ky tu. |
| Username format | Equivalence Partitioning | R-018, R-019 | 2 | Bao phu username co khoang trang va ky tu dac biet. |
| Email format/length | Equivalence Partitioning + Boundary Value Analysis | R-010, R-011, R-017, R-026 | 4 | Bao phu email sai format, thieu @, co khoang trang va >254 ky tu. |
| Duplicate data | State/Uniqueness | R-012, R-013 | 2 | Bao phu username da ton tai va email da ton tai. |
| Password length | Boundary Value Analysis | R-014, R-015, R-016 | 3 | Bao phu <8, =8 va >64 ky tu. |
| Password complexity | Equivalence Partitioning | R-020, R-021, R-022, R-023 | 4 | Bao phu thieu chu hoa, thieu chu thuong, thieu so, thieu ky tu dac biet. |
| FullName quality | Business Rule/Negative Validation | R-024, R-025 | 2 | Bao phu fullName rong va chi gom khoang trang theo rule muc tieu. |

**Tong coverage hien tai:** 9 nhom rule, 26 testcase. So luong nay cao hon muc toi thieu vi password policy duoc tach tung nhom loi, email va fullName co them rule chat luong.

---

## 5. Thiet ke test case

| STT | Test ID | Username | Email | Password | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | R-001 | Hop le | Hop le | `Password@1` | 200 | Dang ky thanh cong, tra token | V1,V2,V3,V4 | High | Ready |
| 2 | R-002 | Rong | Hop le | Hop le | 400 | Bao loi username | X1 | High | Ready |
| 3 | R-003 | Hop le | Rong | Hop le | 400 | Bao loi email | X2 | High | Ready |
| 4 | R-004 | Hop le | Hop le | Rong | 400 | Bao loi password | X3 | High | Ready |
| 5 | R-005 | Rong | Rong | Rong | 400 | Bao loi validation | X1,X2,X3 | High | Ready |
| 6 | R-006 | Do dai 2 | Hop le | Hop le | 400 | Username duoi bien | X1,B1 | Medium | Ready |
| 7 | R-007 | Do dai 3 | Hop le | Hop le | 200 | Username tai min | V1,B2 | Medium | Ready |
| 8 | R-008 | Do dai 51 | Hop le | Hop le | 400 | Username vuot max | X1,B5 | Medium | Ready |
| 9 | R-009 | Do dai 50 | Hop le | Hop le | 200 | Username tai max | V1,B4 | Medium | Ready |
| 10 | R-010 | Hop le | Sai format | Hop le | 400 | Bao loi email | X2,B15 | Medium | Ready |
| 11 | R-011 | Hop le | Thieu `@` | Hop le | 400 | Bao loi email | X2,B15 | Medium | Ready |
| 12 | R-012 | Da ton tai | Hop le | Hop le | 400 | Bao loi trung username | X1 | High | Ready |
| 13 | R-013 | Hop le | Da ton tai | Hop le | 400 | Bao loi trung email | X2 | High | Ready |
| 14 | R-014 | Hop le | Hop le | Duoi 8 ky tu | 400 | Password qua ngan | X3,B6 | High | Ready |
| 15 | R-015 | Hop le | Hop le | 8 ky tu, du 4 nhom | 200 | Password tai min | V3,B7 | High | Ready |
| 16 | R-016 | Hop le | Hop le | >64 ky tu | 400 | Password qua dai | X3,B10 | High | Ready |
| 17 | R-017 | Hop le | Co khoang trang cuoi | Hop le | 400 | Email sai format | X2 | Medium | Ready |
| 18 | R-018 | Co khoang trang cuoi | Hop le | Hop le | 400 | Username sai format | X1 | Medium | Ready |
| 19 | R-019 | Co ky tu dac biet | Hop le | Hop le | 400 | Username sai pattern | X1 | Medium | Ready |
| 20 | R-020 | Hop le | Hop le | Thieu chu hoa | 400 | Password yeu | X3,B11 | High | Ready |
| 21 | R-021 | Hop le | Hop le | Thieu chu thuong | 400 | Password yeu | X3,B12 | High | Ready |
| 22 | R-022 | Hop le | Hop le | Thieu chu so | 400 | Password yeu | X3,B13 | High | Ready |
| 23 | R-023 | Hop le | Hop le | Thieu ky tu dac biet | 400 | Password yeu | X3,B14 | High | Ready |
| 24 | R-024 | Hop le | Hop le | Hop le | 400 | `fullName` rong bi tu choi neu fullName la required theo rule muc tieu | X4,B21 | Medium | Proposed |
| 25 | R-025 | Hop le | Hop le | Hop le | 400 | `fullName` chi gom khoang trang bi tu choi | X4,B22 | Medium | Proposed |
| 26 | R-026 | Hop le | Email >254 ky tu | Hop le | 400 | Email vuot max length bi tu choi | X2,B20 | Medium | Proposed |

---

## 6. Mapping automation

| Cot CSV | Cach dung |
| :--- | :--- |
| `testId` | Ma test case |
| `testType` | Phai bang `REGISTER` |
| `username`, `email`, `password`, `fullName` | Body request register |
| `expectedStatus` | HTTP status mong doi |
| `expectedMessage` | Token hoac message loi mong doi |

**Ket luan:** Register co 26 test case black-box hien co, bao phu positive, negative, equivalence partitioning, boundary value analysis va password quality. Cac case R-024 den R-026 la testcase bo sung de kiem tra gap `fullName` va gioi han do dai email theo rule muc tieu.
