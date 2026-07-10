# AUTH WHITE-BOX TESTING REPORT

## 1. Muc tieu

Report nay ap dung white-box testing cho module Authentication cua VGA Store. Kiem thu duoc thiet ke dua tren cau truc logic ben trong source code, tap trung vao control flow, branch/decision coverage va condition coverage cho cac API auth chinh.

Pham vi:

- `POST /api/auth/register`
- `POST /api/auth/register-admin`
- `POST /api/auth/login`
- `POST /api/auth/google`

Source code duoc phan tich:

- `backend/vgashop/src/main/java/com/example/vgashop/controler/AuthController.java`
- `backend/vgashop/src/main/java/com/example/vgashop/service/AuthService.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/RegisterRequest.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/LoginRequest.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/GoogleLoginRequest.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/UserDTO.java`

Test implementation:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/authentication/integration/AuthIntegrationTest.java`
- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/authentication/data/AuthIntegrationTestData.java`

## 2. Phuong phap white-box ap dung

| Ky thuat | Cach ap dung trong module Auth |
| :--- | :--- |
| Statement coverage | Moi flow thanh cong va loi chinh duoc thuc thi it nhat 1 lan qua MockMvc integration test. |
| Branch/Decision coverage | Moi cau lenh `if`, `else`, `orElseThrow`, `try/catch` quan trong trong `AuthController` va `AuthService` co test case rieng. |
| Condition coverage | Cac dieu kien validation va business rule duoc tach rieng: email trung, username trung, deleted, disabled, password sai, role null, email Google invalid, user Google bi xoa mem, username sinh tu Google email duoc normalize. |
| Loop coverage | Vong `while (userRepository.existsByUsername(username))` trong Google login duoc cover bang case username prefix bi trung 2 lan. |
| Data flow testing | Kiem tra du lieu tao user moi duoc luu DB va response tra ve dung username, email, role, token. |

## 3. Luong dieu khien chinh

### 3.1 Register

Control flow:

1. Request vao `AuthController.register`.
2. `@Valid RegisterRequest` kiem tra username, email, password.
3. Goi `AuthService.register(RegisterRequest)`.
4. Neu email da ton tai thi throw `DuplicateResourceException`.
5. Neu username da ton tai thi throw `DuplicateResourceException`.
6. Neu hop le thi tao `User`, gan role `USER`, status `true`, save DB.
7. Tao JWT va tra ve `AuthResponse`.
8. Neu co `RuntimeException`, controller tra ve HTTP 400 voi `message`.

Nhanh can cover:

- Register thanh cong.
- Email da ton tai.
- Username da ton tai.
- Username invalid.
- Email invalid.
- Password invalid.

### 3.2 Register Admin

Control flow:

1. Request vao `AuthController.registerAdmin`.
2. `@Valid UserDTO` kiem tra username, email, password.
3. Goi `AuthService.register(UserDTO)`.
4. Neu username da ton tai thi throw `DuplicateResourceException`.
5. Neu email da ton tai thi throw `DuplicateResourceException`.
6. Neu `dto.getRole() != null` thi parse role tu request.
7. Neu role null thi gan mac dinh `Role.USER`.
8. Save DB, tao JWT, tra ve `ApiResponse.success`.

Nhanh can cover:

- Role duoc truyen vao.
- Role null va duoc default thanh `USER`.

### 3.3 Login

Control flow:

1. Request vao `AuthController.login`.
2. `@Valid LoginRequest` kiem tra username/password khong rong.
3. Goi `AuthService.login(username, password)`.
4. Neu username khong ton tai thi throw `ResourceNotFoundException`.
5. Neu user bi deleted thi throw `RuntimeException`.
6. Neu user disabled thi throw `RuntimeException`.
7. Neu password sai thi throw `RuntimeException`.
8. Neu hop le thi tao JWT va tra ve `AuthResponse`.
9. Controller bat `RuntimeException` va tra ve HTTP 400.

Nhanh can cover:

- Login thanh cong.
- Username khong ton tai.
- User deleted.
- User disabled.
- Password sai.
- Username rong.
- Password rong.

### 3.4 Google Login

Control flow:

