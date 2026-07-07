# Auth Target Quality Requirements

Tai lieu nay mo ta chuan mong muon cho module Auth. Cac test case black-box/CSV co the lam CI fail neu backend hien tai chua dat cac chuan nay. Khi CI fail, do la bug hoac improvement can ghi nhan tren Jira, khong phai loi cua file test.

## 1. Muc tieu

Module Auth khong chi can "dang nhap/dang ky duoc", ma can an toan, de bao tri va co trai nghiem loi ro rang.

Pham vi ap dung:

- Login
- Register
- Change password
- Google login neu co

Khong dua SQL injection payload vao bo test hien tai theo yeu cau. Cac case input nguy hiem duoc thay bang rule validation ro rang hon: ky tu dac biet, khoang trang, do dai, format sai.

## 2. Username

Rule muc tieu:

- Bat buoc nhap.
- Do dai 3-50 ky tu.
- Chi chap nhan chu cai, chu so va dau gach duoi `_`.
- Khong chap nhan khoang trang dau/cuoi.
- Khong chap nhan khoang trang ben trong.
- Khong chap nhan ky tu dac biet nhu `@`, `#`, `%`.
- Username phai unique khi register.

Ly do:

- Giam loi do trim/normalize khong thong nhat.
- Giam nham lan khi dang nhap.
- De tao rule validation ro rang cho UI va API.

## 3. Email

Rule muc tieu:

- Bat buoc nhap khi register.
- Dung format email co `@` va domain hop le.
- Khong chap nhan khoang trang dau/cuoi.
- Do dai toi da nen theo chuan email thong dung, toi da 254 ky tu.
- Email phai unique khi register.

Ly do:

- Email thuong dung cho thong bao, reset password, Google login.
- Can chan loi duplicate account va email sai format som.

## 4. Password

Rule muc tieu:

- Bat buoc nhap.
- Do dai 8-64 ky tu.
- Co it nhat 1 chu thuong.
- Co it nhat 1 chu hoa.
- Co it nhat 1 chu so.
- Co it nhat 1 ky tu dac biet.
- Khong chap nhan khoang trang dau/cuoi.
- Nen khong chap nhan password chi toan so, chi toan chu, hoac qua de doan.

Vi du hop le:

```text
Password@1
Pass@123
```

Vi du khong hop le:

```text
123456
password@1
PASSWORD@1
Password1
Pass@1
```

Ly do:

- Password 6 ky tu hoac chi gom so/chu la qua yeu.
- Test theo rule moi co the lam lo ra diem backend chua toi uu.

## 5. Login

Rule muc tieu:

- Username va password bat buoc nhap.
- Username co khoang trang, ky tu dac biet, do dai sai phai bi tu choi.
- Khi sai username hoac sai password, message nen chung chung: `Invalid username or password`.
- Khong nen bao rieng "username khong ton tai" trong login vi de lo thong tin tai khoan.
- Username nen case-sensitive neu he thong khong co rule normalize ro rang.

## 6. Register

Rule muc tieu:

- Validate username, email, password, fullName truoc khi tao user.
- Password phai dat strong password policy.
- Duplicate username/email phai bi tu choi.
- Loi validation phai tra HTTP 400 hoac 422 va message co truong loi ro rang.

## 7. Change Password

Rule muc tieu:

- Yeu cau token dang nhap hop le.
- `oldPassword` bat buoc nhap va phai dung.
- `newPassword` bat buoc nhap va phai dat strong password policy.
- `confirmPassword` bat buoc nhap va phai khop `newPassword`.
- `newPassword` khong duoc trung `oldPassword`.
- Password moi co khoang trang dau/cuoi phai bi tu choi.

## 8. Cach ap dung vao CI/CD

File CSV trong Postman la nguon data chay automation. Hien tai bo Auth da tach thanh 4 CSV theo tung API de Newman co the xuat 4 bang ket qua rieng:

```text
automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Register/Auth_Register_Testcase.csv
automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Login/Auth_Login_Testcase.csv
automation/postman/VGA-AUTH-USER/VGA-Store-Auth/Google-Login/Auth_Google_Login_Testcase.csv
automation/postman/VGA-AUTH-USER/VGA-Store-Auth/ChangePassword/Auth_ChangePassword_Testcase.csv
```

Neu backend hien tai van cho phep password yeu nhu `123456`, test Register/ChangePassword se fail. GitHub Actions se ghi log len Jira theo task `KCPM-xxx` cua commit.

Khi co loi:

- Neu loi do code lam hong chuc nang da dat chuan: tao/fix bug.
- Neu loi do backend chua co rule moi: tao improvement task hoac sub-task nang cap Auth.
- Sau khi backend duoc sua, chay lai CI de xac nhan pass.

## 9. Ket luan

Bo test moi khong chi xac nhan he thong hien tai, ma dung de dat muc tieu nang cap Auth. Vi vay expected result trong CSV la expected behavior mong muon, khong phai luc nao cung trung voi behavior hien tai cua backend.
