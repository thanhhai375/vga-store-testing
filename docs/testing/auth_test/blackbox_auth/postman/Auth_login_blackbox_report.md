# BLACK-BOX TEST REPORT: Login

**Module:** Auth  
**Function/API:** Login  
**Endpoint:** `POST /api/auth/login`  
**Loai kiem thu:** Black-box API test  
**File data automation:** `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Login/Auth_Login_Testcase.csv`  
**CSV filter:** `testType=LOGIN`

---

## 1. Muc tieu kiem thu

Kiem tra API dang nhap theo hanh vi dau vao/dau ra, khong phu thuoc vao code ben trong. Test tap trung vao:

- Dang nhap thanh cong voi tai khoan hop le.
- Tu choi input rong.
- Tu choi username/password sai.
- Tu choi username sai format, co khoang trang, sai hoa/thuong.
- Message loi login khong lam lo user co ton tai hay khong.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `username` | Khong rong, ton tai, dung chinh xac hoa/thuong | V1 | Rong, khong ton tai, sai hoa/thuong, co khoang trang, ky tu dac biet | X1 |
| `password` | Khong rong, dung voi username | V2 | Rong, sai password, qua ngan, qua dai | X2 |
| Tai khoan | Ton tai, active, chua bi xoa | V3 | Khong ton tai, bi disable, bi xoa | X3 |

---

## 3. Phan tich gia tri bien

| Bien | min- | min | nominal | max | max+ | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `username.length` | 1-2 | 3 | `hai123` | 50 | > 50 | B1-B4 |
| `password.length` | Rong/5 | `hai123` | Sai password thong dung | Rat dai | Vuot do dai hop ly | B5-B8 |
| `username.format` | Ky tu dac biet | Username seed | Email-like username | Co khoang trang | Sai case | B9-B12 |

---

## 4. Ma tran do bao phu testcase

| Rule/Input can bao phu | Ky thuat | Testcase bao phu | So case | Ly do can co |
| :--- | :--- | :--- | ---: | :--- |
| Dang nhap hop le | Positive/Happy path | L-001 | 1 | Xac nhan tai khoan seed hop le tra token. |
| Truong bat buoc | Equivalence Partitioning | L-002, L-003, L-004 | 3 | Tach rieng ca hai rong, thieu password, thieu username de biet field nao validate sai. |
| Bien do dai username | Boundary Value Analysis | L-005, L-006, L-007, L-008, L-009 | 5 | Bao phu <3, =3, dai/gan max, >50 va user khong ton tai. |
| Bien do dai password | Boundary Value Analysis | L-010, L-012 | 2 | Bao phu password qua ngan va password rat dai de dam bao khong crash/khong bypass. |
| Credential sai | Negative Validation | L-011, L-013, L-014 | 3 | Bao phu password sai voi user ton tai, user khong ton tai va password sai dang khac. |
| Format/normalize username | Equivalence Partitioning + Negative Validation | L-015, L-016, L-017, L-018, L-019 | 5 | Bao phu email-like username, ky tu dac biet, khoang trang cuoi, sai hoa/thuong, khoang trang giua. |

**Tong coverage hien tai:** 6 nhom rule, 19 testcase. Neu chi lay muc toi thieu, co the gop con khoang 10 testcase, nhung khi fail se kho xac dinh loi nam o do dai, format, khoang trang, case-sensitive hay credential sai.

---

## 5. Thiet ke test case

| STT | Test ID | Username | Password | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | L-001 | `hai123` | `hai123` | 200 | Dang nhap thanh cong, tra token | V1,V2,V3 | High | Ready |
| 2 | L-002 | Rong | Rong | 400 | Bao loi validation | X1,X2 | High | Ready |
| 3 | L-003 | `hai123` | Rong | 400 | Bao loi password | X2 | High | Ready |
| 4 | L-004 | Rong | `hai123` | 400 | Bao loi username | X1 | High | Ready |
| 5 | L-005 | Do dai 1 | Sai | 400 | Khong dang nhap | X1,B1 | Medium | Ready |
| 6 | L-006 | Do dai 2 | Sai | 400 | Khong dang nhap | X1,B1 | Medium | Ready |
| 7 | L-007 | Do dai 3, user khong ton tai | Sai | 400 | Invalid username/password | X3,B2 | Medium | Ready |
| 8 | L-008 | Username > 50 | `hai123` | 400 | Khong dang nhap | X1,B4 | Medium | Ready |
| 9 | L-009 | Username dai, khong ton tai | `hai123` | 400 | Invalid username/password | X3,B3 | Medium | Ready |
| 10 | L-010 | `hai123` | Do dai 5 | 400 | Sai password | X2,B5 | High | Ready |
| 11 | L-011 | `hai123` | `123456` | 400 | Sai password | X2 | High | Ready |
| 12 | L-012 | `hai123` | Rat dai | 400 | Sai password, khong crash | X2,B7 | Medium | Ready |
| 13 | L-013 | User khong ton tai | `123456` | 400 | Invalid username/password | X3 | High | Ready |
| 14 | L-014 | `hai123` | `wrongpass123` | 400 | Sai password | X2 | High | Ready |
| 15 | L-015 | Email-like username | `123456` | 400 | Khong dang nhap bang username sai | X1 | Medium | Ready |
| 16 | L-016 | Username co ky tu dac biet | `123456` | 400 | Username sai pattern | X1,B9 | Medium | Ready |
| 17 | L-017 | Username co khoang trang cuoi | `hai123` | 400 | Khong trim de bypass | X1,B11 | Medium | Ready |
| 18 | L-018 | Sai hoa/thuong | `hai123` | 400 | Kiem tra case-sensitive | X1,B12 | Medium | Ready |
| 19 | L-019 | Username co khoang trang ben trong | `123456` | 400 | Username sai pattern | X1,B10 | High | Ready |
| 20 | L-020 | User disabled | Password dung | 400 | Tai khoan bi khoa khong duoc dang nhap | X3 | High | Proposed |
| 21 | L-021 | User deleted | Password dung | 400 | Tai khoan da xoa mem khong duoc dang nhap | X3 | High | Proposed |

---

## 6. Mapping automation

| Cot CSV | Cach dung |
| :--- | :--- |
| `testId` | Ma test case |
| `testType` | Phai bang `LOGIN` |
| `username`, `password` | Body request login |
| `expectedStatus` | HTTP status mong doi |
| `expectedMessage` | Token hoac message loi mong doi |

**Ket luan:** Login co 19 test case black-box hien co, bao phu positive, negative, equivalence partitioning va boundary value analysis. Cac case L-020 va L-021 la testcase de xuat bo sung cho state transition/business rule cua tai khoan disabled/deleted, hien da duoc white-box cover nhung chua co trong CSV Postman black-box.