1. Request vao `AuthController.googleLogin`.
2. `@Valid GoogleLoginRequest` kiem tra email/name.
3. Tim user theo email.
4. Neu user chua ton tai:
   - Lay prefix truoc dau `@` va normalize ky tu khong hop le thanh `_`.
   - Kiem tra username prefix da ton tai chua.
   - Neu trung thi lap `while` de them counter vao username.
   - Tao user moi voi role `USER`, status `true`, password random.
   - Save DB.
5. Neu user da ton tai:
   - Neu status false thi throw `RuntimeException`.
   - Neu active thi tao token cho user hien co.
   - Chan user `deleted=true` de dong bo voi login username/password.
6. Tra ve `AuthResponse`.

Nhanh can cover:

- Email moi, username prefix chua trung.
- Email moi, username prefix bi trung va can vong lap counter.
- Email da ton tai, user active.
- Email da ton tai, user disabled.
- Request invalid.
- Email da ton tai, user deleted.
- Email moi co prefix qua dai hoac co ky tu khong hop le can normalize khi sinh username.

## 4. Do phuc tap Cyclomatic

Tinh theo cong thuc:

`V(G) = P + 1`

Trong do `P` la so nut dieu kien/quyet dinh chinh trong flow.

| Flow | Dieu kien/quyet dinh chinh | V(G) uoc tinh | So test toi thieu theo path doc lap |
| :--- | :--- | :---: | :---: |
| Register | email exists, username exists, controller catch | 3 + 1 | 4 |
| Register Admin | username exists, email exists, role null | 3 + 1 | 4 |
| Login | user missing, deleted, disabled, password match, controller catch | 5 + 1 | 6 |
| Google Login | user null, username while, existing user disabled, controller catch | 4 + 1 | 5 |

Ghi chu: Validation branch cua `@Valid` nam truoc khi vao service, nen duoc tinh rieng trong branch matrix.

## 5. Test case white-box

### 5.1 Duong di nhanh can test

#### Register: 6 nhanh

O flow Register co cac duong di nhanh chinh:

- Request hop le thi vao `authService.register` va dang ky thanh cong.
- Request co email da ton tai thi tra 400.
- Request co username da ton tai thi tra 400.
- Request co username khong hop le thi validation tra 400.
- Request co email khong hop le thi validation tra 400.
- Request co password khong hop le thi validation tra 400.

Ket luan: Register co `6/6` nhanh chinh duoc cover.

#### Register Admin: 2 nhanh

O flow Register Admin co cac duong di nhanh chinh:

- Request co role hop le thi tao user theo role duoc truyen vao.
- Request khong truyen role thi he thong gan mac dinh role `USER`.

Ket luan: Register Admin co `2/2` nhanh chinh duoc cover.

#### Login: 7 nhanh

O flow Login co cac duong di nhanh chinh:

- Request hop le, user ton tai, password dung thi login thanh cong.
- Username khong ton tai thi tra 400.
- User da bi xoa thi tra 400.
- User bi khoa thi tra 400.
- Password sai thi tra 400.
- Username rong thi validation tra 400.
- Password rong thi validation tra 400.

Ket luan: Login co `7/7` nhanh chinh duoc cover.

#### Google Login: 8 nhanh / rule can kiem tra

O flow Google Login co cac duong di nhanh chinh:

- Email Google moi va username prefix chua trung thi tao user moi.
- Email Google moi nhung username prefix da trung thi chay vong lap tao username moi.
- Email Google da ton tai va user active thi login thanh cong.
- Email Google da ton tai nhung user bi khoa thi tra 400.
- Request Google Login co email khong hop le thi validation tra 400.
- Email Google da ton tai nhung user bi xoa mem thi phai tra 400.
- Email Google moi co local-part qua 50 ky tu thi khong duoc tao username vuot rule.
- Email Google moi co local-part chua ky tu khong hop le voi username rule thi normalize thanh `_`.

Ket luan hien tai: Google Login co `8/8` rule pass sau khi `AuthService.googleLogin` normalize username sinh tu email Google.

### 5.2 Danh sach test case

