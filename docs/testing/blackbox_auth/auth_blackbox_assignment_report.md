# Assignment: Kiem thu black-box module Auth

**Chu de:** Phan hoach lop tuong duong, phan tich gia tri bien, thiet ke test case va kiem thu tu dong  
**Module:** Auth  
**Du an:** VGA Store  
**Pham vi:** Login, Register, Change Password  
**Hinh thuc:** Bao cao ca nhan, co the ung dung vao CI/CD  

---

## 1. Muc tieu bao cao

1. Xac dinh dieu kien kiem thu cho 3 chuc nang/API Auth:
   - Login.
   - Register.
   - Change Password.
2. Ap dung ky thuat black-box testing:
   - Equivalence Partitioning.
   - Boundary Value Analysis.
   - Decision Table Testing.
   - State Transition Testing.
3. Thiet ke test case co input, expected result, priority, status va tag bao phu.
4. Trien khai automation test bang Postman/Newman data-driven test.
5. Ket noi CI/CD bang GitHub Actions va log loi len Jira khi test fail.

---

## 2. Mo ta bai toan

He thong VGA Store cho phep nguoi dung dang ky tai khoan, dang nhap va doi mat khau.

Bao cao nay test theo **hanh vi API/input-output**, khong tach theo tang code `Controller` hay `Service`. Day la cach phu hop voi black-box testing vi tester khong can biet code ben trong xu ly nhu the nao.

### 2.1 Login

Mot yeu cau dang nhap hop le khi:

- Username khong rong.
- Password khong rong.
- Username ton tai trong he thong.
- Password dung voi username.

He thong tra ve:

- Thanh cong neu thong tin dang nhap dung.
- That bai neu input rong, user khong ton tai, password sai, username sai format hoac co khoang trang bat thuong.

### 2.2 Register

Mot yeu cau dang ky hop le khi:

- Username khong rong.
- Username co do dai tu 3 den 50 ky tu.
- Username chi gom chu cai, chu so va dau gach duoi `_`.
- Username chua ton tai.
- Email khong rong, dung dinh dang, chua ton tai.
- Password khong rong va dat chuan manh:
  - 8-64 ky tu.
  - Co it nhat 1 chu thuong.
  - Co it nhat 1 chu hoa.
  - Co it nhat 1 chu so.
  - Co it nhat 1 ky tu dac biet.
- Full name co gia tri hop le theo rule he thong.

He thong tra ve:

- Thanh cong neu tat ca dieu kien hop le.
- That bai neu co it nhat mot dieu kien khong hop le.

### 2.3 Change Password

Mot yeu cau doi mat khau hop le khi:

- User da dang nhap va co token hop le.
- Old password khong rong va dung voi mat khau hien tai.
- New password khong rong, khac old password va dat chuan password manh.
- Confirm password khop new password.

He thong tra ve:

- Thanh cong neu doi mat khau hop le.
- That bai neu thieu token, sai old password, password moi yeu, confirm khong khop hoac new password trung old password.

---

# PHAN A. THIET KE KIEM THU BLACK-BOX

---

## Cau 1. Xac dinh lop tuong duong

### 1.1 Login

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| --- | --- | --- | --- | --- |
| Username | Ton tai, dung chinh xac hoa/thuong | LV1 | Rong | LX1 |
| Username |  |  | Khong ton tai | LX2 |
| Username |  |  | Qua ngan/qua dai | LX3 |
| Username |  |  | Ky tu dac biet, khoang trang, sai hoa/thuong | LX4 |
| Password | Dung voi username | LV2 | Rong | LX5 |
| Password |  |  | Sai password | LX6 |
| Password |  |  | Qua ngan/qua dai | LX7 |
| Tai khoan | Ton tai, active | LV3 | Khong ton tai, disabled, deleted | LX8 |

### 1.2 Register

| Bien dau vao | Lop hop le | Tag | Lop khong hop le | Tag |
| --- | --- | --- | --- | --- |
| Username | 3-50 ky tu, chu/so/gach duoi, chua ton tai | RV1 | Rong | RX1 |
| Username |  |  | Nho hon 3 ky tu | RX2 |
| Username |  |  | Lon hon 50 ky tu | RX3 |
| Username |  |  | Da ton tai | RX4 |
| Username |  |  | Ky tu dac biet hoac khoang trang | RX5 |
| Email | Dung format, chua ton tai | RV2 | Rong | RX6 |
| Email |  |  | Sai format | RX7 |
| Email |  |  | Da ton tai | RX8 |
| Email |  |  | Co khoang trang dau/cuoi | RX9 |
| Password | 8-64 ky tu, du chu hoa/thuong/so/ky tu dac biet | RV3 | Rong | RX10 |
| Password |  |  | Nho hon 8 ky tu | RX11 |
| Password |  |  | Lon hon 64 ky tu | RX12 |
| Password |  |  | Thieu chu hoa/thuong/so/ky tu dac biet | RX13 |
| Full name | Co gia tri hop le | RV4 | Rong neu backend quy dinh required | RX14 |

