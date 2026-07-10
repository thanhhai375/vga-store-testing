# Assignment: Kiem thu black-box module User

**Chu de:** Phan hoach lop tuong duong, phan tich gia tri bien, thiet ke test case va kiem thu tu dong  
**Module:** User  
**Du an:** VGA Store  
**Pham vi:** Xem ho so ca nhan, them dia chi, doi mat khau  
**Hinh thuc:** Bao cao ca nhan, co the ung dung vao CI/CD

---

## 1. Muc tieu bao cao

1. Xac dinh dieu kien kiem thu cho 3 chuc nang/API User:
   - View Profile.
   - Add Address.
   - Change Password.
2. Ap dung ky thuat black-box testing:
   - Equivalence Partitioning.
   - Boundary Value Analysis.
   - Decision Table Testing.
   - State/Authentication Transition Testing.
3. Thiet ke test case co input, expected result, priority, status va tag bao phu.
4. Trien khai automation test bang Postman/Newman data-driven test.
5. Ket noi CI/CD bang script `test:user:blackbox`.

---

## 2. Mo ta bai toan

He thong VGA Store cho phep nguoi dung da dang nhap xem ho so ca nhan, them dia chi nhan hang va doi mat khau.

Bao cao nay test theo hanh vi API/input-output. Tester khong can biet code xu ly ben trong, chi quan tam input, trang thai xac thuc va output cua API.

### 2.1 View Profile

Yeu cau hop le khi user co token JWT hop le. He thong tra ve profile cua dung user dang dang nhap va khong tra thong tin nhay cam nhu password hash.

### 2.2 Add Address

Yeu cau hop le khi user co token hop le va body gom recipientName, phone, detailedAddress, isDefault. Khi isDefault=true, dia chi moi tro thanh dia chi mac dinh.

### 2.3 Change Password

Yeu cau hop le khi user co token hop le, oldPassword dung, newPassword dat chuan manh va confirmPassword khop.

---

# PHAN A. THIET KE KIEM THU BLACK-BOX

## Cau 1. Xac dinh lop tuong duong

| Function | Lop hop le chinh | Lop khong hop le chinh |
| --- | --- | --- |
| View Profile | Token hop le, user ton tai | Thieu token, token sai/het han |
| Add Address | Token hop le, address fields hop le | Thieu token, token sai, input rong/sai format |
| Change Password | Token hop le, old dung, new hop le, confirm khop | Thieu token, old sai/rong, new yeu/rong, confirm mismatch |

Chi tiet lop tuong duong nam trong:

- `User_profile_blackbox_report.md`
- `User_address_blackbox_report.md`
- `User_changePassword_blackbox_report.md`

## Cau 2. Phan tich gia tri bien

| Function | Bien ap dung BVA | Gia tri bien chinh |
| --- | --- | --- |
| View Profile | Authorization state | valid, none, invalid |
| Add Address | recipientName, phone, detailedAddress | min, nominal, max, ngoai bien |
| Change Password | newPassword length/complexity, confirmPassword | 8, 64, <8, >64, thieu complexity, mismatch |

## Cau 3. Thiet ke test case

Tong so automation test case hien co: 27

| Function/API | Test IDs | So luong |
| --- | --- | ---: |
| View Profile | UP-001 den UP-003 | 3 |
| Add Address | UA-001 den UA-006 | 6 |
| Change Password | CP-001 den CP-018 | 18 |

## Cau 4. Trien khai kiem thu tu dong

File test script:

```text
automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA Store User Blackbox.postman_collection.json
```

File test data:

```text
automation/postman/VGA-AUTH-USER/VGA-Store-USER/VGA-Store-User-Blackbox-Testcase.csv
```

File environment:

```text
automation/postman/env/VGA_Store_Environment.postman_environment.json
```

Lenh chay:

```bash
cd automation
npm run test:user:blackbox
```

Script npm:

```text
test:user:blackbox
```

Report Newman:

```text
automation/reports/user-blackbox-newman.json
```

---

# PHAN B. MAPPING REPORT SANG CSV

| Cot trong report | Cot trong CSV | Ghi chu |
| --- | --- | --- |
| Test ID | `testId` | Vi du `UP-001`, `UA-001`, `CP-001` |
| Loai chuc nang | `testType` | `PROFILE_GET`, `ADDRESS_ADD`, `CHANGE_PWD` |
| Trang thai token | `authMode` | `valid`, `none`, `invalid` |
| Recipient | `recipientName` | Dung cho Add Address |
| Phone | `phone` | Dung cho Add Address |
| Detailed address | `detailedAddress` | Dung cho Add Address |
| Is default | `isDefault` | Dung cho Add Address |
| Old password | `oldPassword` | Dung cho Change Password |
| New password | `newPassword` | Dung cho Change Password |
| Confirm password | `confirmPassword` | Dung cho Change Password |
| Expected status | `expectedStatus` | HTTP status ky vong |
| Expected message | `expectedMessage` | Chuoi Postman assert response |
| Expected result | `ExpectedResult` | Mo ta ket qua mong doi |

---

# PHAN C. KET LUAN

Module User da co bo black-box API automation theo dung format CI cua nhom:

1. View Profile: 3 test case.
2. Add Address: 6 test case.
3. Change Password: 18 test case.

Bo test tao user rieng cho tung iteration bang Auth API, sau do login lay token de dam bao test doc lap va co the chay lai nhieu lan.

Gap can cai tien tiep theo: bo sung validation cho `UserProfileRequest` va `UserAddressDto` de mo rong automation negative case cho profile/address ma khong phu thuoc loi DB.