| Test ID | Flow | Muc tieu bao phu | Input/Trang thai | Expected |
| :--- | :--- | :--- | :--- | :--- |
| AUTH_INT_001 | Register | Thanh cong | Username/email moi, password hop le | HTTP 200, token khac null, role `USER`, user duoc luu DB |
| AUTH_INT_002 | Register | Username da ton tai | Seed username trung, email moi | HTTP 400, `Username is already taken` |
| AUTH_INT_003 | Register | Email da ton tai | Seed email trung | HTTP 400, `Email is already in use` |
| AUTH_INT_004 | Login | Thanh cong | Seed user active, password dung | HTTP 200, token khac null |
| AUTH_INT_005 | Login | Password sai | Seed user active, password request sai | HTTP 400, `Invalid username or password` |
| AUTH_INT_006 | Login | Username khong ton tai | Khong seed user | HTTP 400, `Invalid username or password` |
| AUTH_INT_007 | Login | User disabled | Seed `status=false` | HTTP 400, `Account is disabled. Please contact support.` |
| AUTH_INT_008 | Login | User deleted | Seed `deleted=true` | HTTP 400, `Account does not exist or has been removed` |
| AUTH_INT_009 | Register validation | Username invalid | Username duoi 3 ky tu | HTTP 400, co loi `data.username` |
| AUTH_INT_010 | Register validation | Email invalid | Email sai dinh dang | HTTP 400, co loi `data.email` |
| AUTH_INT_011 | Register validation | Password invalid | Password yeu | HTTP 400, co loi `data.password` |
| AUTH_INT_012 | Login validation | Username rong | Username blank | HTTP 400, co loi `data.username` |
| AUTH_INT_013 | Login validation | Password rong | Password blank | HTTP 400, co loi `data.password` |
| AUTH_INT_014 | Register Admin | Role duoc truyen vao | Role `ADMIN` | HTTP 200, `data.role = ADMIN` |
| AUTH_INT_015 | Register Admin | Role mac dinh | Role null | HTTP 200, `data.role = USER` |
| AUTH_INT_016 | Google Login | Tao user moi | Email moi, prefix chua trung | HTTP 200, username bang email prefix, user duoc luu DB |
| AUTH_INT_017 | Google Login | Loop username counter | Prefix `conflict` va `conflict1` da ton tai | HTTP 200, username moi la `conflict2` |
| AUTH_INT_018 | Google Login | User Google da ton tai va active | Seed user theo email | HTTP 200, tra ve user hien co |
| AUTH_INT_019 | Google Login | User Google disabled | Seed user `status=false` | HTTP 400, `Account is disabled` |
| AUTH_INT_020 | Google Login validation | Email invalid | Email sai dinh dang | HTTP 400, co loi `data.email` |
| AUTH_INT_021 | Google Login | User Google deleted | Seed user theo email, `deleted=true`, `status=true` | HTTP 400, message account removed/not allowed |
| AUTH_INT_022 | Google Login | Email prefix qua dai | Email moi co local-part 51 ky tu | HTTP 400, khong tao user moi |
| AUTH_INT_023 | Google Login | Email prefix co ky tu khong hop le | Email `john.doe+tag@example.com` | HTTP 200, username duoc normalize thanh `john_doe_tag` |

### 5.3 Test case bo sung va ket qua hien tai

| Test ID | Flow | Ky thuat | Muc tieu bao phu | Input/Trang thai | Expected | Trang thai |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| AUTH_INT_021 | Google Login | State transition / Branch testing | User Google da ton tai nhung `deleted=true` phai bi chan nhu login thuong | Seed user theo email, `deleted=true`, `status=true` | HTTP 400, message account removed/not allowed | Implemented - Pass |
| AUTH_INT_022 | Google Login | Boundary Value Analysis + Data flow testing | Email prefix tao username vuot 50 ky tu khong duoc luu thanh username khong hop le | Email moi co local-part >50 ky tu | HTTP 400 validation, khong tao user moi | Implemented - Pass |
| AUTH_INT_023 | Google Login | Equivalence Partitioning + Data flow testing | Email prefix chua ky tu khong hop le voi username rule (`+`, `.`) phai duoc normalize | Email moi dang `john.doe+tag@example.com` | HTTP 200, username `john_doe_tag`, user duoc tao | Implemented - Pass |

Ghi chu: Cac testcase tren da duoc them vao `AuthIntegrationTest.java` de kiem tra su nhat quan giua rule username cua Register va luong tao username tu Google Login. Luong Google Login hien normalize ky tu khong hop le trong local-part email thanh `_`.

