# Quy Tac Automation, Branch Va Jira CI

File nay la quy uoc chung cho ca nhom khi viet automation test va de GitHub Actions log loi len Jira dung module, dung task.

---

## 1. Nguyen tac chung

Moi commit phai co ma task Jira, vi du:

```bash
git commit -m "KCPM-81 add auth UI testcases"
```

GitHub Actions se lay ma task tu:

- Ten branch.
- Commit message.
- PR title.

Neu test fail, CI se tao hoac cap nhat subtask/issue loi duoi task cha do.

---

## 2. Quy uoc branch

### 2.1 API/Postman blackbox

Dung branch `feature/...`, `fix/...`, `bugfix/...` nhu cu.

Vi du:

```text
feature/KCPM-87-auth-api
feature/KCPM-90-product-admin
fix/KCPM-88-user-api
```

CI se chay Postman/API theo selector trong ten branch hoac commit.

### 2.2 FE UI test

Dung branch:

```text
fe/<ten-nguoi>-<module>-ui
fixFe/<ten-nguoi>-<module>-ui
```

Vi du:

```text
fe/tanvinh-auth-ui
fixFe/tanvinh-auth-ui
fe/hai-cart-payment-ui
fixFe/minh-product-category-ui
```

Y nghia:

| Prefix | Dung khi nao |
| --- | --- |
| `fe/` | Viet moi hoac bo sung testcase UI |
| `fixFe/` | Fix loi FE do testcase UI phat hien |

Khi branch la `fe/...` hoac `fixFe/...`, CI se bo qua Postman/API va chi chay UI test cua module phu hop.

---

## 3. Mapping module FE UI

CI chon file UI test theo ten module trong branch/commit:

| Module | Tu khoa branch/commit | Thu muc test |
| --- | --- | --- |
| Auth | `auth`, `authentication`, `KCPM-81` | `automation/E2E/modules/1_Authentication/*_test.js` |
| Shopping Experience | `shopping`, `shopping-experience`, `shop`, `KCPM-82` | `automation/E2E/modules/2_Shopping_Experience/*_test.js` |
| Cart & Payment | `cart-payment`, `cart`, `payment`, `KCPM-83` | `automation/E2E/modules/3_Cart&Payment/*_test.js` |
| Product & Category | `product-category`, `product`, `category`, `KCPM-84` | `automation/E2E/modules/4_Product&Category_Management/*_test.js` |
| Order | `order`, `order-management`, `KCPM-85` | `automation/E2E/modules/5_Order_Management/*_test.js` |
| Dashboard & User Management | `dashboard-user`, `dashboard`, `user-management`, `KCPM-86` | `automation/E2E/modules/6_Dashboard&User_Management/*_test.js` |
| User Profile | `profile`, `user-profile`, `KCPM-88` | `automation/E2E/modules/7_User_Profile/*_test.js` |

Vi du:

```text
fe/tanvinh-auth-ui
```

CI se chay:

```text
automation/E2E/modules/1_Authentication/*_test.js
```

Luu y: file helper nhu `auth_helpers.js` khong phai testcase, vi khong co duoi `_test.js`, nen CI khong chay truc tiep.

---

## 4. Script automation

### 4.1 API/Postman

Moi module API nen co script dung format:

```text
test:<module>:blackbox
```

Vi du:

```json
{
  "scripts": {
    "test:auth:blackbox": "newman run ...",
    "test:product-admin:blackbox": "newman run ..."
  }
}
```

### 4.2 FE UI

Co the them script rieng de chay local cho tung module:

```json
{
  "scripts": {
    "test:auth:fe": "codeceptjs run \"E2E/modules/1_Authentication/*_test.js\" --steps",
    "test:cart_payment:fe": "codeceptjs run \"E2E/modules/3_Cart&Payment/*_test.js\" --steps"
  }
}
```

Chay local:

```bash
cd automation
npm run test:auth:fe
```

---

## 5. Quy tac Postman CSV

Moi module API nen co file CSV data-driven test trong:

```text
automation/postman/<module-folder>/
```

CSV nen co cac cot:

```csv
testId,testType,expectedStatus,expectedMessage,ExpectedResult
```

Y nghia:

| Cot | Bat buoc | Y nghia |
| --- | --- | --- |
| `testId` | Co | Ma testcase, vi du `R-001`, `U-002` |
| `testType` | Co | Chuc nang/module, vi du `REGISTER`, `LOGIN` |
| `expectedStatus` | Co | HTTP status mong muon |
| `expectedMessage` | Co | Chuoi mong muon trong response |
| `ExpectedResult` | Co | Mo ta ngan ket qua mong doi |

