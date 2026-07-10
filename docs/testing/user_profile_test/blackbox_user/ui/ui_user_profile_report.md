# Report: Bo Testcase UI User Profile Black-box Qua Submit/Action

**Du an:** VGA Store  
**Module:** User Profile UI  
**Jira task:** KCPM-116  
**Pham vi:** Ho so ca nhan, So dia chi, Doi mat khau, Dang xuat  
**Loai test:** UI/E2E black-box theo hanh vi nguoi dung  
**Automation:** `automation/E2E/modules/7_User_Profile/user_profile_test.js`  
**Nguyen tac:** Nguoi dung khong biet logic backend. Moi testcase di qua hanh vi tren UI, sau do kiem tra man hinh/phan hoi cua he thong.

---

## 1. Muc tieu

Bo testcase nay dung de danh gia module User Profile theo goc nhin nguoi dung:

- Nguoi dung da dang nhap xem duoc ho so ca nhan.
- Nguoi dung cap nhat thong tin ca nhan va nhan phan hoi phu hop.
- Nguoi dung them dia chi nhan hang.
- Nguoi dung doi mat khau thanh cong hoac nhan loi ro rang khi input sai.
- Session dang nhap/dang xuat hoat dong dung.
- Cac case FE chua xu ly tot duoc ghi nhan thanh testcase de cai thien UX.

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

- Voi validation FE, testcase uu tien thao tac nhu nguoi dung that: nhap lieu, bam nut, quan sat loi.
- Message khong can phu thuoc 100% vao text backend. Co the pass neu UI hien loi dung y nghia va dung vi tri.
- Test hien co duoc chay bang CodeceptJS va Playwright trong CI.

---

## 3. Profile Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-UP-001 | Cap nhat thong tin ho so thanh cong | User da login | 1. Vao `/profile`; 2. Chon Ho so ca nhan; 3. Nhap ho ten, so dien thoai, gioi tinh, ngay sinh; 4. Bam Luu thay doi | fullName=`Tu Minh Von`; phone=`0912345678`; gender=`Nam`; dob hop le | He thong luu thay doi va khong crash | UI van o profile, form co the tiep tuc thao tac | P1 |
| UI-UP-002 | Email lien ket khong cho chinh sua | User da login | 1. Vao Ho so ca nhan; 2. Quan sat field email | Khong ap dung | Email hien thi la thong tin lien ket, khong bi sua trong form profile | Email van hien va khong bi mat | P1 |
| UI-UP-003 | Bo trong ho ten | User da login | 1. Xoa field Ho va ten; 2. Bam Luu thay doi | fullName=`""` | UI/backend tu choi hoac hien loi can nhap ho ten | Khong luu profile rong ma khong co phan hoi | P1 |
| UI-UP-004 | So dien thoai co chu cai | User da login | 1. Nhap phone co chu; 2. Bam Luu thay doi | phone=`0912ABC567` | UI/backend tu choi hoac hien loi so dien thoai sai dinh dang | Khong chap nhan phone sai format mot cach im lang | P1 |
| UI-UP-005 | So dien thoai qua ngan | User da login | 1. Nhap phone qua ngan; 2. Bam Luu thay doi | phone=`12345` | UI/backend tu choi hoac hien loi do dai phone | Khong chap nhan phone sai format mot cach im lang | P1 |
| UI-UP-006 | Doi gioi tinh thanh cong | User da login | 1. Chon gioi tinh khac; 2. Bam Luu thay doi | gender=`Nu` | Lua chon duoc ghi nhan | UI khong crash, radio state dung | P2 |

---

## 4. Address Book Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-UA-001 | Mo so dia chi va huy them moi | User da login | 1. Vao tab So dia chi; 2. Bam Them dia chi; 3. Bam Huy | Khong ap dung | Modal/form them dia chi dong lai | Khong tao dia chi moi | P2 |
| UI-UA-002 | Them dia chi moi mac dinh thanh cong | User da login | 1. Bam Them dia chi; 2. Nhap recipient/phone/address; 3. Tick mac dinh; 4. Bam Luu dia chi | recipient=`Nguyen Van A`; phone=`0987654321`; address hop le | Dia chi duoc them vao so dia chi | Danh sach dia chi co thong tin vua nhap | P1 |
| UI-UA-003 | Them dia chi bo trong tat ca field | User da login | 1. Mo form them dia chi; 2. Bam Luu dia chi | Cac field rong | UI/backend hien loi bat buoc | Khong tao dia chi rong | P1 |
| UI-UA-004 | Thieu ten nguoi nhan | User da login | 1. Bo trong recipient; 2. Nhap phone/address; 3. Bam Luu dia chi | recipient=`""` | UI/backend hien loi recipient | Khong tao dia chi thieu ten | P1 |
| UI-UA-005 | Phone nguoi nhan sai dinh dang | User da login | 1. Nhap phone co chu; 2. Bam Luu dia chi | phone=`0987-PHONE-O1` | UI/backend hien loi phone | Khong tao dia chi phone sai | P1 |
| UI-UA-006 | Thieu dia chi chi tiet | User da login | 1. Nhap recipient/phone; 2. Bo trong address; 3. Bam Luu dia chi | detailedAddress=`""` | UI/backend hien loi address | Khong tao dia chi thieu dia chi | P1 |

