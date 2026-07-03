# Report: Bo Testcase UI Product Black-box Qua Submit

**Du an:** VGA Store  
**Module:** Product UI (User Side)  
**Pham vi:** Hien thi danh sach, Tim kiem, Loc & Sap xep, Xem chi tiet san pham  
**Loai test:** UI/E2E black-box theo hanh vi nguoi dung  
**Nguyen tac:** Nguoi dung khong biet logic backend. Moi testcase chinh deu di qua hanh vi tuong tac giao dien (chon loc, nhap tim kiem, bam nut, click san pham), sau do kiem tra UI phan hoi.

---

## 1. Muc tieu

Bo testcase nay dung de danh gia module Product (phia nguoi dung) theo goc nhin nguoi dung:

- Danh sach san pham hien thi day du thong tin (anh, ten, gia, hang).
- Tinh nang tim kiem tra ve ket qua chinh xac, khong phan biet hoa/thuong.
- Bo loc (hang, sap xep theo gia) hoat dong dung logic.
- Trang chi tiet san pham hien thi day du: thong so ky thuat, anh, gia dung dinh dang.
- Truong hop san pham khong ton tai duoc xu ly ro rang.
- Nut Load More tai them san pham khong bi loi.

---

## 2. Mau testcase su dung

| Thanh phan | Noi dung |
| --- | --- |
| Precondition | Trang thai ban dau truoc khi test |
| Steps | Cac thao tac cua nguoi dung |
| Test data | Du lieu dau vao / tham so URL |
| Expected after action | Ket qua mong doi sau khi thao tac |
| Pass condition | Dieu kien de xem testcase pass |

Ghi chu:

- Cac testcase BVA (TC_PROD_031–037) kiem tra bien gia tri bien cua tham so loc gia qua URL. Pass condition la he thong khong crash va phan hoi hop le.
- Cac testcase chi tiet san pham (TC_PROD_021–023) lay ID dong tu API backend de tranh phu thuoc du lieu cu.

---

## 3. Hien thi Danh sach San pham

| ID | Testcase | Precondition | Steps | Test data | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_001 | Hien thi danh sach VGA hop le | Trang /products da load | 1. Mo trang /products; 2. Quan sat danh sach | Khong co bo loc | Danh sach card hien thi du: anh, ten, gia | Co `.product-card`, `.card-image`, `.card-name`, `.new-price` | P1 |
| TC_PROD_002 | So luong san pham lon hon 0 | Da co du lieu trong DB | 1. Mo trang /products; 2. Dem so card | Khong co bo loc | It nhat 1 san pham duoc hien thi | `grabNumberOfVisibleElements('.product-card') > 0` | P1 |
| TC_PROD_003 | Hinh anh VGA khong bi loi | Da co du lieu anh trong DB | 1. Mo trang /products; 2. Kiem tra toan bo img | Khong co bo loc | Phan lon anh load duoc, khong qua 50% bi broken | So anh bi loi < tong so anh / 2 | P2 |
| TC_PROD_004 | Gia VGA dung dinh dang tien te | Da co du lieu gia trong DB | 1. Mo trang /products; 2. Kiem tra tung gia tren card | Khong co bo loc | Gia hien thi co ky hieu d, VND hoac ₫ | Moi `.new-price` khop regex `[\d.,]+\s*(d\|VND\|₫)` | P1 |
| TC_PROD_005 | Ten san pham khong rong tren card | Da co du lieu ten trong DB | 1. Mo trang /products; 2. Kiem tra tung `.card-name` | Khong co bo loc | Moi card co ten san pham khac chuoi rong | Moi `.card-name` co `innerText.trim()` khac rong | P1 |

---

## 4. Load More / Phan trang