### 1.3 Change Password

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| --- | --- | --- | --- | --- |
| Authentication | Co token hop le | CV1 | Thieu token, token sai, token het han | CX1 |
| Old password | Dung mat khau hien tai | CV2 | Rong | CX2 |
| Old password |  |  | Sai mat khau | CX3 |
| Old password |  |  | Co khoang trang dau/cuoi | CX4 |
| New password | 8-64 ky tu, du chu hoa/thuong/so/ky tu dac biet | CV3 | Rong | CX5 |
| New password |  |  | Nho hon 8 ky tu | CX6 |
| New password |  |  | Lon hon 64 ky tu | CX7 |
| New password |  |  | Thieu chu hoa/thuong/so/ky tu dac biet | CX8 |
| New password |  |  | Trung old password | CX9 |
| Confirm password | Khop new password | CV4 | Rong hoac khong khop | CX10 |

---

## Cau 2. Phan tich gia tri bien

### 2.1 Login boundary values

| Bien dau vao | min | min+ | nominal | max- | max | Ngoai bien | Tag bien |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Username length | 3 | 4 | 6 | 49 | 50 | 1, 2, 51 | LB1-LB7 |
| Password length | 8 | 9 | 10-16 | 63 | 64 | 0, 7, rat dai | LB8-LB13 |

### 2.2 Register boundary values

| Bien dau vao | min | min+ | nominal | max- | max | Ngoai bien | Tag bien |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Username length | 3 | 4 | 8 | 49 | 50 | 2, 51 | RB1-RB7 |
| Password length | 8 | 9 | 10-16 | 63 | 64 | 0, 7, 65+ | RB8-RB14 |
| Password complexity | Du 4 nhom |  | Password manh |  | Du 4 nhom | thieu hoa/thuong/so/ky tu dac biet | RB15-RB18 |
| Email format | Valid email |  | Normal email |  | Valid email | empty, invalidgmail, duplicate | RB19-RB23 |

### 2.3 Change Password boundary values

| Bien dau vao | min | min+ | nominal | max- | max | Ngoai bien | Tag bien |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| New password length | 8 | 9 | 10-16 | 63 | 64 | 0, 7, 65+ | CB1-CB7 |
| New password complexity | Du 4 nhom |  | Password manh |  | Du 4 nhom | thieu hoa/thuong/so/ky tu dac biet | CB8-CB11 |
| Confirm password | Khop |  | Khop |  | Khop | rong, khong khop | CB12-CB13 |

Ghi chu:

- Username co rule ro: 3-50 ky tu.
- Password trong bo test muc tieu co rule ro: 8-64 ky tu va du 4 nhom ky tu.
- Email khong phai bien numeric, nen ap dung equivalence partitioning va decision table thay vi BVA so hoc.

---

## Cau 3. Thiet ke test case

### 3.1 Login test cases

| STT | Test ID | Ten test case | Username | Password | Expected status | Ket qua mong doi | Tag | Priority | Status |
| ---: | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | L-001 | Login thanh cong | `hai123` | `hai123` | 200 | Dang nhap thanh cong, co token/session | LV1,LV2,LV3 | High | Ready |
| 2 | L-002 | Username/password rong | `""` | `""` | 400 | Bao loi validation | LX1,LX5 | High | Ready |
| 3 | L-003 | Password rong | `hai123` | `""` | 400 | Bao loi password | LX5 | High | Ready |
| 4 | L-004 | Username rong | `""` | `hai123` | 400 | Bao loi username | LX1 | High | Ready |
| 5 | L-013 | User khong ton tai | `usernotexist999` | `123456` | 400 | Invalid username/password | LX2,LX8 | High | Ready |
| 6 | L-014 | Password sai | `hai123` | `wrongpass123` | 400 | Invalid username/password | LX6 | High | Ready |
| 7 | L-006 | Username qua ngan | `ab` | `123456` | 400 | Khong dang nhap | LX3,LB1 | Medium | Ready |
| 8 | L-008 | Username qua dai | 51 ky tu | `hai123` | 400 | Khong dang nhap, khong crash | LX3,LB7 | Medium | Ready |
| 9 | L-010 | Password qua ngan | `hai123` | `12345` | 400 | Invalid username/password | LX7,LB12 | Medium | Ready |
| 10 | L-019 | Username co khoang trang ben trong | `hai 123` | `123456` | 400 | Username sai pattern | LX4 | High | Ready |