---

## 5. Change Password Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-CP-001 | Confirm password khong khop | User da login | 1. Vao Doi mat khau; 2. Nhap old dung; 3. Nhap new va confirm khac nhau; 4. Bam Xac nhan doi | old=`123456`; new=`NewPass123!`; confirm=`WrongPass123!` | UI/backend hien loi confirm khong khop | Khong doi password | P1 |
| UI-CP-002 | Bo trong tat ca field | User da login | 1. Vao Doi mat khau; 2. Bam Xac nhan doi | Tat ca field rong | Field loi bat buoc hoac thong bao loi hien ra | Khong doi password | P1 |
| UI-CP-003 | Sai mat khau cu | User da login | 1. Nhap old sai; 2. Nhap new/confirm hop le; 3. Bam Xac nhan doi | old=`SaiMatKhau123` | Hien loi mat khau cu sai | Khong doi password | P1 |
| UI-CP-004 | Mat khau moi trung mat khau cu | User da login | 1. Nhap old dung; 2. Nhap new giong old; 3. Bam Xac nhan doi | old=`123456`; new=`123456` | UI/backend tu choi password trung | Khong doi password | P1 |
| UI-CP-005 | Mat khau moi qua ngan | User da login | 1. Nhap new qua ngan; 2. Bam Xac nhan doi | new=`123` | UI/backend hien loi do dai/complexity | Khong doi password | P1 |
| UI-CP-006 | Doi mat khau thanh cong va revert | User da login | 1. Doi tu password cu sang password moi; 2. Refresh; 3. Doi nguoc lai password cu | old=`123456`; new=`12345678`; revert ve `123456` | Doi mat khau thanh cong va user van dung duoc tai khoan test | Test khong lam hong du lieu dang nhap cho lan sau | P1 |

---

## 6. Logout va Protected Route Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-SE-001 | Dang xuat thanh cong | User da login | 1. Bam Dang xuat trong sidebar; 2. Refresh page | Khong ap dung | Session bi xoa, nut Dang nhap hien lai | Khong con thay profile rieng tu | P1 |
| UI-SE-002 | Chua login truy cap profile | Chua login | 1. Truy cap `/profile` | Khong ap dung | Bi redirect hoac bi yeu cau dang nhap | Khong thay du lieu profile | P1 |
| UI-SE-003 | Token sai trong localStorage | Browser co token gia | 1. Gan token sai; 2. Truy cap profile | token invalid | UI khong hien profile rieng tu nhu user hop le | Session bi reject/redirect/hien loi | P1 |

---

## 7. UX Enhancement Test Cases Can Bo Sung

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-UX-001 | Loi hien gan field profile | Form profile dang mo | 1. Nhap phone sai; 2. Bam Luu | phone invalid | Loi hien gan field phone | Nguoi dung biet field nao can sua | P2 |
| UI-UX-002 | Nut submit co loading/disabled | Dang submit form profile/address/password | 1. Bam submit | Du lieu bat ky | Nut disabled/loading trong luc xu ly | Khong gui lap request | P2 |
| UI-UX-003 | Submit fail khong xoa het form | Form address/password co loi | 1. Nhap du lieu sai; 2. Bam submit | Du lieu sai mot field | Cac field khac van giu gia tri de sua | Nguoi dung khong phai nhap lai tat ca | P2 |
| UI-UX-004 | Message loi de hieu | Backend tra loi validation/business | 1. Submit case sai old password/phone | Input invalid | Message ngan gon, dung nghia | Khong hien loi ky thuat kho doc | P2 |

---

## 8. Bo Smoke Test Nen Chay Thuong Xuyen

| Thu tu | Testcase | ID lien quan |
| ---: | --- | --- |
| 1 | Dang nhap va vao trang profile | UI-UP-001 |
| 2 | Cap nhat profile thanh cong | UI-UP-001 |
| 3 | Them dia chi moi | UI-UA-002 |
| 4 | Doi mat khau sai old password | UI-CP-003 |
| 5 | Doi mat khau thanh cong va revert | UI-CP-006 |
| 6 | Dang xuat thanh cong | UI-SE-001 |

---

## 9. Ket luan

Bo testcase nay phu hop voi UI black-box vi khong dua vao code noi bo. Moi case deu xuat phat tu hanh vi that:

1. Nguoi dung vao trang profile.
2. Nguoi dung nhap du lieu vao form.
3. Nguoi dung bam Submit/Action.
4. UI phai phan hoi dung, ro rang va bao ve du lieu rieng tu.

Neu testcase UX fail, day la tin hieu can toi uu FE: validation gan field, giu du lieu sau submit fail, loading/disable nut submit, thong bao de hieu va session handling chat hon.
