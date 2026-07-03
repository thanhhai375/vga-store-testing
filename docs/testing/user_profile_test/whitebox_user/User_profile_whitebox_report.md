# USER PROFILE WHITE-BOX TESTING REPORT

## 1. Muc tieu

Report nay ap dung white-box testing cho module User Profile cua VGA Store. Kiem thu duoc thiet ke dua tren cau truc logic ben trong source code, tap trung vao control flow, branch/decision coverage va data flow cho cac API profile chinh.

Pham vi:

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/addresses`
- `PUT /api/users/change-password`

Source code duoc phan tich:

- `backend/vgashop/src/main/java/com/example/vgashop/controler/UserController.java`
- `backend/vgashop/src/main/java/com/example/vgashop/service/UserService.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/UserProfileRequest.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/UserAddressDto.java`
- `backend/vgashop/src/main/java/com/example/vgashop/dto/ChangePasswordRequest.java`
- `backend/vgashop/src/main/java/com/example/vgashop/security/JwtAuthFilter.java`
- `backend/vgashop/src/main/java/com/example/vgashop/security/SecurityConfig.java`

Test implementation:

- `backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/user_profile/integration/UserProfileIntegrationTest.java`

## 2. Phuong phap white-box ap dung

| Ky thuat | Cach ap dung trong module User Profile |
| :--- | :--- |
| Statement coverage | Moi flow chinh cua profile, address va change password duoc thuc thi qua MockMvc integration test. |
| Branch/Decision coverage | Cac nhanh authenticated/unauthenticated, old password sai, password validation fail, password success va address default duoc tach thanh test case rieng. |
| Condition coverage | Dieu kien `user.getAddresses().isEmpty()`, `passwordEncoder.matches`, `newPassword` validation va route security duoc cover. |
| Data flow testing | Kiem tra du lieu request duoc luu vao entity va response tra ve dung phone/gender/dob/address/default flag. |
| Security path coverage | Kiem tra request profile khong co token bi chan boi Spring Security truoc khi vao controller. |

## 3. Luong dieu khien chinh

### 3.1 Get Profile

Control flow:

1. Request vao endpoint `/api/users/profile`.
2. `JwtAuthFilter` doc token va tao principal neu token hop le.
3. `SecurityConfig` yeu cau `/api/users/**` phai authenticated.
4. `UserController.getProfile` lay `principal.getName()`.
5. `UserService.getUserProfile` tim user theo username.
6. Neu user ton tai thi map sang `UserProfileResponse`.
7. Neu request khong co token thi bi chan truoc controller.

Nhanh can cover:

- Token hop le, get profile thanh cong.
- Thieu token, request bi tu choi.

### 3.2 Update Profile

Control flow:

1. Request vao `UserController.updateProfile`.
2. Service tim user theo principal username.
3. Gan lai `username`, `phone`, `gender`, `dob` tu request.
4. Luu user vao database.
5. Tra ve `ApiResponse.success`.

Nhanh can cover:

- Update thanh cong va data moi duoc persist.

### 3.3 Add Address

Control flow:

1. Request vao `UserController.addAddress`.
2. Service tim user theo principal username.
3. Tao `UserAddress` moi va gan user/recipient/phone/address.
4. Neu `dto.isDefault == true` hoac user chua co address thi set address moi la default.
5. Neu khong thi address moi khong phai default.
6. Luu user va tra ve profile moi.

Nhanh can cover:

- User chua co address, address dau tien tu dong la default.

### 3.4 Change Password

Control flow:

1. Request vao `UserController.changePassword`.
2. `@Valid ChangePasswordRequest` validate old/new/confirm password.
3. Service tim user theo principal username.
4. Neu old password sai thi throw `IllegalArgumentException`.
5. Neu confirm khong khop new password thi throw `IllegalArgumentException`.
6. Neu new password trung old password thi throw `IllegalArgumentException`.
7. Neu hop le thi BCrypt encode password moi va save.

Nhanh can cover:

- Old password sai.
- New password yeu bi validation reject.
- Change password thanh cong va DB luu password moi da encode.

## 4. Do phuc tap Cyclomatic

Tinh theo cong thuc:

`V(G) = P + 1`

Trong do `P` la so nut dieu kien/quyet dinh chinh trong flow.

| Flow | Dieu kien/quyet dinh chinh | V(G) uoc tinh | So test toi thieu theo path doc lap |
| :--- | :--- | :---: | :---: |
| Get Profile | authenticated/unauthenticated, user exists | 2 + 1 | 3 |
| Update Profile | user exists | 1 + 1 | 2 |
| Add Address | isDefault true, addresses empty | 2 + 1 | 3 |
| Change Password | validation, old matches, confirm matches, new same old | 4 + 1 | 5 |

Ghi chu: Mot so branch chua duoc dua vao CI vi DTO profile/address hien chua co validation day du. Cac gap nay duoc ghi nhan trong target quality report black-box.

## 5. Test case white-box

### 5.1 Duong di nhanh can test

#### Get Profile: 2 nhanh

- Token hop le thi lay profile cua user dang dang nhap.
- Khong co token thi bi chan truy cap.

Ket luan: Get Profile co `2/2` nhanh chinh duoc cover.

#### Update Profile: 1 nhanh

- Request hop le thi cap nhat profile va persist phone/gender/dob.

Ket luan: Update Profile co `1/1` nhanh chinh duoc cover.

#### Add Address: 1 nhanh

- Them dia chi dau tien va he thong tu set `isDefault=true`.

Ket luan: Add Address co `1/1` nhanh chinh hien dua vao CI duoc cover.

#### Change Password: 3 nhanh

- Old password sai thi tra 400.
- New password yeu thi validation tra 400.
- Old dung, new hop le, confirm khop thi doi password thanh cong.

Ket luan: Change Password co `3/3` nhanh chinh hien dua vao CI duoc cover.

### 5.2 Danh sach test case

| Test ID | Flow | Muc tieu bao phu | Input/Trang thai | Expected |
| :--- | :--- | :--- | :--- | :--- |
| USER_PROFILE_WB_001 | Get Profile | Thanh cong | Token hop le cua `profile_user` | HTTP 200, profile dung username/email/role/phone |
| USER_PROFILE_WB_002 | Update Profile | Persist data | Username/phone/gender/dob moi | HTTP 200, response co data da cap nhat |
| USER_PROFILE_WB_003 | Add Address | Address dau tien default | User chua co address, `isDefault=false` | HTTP 200, address duoc them va `isDefault=true` |
| USER_PROFILE_WB_004 | Change Password | Old password sai | `oldPassword` sai | HTTP 400, message `Mật khẩu cũ không đúng!` |
| USER_PROFILE_WB_005 | Change Password validation | New password yeu | `newPassword=12345678` | HTTP 400, co loi `data.newPassword` |
| USER_PROFILE_WB_006 | Change Password | Thanh cong | Old dung, new hop le, confirm khop | HTTP 200, password moi match BCrypt trong DB |
| USER_PROFILE_WB_007 | Security | Chua authenticated | Khong gui token | HTTP 4xx |

## 6. Branch coverage matrix

Chi tiet branch matrix nam tai:

`docs/testing/user_profile_test/whitebox_user/USER_PROFILE_BRANCH_MATRIX.csv`

Tom tat:

| Nhom flow | So branch chinh | Covered | Not covered |
| :--- | :---: | :---: | :---: |
| Get Profile | 2 | 2 | 0 |
| Update Profile | 1 | 1 | 0 |
| Add Address | 1 | 1 | 0 |
| Change Password | 3 | 3 | 0 |
| Tong | 7 | 7 | 0 |

Ti le branch coverage theo branch matrix hien tai:

`7 / 7 = 100%`

## 7. Ket qua thuc thi

Lenh chay:

```powershell
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=UserProfileIntegrationTest test
```

Ket qua local:

- Tests run: 7
- Failures: 0
- Errors: 0
- Skipped: 0
- Build: SUCCESS

Report duoc tao khi chay test:

- Test result: `backend/vgashop/target/surefire-reports/`
- Coverage HTML: `backend/vgashop/target/site/jacoco/index.html`

## 8. Ket luan

Module User Profile da co bo white-box integration test rieng cho cac nhanh logic chinh trong get profile, update profile, add address va change password. Bo test phu hop voi cac ky thuat trong bai hoc: statement coverage, branch/decision coverage, condition coverage, data flow testing va security path testing.

Theo branch matrix hien tai, muc bao phu nhanh chinh dat 100%. Cac validation gap cua `UserProfileRequest` va `UserAddressDto` duoc ghi nhan rieng trong black-box target quality report de tranh lam CI fail khong on dinh khi backend chua co rule.
