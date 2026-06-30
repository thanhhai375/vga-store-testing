# Quy Dinh Chung Ve Automation, CI Va Jira

Tai lieu nay dung cho tat ca thanh vien khi viet test automation. Muc tieu la GitHub Actions chi chay dung module dang lam va ghi ket qua dung Jira task.

---

## 1. Nguyen tac chung

- Branch nen co ma Jira va ten module.
- Commit nen co ma Jira, vi du `KCPM-91`.
- Chi commit file lien quan den task cua minh.
- Khong commit file sinh ra khi chay test, vi du `automation/reports/`.
- Khong dung `git add .` khi workspace co file khong lien quan.

Vi du commit dung:

```bash
git commit -m "KCPM-91 test(cart): add black-box Postman test cases"
```

---

## 2. Quy uoc branch

### API/Postman

Dung cho black-box API/Postman:

```text
feature/<jira-key>-<module>-api
feature/<jira-key>-<ten-nguoi>-<module>-api
fix/<jira-key-subtask>-<module>-api
bugfix/<jira-key>-<module>-api
```

Vi du:

```text
feature/KCPM-91-cart-api
feature/KCPM-87-tanvinh-auth-api
fix/KCPM-157-auth-api
```

### FE UI

Dung cho UI/E2E test:

```text
fe/<jira-key>-<module>-fe
fe/<jira-key>-<ten-nguoi>-<module>-fe
fixFe/<jira-key-subtask>-<module>-fe
```

Vi du:

```text
fe/KCPM-81-auth-fe
fe/KCPM-81-tanvinh-auth-fe
fixFe/KCPM-158-auth-fe
```

`feature/...` va `fix/...` dung cho API/Postman.  
`fe/...` va `fixFe/...` dung cho FE UI.  
`whitebox/...` va `fixWhitebox/...` dung cho backend white-box.

---

## 3. CI chon test nhu the nao

CI doc branch va commit message de tim:

```text
Jira key -> ghi ket qua vao task nao
module   -> chay test nao
```

Neu branch/commit khong khop module nao, CI phai fail ro loi chon module. CI khong duoc fallback chay tat ca module tren branch ca nhan.

---

## 4. API/Postman modules

CI chay npm script theo format:

```text
test:<module>:blackbox
```

Danh sach module hien co:

| Module keyword | Script |
| --- | --- |
| `auth`, `authentication`, `KCPM-87` | `npm run test:auth:blackbox` |
| `user`, `user-api`, `KCPM-88` | `npm run test:user:blackbox` |
| `product-user`, `KCPM-89` | `npm run test:product-user:blackbox` |
| `product-admin`, `admin-product`, `KCPM-90` | `npm run test:product-admin:blackbox` |
| `cart`, `KCPM-91` | `npm run test:cart:blackbox` |
| `payment`, `KCPM-92` | `npm run test:payment:blackbox` |
| `admin`, `admin-api`, `KCPM-93` | `npm run test:admin:blackbox` |

Vi du:

```text
feature/KCPM-91-cart-api
```

Chi chay:

```bash
npm run test:cart:blackbox
```

---

## 5. FE UI modules

CI chay npm script theo format:

```text
test:<module>:fe
```

Danh sach module hien co:

| Module keyword | Folder E2E | Script |
| --- | --- | --- |
| `auth`, `authentication`, `KCPM-81` | `E2E/modules/1_Authentication` | `npm run test:auth:fe` |
| `shopping`, `KCPM-82` | `E2E/modules/2_Shopping_Experience` | `npm run test:shopping:fe` |
| `cart`, `payment`, `KCPM-83` | `E2E/modules/3_Cart&Payment` | `npm run test:cart:fe` |
| `product`, `category`, `KCPM-84` | `E2E/modules/4_Product&Category_Management` | `npm run test:product:fe` |
| `order`, `KCPM-85` | `E2E/modules/5_Order_Management` | `npm run test:order:fe` |
| `dashboard`, `KCPM-86` | `E2E/modules/6_Dashboard&User_Management` | `npm run test:dashboard:fe` |
| `profile`, `user-profile`, `KCPM-116` | `E2E/modules/7_User_Profile` | `npm run test:profile:fe` |

Vi du:

```text
fe/KCPM-82-shopping-fe
```

Chi chay:

```bash
npm run test:shopping:fe
```

---

## 6. Tao branch moi

Luon tao branch tu `sprint7` moi nhat:

```bash
git switch sprint7
git pull origin sprint7
git switch -c feature/KCPM-91-cart-api
```

Hoac voi FE:

```bash
git switch sprint7
git pull origin sprint7
git switch -c fe/KCPM-83-cart-fe
```

Hoac voi white-box:

```bash
git switch sprint7
git pull origin sprint7
git switch -c whitebox/KCPM-128-auth
```

---

## 7. Thanh vien da push branch truoc khi CI chung duoc sua

Neu thanh vien da co branch rieng, vi du:

```text
feature/KCPM-91-cart-api
```

Thi cap nhat workflow moi tu `sprint7` bang:

```bash
git status
git fetch origin
git merge origin/sprint7
git push
```

Khong bat buoc sua message cua merge commit neu branch da co Jira key. Neu Git cho sua message, co the ghi:

```text
KCPM-91 merge latest CI rules from sprint7
```

Neu co conflict o file CI chung, uu tien giu ban moi tu `sprint7` cho:

```text
.github/workflows/ci.yml
automation/package.json
```

---

## 8. Chay test local

Vao thu muc automation:

```bash
cd automation
npm install
```

Chay API/Postman:

```bash
npm run test:cart:blackbox
```

Chay FE UI:

```bash
npm run test:cart:fe
```

Chay backend white-box:

```bash
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=AuthIntegrationTest test
```

Voi module khac, doi ten class test tuong ung, vi du:

```bash
.\mvnw.cmd -Pwhitebox -Dtest=CartIntegrationTest test
.\mvnw.cmd -Pwhitebox -Dtest=ProductAdminIntegrationTest test
```

Quy uoc thu muc white-box:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/<module>/.../*Test.java
```

Neu can chay truc tiep CodeceptJS:

```bash
npx codeceptjs run "E2E/modules/3_Cart&Payment/*_test.js" --steps
```

---

## 9. Commit va push

Chi add file lien quan:

```bash
git add <file-lien-quan>
git commit -m "KCPM-91 test(cart): add black-box Postman test cases"
git push -u origin feature/KCPM-91-cart-api
```

Khong dung:

```bash
git add .
```

Neu dang fix subtask loi do CI tao ra, dung Jira key cua subtask:

```bash
git commit -m "KCPM-157 fix cart API total price validation"
```

---

## 10. Quy tac testcase

### FE UI

FE UI test theo hanh vi nguoi dung:

1. Mo man hinh/form.
2. Nhap du lieu.
3. Bam Submit/Action.
4. Kiem tra UI phan hoi.

Ten testcase nen co ID ro rang:

```javascript
Scenario('UI-RG-010: Register voi password qua ngan bi tu choi sau submit', ({ I }) => {
  ...
});
```

### API/Postman

CSV nen co cac cot chinh:

```csv
testId,testType,expectedStatus,expectedMessage,ExpectedResult
```

Moi assertion trong Postman nen co `testId` de khi fail Jira doc duoc loi.

---

## 11. Jira se ghi gi khi fail

Khi CI fail, workflow se tao hoac cap nhat subtask/issue duoi task cha.

FE UI fail:

```text
FAILED FILE
FAILED TESTCASE
Failure reason
Failure location
Screenshot artifact
Fix hint
```

API/Postman fail:

```text
FAILED FILE
Script
Failed API request/assertion summary
Failure reason
Response/status context
Fix hint
```

White-box fail:

```text
FAILED FILE
FAILED TESTCASE
Failure reason
Failure location
Coverage artifact
Fix hint
```

Log day du va screenshot nam trong GitHub Actions artifact, khong dua log dai vao Jira.

---

## 12. Loi moi va loi lap lai

CI phan biet loi bang:

```text
Task Jira + file/script fail + testcase fail
```

- Cung testcase fail lai: update/comment vao subtask cu.
- Testcase fail moi: tao subtask/issue moi.

---

## 13. Labels va due date

Workflow tu set:

```text
Parent = task Jira trong commit/branch
Assignee = nguoi commit neu map duoc email Jira
Due date = ngay hien tai + JIRA_DUE_DAYS
```

Labels API/Postman:

```text
automation-test, blackbox, github-actions, ci-failure, api, newman, postman, module-...
```

Labels FE UI:

```text
automation-test, blackbox, github-actions, ci-failure, ui, fe, codeceptjs, module-...
```

Labels white-box:

```text
automation-test, github-actions, ci-failure, whitebox, backend, junit, maven, jacoco, module-...
```

Khi CI pass, workflow co gang comment pass va chuyen subtask loi sang Done/Resolved.

---

## 14. Quy trinh fix loi

1. Mo subtask loi tren Jira.
2. Doc `FAILED TESTCASE` hoac API assertion summary.
3. Xem `Failure reason`, `Fix hint`, screenshot/log artifact.
4. Tao branch fix bang Jira key cua subtask.
5. Sua code/test.
6. Chay test local.
7. Commit voi Jira key cua subtask.
8. Push de CI chay lai.

Vi du:

```text
fixFe/KCPM-158-auth-fe
fix/KCPM-157-cart-api
fixWhitebox/KCPM-160-auth
```

---

## 15. Merge vao sprint7

Nen tao PR vao `sprint7`, khong merge truc tiep neu team chua thong nhat.

PR nen ghi:

```text
Summary
Module
Test da them/sua
Ket qua local
Known failures neu co
```

Neu `sprint7` can xanh/pass, khong merge branch con test fail chua duoc chap nhan.

---

## 16. Loi can tranh

- Branch thieu Jira key.
- Branch thieu ten module.
- Commit thieu Jira key khi viet test/fix loi.
- Dung `feature/...` cho FE UI hoac dung `fe/...` cho API/Postman.
- Dung sai `whilebox`; ten dung la `whitebox`.
- Dung `git add .` khi co file khong lien quan.
- Commit `automation/reports/`.
- Dua log CodeceptJS/Newman qua dai vao Jira.
- Dung chung `testId` cho nhieu testcase API trong cung module.
- Merge branch test fail vao `sprint7` khi team yeu cau CI xanh.
