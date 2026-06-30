# Quy Tac Lam White-box Automation Va Jira CI

File nay dung cho cac task white-box backend. Muc tieu la cach chay CI va cach ghi loi len Jira giong co che API/Postman va FE UI.

## 1. Quy uoc branch

Dung branch:

```text
whitebox/<jira-key>-<module>
fixWhitebox/<jira-key-subtask>-<module>
```

Vi du:

```text
whitebox/KCPM-128-auth
fixWhitebox/KCPM-160-auth
```

Branch phai co Jira key de CI biet comment vao task nao.

## 2. Cach CI chon test

CI doc branch, PR title va commit message.

Voi Auth white-box:

```text
whitebox/KCPM-128-auth
```

CI chay:

```bash
cd backend/vgashop
./mvnw -Pwhitebox -Dtest=AuthIntegrationTest test
```

Neu merge vao `main` hoac `develop`, CI chay tat ca test white-box bang profile `whitebox`.

## 3. Report va coverage

Khi chay xong, artifact tren GitHub Actions co:

```text
backend/vgashop/whitebox-reports/**
backend/vgashop/target/surefire-reports/**
backend/vgashop/target/site/jacoco/**
```

File coverage HTML:

```text
backend/vgashop/target/site/jacoco/index.html
```

## 4. Jira se ghi gi khi fail

Khi white-box fail, CI tao hoac cap nhat subtask/issue duoi task cha giong API/Postman va FE UI.

Noi dung subtask co:

```text
FAILED FILE
FAILED TESTCASE
Failure reason
Failure location
Coverage artifact
Fix hint
GitHub Actions log
Assignee theo commit
Due date theo rule chung
```

Labels white-box:

```text
automation-test, github-actions, ci-failure, whitebox, backend, junit, maven, jacoco, module-...
```

## 5. Khi CI pass

Neu truoc do co subtask loi CI, workflow se comment pass, doi label sang `ci-passed/ci-resolved`, va co gang chuyen subtask sang Done/Resolved.

## 6. Quy tac testcase

- Test dat trong `backend/vgashop/src/test/java/.../whitebox_test/...`.
- Ten test nen the hien nhanh logic dang bao phu.
- Report nen co branch matrix, vi du `AUTH_BRANCH_MATRIX.csv`.
- Khong commit file build sinh ra: `target/`, `whitebox-reports/`.

