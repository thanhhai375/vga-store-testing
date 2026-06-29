# Quy Dinh Chung Ve Automation, CI Va Jira

Tai lieu nay dung cho tat ca thanh vien khi viet test automation. Muc tieu la moi nguoi dat branch, commit va chay CI thong nhat de GitHub Actions chi test dung phan minh lam, dong thoi log loi dung Jira task.

---

## 1. Nguyen tac bat buoc

- Moi commit phai co ma Jira, vi du `KCPM-81`.
- Branch phai the hien ro dang lam API/Postman hay FE UI.
- Chi commit file lien quan den task cua minh.
- Khong commit file sinh ra khi chay test, vi du `automation/reports/`.
- Khong dung `git add .` neu workspace co file khong lien quan.

Vi du commit dung:

```bash
git commit -m "KCPM-81 add auth UI tests"
```

---

## 2. Quy uoc branch

### API/Postman

Dung cho black-box API/Postman:

```text
feature/<jira-key>-<module>-api
fix/<jira-key>-<module>-api
bugfix/<jira-key>-<module>-api
```

Vi du:

```text
feature/KCPM-87-auth-api
fix/KCPM-88-user-api
```

### FE UI

Dung cho UI/E2E test hoac fix loi FE:

```text
fe/<ten-nguoi>-<module>-ui
fixFe/<ten-nguoi>-<module>-ui
```

Vi du:

```text
fe/tanvinh-auth-ui
fixFe/hai-cart-payment-ui
```

`fe/...` dung khi viet testcase UI.  
`fixFe/...` dung khi fix loi FE do testcase UI phat hien.

---

## 3. CI se chay module nao

### FE UI

CI chon UI test theo ten module trong branch/commit:

| Tu khoa | Thu muc test |
| --- | --- |
| `auth`, `authentication` | `automation/E2E/modules/1_Authentication/*_test.js` |
| `shopping`, `shopping-experience`, `shop` | `automation/E2E/modules/2_Shopping_Experience/*_test.js` |
| `cart-payment`, `cart`, `payment` | `automation/E2E/modules/3_Cart&Payment/*_test.js` |
| `product-category`, `product`, `category` | `automation/E2E/modules/4_Product&Category_Management/*_test.js` |
| `order`, `order-management` | `automation/E2E/modules/5_Order_Management/*_test.js` |
| `dashboard`, `user-management`, `dashboard-user` | `automation/E2E/modules/6_Dashboard&User_Management/*_test.js` |
| `profile`, `user-profile` | `automation/E2E/modules/7_User_Profile/*_test.js` |

Neu branch la `fe/...` hoac `fixFe/...`, CI se bo qua Postman/API va chi chay UI test cua module phu hop.

### API/Postman

CI chay script co format:

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

---

## 4. Cach lam viec

### Tao branch moi

Luon tao branch tu `sprint7` moi nhat:

```bash
git switch sprint7
git pull origin sprint7
git switch -c fe/<ten-nguoi>-<module>-ui
```

Hoac voi API:

```bash
git switch -c feature/<jira-key>-<module>-api
```

### Chay test local

Vao thu muc automation:

```bash
cd automation
npm install
```

Chay FE UI theo module:

```bash
npm run test:auth:fe
```

Hoac chay truc tiep:

```bash
npx codeceptjs run "E2E/modules/1_Authentication/*_test.js" --steps
```

Chay API/Postman:

```bash
npm run test:auth:blackbox
```

### Commit va push

Chi add file lien quan:

```bash
git add <file-lien-quan>
git commit -m "KCPM-81 add auth UI tests"
git push -u origin <branch>
```

---

## 5. Quy tac testcase

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

## 6. Jira se ghi gi khi fail

Khi CI fail, workflow se tao hoac cap nhat subtask/issue duoi task cha.

### FE UI fail

Jira se ghi ngan gon:

```text
FAILED FILE
FAILED TESTCASE
Failure reason
Failure location
Screenshot artifact
Fix hint
```

### API/Postman fail

Jira se ghi ngan gon:

```text
FAILED FILE
Script
Failed API request/assertion summary
Failure reason
Response/status context
Fix hint
```

Log day du va screenshot nam trong GitHub Actions artifact, khong dua log dai vao Jira.

---

## 7. Loi moi va loi lap lai

CI phan biet loi bang:

```text
Task Jira + file fail + testcase fail
```

- Cung testcase fail lai: update/comment vao subtask cu.
- Testcase fail moi: tao subtask/issue moi.

---

## 8. Labels va due date

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

Khi CI pass, workflow co gang comment pass va chuyen subtask loi sang Done/Resolved.

---

## 9. Quy trinh fix loi

1. Mo subtask loi tren Jira.
2. Doc `FAILED TESTCASE` hoac API assertion summary.
3. Xem `Failure reason`, `Fix hint`, screenshot/log artifact.
4. Tao branch fix:

```text
fixFe/<ten-nguoi>-<module>-ui
fix/<jira-key>-<module>-api
```

5. Sua code/test.
6. Chay test local.
7. Commit voi cung ma Jira.
8. Push de CI chay lai.

---

## 10. Merge vao sprint7

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

## 11. Loi can tranh

- Commit thieu ma Jira.
- Branch FE khong co ten module, vi du `fe/tanvinh`.
- Dung `git add .` khi co file khong lien quan.
- Commit `automation/reports/`.
- Dua log CodeceptJS/Newman qua dai vao Jira.
- Dung chung `testId` cho nhieu testcase API trong cung module.
- Merge branch test fail vao `sprint7` khi team yeu cau CI xanh.
