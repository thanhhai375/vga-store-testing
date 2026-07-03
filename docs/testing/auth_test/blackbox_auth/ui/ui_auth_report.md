# Report: Bo Testcase UI Auth Black-box Qua Submit

**Du an:** VGA Store  
**Module:** Auth UI  
**Pham vi:** Login, Register, Logout, Protected Route, Change Password  
**Loai test:** UI/E2E black-box theo hanh vi nguoi dung  
**Nguyen tac:** Nguoi dung khong biet logic backend. Moi testcase chinh deu di qua hanh vi nhap lieu va bam Submit/Action, sau do kiem tra UI phan hoi.

---

## 1. Muc tieu

Bo testcase nay dung de danh gia module Auth theo goc nhin nguoi dung:

- Nguoi dung nhap dung thi hoan thanh duoc luong.
- Nguoi dung nhap sai thi UI bao loi ro rang.
- Form khong lam mat du lieu khi submit fail.
- Session duoc tao, giu, xoa dung luc.
- Trang rieng tu duoc bao ve.
- Cac case FE chua xu ly tot se duoc ghi nhan thanh testcase de toi uu UX.

---

## 2. Mau testcase su dung

| Thanh phan | Noi dung |
| --- | --- |
| Precondition | Trang thai ban dau truoc khi test |
| Steps | Cac thao tac cua nguoi dung |
| Test data | Du lieu nhap vao form |
| Expected after submit/action | Ket qua mong doi sau khi bam Submit/Action |
| Pass condition | Dieu kien de xem testcase pass |

Ghi chu:

- Voi validation FE, testcase van uu tien bam Submit roi kiem tra loi.
- Neu FE co the hien loi ngay khi nhap, do la diem cong UX, nhung pass condition chinh van nam sau Submit.
- Message khong nen phu thuoc 100% vao text backend. Co the pass neu UI hien loi dung y nghia va dung field.

---

## 3. Login Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-LG-001 | Dang nhap thanh cong | User hop le da ton tai; chua login | 1. Mo modal Login; 2. Nhap username/password; 3. Bam Dang nhap | username=`hai123`; password=`hai123` | Modal dong, header chuyen sang trang thai da dang nhap, token duoc luu | Co token/session va thay avatar/user menu | P1 |
| UI-LG-002 | Bo trong username/email | Chua login | 1. Mo Login; 2. Bo trong username; 3. Nhap password; 4. Bam Dang nhap | username=`""`; password=`hai123` | Form bi chan submit, field username/email invalid hoac hien loi bat buoc | Khong co token, modal van mo, field loi ro rang | P1 |
| UI-LG-003 | Bo trong password | Chua login | 1. Mo Login; 2. Nhap username; 3. Bo trong password; 4. Bam Dang nhap | username=`hai123`; password=`""` | Form bi chan submit, field password invalid hoac hien loi bat buoc | Khong co token, modal van mo, field password loi | P1 |
| UI-LG-004 | Sai username/password | Chua login | 1. Mo Login; 2. Nhap thong tin sai; 3. Bam Dang nhap | username=`usernotexist999`; password=`wrong-password` | Hien loi dang nhap that bai, khong tiet lo user co ton tai hay khong | Khong co token, modal van mo, input van sua duoc | P1 |
| UI-LG-005 | Username dung nhung password sai | User `hai123` ton tai | 1. Mo Login; 2. Nhap username dung; 3. Nhap password sai; 4. Bam Dang nhap | username=`hai123`; password=`wrong-password` | Hien loi sai thong tin dang nhap | Khong co token, modal van mo, username khong bi xoa | P1 |
| UI-LG-006 | Password qua ngan/y eu khi login | Chua login | 1. Mo Login; 2. Nhap username; 3. Nhap password ngan; 4. Bam Dang nhap | username=`hai123`; password=`123` | UI khong crash; he thong tu choi dang nhap bang loi de hieu | Khong co token; co loi tai form/toast/alert | P2 |
| UI-LG-007 | Submit bang phim Enter | User hop le ton tai | 1. Mo Login; 2. Nhap du lieu hop le; 3. Nhan Enter trong form | username=`hai123`; password=`hai123` | Form submit nhu bam nut Dang nhap | Dang nhap thanh cong, modal dong | P2 |
| UI-LG-008 | Toggle hien/an password | Modal Login dang mo | 1. Nhap password; 2. Bam icon mat; 3. Bam lai icon mat | password=`secret123` | Type input doi password/text/password, gia tri khong mat | Field van giu `secret123` | P2 |
| UI-LG-009 | Dong modal Login | Modal Login dang mo | 1. Bam nut close | Khong ap dung | Modal dong, trang hien tai khong doi | Khong con thay modal | P3 |
| UI-LG-010 | Login thanh cong roi reload | Da login thanh cong | 1. Reload trang | Khong ap dung | Session hop le van duoc giu | Header van hien user/avatar, token con ton tai | P1 |