### 3.2 Register test cases

| STT | Test ID | Ten test case | Username | Email | Password | Full name | Expected status | Ket qua mong doi | Tag | Priority | Status |
| ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | R-001 | Register thanh cong | `r001_user` | `r001_success@gmail.com` | `Password@1` | `New User` | 200 | Tao user thanh cong, tra token | RV1,RV2,RV3,RV4 | High | Ready |
| 2 | R-002 | Username rong | `""` | hop le | `Password@1` | hop le | 400 | Bao loi username | RX1 | High | Ready |
| 3 | R-003 | Email rong | hop le | `""` | `Password@1` | hop le | 400 | Bao loi email | RX6 | High | Ready |
| 4 | R-004 | Password rong | hop le | hop le | `""` | hop le | 400 | Bao loi password | RX10 | High | Ready |
| 5 | R-006 | Username qua ngan | `ab` | hop le | `Password@1` | hop le | 400 | Username duoi bien | RX2,RB1 | Medium | Ready |
| 6 | R-007 | Username dat min | `u07` | hop le | `Password@1` | hop le | 200 | Dang ky thanh cong | RV1,RB2 | Medium | Ready |
| 7 | R-008 | Username qua dai | 51 ky tu | hop le | `Password@1` | hop le | 400 | Username vuot max | RX3,RB7 | Medium | Ready |
| 8 | R-009 | Username dat max | 50 ky tu | hop le | `Password@1` | hop le | 200 | Dang ky thanh cong | RV1,RB6 | Medium | Ready |
| 9 | R-010 | Email sai format | hop le | `invalidgmail` | `Password@1` | hop le | 400 | Bao loi email | RX7,RB19 | Medium | Ready |
| 10 | R-012 | Username da ton tai | `hai123` | hop le | `Password@1` | hop le | 400 | Bao loi trung username | RX4 | High | Ready |
| 11 | R-013 | Email da ton tai | hop le | email da ton tai | `Password@1` | hop le | 400 | Bao loi trung email | RX8 | High | Ready |
| 12 | R-014 | Password qua ngan | hop le | hop le | `Pass@1` | hop le | 400 | Password duoi 8 ky tu | RX11,RB8 | High | Ready |
| 13 | R-015 | Password dat min | hop le | hop le | `Pass@123` | hop le | 200 | Dang ky thanh cong | RV3,RB9 | High | Ready |
| 14 | R-016 | Password qua dai | hop le | hop le | >64 ky tu | hop le | 400 | Password vuot max | RX12,RB14 | High | Ready |
| 15 | R-020 | Password thieu chu hoa | hop le | hop le | `password@1` | hop le | 400 | Password yeu | RX13,RB15 | High | Ready |
| 16 | R-021 | Password thieu chu thuong | hop le | hop le | `PASSWORD@1` | hop le | 400 | Password yeu | RX13,RB16 | High | Ready |
| 17 | R-022 | Password thieu chu so | hop le | hop le | `Password@` | hop le | 400 | Password yeu | RX13,RB17 | High | Ready |
| 18 | R-023 | Password thieu ky tu dac biet | hop le | hop le | `Password1` | hop le | 400 | Password yeu | RX13,RB18 | High | Ready |

### 3.3 Change Password test cases

