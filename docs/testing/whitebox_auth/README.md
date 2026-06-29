# WHITE-BOX AUTH REPORTS

Thu muc nay chua tai lieu white-box testing rieng cho module Authentication.

| Noi dung | File |
| :--- | :--- |
| Report white-box tong hop | `Auth_whitebox_report.md` |
| Branch coverage matrix | `AUTH_BRANCH_MATRIX.csv` |

Pham vi test:

- Register
- Register Admin
- Login
- Google Login

Ky thuat ap dung:

- Statement coverage
- Branch/Decision coverage
- Condition coverage
- Loop coverage
- Data flow testing

## Lenh chay test

Chay toan bo white-box test:

```powershell
cd E:\CODECNTT\DU_AN\TestingVGA\vga-store-testing\backend\vgashop
.\mvnw.cmd -Pwhitebox test
```

Neu terminal chua nhan Java:

```powershell
$env:JAVA_HOME="D:\download\configurate"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd -Pwhitebox test
```

## Ket qua report

Sau khi chay test, Maven tao report tai:

- Test result: `backend/vgashop/target/surefire-reports/`
- Coverage HTML: `backend/vgashop/target/site/jacoco/index.html`

Mo file `target/site/jacoco/index.html` de xem line coverage, branch coverage va method coverage cua cac class Auth.

## CI/CD

White-box Auth duoc cau hinh trong GitHub Actions tai:

`/.github/workflows/ci.yml`

CI se chay step:

```bash
cd backend/vgashop
./mvnw -Pwhitebox test
```

Khi CI hoan tat, co the tai artifact `ci-test-logs` de xem:

- `backend/vgashop/whitebox.log`
- `backend/vgashop/target/surefire-reports/`
- `backend/vgashop/target/site/jacoco/`

Quy uoc de CI tu dong bat test cua tat ca module:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/<module>/**/*Test.java
```

Vi du:

```text
whitebox_test/authentication/integration/AuthIntegrationTest.java
whitebox_test/product/integration/ProductIntegrationTest.java
whitebox_test/cart/integration/CartIntegrationTest.java
```

Ghi chu: Jenkins khong duoc dung cho phan white-box nay; white-box CI chay qua GitHub Actions.