---

## 4. Register Test Cases

Ghi chu cap nhat: Form Register hien co truong `confirmPassword`. Tat ca testcase Register co submit form va khong co muc tieu test rieng ve confirm password phai nhap `confirmPassword` trung voi `password` de tranh fail sai nguyen nhan.

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-RG-001 | Dang ky thanh cong | Chua login; username/email chua ton tai | 1. Mo Register; 2. Nhap day du du lieu hop le; 3. Bam Tao tai khoan | username=`e2e_user_<time>`; fullName=`E2E Test User`; email=`e2e_user_<time>@gmail.com`; password=`Pass123456!`; confirmPassword=`Pass123456!` | Hien thong bao thanh cong, chuyen ve Login hoac trang thai theo thiet ke | User duoc tao, form khong bao loi, co phan hoi thanh cong | P1 |
| UI-RG-002 | Bo trong username | Chua login | 1. Mo Register; 2. Bo trong username; 3. Nhap cac field khac; 4. Bam Tao tai khoan | username=`""`; email hop le; password=`Pass123456!`; confirmPassword=`Pass123456!`; fullName hop le | Field username bi invalid hoac hien loi bat buoc | Khong tao user, modal van mo, focus/loi nam o username | P1 |
| UI-RG-003 | Bo trong full name | Chua login | 1. Mo Register; 2. Bo trong full name; 3. Nhap field khac; 4. Bam Tao tai khoan | fullName=`""`; password=`Pass123456!`; confirmPassword=`Pass123456!` | Field full name bi invalid hoac hien loi bat buoc | Khong tao user, modal van mo | P1 |
| UI-RG-004 | Bo trong email | Chua login | 1. Mo Register; 2. Bo trong email; 3. Nhap field khac; 4. Bam Tao tai khoan | email=`""`; password=`Pass123456!`; confirmPassword=`Pass123456!` | Field email bi invalid hoac hien loi bat buoc | Khong tao user, modal van mo | P1 |
| UI-RG-005 | Bo trong password | Chua login | 1. Mo Register; 2. Bo trong password; 3. Nhap field khac; 4. Bam Tao tai khoan | password=`""` | Field password bi invalid hoac hien loi bat buoc | Khong tao user, modal van mo | P1 |
| UI-RG-006 | Email sai dinh dang | Chua login | 1. Mo Register; 2. Nhap email sai; 3. Bam Tao tai khoan | email=`invalidgmail`; password=`Pass123456!`; confirmPassword=`Pass123456!` | UI hien loi email khong hop le sau submit | Khong tao user, email field/form co loi ro rang | P1 |
| UI-RG-007 | Username qua ngan | Chua login | 1. Mo Register; 2. Nhap username 2 ky tu; 3. Bam Tao tai khoan | username=`ab`; password=`Pass123456!`; confirmPassword=`Pass123456!` | UI hien loi username qua ngan hoac rule username | Khong tao user, modal van mo | P1 |
| UI-RG-008 | Username toan khoang trang | Chua login | 1. Mo Register; 2. Nhap username chi gom space; 3. Bam Tao tai khoan | username=`   `; password=`Pass123456!`; confirmPassword=`Pass123456!` | UI trim/reject va bao username khong duoc trong | Khong tao user; neu hien loi bat buoc/invalid thi pass | P1 |
| UI-RG-009 | Username co ky tu dac biet | Chua login | 1. Mo Register; 2. Nhap username co ky tu dac biet; 3. Bam Tao tai khoan | username=`user@123`; password=`Pass123456!`; confirmPassword=`Pass123456!` | Neu rule khong cho, UI hien loi ky tu hop le; neu cho, tao user thanh cong theo rule | Ket qua nhat quan voi rule hien thi/yeu cau | P2 |
| UI-RG-010 | Password qua ngan/y eu | Chua login | 1. Mo Register; 2. Nhap password yeu; 3. Nhap confirm password trung password; 4. Bam Tao tai khoan | password=`123`; confirmPassword=`123` | UI hien loi mat khau yeu/qua ngan, khong dang ky thanh cong | Khong tao user, loi gan password hoac thong bao de hieu | P1 |
| UI-RG-011 | Password thieu chu hoa | Chua login | 1. Mo Register; 2. Nhap password thieu chu hoa; 3. Nhap confirm password trung password; 4. Bam Tao tai khoan | password=`password123!`; confirmPassword=`password123!` | UI hien loi password chua dat yeu cau neu he thong yeu cau password manh | Khong tao user hoac co phan hoi rule ro rang | P2 |
| UI-RG-012 | Password thieu chu thuong | Chua login | 1. Mo Register; 2. Nhap password thieu chu thuong; 3. Nhap confirm password trung password; 4. Bam Tao tai khoan | password=`PASSWORD123!`; confirmPassword=`PASSWORD123!` | UI hien loi password chua dat yeu cau neu he thong yeu cau password manh | Khong tao user hoac co phan hoi rule ro rang | P2 |
| UI-RG-013 | Password thieu so | Chua login | 1. Mo Register; 2. Nhap password thieu so; 3. Nhap confirm password trung password; 4. Bam Tao tai khoan | password=`Password!`; confirmPassword=`Password!` | UI hien loi password chua dat yeu cau neu he thong yeu cau password manh | Khong tao user hoac co phan hoi rule ro rang | P2 |
| UI-RG-014 | Password thieu ky tu dac biet | Chua login | 1. Mo Register; 2. Nhap password thieu ky tu dac biet; 3. Nhap confirm password trung password; 4. Bam Tao tai khoan | password=`Password123`; confirmPassword=`Password123` | UI hien loi password chua dat yeu cau neu he thong yeu cau password manh | Khong tao user hoac co phan hoi rule ro rang | P2 |
| UI-RG-015 | Username da ton tai | Database co user `hai123` | 1. Mo Register; 2. Nhap username da ton tai; 3. Bam Tao tai khoan | username=`hai123`; email moi; password=`Pass123456!`; confirmPassword=`Pass123456!` | Hien loi username da ton tai, khong xoa du lieu form | Khong tao user moi, modal van mo | P1 |
| UI-RG-016 | Email da ton tai | Database co email test da ton tai | 1. Mo Register; 2. Nhap email da ton tai; 3. Bam Tao tai khoan | username moi; email da ton tai; password=`Pass123456!`; confirmPassword=`Pass123456!` | Hien loi email da duoc su dung, khong xoa du lieu form | Khong tao user moi, modal van mo | P1 |
| UI-RG-017 | Submit nhieu lan lien tuc | Chua login; du lieu hop le | 1. Nhap form hop le; 2. Bam Tao tai khoan lien tuc nhieu lan | Du lieu hop le moi, confirmPassword trung password | Nut submit loading/disabled hoac chi tao mot request hop le | Khong tao trung user, UI khong bi treo | P2 |
| UI-RG-018 | Dang ky fail khong mat du lieu | Chua login | 1. Nhap du lieu co loi; 2. Bam Tao tai khoan | email=`invalidgmail`; cac field khac hop le; confirmPassword trung password | UI hien loi va giu cac field nguoi dung da nhap de sua | Username/fullName/password/email/confirmPassword khong bi xoa bat ngo | P2 |
| UI-RG-019 | Confirm password khong khop | Chua login | 1. Mo Register; 2. Nhap password va confirm password khac nhau; 3. Bam Tao tai khoan | password=`Pass123456!`; confirmPassword=`Different123!` | UI chan dang ky va hien loi xac nhan mat khau khong khop | Khong tao user, modal van mo, nguoi dung biet can sua confirm password | P1 |