Khong commit file report sinh ra trong:

```text
automation/reports/
```

---

## 6. Quy tac testcase FE UI

FE UI test la black-box theo hanh vi nguoi dung:

1. Mo man hinh/form.
2. Nhap du lieu.
3. Bam Submit/Action.
4. Kiem tra UI phan hoi.

Testcase nen dat ten co ID ro rang:

```javascript
Scenario('UI-RG-010: Register voi password qua ngan bi tu choi sau submit', ({ I }) => {
  ...
});
```

Nen uu tien assert:

- Modal/form con mo khi submit fail.
- Khong co token/session khi login fail.
- Field invalid hoac message loi hien ro.
- Success state hien dung sau thao tac thanh cong.
- Session/logout/protected route dung hanh vi nguoi dung.

---

## 7. Jira log khi fail

### 7.1 API/Postman fail

Subtask Jira se ghi ngan gon:

```text
FAILED FILE
Script
Branch
Commit
Failed API request/assertion summary
Failure reason
Response/status context
Fix hint
```

Khong dua toan bo Newman log dai vao Jira. Log day du nam trong GitHub Actions artifact.

### 7.2 FE UI fail

Subtask Jira se ghi ngan gon:

```text
FAILED FILE
FAILED TESTCASE
Failure reason
Failure location
Screenshot artifact
Fix hint
```

Vi du:

```text
FAILED FILE: ./E2E/modules/1_Authentication/change_password_test.js
FAILED TESTCASE:
- FE-CP-001: Doi mat khau thanh cong va dang nhap bang mat khau moi

Failure reason:
element (.alert-message.success) still not visible after 10 sec

Failure location:
change_password_test.js:27

Fix hint:
Expected UI element did not appear in time. Check action result, selector, and FE feedback rendering.
```

Khong dua toan bo step log `I fill field...`, `I click...` vao Jira. Log day du va screenshot nam trong GitHub Actions artifact.

---

## 8. Loi moi va loi lap lai

CI dung fingerprint de phan biet:

```text
Task Jira + file fail + testcase fail
```

Neu cung testcase fail lai:

```text
Trang thai loi: LOI CU TAI PHAT
```

CI se comment/update subtask cu.

Neu testcase fail khac:

```text
Trang thai loi: LOI MOI
```

CI se tao subtask/issue moi.

---

## 9. Jira fields tu dong

Workflow se tu set khi fail:

```text
Parent = task co trong commit/branch, vi du KCPM-81
Assignee = nguoi commit neu map duoc email Jira
Priority = JIRA_DEFAULT_PRIORITY, mac dinh High
Due date = ngay hien tai + JIRA_DUE_DAYS
```

Neu `JIRA_DUE_DAYS` khong co, workflow fallback sang due date cua task cha neu Jira co.

Labels khi API/Postman fail:

```text
automation-test
blackbox
github-actions
ci-failure
api
newman
postman
module-...
```

Labels khi FE UI fail:

```text
automation-test
blackbox
github-actions
ci-failure
ui
fe
codeceptjs
module-...
```

Khi CI pass, workflow co gang:

- Comment CI passed.
- Them label `ci-passed`, `ci-resolved`.
- Go label loi cu.
- Chuyen subtask loi sang Done/Resolved neu Jira workflow cho phep.

---

## 10. Quy tac fix loi

1. Mo subtask loi tren Jira.
2. Doc `FAILED TESTCASE` hoac `Failed API request/assertion summary`.
3. Xem `Failure reason`, `Fix hint`, screenshot/log artifact.
4. Tao branch fix:

```text
fixFe/<ten-nguoi>-<module>-ui
```

hoac voi API:

```text
fix/<jira-key>-<module>-api
```

5. Commit voi cung ma task Jira:

```bash
git commit -m "KCPM-81 fix auth UI feedback"
```

6. Push len GitHub.
7. Neu CI pass, subtask loi se duoc comment va co gang chuyen sang Done.

---

## 11. Nhung loi can tranh

- Khong commit ma thieu ma Jira.
- Khong dung `git add .` neu workspace co nhieu file khong lien quan.
- Khong commit `automation/reports/`.
- Khong dat branch FE chung chung nhu `fe/tanvinh`; phai co module, vi du `fe/tanvinh-auth-ui`.
- Khong dua log CodeceptJS/Newman qua dai vao Jira; Jira chi can loi chinh va hint fix.
- Khong dung chung `testId` cho nhieu testcase API khac nhau trong cung module.
- Khong dat script API sai format `test:<module>:blackbox`.