| ID | Testcase | Precondition | Steps | Test data | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_006 | Trang danh sach co san pham va result-count | Da co du lieu | 1. Mo trang /products; 2. Quan sat | Khong co bo loc | Co san pham va thong tin so ket qua | Co `.product-card` va `.result-count` | P1 |
| TC_PROD_007 | Load More tai them san pham | Co hon 1 trang san pham | 1. Mo trang /products; 2. Dem so card; 3. Bam `.btn-load-more`; 4. Dem lai | Khong co bo loc | So card tang len sau khi bam | `after > before` | P1 |

---

## 5. Tim kiem San pham

| ID | Testcase | Precondition | Steps | Test data | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_013 | Tim kiem chinh xac ten san pham | San pham "RTX 4060" ton tai trong DB | 1. Mo /products; 2. Nhap tu khoa; 3. Nhan Enter | search=`RTX 4060` | Chi hien san pham co ten khop | Co `.product-card`, trang hien chu "RTX 4060" | P1 |
| TC_PROD_014 | Tim kiem khong phan biet hoa/thuong | Co san pham ten co "RTX" | 1. Mo /products; 2. Nhap `rtx`; 3. Nhan Enter | search=`rtx` | He thong van tim ra san pham phu hop | So card > 0 | P1 |

---

## 6. Loc & Sap xep San pham

| ID | Testcase | Precondition | Steps | Test data | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_015 | Sap xep gia thap den cao | Co du lieu gia | 1. Mo /products; 2. Chon option `price_asc` | sortBy=`price_asc` | Danh sach sap xep tang dan theo gia | Moi `prices[i] >= prices[i-1]` | P1 |
| TC_PROD_016 | Sap xep gia cao den thap | Co du lieu gia | 1. Mo /products; 2. Chon option `price_desc` | sortBy=`price_desc` | Danh sach sap xep giam dan theo gia | Moi `prices[i] <= prices[i-1]` | P1 |
| TC_PROD_017 | Loc hang AMD co ket qua | Co san pham AMD trong DB | 1. Mo /products; 2. Tick filter "AMD" | brand=`AMD` | Chi hien san pham AMD, so luong > 0 | `grabNumberOfVisibleElements('.product-card') > 0` | P1 |
| TC_PROD_018 | Loc hang Intel Arc khong crash | Co the khong co san pham Intel Arc | 1. Mo /products; 2. Tick filter "Intel Arc" | brand=`Intel Arc` | Trang khong crash, UI van hien thi binh thuong | Co `.shop-layout` | P2 |
| TC_PROD_019 | Ket hop loc AMD + sap xep gia tang dan | Co san pham AMD | 1. Tick AMD; 2. Chon `price_asc` | brand=`AMD`, sortBy=`price_asc` | Ket qua loc co san pham AMD, sap xep dung | So card > 0, khong loi | P1 |

---

## 7. Chi tiet San pham

| ID | Testcase | Precondition | Steps | Test data | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_020 | Xem chi tiet san pham VGA | Co san pham trong danh sach | 1. Mo /products; 2. Click ten san pham dau tien | Khong co | Chuyen sang trang chi tiet, hien day du thong tin | Co `.product-detail-page`, `.product-title`, `.current-price` | P1 |
| TC_PROD_021 | Thong so ky thuat hien trong trang chi tiet | San pham co ID lay tu API ton tai | 1. Lay ID tu API; 2. Mo /product/:id; 3. Kiem tra specs | id lay dong tu `/api/products?size=1` | Bang thong so ky thuat hien thi | Co `.specs-table` | P1 |
| TC_PROD_022 | Hinh anh trong trang chi tiet khong bi loi | San pham co anh | 1. Mo /product/:id; 2. Kiem tra img | id lay dong | Anh chinh load thanh cong | `img.complete && img.naturalWidth > 0` | P1 |
| TC_PROD_023 | Gia trong trang chi tiet dung dinh dang | San pham co gia | 1. Mo /product/:id; 2. Kiem tra `.current-price` | id lay dong | Gia co ky hieu tien te hop le | Khop regex `[\d.,]+\s*(d\|VND\|₫)` | P1 |
| TC_PROD_024 | San pham khong ton tai hien loi | Khong co san pham ID 99999 | 1. Mo /product/99999; 2. Doi UI phan hoi | id=`99999` | App hien component loi thay vi trang trang | Co `.detail-error` | P1 |