---

## 5. Change Password Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-CP-001 | Doi mat khau thanh cong | User da login | 1. Vao Profile > Doi mat khau; 2. Nhap old/new/confirm; 3. Bam Xac nhan doi | oldPassword dung; newPassword=`NewPass123!`; confirm=`NewPass123!` | Hien thong bao thanh cong, form duoc clear | Logout va login lai bang password moi thanh cong | P1 |
| UI-CP-002 | Bo trong old password | User da login | 1. Vao form doi password; 2. Bo trong old password; 3. Bam Xac nhan doi | oldPassword=`""`; newPassword hop le; confirm hop le | Field old password invalid hoac hien loi bat buoc | Khong doi password, form van mo | P1 |
| UI-CP-003 | Bo trong new password | User da login | 1. Bo trong new password; 2. Bam Xac nhan doi | newPassword=`""` | Field new password invalid hoac hien loi bat buoc | Khong doi password, form van mo | P1 |
| UI-CP-004 | Confirm password khong khop | User da login | 1. Nhap old dung; 2. Nhap new va confirm khac nhau; 3. Bam Xac nhan doi | newPassword=`NewPass123!`; confirm=`Different123!` | UI hien loi confirm khong khop | Khong doi password, form van mo | P1 |
| UI-CP-005 | Sai old password | User da login | 1. Nhap old password sai; 2. Nhap new/confirm hop le; 3. Bam Xac nhan doi | oldPassword=`wrong-old-password`; newPassword=`NewPass123!` | Hien loi mat khau cu sai | Khong doi password, login bang password cu van duoc | P1 |
| UI-CP-006 | New password qua ngan/y eu | User da login | 1. Nhap old dung; 2. Nhap new password yeu; 3. Bam Xac nhan doi | newPassword=`123`; confirm=`123` | UI chan submit hoac hien loi password yeu | Khong doi password, form van mo | P1 |
| UI-CP-007 | New password trung old password | User da login | 1. Nhap old dung; 2. Nhap new giong old; 3. Bam Xac nhan doi | oldPassword=`Pass123456!`; newPassword=`Pass123456!` | UI/backend tu choi va hien loi de hieu | Khong doi password, form van mo | P2 |
| UI-CP-008 | Submit fail khong xoa toan bo form | User da login | 1. Nhap du lieu sai; 2. Bam Xac nhan doi | oldPassword sai; new hop le | UI hien loi, nguoi dung co the sua lai khong phai nhap lai tat ca | Form con hien va input quan trong van con/hoac focus loi | P2 |

