# User Target Quality Requirements

## 1. View Profile

- Chi user da dang nhap moi duoc xem ho so ca nhan.
- Token hop le tra ve HTTP 200 va payload co `id`, `username`, `email`, `role`.
- Thieu token hoac token sai phai bi tu choi voi HTTP 401/403.
- API khong duoc tra ve password hash hay thong tin nhay cam.

## 2. Add Address

- Chi user da dang nhap moi duoc them dia chi.
- Dia chi hop le gom `recipientName`, `phone`, `detailedAddress`, `isDefault`.
- `recipientName` nen bat buoc, 1-100 ky tu.
- `phone` nen bat buoc, dung pattern so dien thoai Viet Nam, 10 chu so.
- `detailedAddress` nen bat buoc, 1-500 ky tu.
- Neu `isDefault=true`, cac dia chi cu cua user phai duoc set ve non-default.
- Thieu token hoac token sai phai bi tu choi voi HTTP 401/403.

## 3. Change Password

- Chi user da dang nhap moi duoc doi mat khau.
- `oldPassword` khong rong va dung voi mat khau hien tai.
- `newPassword` khong rong, khac mat khau cu, dai 8-64 ky tu.
- `newPassword` phai co chu hoa, chu thuong, chu so, ky tu dac biet va khong co khoang trang.
- `confirmPassword` khong rong va phai khop `newPassword`.
- Thanh cong tra ve HTTP 200; loi validation/business rule tra ve HTTP 400; thieu/sai token tra ve HTTP 401/403.

## 4. Automation/CI

- Script npm phai dung format `test:user:blackbox`.
- Newman JSON report export vao `automation/reports/user-blackbox-newman.json`.
- CSV phai co toi thieu `testId`, `testType`, `expectedStatus`, `expectedMessage`, `ExpectedResult`.
