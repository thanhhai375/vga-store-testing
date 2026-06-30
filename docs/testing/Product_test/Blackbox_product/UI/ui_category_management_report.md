# Report: Bo Testcase UI Category & Product Management Black-box Qua Submit

**Du an:** VGA Store  
**Module:** Product & Category Management (Admin Side)  
**Pham vi:** Them moi san pham, Cap nhat san pham, Xoa san pham, Kiem soat truy cap, Phan trang admin, Tim kiem admin  
**Loai test:** UI/E2E black-box theo hanh vi nguoi dung  
**Nguyen tac:** Tester khong biet logic backend. Moi testcase deu di qua hanh vi thao tac tren giao dien admin (dien form, bam nut, tim kiem, phan trang), sau do kiem tra UI phan hoi dung.

---

## 1. Muc tieu

Bo testcase nay dung de danh gia module quan ly san pham phia Admin theo goc nhin nguoi dung quan tri:

- Admin dien form hop le thi them/sua san pham thanh cong.
- Admin de trong truong bat buoc thi UI bao loi validation, khong tao san pham.
- Admin co the sua thong tin san pham qua nut "Sua" va luu thanh cong.
- Truy cap trang sua san pham khong ton tai duoc xu ly gracefully.
- Admin xoa san pham thanh cong, san pham bien mat khoi danh sach.
- User thuong truy cap trang admin bi redirect ve login (kiem soat truy cap).
- Cac BVA loc gia va phan trang hoat dong on dinh, khong crash he thong.
- Tim kiem san pham trong admin tra ve ket qua chinh xac.

---

## 2. Mau testcase su dung

| Thanh phan | Noi dung |
| --- | --- |
| Precondition | Trang thai ban dau truoc khi test |
| Steps | Cac thao tac cua nguoi dung |
| Test data | Du lieu nhap vao form / tham so URL |
| Expected after submit/action | Ket qua mong doi sau khi bam Submit/Action |
| Pass condition | Dieu kien de xem testcase pass |

Ghi chu:

- Truoc moi testcase, `Before()` tu dong dang nhap Admin va vao trang quan ly san pham.
- TC_PROD_029 tu tao san pham moi de xoa, tranh anh huong du lieu san pham thuc.
- Cac testcase BVA (TC_PROD_031–037) kiem tra phia user frontend de kiem tra xu ly bien gia tri.
- Cac testcase phan trang admin (TC_PROD_038–042) kiem tra truc tiep tren giao dien admin.

---

## 3. Them moi San pham (POST)

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_025 | Admin them moi san pham VGA thanh cong | Da dang nhap Admin; dang o `/products/new` | 1. Mo `/products/new`; 2. Dien ten san pham; 3. Dien gia ban; 4. Dien ton kho; 5. Bam "Luu san pham" | name=`VGA Test Auto <timestamp>`; price=`45000000`; stock=`10` | SweetAlert2 popup thanh cong xuat hien | Co `.swal2-popup` | P1 |
| TC_PROD_026 | Admin them san pham thieu ten → bao loi validation | Da dang nhap Admin; dang o `/products/new` | 1. Mo `/products/new`; 2. Bo trong ten; 3. Chi dien gia; 4. Bam "Luu san pham" | name=`""`; price=`45000000` | He thong tu choi, khong tao san pham moi | Van o URL `/products/new`, khong redirect | P1 |

---

## 4. Cap nhat San pham (PUT)

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_027 | Admin cap nhat thong tin san pham thanh cong | Da dang nhap Admin; co san pham trong bang | 1. O trang `/products`; 2. Bam nut "Sua" cua dong dau tien; 3. Xoa va nhap gia moi; 4. Bam "Luu san pham" | price=`12500000` | SweetAlert2 popup thanh cong xuat hien | Co `.swal2-popup` | P1 |
| TC_PROD_028 | Admin truy cap trang sua san pham khong ton tai → xu ly gracefully | Da dang nhap Admin | 1. Mo URL `/products/99999/edit`; 2. Doi UI phan hoi | id=`99999` | App khong crash, redirect hoac hien thong bao phu hop | Co the o /login, /products hoac hien form rong — khong co trang trang | P2 |

---

## 5. Xoa San pham (DELETE)

| ID | Testcase | Precondition | Steps | Test data | Expected after submit/action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_029 | Admin xoa san pham thanh cong | Da dang nhap Admin; co san pham trong bang | 1. Them moi san pham `DELETE_ME_<time>`; 2. Quay ve danh sach; 3. Bam nut "Xoa" dong dau tien; 4. Xac nhan neu co popup | name=`DELETE_ME_<timestamp>` | San pham vua xoa khong con xuat hien o dong dau danh sach | `dontSee(deleteName, 'table tbody tr:first-child')` | P1 |
| TC_PROD_030 | Truy cap trang admin khi chua dang nhap → redirect ve login | Chua dang nhap (sau logout) | 1. Dang xuat; 2. Mo URL `/products` cua admin | Khong ap dung | He thong redirect ve trang login | URL chua `/login` | P1 |

---

## 6. BVA – Loc Gia Bien (Boundary Value Analysis – User Frontend)