---

## 8. BVA – Loc Gia Bien (Boundary Value Analysis)

Tat ca cac testcase nay kiem tra tham so URL loc gia theo ky thuat phan tich gia tri bien. Pass condition la he thong khong crash va tra ve UI hop le.

| ID | Testcase | Loai bien | Test data (URL param) | Expected after action | Pass condition | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| TC_PROD_031 | minPrice=0 (bien min hop le) | Valid – bien min | `minPrice=0&maxPrice=20000000` | Danh sach hien thi binh thuong | Co `.shop-product-grid`, khong co "Loi" | P1 |
| TC_PROD_032 | minPrice am (duoi bien min) | Invalid – duoi min | `minPrice=-1500000` | He thong xu ly gracefully | Co `.shop-product-grid`, khong crash | P1 |
| TC_PROD_033 | maxPrice am (duoi bien min) | Invalid – duoi min | `maxPrice=-5000000` | He thong xu ly gracefully | Co `.shop-product-grid`, khong crash | P1 |
| TC_PROD_034 | minPrice > maxPrice (logic bien sai) | Invalid – logic | `minPrice=20000000&maxPrice=5000000` | He thong xu ly gracefully | Co `.shop-product-grid`, khong crash | P1 |
| TC_PROD_035 | maxPrice=0 (bien dac biet) | Valid/Edge – bien | `minPrice=0&maxPrice=0` | Tra ve list rong hoac san pham gia 0d | Khong co "Loi he thong", co `.shop-product-grid` | P2 |
| TC_PROD_036 | minPrice Overflow (vuot max) | Invalid – vuot bien | `minPrice=9999999999999999` | He thong xu ly gracefully | Khong co "Loi he thong", co `.shop-product-grid` | P1 |
| TC_PROD_037 | maxPrice Overflow (vuot max) | Invalid – vuot bien | `maxPrice=9999999999999999` | He thong xu ly gracefully | Khong co "Loi he thong", co `.shop-product-grid` | P1 |

---

## 9. Bo Smoke Test Nen Chay Thuong Xuyen

| Thu tu | Testcase | ID lien quan |
| ---: | --- | --- |
| 1 | Hien thi danh sach VGA hop le | TC_PROD_001 |
| 2 | So luong san pham lon hon 0 | TC_PROD_002 |
| 3 | Tim kiem chinh xac "RTX 4060" | TC_PROD_013 |
| 4 | Sap xep gia thap den cao | TC_PROD_015 |
| 5 | Loc hang AMD co ket qua | TC_PROD_017 |
| 6 | Xem chi tiet san pham | TC_PROD_020 |
| 7 | San pham khong ton tai hien loi | TC_PROD_024 |
| 8 | minPrice am khong crash | TC_PROD_032 |

---

## 10. Ket luan

Bo testcase nay phu hop voi UI black-box vi khong dua vao code noi bo hay gia dinh nguoi dung biet rule backend. Moi case deu xuat phat tu hanh vi that:

1. Nguoi dung mo trang danh sach san pham.
2. Nguoi dung tuong tac: tim kiem, chon loc, sap xep, bam vao san pham.
3. UI phai phan hoi dung, ro rang va khong crash du du lieu dau vao bien.

Neu testcase BVA fail (TC_PROD_032–037), day la tin hieu can kiem tra lai phan xu ly tham so URL tren FE hoac validate dau vao tren BE. Tat ca cac case deu duoc viet theo nguyen tac khong phu thuoc ID cu dinh trong DB — ID san pham duoc lay dong tu API de dam bao test on dinh theo thoi gian.