---

## 6. Logout va Protected Route Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-SE-001 | Logout thanh cong | User da login | 1. Mo user menu; 2. Bam Dang xuat | Khong ap dung | Token/user bi xoa, header hien nut Dang nhap | Khong con avatar/user menu, localStorage khong con token | P1 |
| UI-SE-002 | Logout roi refresh | User vua logout | 1. Refresh trang | Khong ap dung | Session khong quay lai | Header van o trang thai chua login | P1 |
| UI-SE-003 | Chua login vao profile | Chua login | 1. Truy cap `/profile` | Khong ap dung | Bi redirect ve trang chu hoac mo login modal theo thiet ke | Khong thay noi dung profile rieng tu | P1 |
| UI-SE-004 | Da login vao profile | User da login | 1. Truy cap `/profile` | Khong ap dung | Profile hien thi binh thuong | Thay sidebar/profile content | P1 |
| UI-SE-005 | Chua login vao tab password | Chua login | 1. Truy cap `/profile?tab=password` | Khong ap dung | Bi chan nhu route rieng tu | Khong thay form doi password | P1 |
| UI-SE-006 | Token sai trong localStorage | Browser co token gia | 1. Gan token gia; 2. Truy cap profile/reload | token=`invalid-token` | UI khong dung man hinh trang; tu logout/redirect/hien loi phu hop | Khong hien profile rieng tu voi token sai | P1 |

