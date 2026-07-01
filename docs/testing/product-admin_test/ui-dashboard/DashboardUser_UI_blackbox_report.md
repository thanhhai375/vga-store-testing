# Report: Bo Testcase UI Dashboard & User Management Black-box Qua Submit/Action

**Du an:** VGA Store  
**Module:** Dashboard & User Management UI  
**Pham vi:** Xem Dashboard (Thong ke, Filter Time), Quan ly nguoi dung (Xem danh sach, Them, Khoa/Mo khoa, Phan trang, Loc)  
**Loai test:** UI/E2E black-box theo hanh vi nguoi dung  
**Nguyen tac:** Nguoi dung khong biet logic backend. Moi testcase deu di qua thao tac nhap lieu, filter hoac action tren giao dien, sau do kiem tra UI phan hoi (thay doi mau sac, hien thong bao, loading, v.v).

---

## 1. Muc tieu

Bo testcase nay dung de danh gia module Dashboard & User Management theo goc nhin nguoi dung:

- Thong ke va bieu do tai du lieu chinh xac sau khi filter.
- Form them User chan cac du lieu khong hop le (BVA, EP) va hien loi truoc/sau khi submit.
- Empty State hien thi ro rang khi khong co du lieu.
- Hieu ung chuyen trang thai (State Transition) hoat dong muot ma khi khoa/mo khoa user.
- Cac case FE chua xu ly tot se duoc ghi nhan de toi uu UX.

---

## 2. Mau testcase su dung

| Thanh phan | Noi dung |
| --- | --- |
| Precondition | Trang thai ban dau truoc khi test |
| Steps | Cac thao tac cua nguoi dung |
| Test data | Du lieu nhap vao hoac lua chon |
| Expected after submit/action | Ket qua mong doi sau khi bam Submit/Action |
| Pass condition | Dieu kien de xem testcase pass |

Ghi chu:
- Testcase uu tien thao tac action thuc te (click, chon dropdown, bam Luu).
- Khuyen khich phat hien loi giao dien thay vi chi test tinh dung dan cua du lieu.

---

## 3. Dashboard Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-DB-001 | Hien thi tong quan Dashboard | Dang nhap quyen ADMIN | 1. Vao trang chu Dashboard | Khong ap dung | Load cac block thong ke (Don hang, Doanh thu), bieu do va danh sach don hang cho | Hien thi du cac the thong ke, khong co loi crash UI | P1 |
| UI-DB-002 | Thay doi thoi gian loc bieu do | Dang mo Dashboard | 1. Bấm vao dropdown Thoi gian; 2. Chon 7 ngay/1 thang | dropdown=`7days` | Giao dien bieu do nhoe di hoac hien spinner loading | Bieu do ve lai, khong giu nguyen so lieu cu ma khong bao hieu loading | P1 |
| UI-DB-003 | Dashboard khi he thong chua co don hang | Data don hang rỗng | 1. Vao Dashboard | Khong ap dung | Giao dien the thong ke hien 0, bieu do hien Empty State | Thay the giao dien loi/rong bang "Chua co du lieu", thong ke hien "0" | P2 |
| UI-DB-004 | Click xem tat ca don hang | Dang mo Dashboard | 1. Bam nut "Xem tat ca" o danh sach cho | Khong ap dung | Chuyen huong (redirect) sang trang Quản lý đơn hàng | URL doi thanh `/orders`, load dung trang danh sach | P2 |

---

