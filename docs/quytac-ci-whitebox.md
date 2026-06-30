# Quy tac CI cho White-box

File nay ap dung cho backend white-box/JUnit test trong GitHub Actions.

## 1. Branch

Dung branch cho white-box:

```text
whitebox/<jira-key>-<module>
fixWhitebox/<jira-key-subtask>-<module>
```

Vi du:

```text
whitebox/KCPM-128-auth
whitebox/KCPM-91-cart
fixWhitebox/KCPM-160-auth
```

CI doc `branch name`, `PR title`, va `commit message` de lay Jira key va module can chay.

## 2. Commit va fix task con

Khi CI tao subtask loi, nguoi fix nen lam tren branch fix rieng theo key subtask:

```text
fixWhitebox/<jira-key-subtask>-<module>
```

Vi du:

```text
fixWhitebox/KCPM-160-auth
fixWhitebox/KCPM-161-cart
```

Commit khi fix phai co key subtask de Jira hien trong muc Development cua task con:

```text
KCPM-160 fix auth white-box register branches
KCPM-161 fix cart white-box service condition
```

Neu mot nguoi fix nhieu subtask trong cung mot branch, co 2 cach dung:

- Moi loi/subtask mot commit rieng, moi commit ghi dung key subtask cua loi do.
- Neu mot commit fix nhieu subtask, commit message va PR title phai ghi tat ca key subtask.

Vi du:

```text
KCPM-160 KCPM-161 fix backend white-box branch cases
```

Quy tac chon key:

- Branch fix nen dung key subtask loi.
- Commit fix phai co key subtask loi.
- PR title nen co key subtask, hoac tat ca key subtask neu PR fix nhieu loi.
- Neu CI da gom loi theo module, thuong chi can fix 1 subtask cho module do. Comment trong subtask se liet ke tat ca class/testcase dang fail.
- Task cha van duoc CI nhan dien qua quan he parent cua subtask va fingerprint trong comment.

## 3. Cach chay

White-box chay Maven/JUnit truc tiep trong backend.

Lenh local:

```text
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=<TestClass> test
```

Tren GitHub Actions:

```text
cd backend/vgashop
./mvnw -Pwhitebox -Dtest=<TestClass> test
```

Thu muc test white-box:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/<module>/.../*Test.java
```

White-box khong start backend bang Docker Compose. CI chay truc tiep code backend bang Maven/JUnit, co the dung Spring test, H2/test database, mock hoac in-memory auth tuy theo test.

Neu push vao `main` hoac `develop`, hoac PR vao `main`/`develop`, CI chay full regression tat ca file `*Test.java` trong `whitebox_test`.

## 4. Cach log Jira

Khi white-box fail, CI tao hoac update 1 subtask loi duoi task cha.

Subtask duoc gom theo:

```text
<task-cha>:WHITEBOX_BACKEND_<module>
```

Vi du:

```text
KCPM-128:WHITEBOX_BACKEND_AUTH
KCPM-91:WHITEBOX_BACKEND_CART_PAYMENT
```

Description cua subtask:

- Chi lay tu description cua task cha.
- Khong ghi log loi vao description.
- Neu task cha khong co description thi description subtask de trong.

Comment cua subtask ghi loi JUnit/Maven ngan gon.

Noi dung comment gom:

```text
CI-FINGERPRINT
Trang thai loi: LOI MOI hoac LOI CU TAI PHAT
Loai test: WHITEBOX_BACKEND
Thong tin task cha
Nhanh bi loi
Su kien GitHub
Nguoi phu trach theo commit
Jira assignee lookup
GitHub Actions log
FAILED FILES
FAILED TESTCASES
FAILURE REASON
COVERAGE
FIX HINT
```

Neu loi cu tai phat, CI comment tiep vao subtask cu. Neu cung mot module co nhieu class/testcase fail, CI gom vao cung 1 comment.

## 5. Khi pass/fail

Khi fail:

- Tao subtask neu la loi moi.
- Update/comment vao subtask cu neu loi cu tai phat.
- Gan label `ci-failure`, `whitebox`, `backend`, `junit`, `maven`, `jacoco`, `module-...`.
- Gan assignee theo nguoi commit neu map duoc email Jira.
- Task cha duoc dua ve `In Progress` neu Jira workflow cho phep.

Khi pass:

- Comment pass vao task cha.
- Neu da tung co subtask loi CI, CI comment pass vao subtask do.
- Doi label subtask loi sang `ci-passed`, `ci-resolved`.
- Chuyen subtask loi sang `Done/Resolved` neu Jira workflow cho phep.
- Chuyen task cha sang `Done` neu Jira workflow cho phep.