---

## 7. UX Enhancement Test Cases Can Bo Sung

Day la cac testcase dung de phat hien diem FE chua xu ly tot. Neu hien tai fail, khong co nghia backend sai; no la co so de cai thien trai nghiem nguoi dung.

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-UX-001 | Loi hien gan field thay vi chi toast | Form Register dang mo | 1. Nhap password yeu; 2. Bam Submit | password=`123` | Loi hien gan field password hoac co vung alert co dinh | Nguoi dung biet field nao can sua | P2 |
| UI-UX-002 | Focus vao field loi dau tien | Form co nhieu field sai | 1. Bo trong username/email/password; 2. Bam Submit | Nhieu field rong | Focus/scroll den field loi dau tien | Nguoi dung sua loi nhanh | P2 |
| UI-UX-003 | Submit button co loading/disabled | Form Register/Login | 1. Nhap du lieu; 2. Bam Submit | Du lieu bat ky | Nut submit loading/disabled trong luc xu ly | Khong bam gui lap nhieu request | P2 |
| UI-UX-004 | Error message khong phu thuoc text backend kho hieu | Backend tra loi ky thuat | 1. Submit case duplicate/invalid; 2. Quan sat message | Duplicate/invalid input | UI map thanh cau de hieu voi nguoi dung | Message ngan gon, dung nghia | P2 |
| UI-UX-005 | Toast/alert du lau de doc | Submit thanh cong hoac that bai | 1. Bam Submit; 2. Quan sat thong bao | Bat ky | Thong bao du lau hoac co alert co dinh | Nguoi dung nhan biet duoc ket qua | P3 |

---

## 8. Bo Smoke Test Nen Chay Thuong Xuyen

| Thu tu | Testcase | ID lien quan |
| ---: | --- | --- |
| 1 | Dang ky thanh cong voi du lieu hop le | UI-RG-001 |
| 2 | Dang nhap thanh cong | UI-LG-001 |
| 3 | Dang nhap sai password | UI-LG-005 |
| 4 | Register password yeu bi tu choi sau submit | UI-RG-010 |
| 5 | Logout xoa session | UI-SE-001 |
| 6 | Chua login truy cap profile bi chan | UI-SE-003 |
| 7 | Doi mat khau thanh cong | UI-CP-001 |
| 8 | Sai old password khi doi mat khau | UI-CP-005 |

---

## 9. Ket luan

Bo testcase nay phu hop voi UI black-box vi khong dua vao code noi bo hay gia dinh nguoi dung biet rule backend. Moi case deu xuat phat tu hanh vi that:

1. Nguoi dung mo form.
2. Nguoi dung nhap du lieu.
3. Nguoi dung bam Submit/Action.
4. UI phai phan hoi dung, ro rang va giu duoc trai nghiem muot.

Neu testcase UX fail, day la tin hieu can toi uu FE: hien loi gan field, giu du lieu sau submit fail, loading/disable nut submit, thong bao de hieu va bao ve session chat hon.