## 4. User Management Test Cases

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-UM-001 | Load danh sach va phan trang | Co > 10 user trong DB | 1. Vao Quản lý User; 2. Cuon xuong cuoi; 3. Bam "Trang sau" | Khong ap dung | Bảng cap nhat danh sach moi, active page thay doi | Khong load lai ca trang (reload), chi render lai table | P1 |
| UI-UM-002 | Tim kiem user khong ton tai | Dang mo Quản lý User | 1. Nhap text tim kiem khong co that | search=`usernotexist123` | Bảng an di, hien thi Empty State "Khong tim thay ket qua" | UI hien Empty State ro rang, khong bi trang tinh | P1 |
| UI-UM-003 | Loc theo vai tro (Role) | Dang mo Quản lý User | 1. Chon dropdown Vai tro; 2. Chon "ADMIN" | filter=`ADMIN` | Bang chi hien thi cac hang co Badge Role la ADMIN | 100% ket qua hien thi la Admin | P1 |
| UI-UM-004 | Bỏ trong tat ca truong khi Them User | Dang mo form Them User | 1. Bo trong form; 2. Bam Luu | Khong co | Form bao loi required cho Username, Email, Password | Modal khong dong, hien loi do o cac the input | P1 |
| UI-UM-005 | Them User thanh cong | Dang mo form Them User | 1. Nhap du lieu hop le; 2. Bam Luu | user=`testuser1`, email=`test@gmail.com`, pass=`123456`, role=`USER` | Toast thong bao thanh cong, modal tu dong, bang hien len tren cung (hoac tu dong load lai) | Co thong bao thanh cong, user moi the hien trong list | P1 |
| UI-UM-006 | Username qua ngan (BVA) | Dang mo form Them User | 1. Nhap username 2 ky tu; 2. Nhap du cac field khac; 3. Bam Luu | username=`ab` | Form bao loi do tai the username | Modal khong dong, loi "qua ngan" hien ra | P1 |
| UI-UM-007 | Email sai dinh dang (EP) | Dang mo form Them User | 1. Nhap email khong co @; 2. Bam Luu | email=`invalidemail` | Form bao loi tai the email | Modal khong dong, loi email hien ra | P1 |
| UI-UM-008 | Username da ton tai | Ton tai user `admin` | 1. Nhap username `admin`; 2. Bam Luu | username=`admin` | Báo loi tu server "User da ton tai", giu nguyen form | Hien toast hoac loi the text, khong lam mat du lieu form | P1 |
| UI-UM-009 | Khoa (Lock) tai khoan (State Transition) | Ton tai user o trang thai ACTIVE | 1. Bam nut Khoa tren 1 hang; 2. Bam Xac nhan tren modal pop-up | Khong ap dung | Thong bao Khoa thanh cong, Badge Status doi tu Xanh -> Đo mượt mà | Toast thanh cong, UI badge doi mau | P1 |
| UI-UM-010 | Huy thao tac tren Modal Xac nhan | Dang mo modal Khoa | 1. Bam Huy hoac dau X | Khong ap dung | Modal dong lai, khong co api goi di | Trang thai user o UI khong doi | P2 |

---

## 5. UX Enhancement Test Cases Can Bo Sung

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-UX-UM-001 | Hien loi canh the, khong chi toast | Mo form Them User, nhap du lieu sai | 1. Bam Luu | email=`sai`, pass=`1` | Ngoai Toast con phai co text đo canh tung o input | Nguoi dung biet cu the cho nao loi | P2 |
| UI-UX-UM-002 | Submit loading xuyen suot qua trinh goi API | Form Them User | 1. Nhap du form; 2. Bam Luu | Data hop le | Nut Luu bien thanh dang quay (spinner) hoac Disabled | Ngan khong cho user spam click gay loi tao 2 user | P2 |
| UI-UX-DB-001 | Hieu ung Loading khung Dashboard | Thay doi bo loc thoi gian | 1. Chon loc 1 thang | filter=`1month` | Cac bieu do co the Skeletion hoac khoi xam mờ cho đên khi data vê | Khong giat cuc UI hoac đe so 0 trong khi đoi API | P2 |

---

## 6. Bo Smoke Test Nen Chay Thuong Xuyen

| Thu tu | Testcase | ID lien quan |
| ---: | --- | --- |
| 1 | Hien thi tong quan Dashboard | UI-DB-001 |
| 2 | Them User thanh cong | UI-UM-005 |
| 3 | Username da ton tai (Loi) | UI-UM-008 |
| 4 | Loc User theo Vai tro (Role) | UI-UM-003 |
| 5 | Phan trang danh sach User | UI-UM-001 |
| 6 | Khoa (Lock) tai khoan thanh cong | UI-UM-009 |
| 7 | Bỏ trong cac field bat buoc khi tao User | UI-UM-004 |

---

## 7. Ket luan

Bo testcase nang cap nay dap ung đung tinh chat Black-box UI Test:
1. Thao tac giong thet user (Chon dropdown, bo trong o, go chu vao ô).
2. Kiem dinh phan hoi giao dien thay vi chi check data, đac biet quan tam den (Empty State, Loading, Toast, Disabled buttons, Validation text).
3. Phan loai uu tien giup team biet đieu gi anh huong den Main flow (Tao User) va đieu gi la UX Enhancement.
