# USER PROFILE TESTING OVERVIEW REPORT

**Du an:** VGA Store  
**Module:** User Profile  
**Pham vi tong quan:** Ho so ca nhan, so dia chi, doi mat khau, xac thuc truy cap va dang xuat  
**Nguoi thuc hien:** Tu Minh Von  
**Ngay tong hop:** 03/07/2026  

## 1. Muc tieu

Bao cao nay tong hop toan bo phan kiem thu da thuc hien cho module User Profile. Muc tieu la gom cac tai lieu rieng le ve black-box API, black-box UI va white-box backend thanh mot bao cao tong quan de de theo doi trong sprint, CI/CD va Jira.

Module User Profile duoc kiem thu theo 3 goc nhin:

- API behavior: kiem tra request/response cua cac API user bang Postman/Newman.
- UI behavior: kiem tra hanh vi nguoi dung tren trang profile bang CodeceptJS/Playwright.
- Backend logic: kiem tra nhanh logic noi bo cua controller/service/security bang JUnit, MockMvc va H2.

## 2. Pham vi chuc nang

| Nhom chuc nang | Noi dung kiem thu | Endpoint/Man hinh |
| --- | --- | --- |
| View Profile | User da dang nhap xem thong tin ca nhan, user chua dang nhap hoac token sai bi chan | `GET /api/users/profile`, `/profile` |
| Update Profile | Cap nhat ho ten/thong tin ca nhan, phone, gender, dob | `PUT /api/users/profile`, tab Ho so ca nhan |
| Add Address | Them dia chi giao hang, dia chi dau tien/default, chan truy cap neu khong co token | `POST /api/users/addresses`, tab So dia chi |
| Change Password | Doi mat khau thanh cong, old password sai, new password yeu, confirm mismatch, token sai/thieu | `PUT /api/users/change-password`, tab Doi mat khau |
| Session/Access | Dang xuat, protected route, token invalid | Header/sidebar/profile route |

## 3. Cau truc tai lieu va automation

| Hang muc | Duong dan |
| --- | --- |
| README module | `docs/testing/user_profile_test/README.md` |
| Tong hop black-box API | `docs/testing/user_profile_test/blackbox_user/postman/user_blackbox_assignment_report.md` |
| Report View Profile API | `docs/testing/user_profile_test/blackbox_user/postman/User_profile_blackbox_report.md` |
| Report Add Address API | `docs/testing/user_profile_test/blackbox_user/postman/User_address_blackbox_report.md` |
| Report Change Password API | `docs/testing/user_profile_test/blackbox_user/postman/User_changePassword_blackbox_report.md` |
| Target quality | `docs/testing/user_profile_test/blackbox_user/postman/user_target_quality_requirements.md` |
| Report UI black-box | `docs/testing/user_profile_test/blackbox_user/ui/ui_user_profile_report.md` |
| Report white-box | `docs/testing/user_profile_test/whitebox_user/User_profile_whitebox_report.md` |
| Branch matrix white-box | `docs/testing/user_profile_test/whitebox_user/USER_PROFILE_BRANCH_MATRIX.csv` |
| Postman collection | `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA Store User Blackbox.postman_collection.json` |
| Postman CSV data | `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv` |
| UI automation | `automation/E2E/modules/7_User_Profile/user_profile_test.js` |
| White-box test | `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/user_profile/integration/UserProfileIntegrationTest.java` |

## 4. Black-box API/Postman

Black-box API tap trung vao hanh vi input/output, khong phu thuoc code noi bo. Bo test dung Postman collection ket hop CSV data-driven de chay lap lai trong CI.

Ky thuat da ap dung:

- Equivalence Partitioning: tach lop hop le/khong hop le theo token, input address va password.
- Boundary Value Analysis: kiem tra bien do dai password, address va trang thai authorization.
- Decision Table Testing: ket hop old password, new password, confirm password va token.
- State/Authentication Transition Testing: valid token, missing token, invalid token.