Cac testcase nay kiem tra tham so URL loc gia tren trang user frontend theo ky thuat BVA. Pass condition la he thong khong crash va tra ve giao dien hop le.

| ID | Testcase | Loai bien | Test data (URL param) | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_031 | minPrice=0, maxPrice=20tr (bien min hop le) | Valid – bien min | `minPrice=0&maxPrice=20000000` | Danh sach hien thi binh thuong | Co `.shop-product-grid`, khong co "Loi" | P1 |
| TC_PROD_032 | minPrice am (duoi bien min) | Invalid – duoi min | `minPrice=-1500000` | He thong xu ly gracefully, khong crash | Co `.shop-product-grid` | P1 |
| TC_PROD_033 | maxPrice am (duoi bien min) | Invalid – duoi min | `maxPrice=-5000000` | He thong xu ly gracefully, khong crash | Co `.shop-product-grid` | P1 |
| TC_PROD_034 | minPrice > maxPrice (logic bien sai) | Invalid – logic | `minPrice=20000000&maxPrice=5000000` | He thong xu ly gracefully, khong crash | Co `.shop-product-grid` | P1 |
| TC_PROD_035 | maxPrice=0 (bien dac biet) | Valid/Edge | `minPrice=0&maxPrice=0` | List rong hoac san pham gia 0d, khong crash | Khong co "Loi he thong", co `.shop-product-grid` | P2 |
| TC_PROD_036 | minPrice Overflow (vuot max) | Invalid – vuot bien | `minPrice=9999999999999999` | He thong xu ly gracefully, khong crash | Khong co "Loi he thong", co `.shop-product-grid` | P1 |
| TC_PROD_037 | maxPrice Overflow (vuot max) | Invalid – vuot bien | `maxPrice=9999999999999999` | He thong xu ly gracefully, khong crash | Khong co "Loi he thong", co `.shop-product-grid` | P1 |

---

## 7. BVA – Phan trang Admin (Boundary Value Analysis – Admin Frontend)

| ID | Testcase | Loai bien | Precondition | Steps | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_038 | Trang 1 phan trang admin hien thi dung | Da co du lieu | Dang o `/products` admin | Quan sat thanh phan phan trang | Pagination hien thi, trang 1 duoc active | Co `.pagination`, `.page-btn.active`, text "1" | P1 |
| TC_PROD_039 | Chuyen sang trang 2 trong admin | Co >= 2 trang du lieu | Dang o `/products` admin | Bam nut trang "2" | Trang 2 duoc active, danh sach cap nhat | `.page-btn.active` hien text "2" | P1 |
| TC_PROD_040 | Trang cuoi cung van hien thi san pham | Co nhieu trang | Dang o `/products` admin | Bam nut trang cuoi | Van co san pham hien thi | Co `table tbody tr` | P2 |

---

## 8. Tim kiem Admin

| ID | Testcase | Precondition | Steps | Test data | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_041 | Tim kiem san pham khong ton tai → bang rong | Dang o `/products` admin | 1. Nhap tu khoa khong co trong DB; 2. Doi ket qua | search=`XXXX_KHONG_TON_TAI_9999` | Bang rong hoac thong bao khong co du lieu, khong crash | Khong co "Loi he thong" | P1 |
| TC_PROD_042 | Tim kiem san pham ton tai → co ket qua | Co san pham ten chua "RTX" | 1. Nhap "RTX"; 2. Doi ket qua | search=`RTX` | It nhat 1 dong san pham hien thi | `grabNumberOfVisibleElements('table tbody tr') > 0` | P1 |

---

## 9. Bo Smoke Test Nen Chay Thuong Xuyen

| Thu tu | Testcase | ID lien quan |
| ---: | --- | --- |
| 1 | Them san pham thanh cong | TC_PROD_025 |
| 2 | Them san pham thieu ten bi tu choi | TC_PROD_026 |
| 3 | Sua san pham thanh cong | TC_PROD_027 |
| 4 | Xoa san pham thanh cong | TC_PROD_029 |
| 5 | Chua dang nhap bi redirect login | TC_PROD_030 |
| 6 | Phan trang trang 1 hien dung | TC_PROD_038 |
| 7 | Tim kiem "RTX" co ket qua | TC_PROD_042 |
| 8 | minPrice am khong crash | TC_PROD_032 |

---

## 10. Ket luan

Bo testcase nay phu hop voi UI black-box vi khong dua vao code noi bo hay gia dinh nguoi quan tri biet rule he thong. Moi case deu xuat phat tu hanh vi that:

1. Admin mo form them/sua san pham.
2. Admin nhap du lieu va bam Submit/Action.
3. UI phai phan hoi dung: thong bao thanh cong, bao loi validation ro rang, redirect dung trang.

Neu testcase BVA fail (TC_PROD_032–037), day la tin hieu can kiem tra lai phan xu ly tham so URL loc gia tren FE. Neu TC_PROD_030 fail, day la loi nghiem trong ve kiem soat truy cap can uu tien xu ly ngay. TC_PROD_029 duoc thiet ke de tu tao va tu xoa san pham test, dam bao khong lam anh huong du lieu san pham that trong he thong.
