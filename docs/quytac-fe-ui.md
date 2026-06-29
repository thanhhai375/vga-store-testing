# Quy Tac FE UI/E2E

## 1. Pham vi

Tai lieu nay dung cho test giao dien FE bang CodeceptJS/Playwright.

## 2. Quy uoc branch

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
test:<module>:fe
```

| Module keyword | Folder E2E | Script |
| --- | --- | --- |
| `auth`, `authentication`, `KCPM-81` | `E2E/modules/1_Authentication` | `npm run test:auth:fe` |
| `shopping`, `KCPM-82` | `E2E/modules/2_Shopping_Experience` | `npm run test:shopping:fe` |
| `cart`, `payment`, `KCPM-83` | `E2E/modules/3_Cart&Payment` | `npm run test:cart:fe` |
| `product`, `category`, `KCPM-84` | `E2E/modules/4_Product&Category_Management` | `npm run test:product:fe` |
| `order`, `KCPM-85` | `E2E/modules/5_Order_Management` | `npm run test:order:fe` |
| `dashboard`, `KCPM-86` | `E2E/modules/6_Dashboard&User_Management` | `npm run test:dashboard:fe` |
| `profile`, `user-profile`, `KCPM-116` | `E2E/modules/7_User_Profile` | `npm run test:profile:fe` |

Vi du branch:

```text
fe/KCPM-82-shopping-fe
```

Chi chay:

```bash
npm run test:shopping:fe
```

## 5. Chay local

```bash
cd automation
npm install
npm run test:cart:fe
```

Neu can chay truc tiep CodeceptJS:

```bash
npx codeceptjs run "E2E/modules/3_Cart&Payment/*_test.js" --steps
```

## 6. Quy tac testcase

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

## 7. Jira khi fail

FE UI fail se ghi:

```text
FAILED FILE
FAILED TESTCASE
Failure reason
Failure location
Screenshot artifact
Fix hint
```

Log day du va screenshot nam trong GitHub Actions artifact, khong dua log dai vao Jira.

## 8. Labels

```text
automation-test, blackbox, github-actions, ci-failure, ui, fe, codeceptjs, module-...
```

## 9. Loi can tranh

- Branch thieu Jira key.
- Branch thieu ten module.
- Commit thieu Jira key.
- Dung `feature/...` cho FE UI.
- Dua log CodeceptJS qua dai vao Jira.
