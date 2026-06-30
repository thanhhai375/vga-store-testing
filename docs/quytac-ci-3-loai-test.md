# Quy Tac CI Cho API/Postman, FE UI Va White-box

Tai lieu nay chi quy dinh 4 phan can dung khi lam automation: branch, cach chay, cach log Jira, va khi pass/fail.

## 1. Branch

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
feature/KCPM-90-product-admin-api
fix/KCPM-157-auth-api
```

### FE UI

Dung cho UI/E2E:

```text
fe/<jira-key>-<module>-fe
fe/<jira-key>-<ten-nguoi>-<module>-fe
fixFe/<jira-key-subtask>-<module>-fe
```

Vi du:

```text
fe/KCPM-81-auth-fe
fe/KCPM-83-cart-payment-fe
fixFe/KCPM-158-auth-fe
```

### White-box

Dung cho backend white-box/JUnit:

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

## 2. Cach CI chay

CI doc `branch name`, `PR title`, va `commit message` de lay:

```text
Jira key -> ghi ket qua vao task cha
module -> chay dung bo test cua module do
```

### API/Postman

CI chay Newman script trong `automation/package.json` theo format:

```text
test:<module>:blackbox
```

Vi du:

```text
npm run test:auth:blackbox
npm run test:cart:blackbox
npm run test:product-admin:blackbox
```

API/Postman se start app bang Docker Compose truoc khi test.

### FE UI

CI chay CodeceptJS theo file trong:

```text
automation/E2E/modules/<module-folder>/*_test.js
```

Vi du:

```text
automation/E2E/modules/1_Authentication/*_test.js
automation/E2E/modules/3_Cart&Payment/*_test.js
```

FE UI se start app bang Docker Compose truoc khi test.

### White-box

CI khong start backend Docker cho white-box. CI chay Maven/JUnit truc tiep:

```bash
cd backend/vgashop
./mvnw -Pwhitebox -Dtest=<TestClass> test
```

CI tim file test trong:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/<module>/.../*Test.java
```

White-box dung de test logic ben trong code, nen co the dung Spring test/H2/test database thay vi backend Docker.

## 3. Cach log Jira

### Khi CI fail

Workflow tao hoac update subtask loi duoi task cha.

CI gom loi theo file/script/module fail:

```text
Task cha + FAILED FILE
```

Vi vay neu 1 file/script co 3 testcase fail, Jira chi tao 1 subtask loi. Comment se liet ke ca 3 testcase fail de nguoi fix biet can sua nhung loi nao.

Neu da ton tai subtask loi cu duoc tao theo co che cu, CI se tim lai theo `FAILED FILE`, chon mot subtask lam subtask chinh, comment loi moi vao do, va danh dau cac subtask cung file con lai la duplicate/merged.

Description cua subtask:

```text
Lay theo description cua task cha neu task cha co description.
Neu task cha khong co description, CI tao mo ta ngan theo loai test.
Description khong ghi log loi dai.
```

Comment cua subtask:

```text
Ghi chi tiet loi de nguoi fix doc vao biet loi gi va sua o dau.
```

Noi dung chung trong comment:

```text
Loai test
Loi can sua
FAILED FILE
FAILED TESTCASES
Branch
Commit
GitHub Actions log
Nguoi commit
Fix hint
```

API/Postman comment co them:

```text
Failed API request/assertion summary
Failure reason
Response/status context
Fix hint
```

FE UI comment co them:

```text
Likely root cause
Failure reason
Failure location
Screenshot artifact
Fix hint
```

White-box comment co them:

```text
Failure reason
Failure location
Coverage artifact
Fix hint
```

### Labels khi fail

API/Postman:

```text
automation-test, blackbox, github-actions, ci-failure, api, newman, postman, module-...
```

FE UI:

```text
automation-test, blackbox, github-actions, ci-failure, ui, fe, codeceptjs, module-...
```

White-box:

```text
automation-test, github-actions, ci-failure, whitebox, backend, junit, maven, jacoco, module-...
```

## 4. Khi pass/fail

### Khi CI fail

- Neu la loi moi: tao subtask/issue loi duoi task cha.
- Neu la loi cu lap lai: update/comment vao subtask loi cu.
- Gan label `ci-failure`.
- Gan assignee theo nguoi commit neu map duoc email Jira.
- Gan due date theo `JIRA_DUE_DAYS` neu cau hinh co.
- Task cha duoc transition ve In Progress neu Jira workflow cho phep.

### Khi CI pass

- Comment pass vao task cha.
- Neu co subtask loi CI cu: comment pass vao subtask do.
- Doi label subtask loi sang `ci-passed`, `ci-resolved`.
- Chuyen subtask loi sang Done/Resolved neu Jira workflow cho phep.
- Chuyen task cha sang Done neu Jira workflow cho phep.

Ghi chu: Jira team-managed co the an task Done khoi Backlog. Task khong bi xoa; co the tim bang search/JQL:

```jql
project = KCPM AND status = Done ORDER BY updated DESC
```

