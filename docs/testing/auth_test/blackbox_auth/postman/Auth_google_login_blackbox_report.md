# BLACK-BOX TEST REPORT: Google Login

**Module:** Auth  
**Function/API:** Google Login  
**Endpoint:** `POST /api/auth/google`  
**Loai kiem thu:** Black-box API test  
**File data automation:** `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Google-Login/Auth_Google_Login_Testcase.csv`  
**CSV filter:** `testType=GOOGLE_LOGIN`

---

## 1. Muc tieu kiem thu

Kiem tra API dang nhap bang Google theo hanh vi dau vao/dau ra, khong phu thuoc vao code ben trong. Test tap trung vao:

- Dang nhap Google thanh cong voi ho so Google hop le.
- Tu dong tao user hoac dang nhap user da ton tai theo email Google.
- Tu choi email rong, sai format hoac co khoang trang dau/cuoi.
- Validate ten hien thi Google khi rong, qua dai, co khoang trang hoac ky tu dac biet.
- Dam bao dang nhap lap lai bang cung email khong tao user trung.

---

## 2. Xac dinh lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| :--- | :--- | :---: | :--- | :---: |
| `email` Google | Khong rong, dung format email, chua/da ton tai deu xu ly dung | V1 | Rong, sai format, co khoang trang dau/cuoi | X1 |
| `name` Google | Khong rong, ten ngan/hop le, co khoang trang giua neu la display name | V2 | Rong, qua dai neu backend co gioi han | X2 |
| User theo email | Email moi tao user/dang nhap thanh cong | V3 | Email thuoc user bi vo hieu hoa neu backend co rule block | X3 |
| Truong optional | Thieu avatar/chi co field bat buoc van xu ly duoc | V4 | Thieu field bat buoc name/email | X4 |
| Dang nhap lap lai | Cung email tra user cu, khong tao duplicate | V5 | Tao trung user cung email | X5 |

---

## 3. Phan tich gia tri bien

| Bien | min- | min | nominal | max | max+ | Tag |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `email` | Rong/sai format | Email hop le | Gmail thong dung | Email dai hop le | Co khoang trang dau/cuoi | B1-B5 |
| `name.length` | Rong | 1 ky tu | Ten Google thong dung | Ten dai | Qua dai theo rule backend | B6-B10 |
| `name.format` | Rong | Chu cai | Co khoang trang giua | Co ky tu dac biet | Co khoang trang dau/cuoi | B11-B14 |
| User state | Email moi | Email da ton tai | Email dang nhap lap lai | User disabled | Duplicate email | B15-B18 |

---

## 4. Ma tran do bao phu testcase

| Rule/Input can bao phu | Ky thuat | Testcase bao phu | So case | Ly do can co |
| :--- | :--- | :--- | ---: | :--- |
| Google login hop le | Positive/Happy path | G-001 | 1 | Xac nhan ho so Google hop le tra token. |
| User da ton tai/dang nhap lap lai | State/Uniqueness | G-002, G-018 | 2 | Bao phu dang nhap bang email da co va khong tao duplicate user. |
| Truong bat buoc | Equivalence Partitioning | G-003, G-004, G-005 | 3 | Tach rieng thieu email, thieu name va thieu ca hai de biet rule validate sai o dau. |
| Email format/bien | Equivalence Partitioning + Boundary Value Analysis | G-006, G-007, G-010, G-011 | 4 | Bao phu email sai format, email dai hop le, plus notation va khoang trang dau/cuoi. |
| Name length | Boundary Value Analysis | G-008, G-009 | 2 | Bao phu ten 1 ky tu va ten qua dai theo rule muc tieu. |
| Name format/display name | Equivalence Partitioning | G-012, G-016, G-017 | 3 | Bao phu display name co ky tu dac biet, khoang trang dau/cuoi va khoang trang giua. |
| Truong optional Google profile | Business Rule | G-013, G-014 | 2 | Dam bao API khong phu thuoc vao avatar hoac field optional. |
| Trang thai user | State Transition | G-015 | 1 | Kiem tra hanh vi voi user disabled neu backend co rule vo hieu hoa. |