Tong so testcase API black-box hien co: **27**.

| Nhom API | Test IDs | So luong | Noi dung chinh |
| --- | --- | ---: | --- |
| View Profile | UP-001 den UP-003 | 3 | Token hop le, thieu token, token sai |
| Add Address | UA-001 den UA-006 | 6 | Them dia chi hop le, default/non-default, address bien, token sai/thieu |
| Change Password | CP-001 den CP-018 | 18 | Thanh cong, old sai/rong, new yeu/rong/qua dai/thieu complexity, confirm mismatch, token sai/thieu |

Lenh chay:

```bash
cd automation
npm run test:user:blackbox
```

Output report:

```text
automation/reports/user-blackbox-newman.json
```

## 5. UI black-box/E2E

UI black-box tap trung vao hanh vi nguoi dung that tren trang profile. Test khong can biet logic backend, chi thao tac tren giao dien va quan sat ket qua sau submit/action.

Pham vi thiet ke testcase UI:

| Nhom UI | So testcase thiet ke | Muc tieu |
| --- | ---: | --- |
| Profile | 6 | Cap nhat profile, email readonly, validate ho ten/phone/gender |
| Address Book | 6 | Mo/huy form, them dia chi, validate recipient/phone/address |
| Change Password | 6 | Confirm mismatch, rong field, old sai, new trung old, new qua ngan, doi thanh cong va revert |
| Logout/Protected Route | 3 | Dang xuat, chua login vao profile, token sai trong localStorage |
| UX Enhancement | 4 | Loi gan field, loading submit, giu du lieu sau fail, message de hieu |

Automation hien co nam tai:

```text
automation/E2E/modules/7_User_Profile/user_profile_test.js
```

Test script tao user rieng theo `runId`, dang nhap qua UI, vao `/profile`, sau do chay cac scenario chinh:

- Cap nhat profile.
- Kiem tra email lien ket.
- Negative case cho fullname/phone.
- Them dia chi va negative case address.
- Doi mat khau negative/positive va revert.
- Dang xuat.

Lenh chay truc tiep:

```bash
cd automation
npx codeceptjs run "E2E/modules/7_User_Profile/user_profile_test.js" --steps
```

Branch CI FE lien quan:

```text
fe/KCPM-116-profile
```

## 6. Backend white-box/JUnit

White-box backend kiem tra logic noi bo cua module User Profile dua tren control flow, branch/decision coverage, condition coverage, data flow testing va security path coverage.

Pham vi API white-box:

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/addresses`
- `PUT /api/users/change-password`

Source code duoc phan tich:

- `UserController`
- `UserService`
- `UserProfileRequest`
- `UserAddressDto`
- `ChangePasswordRequest`
- `JwtAuthFilter`
- `SecurityConfig`

Test implementation:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/user_profile/integration/UserProfileIntegrationTest.java
```

Test su dung:

- `@SpringBootTest`
- `@AutoConfigureMockMvc`
- H2 in-memory database
- JWT token test
- `UserRepository`
- `BCryptPasswordEncoder`

Danh sach testcase white-box:

| Test ID | Flow | Muc tieu |
| --- | --- | --- |
| USER_PROFILE_WB_001 | Get Profile | Token hop le lay dung profile user |
| USER_PROFILE_WB_002 | Update Profile | Cap nhat va persist username/phone/gender/dob |
| USER_PROFILE_WB_003 | Add Address | Dia chi dau tien duoc set default |
| USER_PROFILE_WB_004 | Change Password | Old password sai tra 400 |
| USER_PROFILE_WB_005 | Change Password validation | New password yeu bi validation reject |
| USER_PROFILE_WB_006 | Change Password | Doi password thanh cong va DB luu password moi da encode |
| USER_PROFILE_WB_007 | Security | Request khong token bi reject |

Ket qua branch coverage theo branch matrix:

