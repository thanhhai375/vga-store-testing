# Quy Tac API/Postman Black-box

## 1. Pham vi

Tai lieu nay dung cho test API black-box bang Postman/Newman.

## 2. Quy uoc branch

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

## 3. CI chon test nhu the nao

CI doc branch va commit message de tim:

```text
Jira key -> ghi ket qua vao task nao
module   -> chay test nao
```

Neu branch/commit khong khop module nao, CI fail ro loi chon module. CI khong fallback chay tat ca module tren branch ca nhan.

## 4. Danh sach module

CI chay npm script theo format:

```text
test:<module>:blackbox
```

| Module keyword | Script |
| --- | --- |
| `auth`, `authentication`, `KCPM-87` | `npm run test:auth:blackbox` |
| `user`, `user-api`, `KCPM-88` | `npm run test:user:blackbox` |
| `product-user`, `KCPM-89` | `npm run test:product-user:blackbox` |
| `product-admin`, `admin-product`, `KCPM-90` | `npm run test:product-admin:blackbox` |
| `cart`, `KCPM-91` | `npm run test:cart:blackbox` |
| `payment`, `KCPM-92` | `npm run test:payment:blackbox` |
| `admin`, `admin-api`, `KCPM-93` | `npm run test:admin:blackbox` |

Vi du branch:

```text
feature/KCPM-91-cart-api
```

Chi chay:

```bash
npm run test:cart:blackbox
```

## 5. Chay local

```bash
cd automation
npm install
npm run test:cart:blackbox
```

## 6. Quy tac testcase

CSV nen co cac cot chinh:

```csv
testId,testType,expectedStatus,expectedMessage,ExpectedResult
```

Moi assertion trong Postman nen co `testId` de khi fail Jira doc duoc loi.

## 7. Jira khi fail

API/Postman fail se ghi:

```text
FAILED FILE
Script
Failed API request/assertion summary
Failure reason
Response/status context
Fix hint
```

Log day du nam trong GitHub Actions artifact, khong dua log dai vao Jira.

## 8. Labels

```text
automation-test, blackbox, github-actions, ci-failure, api, newman, postman, module-...
```

## 9. Loi can tranh

- Branch thieu Jira key.
- Branch thieu ten module.
- Commit thieu Jira key.
- Dung `fe/...` cho API/Postman.
- Commit `automation/reports/`.
- Dung chung `testId` cho nhieu testcase API trong cung module.