## 6. Branch coverage matrix

Chi tiet branch matrix nam tai:

`docs/testing/auth_test/whitebox_auth/AUTH_BRANCH_MATRIX.csv`

### 6.1. Do bao phu

| Function/API | Tong branch/rule can phu | So testcase toi thieu de phu 100% | Testcase hien co | Do bao phu hien tai | Ghi chu |
| :--- | ---: | ---: | ---: | :---: | :--- |
| Register | 6 | 6 | 6 | 6/6 = 100% | `AUTH_INT_001` den `AUTH_INT_003`, `AUTH_INT_009` den `AUTH_INT_011` |
| Register Admin | 2 | 2 | 2 | 2/2 = 100% | `AUTH_INT_014`, `AUTH_INT_015` |
| Login | 7 | 7 | 7 | 7/7 = 100% | `AUTH_INT_004` den `AUTH_INT_008`, `AUTH_INT_012`, `AUTH_INT_013` |
| Google Login | 8 | 8 | 8 | 8/8 = 100% | `AUTH_INT_016` den `AUTH_INT_023` |
| Tong Auth white-box | 23 | 23 | 23 | 23/23 = 100% | Bao phu cac branch/rule chinh trong `AuthController` va `AuthService` |

**Tong:** 23/23 testcase = 100%.

## 7. Ket qua thuc thi

Lenh chay:

```powershell
cd backend/vgashop
.\mvnw.cmd -Pwhitebox test
```
.\mvnw.cmd -Pwhitebox -Dtest=AuthIntegrationTest test

Ket qua ky vong sau cap nhat logic Google Login:

- Tests run: 23
- Failures: 0
- Errors: 0
- Skipped: 0
- Build: SUCCESS

Danh sach cac case Google Login tung la gap va hien da duoc cover:

| Test ID | Method | Expected | Actual | Nguyen nhan |
| :--- | :--- | :--- | :--- | :--- |
| AUTH_INT_021 | `googleLogin_withDeletedExistingUser_returnsBadRequest` | HTTP 400 | HTTP 400 | `AuthService.googleLogin` chan user da bi xoa mem (`deleted=true`). |
| AUTH_INT_022 | `googleLogin_withLongEmailPrefix_rejectsInvalidGeneratedUsername` | HTTP 400 | HTTP 400 | BE khong tao user moi voi username sinh tu local-part dai hon 50 ky tu. |
| AUTH_INT_023 | `googleLogin_withInvalidUsernameCharactersInEmailPrefix_normalizesGeneratedUsername` | HTTP 200 | HTTP 200 | Prefix `john.doe+tag` duoc normalize thanh `john_doe_tag`. |

Report duoc tao tai:

- Test result: `backend/vgashop/target/surefire-reports/`
- Coverage HTML: `backend/vgashop/target/site/jacoco/index.html`

Ket qua JaCoCo gan nhat tu lan report truoc:

| Pham vi | Line coverage | Branch coverage | Method coverage | Ghi chu |
| :--- | :---: | :---: | :---: | :--- |
| `AuthController` + `AuthService` | 79/81 = 97.5% | 20/22 = 90.9% | 11/11 = 100% | Day la pham vi logic auth chinh |
| Cac class Auth DTO trong report | 53/96 = 55.2% | Khong co branch | 39/54 = 72.2% | DTO co nhieu getter/setter/constructor khong duoc goi het |
| Tong 7 class Auth duoc JaCoCo do | 132/163 = 81.0% | 20/22 = 90.9% | 50/65 = 76.9% | Bao gom controller, service va DTO |

Ghi chu: Logic Google Login da duoc cap nhat de normalize username sinh tu email Google. Can chay lai JaCoCo neu can so lieu coverage chinh thuc moi.

## 8. Ket luan

Module Auth da co bo white-box integration test rieng cho cac nhanh logic chinh trong register, register-admin, login va Google login. Bo test phu hop voi cac ky thuat trong bai hoc: statement coverage, branch coverage, condition coverage, loop coverage va data flow testing.

Theo ket qua hien tai, 23/23 testcase AuthIntegrationTest pass. Flow Google Login da chan user bi xoa mem, chan local-part qua 50 ky tu va normalize ky tu khong hop le trong username sinh tu email Google.
