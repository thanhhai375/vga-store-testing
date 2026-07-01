# Black-box Report: User Profile

**Function/API:** View Profile  
**Endpoint:** `GET /api/users/profile`  
**Automation:** `test:user:blackbox`  
**CSV:** `automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv`

## 1. Lop tuong duong

| Bien/Dieu kien | Lop hop le | Tag | Lop khong hop le | Tag |
| --- | --- | --- | --- | --- |
| Authentication | Token hop le cua user dang ton tai | PV1 | Thieu token | PX1 |
| Authentication |  |  | Token sai/het han | PX2 |
| Response data | Co id, username, email, role | PV2 | Thieu field dinh danh | PX3 |
| Bao mat du lieu | Khong tra password/hash | PV3 | Lo thong tin nhay cam | PX4 |

## 2. Phan tich gia tri bien

Profile GET khong co input body nen BVA tap trung vao trang thai token:

| Bien | Hop le | Ngoai bien/khong hop le | Tag |
| --- | --- | --- | --- |
| Authorization header | `Bearer <valid-token>` | Rong/khong gui header | PB1 |
| Authorization header | `Bearer <valid-token>` | Token sai format hoac invalid | PB2 |

## 3. Test cases

| STT | Test ID | Ten test case | Auth mode | Expected status | Ket qua mong doi | Tag | Priority | Status |
| ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | UP-001 | Xem ho so thanh cong | valid | 200 | Tra ve profile co id/username/email | PV1,PV2,PV3 | High | Ready |
| 2 | UP-002 | Xem ho so khi thieu token | none | 403 | Bi tu choi truy cap | PX1 | High | Ready |
| 3 | UP-003 | Xem ho so khi token sai | invalid | 403 | Bi tu choi truy cap | PX2 | High | Ready |

## 4. Mapping automation

| Report | CSV/Postman |
| --- | --- |
| Test ID | `testId` |
| Loai function | `testType=PROFILE_GET` |
| Trang thai token | `authMode` |
| Expected HTTP status | `expectedStatus` |
| Expected message | `expectedMessage` |

Lenh chay:

```bash
cd automation
npm run test:user:blackbox
```