| STT | Test ID | Ten test case | Old password | New password | Confirm password | Expected status | Ket qua mong doi | Tag | Priority | Status |
| ---: | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | C-001 | Doi mat khau thanh cong | dung | `Password@1` | `Password@1` | 200 | Doi mat khau thanh cong | CV1,CV2,CV3,CV4 | High | Ready |
| 2 | C-002 | Old password rong | `""` | hop le | hop le | 400 | Bao loi old password | CX2 | High | Ready |
| 3 | C-003 | New password rong | dung | `""` | `""` | 400 | Bao loi new password | CX5 | High | Ready |
| 4 | C-004 | Confirm password rong | dung | hop le | `""` | 400 | Bao loi confirm password | CX10 | High | Ready |
| 5 | C-005 | Old password sai | sai | hop le | hop le | 400 | Bao loi old password sai | CX3 | High | Ready |
| 6 | C-006 | New password qua ngan | dung | `Pass@1` | `Pass@1` | 400 | Password duoi 8 ky tu | CX6,CB1 | High | Ready |
| 7 | C-007 | New password dat min | dung | `Pass@123` | `Pass@123` | 200 | Doi mat khau thanh cong | CV3,CB2 | High | Ready |
| 8 | C-008 | New password qua dai | dung | >64 ky tu | >64 ky tu | 400 | Password vuot max | CX7,CB7 | High | Ready |
| 9 | C-009 | Confirm khong khop | dung | `Password@1` | `Password@2` | 400 | Bao loi confirm mismatch | CX10,CB13 | High | Ready |
| 10 | C-010 | New password trung old password | dung | trung old | trung old | 400 | Khong cho trung mat khau cu | CX9 | Medium | Ready |
| 11 | C-011 | Old password co khoang trang | ` hai123 ` | hop le | hop le | 400 | Khong trim de bypass | CX4 | Medium | Ready |
| 12 | C-012 | New password co khoang trang | dung | ` Password@1 ` | ` Password@1 ` | 400 | Bao loi validation | CX8 | Medium | Ready |
| 13 | C-013 | New password thieu chu hoa | dung | `password@1` | `password@1` | 400 | Password yeu | CX8,CB8 | High | Ready |
| 14 | C-014 | New password thieu chu thuong | dung | `PASSWORD@1` | `PASSWORD@1` | 400 | Password yeu | CX8,CB9 | High | Ready |
| 15 | C-015 | New password thieu chu so | dung | `Password@` | `Password@` | 400 | Password yeu | CX8,CB10 | High | Ready |
| 16 | C-016 | New password thieu ky tu dac biet | dung | `Password1` | `Password1` | 400 | Password yeu | CX8,CB11 | High | Ready |

---

## Cau 4. Trien khai kiem thu tu dong

### 4.1 API data-driven test bang Postman/Newman

File test script:

```text
automation/postman/VGA-AUTH-USER/VGA-Store-Auth/VGA Store Auth.postman_collection.json
```

File test data:

```text
automation/postman/VGA-AUTH-USER/VGA-Store-Auth/VGA-Store-Auth-Testcase.csv
```

File environment:

```text
automation/postman/env/VGA_Store_Environment.postman_environment.json
```

Lenh chay:

```bash
cd automation
npm run test:auth:blackbox
```

Y nghia:

- Collection dong vai tro test script.
- CSV dong vai tro test data.
- Newman doc tung dong CSV va chay request theo `testType`.
- Day la data-driven black-box test.

### 4.2 CI/CD bang GitHub Actions

File workflow:

```text
.github/workflows/ci.yml
```

Khi push commit co ma Jira, vi du:

```bash
git commit -m "KCPM-10 fix login"
git push
```

Workflow se:

1. Build Docker.
2. Cho backend san sang.
3. Chay Newman/Postman API test.
4. Chay CodeceptJS UI test neu cau hinh.
5. Neu fail, tao hoac cap nhat Bug/Sub-task CI duoi task Jira cha.

---

# PHAN B. LIEN KET LY THUYET VOI TRIEN KHAI

## 1. Mapping ky thuat voi file trien khai

| Ly thuyet | Trien khai trong du an |
| --- | --- |
| Equivalence Partitioning | Cac dong hop le/khong hop le trong CSV |
| Boundary Value Analysis | Cac dong username/password min, max, ngoai bien trong CSV |
| Decision Table | Postman assertion cho to hop input/result |
| State Transition | UI test login/register neu chay CodeceptJS |
| Test Procedure | `docs/testing/auth_test_procedures_scripts.md` |
| Test Script | Postman collection va CodeceptJS files |
| CI/CD | `.github/workflows/ci.yml` |

## 2. Mapping tu report sang CSV

Moi dong trong CSV tuong ung voi mot test case API:

| Cot trong report | Cot trong CSV | Ghi chu |
| --- | --- | --- |
| Test ID | `testId` | Vi du `L-001`, `R-001`, `C-001` |
| Loai chuc nang | `testType` | `LOGIN`, `REGISTER`, `CHANGE_PWD` |
| Username | `username` | Dung cho Login/Register |
| Email | `email` | Dung cho Register |
| Password | `password` | Dung cho Login/Register |
| Full name | `fullName` | Dung cho Register |
| Old password | `oldPassword` | Dung cho Change Password |
| New password | `newPassword` | Dung cho Change Password |
| Confirm password | `confirmPassword` | Dung cho Change Password |
| Expected status | `expectedStatus` | HTTP status ky vong |
| Ket qua mong doi | `ExpectedResult` | Mo ta expected outcome |
| Expected message/token | `expectedMessage` | Chuoi Postman dung de assert response |

