# Quy Tac White-box Backend

## 1. Pham vi

Tai lieu nay dung cho white-box test backend Spring Boot bang JUnit, MockMvc, Maven Surefire va JaCoCo.

## 2. Quy uoc branch

```text
whitebox/<jira-key>-<module>
whitebox/<jira-key>-<ten-nguoi>-<module>
fixWhitebox/<jira-key-subtask>-<module>
```

Vi du:

```text
whitebox/KCPM-87-auth
whitebox/KCPM-91-cart
fixWhitebox/KCPM-160-auth
```

## 3. Vi tri dat test

White-box test phai dat trong:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/<module>/
```

Ten file test phai ket thuc bang `Test.java`, vi du:

```text
AuthIntegrationTest.java
ProductIntegrationTest.java
CartIntegrationTest.java
```

CI dang chay Maven profile:

```bash
./mvnw -Pwhitebox test
```

Profile nay tu dong quet:

```text
**/whitebox_test/**/*Test.java
```

## 4. Cach xac dinh nhanh white-box

Moi thanh vien doc `Controller`, `Service`, DTO/request cua module minh va tach cac duong di nhanh chinh:

- Request hop le.
- Request invalid/validation fail.
- Du lieu khong ton tai.
- Du lieu trung.
- User khong co quyen neu module co security.
- Exception/business rule.
- Vong lap neu co.

Moi nhanh can co it nhat 1 test case.

## 5. Chay local

Linux/macOS/Git Bash:

```bash
cd backend/vgashop
./mvnw -Pwhitebox test
```

Windows PowerShell:

```powershell
cd E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\backend\vgashop
.\mvnw.cmd -Pwhitebox test
```

Neu PowerShell chua nhan Java:

```powershell
$env:JAVA_HOME="D:\download\configurate"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd -Pwhitebox test
```

## 6. Report sinh ra

Sau khi chay test:

```text
backend/vgashop/target/surefire-reports/
backend/vgashop/target/site/jacoco/index.html
```

- `surefire-reports`: ket qua pass/fail cua JUnit.
- `jacoco/index.html`: line coverage, branch coverage, method coverage.

## 7. Jira khi fail

White-box backend fail se ghi:

```text
FAILED FILE
Maven profile: whitebox
Branch
Commit
Last Maven log
Surefire report artifact
JaCoCo coverage artifact
```

Artifact CI se co:

```text
backend/vgashop/whitebox.log
backend/vgashop/target/surefire-reports/
backend/vgashop/target/site/jacoco/
```

## 8. Jira khi pass

Neu CI pass, task cha se duoc comment dang:

```text
CI PASSED for KCPM-xxx.
Run: <GitHub Actions run URL>
Branch: <branch>
Commit: <commit-sha>
```

Dieu kien bat buoc: branch, commit message hoac PR title phai co Jira key dang `KCPM-xxx`. Neu khong co Jira key, workflow khong biet ghi comment vao task cha nao.

## 9. Labels

```text
automation-test, whitebox, github-actions, ci-failure, backend, junit, maven, jacoco, module-...
```

## 10. Loi can tranh

- Dat test ngoai `whitebox_test/<module>/` lam CI khong quet duoc.
- Ten file khong ket thuc bang `Test.java`.
- Test phu thuoc database that thay vi H2/test database.
- Test phu thuoc thu tu chay.
- Khong clean data giua cac test.
- Chi test happy path, bo qua nhanh loi.
