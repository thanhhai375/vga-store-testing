# Quy tac CI cho FE UI

File nay ap dung cho UI/E2E test bang CodeceptJS trong GitHub Actions.

## 1. Branch

Dung branch cho FE UI:

```text
fe/<jira-key>-<module>
fe/<jira-key>-<ten-nguoi>-<module>
fixFe/<jira-key-subtask>-<module>
```

Vi du:

```text
fe/KCPM-81-auth
fe/KCPM-83-cart
fixFe/KCPM-158-auth
```

Ten module nen dat ngan theo quy uoc:

```text
auth      -> Authentication
shop      -> Shopping Experience
cart      -> Cart & Payment
product   -> Product & Category Management
order     -> Order Management
dashboard -> Dashboard & User Management
profile   -> User Profile
```

Vi du branch theo module:

```text
fe/KCPM-81-auth
fe/KCPM-82-shop
fe/KCPM-83-cart
fe/KCPM-84-product
fe/KCPM-85-order
fe/KCPM-86-dashboard
fe/KCPM-88-profile
```

CI doc `branch name`, `PR title`, va `commit message` de lay Jira key va module can chay.

## 2. Commit va fix task con

Khi CI tao subtask loi, nguoi fix nen lam tren branch fix rieng theo key subtask:

```text
fixFe/<jira-key-subtask>-<module>
```

Vi du:

```text
fixFe/KCPM-157-auth
fixFe/KCPM-158-auth
```

Commit khi fix phai co key subtask de Jira hien trong muc Development cua task con:

```text
KCPM-157 fix auth register UI message
KCPM-158 fix auth login UI validation
```

Neu mot nguoi fix nhieu subtask trong cung mot branch, co 2 cach dung:

- Moi loi/subtask mot commit rieng, moi commit ghi dung key subtask cua loi do.
- Neu mot commit fix nhieu subtask, commit message va PR title phai ghi tat ca key subtask.

Vi du:

```text
KCPM-157 KCPM-158 KCPM-159 fix auth UI feedback messages
```

Quy tac chon key:

- Branch fix nen dung key subtask loi.
- Commit fix phai co key subtask loi.
- PR title nen co key subtask, hoac tat ca key subtask neu PR fix nhieu loi.
- Neu CI da gom loi theo module, thuong chi can fix 1 subtask cho module do. Comment trong subtask se liet ke tat ca testcase/file dang fail.
- Task cha van duoc CI nhan dien qua quan he parent cua subtask va fingerprint trong comment.

## 3. Cach chay

FE UI chay bang CodeceptJS trong thu muc `automation`.

Lenh local theo tung file:

```text
npx codeceptjs run <test-file> --steps
```

Vi du:

```text
npx codeceptjs run ./E2E/modules/1_Authentication/register_test.js --steps
```

Tren CI:

- CI start app bang Docker Compose.
- CI cho backend san sang.
- CI cai dependency trong `automation`.
- CI cai Chromium cho Playwright.
- CI chay dung file UI test theo module cua branch/commit.
- Neu push vao `main` hoac `develop`, hoac PR vao `main`/`develop`, CI chay full regression tat ca file `*_test.js`.

Thu muc test FE:

```text
automation/E2E/modules/<module-folder>/*_test.js
```

Vi du:

```text
automation/E2E/modules/1_Authentication/*_test.js
automation/E2E/modules/3_Cart&Payment/*_test.js
```

## 4. Cach log Jira

Khi FE UI fail, CI tao hoac update 1 subtask loi duoi task cha.

Subtask duoc gom theo:

```text
<task-cha>:FE_UI_<module>
```

Vi du:

```text
KCPM-81:FE_UI_AUTH
KCPM-83:FE_UI_CART_PAYMENT
```

Description cua subtask:

- Chi lay tu description cua task cha.
- Khong ghi log loi vao description.
- Neu task cha khong co description thi description subtask de trong.

Comment cua subtask ghi tat ca loi cua module trong 1 comment.

Noi dung comment gom:

```text
CI-FINGERPRINT
Trang thai loi: LOI MOI hoac LOI CU TAI PHAT
Loai test: FE_UI
Thong tin task cha
Nhanh bi loi
Su kien GitHub
Nguoi phu trach theo commit
Jira assignee lookup
GitHub Actions log
FAILED FILES
FAILED TESTCASES
LIKELY ROOT CAUSE
FAILURE REASON
FIX HINT
```

Comment khong dua raw log dai, khong dua screenshot path dai, va khong dua doan code test loi. Muc tieu la nguoi fix doc nhanh va biet loi UI nao dang fail.

Neu loi cu tai phat, CI comment tiep vao subtask cu. Neu cung mot module co nhieu testcase fail, CI gom vao cung 1 comment.

## 5. Khi pass/fail

Khi fail:

- Tao subtask neu la loi moi.
- Update/comment vao subtask cu neu loi cu tai phat.
- Gan label `ci-failure`, `ui`, `fe`, `codeceptjs`, `blackbox`, `module-...`.
- Gan assignee theo nguoi commit neu map duoc email Jira.
- Task cha duoc dua ve `In Progress` neu Jira workflow cho phep.

Khi pass:

- Comment pass vao task cha.
- Neu da tung co subtask loi CI, CI comment pass vao subtask do.
- Doi label subtask loi sang `ci-passed`, `ci-resolved`.
- Chuyen subtask loi sang `Done/Resolved` neu Jira workflow cho phep.
- Chuyen task cha sang `Done` neu Jira workflow cho phep.