Vi du:

```text
Report:
R-001 | REGISTER | username=r001_user | password=Password@1 | expectedStatus=200 | expectedMessage=token

CSV:
"R-001","REGISTER","r001_user","r001_success@gmail.com","Password@1","New User",,,,"Valid register succeeds with strong password and returns token","200","token"
```

Tag coverage nhu `LV1`, `RX13`, `CB11` nam trong report de giai thich do bao phu. Neu muon Newman bao cao tag truc tiep, co the them cot `tags` vao CSV sau.

## 3. Moi function/API mot file report

Theo yeu cau black-box, moi function/API co mot file report rieng:

| Function/API | File report |
| --- | --- |
| Login | `docs/testing/blackbox_auth/Auth_login_blackbox_report.md` |
| Register | `docs/testing/blackbox_auth/Auth_register_blackbox_report.md` |
| Change Password | `docs/testing/blackbox_auth/Auth_changePassword_blackbox_report.md` |

File `auth_blackbox_assignment_report.md` la file tong hop de nop/bao cao theo format assignment.

## 4. Giai thich ve tag

Trong bang lop tuong duong co 2 cot tag vi co 2 loai lop:

- Tag cho lop hop le, vi du `LV1`, `RV1`, `CV1`.
- Tag cho lop khong hop le, vi du `LX1`, `RX1`, `CX1`.

Muc dich cua tag la trace coverage: biet test case nao da bao phu lop nao.

Vi du:

| Tag | Y nghia | Test case |
| --- | --- | --- |
| `LV1` | Username login hop le | L-001 |
| `LX1` | Username login rong | L-004 |
| `RV3` | Password register hop le | R-001, R-015 |
| `RX13` | Password register thieu nhom ky tu | R-020 den R-023 |
| `CV3` | New password hop le | C-001, C-007 |
| `CX8` | New password khong dat complexity | C-013 den C-016 |

## 5. Cac file test can dua len GitHub

Neu chi xet Auth black-box va CI/CD, can dua len GitHub cac file chinh:

| Nhom | File | Bat buoc |
| --- | --- | --- |
| GitHub Actions | `.github/workflows/ci.yml` | Co |
| Newman script | `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/VGA Store Auth.postman_collection.json` | Co |
| Test data | `automation/postman/VGA-AUTH-USER/VGA-Store-Auth/VGA-Store-Auth-Testcase.csv` | Co |
| Postman environment | `automation/postman/env/VGA_Store_Environment.postman_environment.json` | Co |
| Node automation config | `automation/package.json` | Co |
| Dependency lock | `automation/package-lock.json` | Co |

Neu nop bao cao kem tai lieu thiet ke, them:

| File bao cao | Muc dich |
| --- | --- |
| `docs/testing/blackbox_auth/auth_blackbox_assignment_report.md` | Bao cao tong hop theo format assignment |
| `docs/testing/blackbox_auth/Auth_login_blackbox_report.md` | Report Login theo API |
| `docs/testing/blackbox_auth/Auth_register_blackbox_report.md` | Report Register theo API |
| `docs/testing/blackbox_auth/Auth_changePassword_blackbox_report.md` | Report Change Password theo API |
| `docs/testing/blackbox_auth/auth_target_quality_requirements.md` | Chuan Auth muc tieu |

## 6. Luu y ve GitHub Secrets

Secrets khong phai file nen khong commit len GitHub. Can tao trong GitHub repository:

```text
JIRA_BASE_URL
JIRA_EMAIL
JIRA_API_TOKEN
JIRA_PROJECT_KEY
```

Tuy chon:

```text
JIRA_FAILURE_ISSUE_TYPE
JIRA_DEFAULT_PRIORITY
```

---

# PHAN C. KET LUAN

Module Auth da duoc thiet ke kiem thu theo black-box testing cho 3 function/API:

1. Login: 19 test case trong CSV.
2. Register: 23 test case trong CSV.
3. Change Password: 16 test case trong CSV.

Bao cao da lien ket ly thuyet voi trien khai:

- Co lop tuong duong.
- Co phan tich gia tri bien.
- Co test case, expected result, priority va status.
- Co mapping sang CSV data-driven test.
- Co workflow GitHub Actions de chay CI/CD va log loi len Jira.

Voi quy trinh nay, black-box testing khong chi nam o muc ly thuyet ma duoc chuyen thanh automation test co the chay moi khi push code.
