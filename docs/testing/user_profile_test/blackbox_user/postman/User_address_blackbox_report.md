# Black-box Report: User Address

**Function/API:** Add Address  
**Endpoint:** `POST /api/users/addresses`  
**Automation:** `test:user:blackbox`  
**CSV:** `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv`

## 1. Lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| --- | --- | --- | --- | --- |
| Authentication | Token hop le | AV1 | Thieu token/token sai | AX1 |
| Recipient name | 1-100 ky tu | AV2 | Rong, qua 100 ky tu | AX2 |
| Phone | So dien thoai hop le | AV3 | Rong, sai format, qua ngan/qua dai | AX3 |
| Detailed address | 1-500 ky tu | AV4 | Rong, qua 500 ky tu | AX4 |
| Default flag | true/false | AV5 | Khong phai boolean | AX5 |

## 2. Phan tich gia tri bien

| Bien dau vao | min | nominal | max | Ngoai bien | Tag |
| --- | ---: | ---: | ---: | --- | --- |
| recipientName length | 1 | 10-30 | 100 | 0, 101 | AB1-AB4 |
| phone length | 10 | 10 | 10 | 0, 9, 11, co chu cai | AB5-AB8 |
| detailedAddress length | 1 | 20-120 | 500 | 0, 501 | AB9-AB12 |
| isDefault | true/false | true/false | true/false | string/null neu backend bat buoc | AB13 |

## 3. Test cases

| STT | Test ID | Ten test case | Recipient | Phone | Address | Default | Expected status | Ket qua mong doi | Tag | Priority | Status |
| ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | UA-001 | Them dia chi mac dinh hop le | Nguyen Van A | 0987654321 | Hop le | true | 200 | Dia chi duoc them va nam trong profile | AV1-AV5 | High | Ready |
| 2 | UA-002 | Them dia chi non-default hop le | Tran Thi B | 0912345678 | Hop le | false | 200 | Dia chi duoc them, khong bat default | AV1-AV5 | High | Ready |
| 3 | UA-003 | Detailed address dat min | Le Van C | 0900000000 | 1 ky tu | false | 200 | Chap nhan gia tri bien hop le hien tai | AV4,AB9 | Medium | Ready |
| 4 | UA-004 | Detailed address dai hop le | Pham Van D | 0933445566 | Chuoi dai trong gioi han | true | 200 | Chap nhan dia chi dai hop le | AV4,AB11 | Medium | Ready |
| 5 | UA-005 | Them dia chi thieu token | No Token User | 0987654321 | Hop le | false | 403 | Bi tu choi truy cap | AX1 | High | Ready |
| 6 | UA-006 | Them dia chi token sai | Invalid Token User | 0987654321 | Hop le | false | 403 | Bi tu choi truy cap | AX1 | High | Ready |

## 4. Gap chat luong hien tai

`UserAddressDto` hien chua co `@NotBlank`, `@Size`, `@Pattern`, nen cac case rong/sai format chua nen dua vao CI pass/fail on dinh. De dat target quality, nen bo sung validation DTO va them cac case:

- recipientName rong/qua dai.
- phone rong/sai format/9 hoac 11 chu so.
- detailedAddress rong/qua 500 ky tu.

## 5. Mapping automation

| Report | CSV/Postman |
| --- | --- |
| Test ID | `testId` |
| Loai function | `testType=ADDRESS_ADD` |
| Input | `recipientName`, `phone`, `detailedAddress`, `isDefault` |
| Token | `authMode` |
| Expected HTTP status | `expectedStatus` |
| Expected message | `expectedMessage` |