**Tong coverage hien tai:** 8 nhom rule, 18 testcase. Bo test nay tach rieng email, display name, optional fields va state cua user de khi fail co the xac dinh loi nam o validation, mapping Google profile hay duplicate account.

---

## 5. Thiet ke test case

| STT | Test ID | Google name | Google email | Expected status | Expected result | Tag | Priority | Status |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| 1 | G-001 | `Google New User` | `g001_new_google@gmail.com` | 200 | Ho so Google hop le tu tao user hoac dang nhap thanh cong, tra token | V1,V2,V3 | High | Ready |
| 2 | G-002 | `Google Existing User` | `g002_exist_google@gmail.com` | 200 | Email da ton tai dang nhap thanh cong, tra token | V1,V2,V5 | High | Ready |
| 3 | G-003 | `Google Missing Email` | Rong | 400 | Email rong bi tu choi | X1,X4 | High | Ready |
| 4 | G-004 | Rong | `g004_empty_name@gmail.com` | 400 | Name rong bi tu choi | X2,X4 | Medium | Ready |
| 5 | G-005 | Rong | Rong | 400 | Bao loi validation khi name va email deu rong | X1,X2,X4 | High | Ready |
| 6 | G-006 | `Google Invalid Email` | `notanemail` | 400 | Email sai format bi tu choi | X1,B1 | High | Ready |
| 7 | G-007 | `Google Long Email` | Email dai hop le | 200 | Email dai nhung dung format duoc chap nhan | V1,B4 | Medium | Ready |
| 8 | G-008 | `A` | `g008_short_email@gmail.com` | 200 | Name 1 ky tu duoc chap nhan neu backend khong co min length cho display name | V2,B7 | Medium | Ready |
| 9 | G-009 | Ten rat dai | `g009_long_name@gmail.com` | 400 | Name qua dai bi tu choi neu backend co max length | X2,B10 | Medium | Ready |
| 10 | G-010 | `Google Plus Email` | `g010_plus_notation+tag@gmail.com` | 200 | Email co dau cong hop le duoc chap nhan | V1,B4 | Medium | Ready |
| 11 | G-011 | `Google Whitespace Email` | Email co khoang trang cuoi | 400 | Email co khoang trang dau/cuoi bi tu choi | X1,B5 | High | Ready |
| 12 | G-012 | `User @#$%^&` | `g012_special_chars_name@gmail.com` | 200 | Display name co ky tu dac biet duoc chap nhan neu backend cho phep ten hien thi | V2,B13 | Low | Ready |
| 13 | G-013 | `Google Url Picture` | `g013_url_test@gmail.com` | 200 | Dang nhap Google thanh cong khi thieu anh dai dien | V4 | Medium | Ready |
| 14 | G-014 | `Google Optional Field` | `g014_optional_field@gmail.com` | 200 | Dang nhap Google thanh cong khi chi co field bat buoc | V4 | Medium | Ready |
| 15 | G-015 | `Google Disabled User` | `g015_disabled_user@gmail.com` | 200 | Kiem tra user disabled; chi fail neu backend co rule chan user vo hieu hoa | V3/X3 | Medium | Ready |
| 16 | G-016 | `Google Trim Name ` | `g016_trim_name@gmail.com` | 200 | Name co khoang trang dau/cuoi duoc chap nhan hoac chuan hoa | V2,B14 | Low | Ready |
| 17 | G-017 | `Google Internal Space Name` | `g017_space_name@gmail.com` | 200 | Display name co khoang trang giua duoc chap nhan | V2,B12 | Low | Ready |
| 18 | G-018 | `Google Existing User Updated` | `g002_exist_google@gmail.com` | 200 | Dang nhap lai cung email khong tao user trung, tra token | V1,V5 | High | Ready |

---

## 6. Mapping automation

| Cot CSV | Cach dung |
| :--- | :--- |
| `testId` | Ma test case |
| `testType` | Phai bang `GOOGLE_LOGIN` |
| `username` | Ten hien thi Google profile |
| `email` | Email Google profile |
| `expectedStatus` | HTTP status mong doi |
| `expectedMessage` | Token hoac message loi mong doi |

**Ket luan:** Google Login co 18 test case black-box, bao phu positive, negative, equivalence partitioning, boundary value analysis, optional field va state/uniqueness theo email Google.