| Flow | Branch chinh | Covered | Not covered |
| --- | ---: | ---: | ---: |
| Get Profile | 2 | 2 | 0 |
| Update Profile | 1 | 1 | 0 |
| Add Address | 1 | 1 | 0 |
| Change Password | 3 | 3 | 0 |
| Tong | 7 | 7 | 0 |

Ti le coverage theo branch matrix: **7/7 = 100%**.

Lenh chay:

```powershell
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=UserProfileIntegrationTest test
```

Ket qua ghi nhan:

- Tests run: 7
- Failures: 0
- Errors: 0
- Skipped: 0
- Build: SUCCESS

Branch CI white-box:

```text
whitebox/KCPM-134-profile
```

## 7. Tong hop ket qua

| Lop kiem thu | Cong cu | So testcase/coverage | Trang thai |
| --- | --- | ---: | --- |
| API black-box | Postman/Newman | 27 testcase | San sang CI |
| UI black-box | CodeceptJS/Playwright | 19 scenario automation chinh, 25 testcase thiet ke trong report | San sang chay E2E, co them UX backlog |
| Backend white-box | JUnit/MockMvc/H2/JaCoCo | 7 testcase, 7/7 branch chinh | Pass |

Tong quan, module User Profile da duoc bao phu tu 3 lop:

1. API contract va validation hanh vi.
2. Hanh vi nguoi dung tren UI.
3. Logic noi bo va security path backend.

## 8. Target quality va gap can cai tien

Nhung diem da dat:

- User khong dang nhap/token sai bi chan o API profile/address/change password.
- Profile API khong duoc lo password hash.
- Change password co validate old password, confirm password va password complexity.
- White-box test da cover cac nhanh chinh cua profile, address, change password va security.
- Automation API da data-driven bang CSV, de chay lai trong CI.
- UI test tao user rieng theo runtime de giam xung dot du lieu.

Gap can cai tien:

- `UserProfileRequest` va `UserAddressDto` chua co validation day du cho `@NotBlank`, `@Size`, `@Pattern`.
- Negative case profile/address nhu phone sai format, recipient rong, address qua dai chua nen dua vao CI backend/API pass-fail on dinh neu backend chua co rule.
- UI can cai tien thong bao loi gan field, loading/disable nut submit va giu lai du lieu khi submit fail.
- Protected route UI voi token invalid/chua login da co trong report thiet ke, co the tach thanh scenario automation rieng de smoke test ro hon.
- Can dong bo encoding message tieng Viet trong mot so file/test de log de doc hon tren console.

## 9. De xuat smoke/regression

Bo smoke nen chay thuong xuyen:

| Thu tu | Test |
| ---: | --- |
| 1 | Dang ky/dang nhap user test |
| 2 | View profile voi token hop le |
| 3 | Cap nhat profile thanh cong |
| 4 | Them dia chi moi |
| 5 | Doi mat khau sai old password |
| 6 | Doi mat khau thanh cong va revert |
| 7 | Dang xuat |
| 8 | White-box `UserProfileIntegrationTest` |

Bo regression nen chay khi merge sprint:

```bash
cd automation
npm run test:user:blackbox
```

```bash
cd automation
npx codeceptjs run "E2E/modules/7_User_Profile/user_profile_test.js" --steps
```

```powershell
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=UserProfileIntegrationTest test
```

## 10. Ket luan

Phan User Profile da co bo tai lieu va automation kha day du, bao gom black-box API, black-box UI va white-box backend. Tong cong hien co 27 testcase API black-box, 19 scenario UI automation chinh va 7 testcase white-box backend. White-box dat 100% branch coverage theo branch matrix hien tai.

Chat luong hien tai du dap ung nhu cau kiem thu sprint cho cac flow chinh: xem profile, cap nhat profile, them dia chi, doi mat khau va bao ve truy cap. Huong cai tien tiep theo nen tap trung vao validation DTO profile/address va trai nghiem loi tren UI de mo rong negative test mot cach on dinh trong CI.
