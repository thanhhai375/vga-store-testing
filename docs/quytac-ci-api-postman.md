# Quy tac CI cho API/Postman

File nay ap dung cho black-box API/Postman trong GitHub Actions.

## 1. Branch

Dung branch cho API/Postman:

```text
feature/<jira-key>-<module>-api
feature/<jira-key>-<ten-nguoi>-<module>-api
fix/<jira-key-subtask>-<module>-api
bugfix/<jira-key>-<module>-api
```

Vi du:

```text
feature/KCPM-91-cart-api
feature/KCPM-90-product-admin-api
fix/KCPM-157-auth-api
```

CI doc `branch name`, `PR title`, va `commit message` de lay Jira key va module can chay.

## 2. Cach chay

API/Postman chay bang Newman script trong `automation/package.json`.

Format script:

```text
test:<module>:blackbox
```

Vi du:

```text
npm run test:auth:blackbox
npm run test:cart:blackbox
npm run test:product-admin:blackbox
```

Tren CI:

- CI start app bang Docker Compose.
- CI cho backend san sang.
- CI cai dependency trong `automation`.
- CI chay dung script Postman/Newman theo module cua branch/commit.
- Neu push vao `main` hoac `develop`, hoac PR vao `main`/`develop`, CI chay full regression tat ca script black-box.

## 3. Cach log Jira

Khi API/Postman fail, CI tao hoac update 1 subtask loi duoi task cha.

Subtask duoc gom theo:

```text
<task-cha>:API_POSTMAN_<module>
```

Vi du:

```text
KCPM-91:API_POSTMAN_CART_PAYMENT
KCPM-90:API_POSTMAN_PRODUCT_CATEGORY
```

Description cua subtask:

- Chi lay tu description cua task cha.
- Khong ghi log loi vao description.
- Neu task cha khong co description thi description subtask de trong.

Comment cua subtask ghi loi ro rang de nguoi fix doc vao biet loi gi.

Noi dung comment gom:

```text
CI-FINGERPRINT
Trang thai loi: LOI MOI hoac LOI CU TAI PHAT
Loai test: API_POSTMAN
Thong tin task cha
Nhanh bi loi
Su kien GitHub
Nguoi phu trach theo commit
Jira assignee lookup
GitHub Actions log
FAILED FILES
FAILED TESTCASES
API/POSTMAN SUMMARY
HTTP/STATUS CONTEXT
FAILURE REASON
FIX HINT
```

Neu loi cu tai phat, CI comment tiep vao subtask cu. Neu cung mot module co nhieu loi, CI gom vao 1 comment de doc gon hon.

## 4. Khi pass/fail

Khi fail:

- Tao subtask neu la loi moi.
- Update/comment vao subtask cu neu loi cu tai phat.
- Gan label `ci-failure`, `api`, `newman`, `postman`, `blackbox`, `module-...`.
- Gan assignee theo nguoi commit neu map duoc email Jira.
- Task cha duoc dua ve `In Progress` neu Jira workflow cho phep.

Khi pass:

- Comment pass vao task cha.
- Neu da tung co subtask loi CI, CI comment pass vao subtask do.
- Doi label subtask loi sang `ci-passed`, `ci-resolved`.
- Chuyen subtask loi sang `Done/Resolved` neu Jira workflow cho phep.
- Chuyen task cha sang `Done` neu Jira workflow cho phep.
