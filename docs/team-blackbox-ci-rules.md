# Quy Tac Lam Blackbox Automation Va Jira CI

File nay la quy uoc chung de moi thanh vien trong nhom lam automation giong nhau, de GitHub Actions chay duoc va Jira log loi du thong tin.

## 1. Quy trinh lam viec

1. Nhan task tren Jira, vi du `KCPM-88`.
2. Tao hoac dung branch cua minh.
3. Khi commit bat buoc co ma task Jira:

```bash
git commit -m "KCPM-88 add user blackbox automation"
```

4. Push len GitHub.
5. GitHub Actions tu chay tat ca blackbox scripts.
6. Neu fail, workflow se tao hoac update sub-task CI fail trong Jira task cha.
7. Neu pass, workflow se comment `CI passed`, doi label sang `ci-passed/ci-resolved`, va co gang chuyen sub-task sang Done.

## 2. Quy tac dat script trong package.json

Moi module phai co script theo dung format:

```text
test:<module>:blackbox
```

Vi du:

```json
{
  "scripts": {
    "test:auth:blackbox": "newman run ...",
    "test:user:blackbox": "newman run ...",
    "test:product:blackbox": "newman run ..."
  }
}
```

Workflow chi tu dong chay script dung format tren. Script sai ten se khong duoc CI chay.

## 3. Quy tac dat file report Newman

Moi script nen export JSON report vao:

```text
automation/reports/<module>-blackbox-newman.json
```

Vi du:

```bash
--reporters cli,json --reporter-json-export "reports/user-blackbox-newman.json"
```

Khong commit file trong `automation/reports`. Day la file sinh ra khi chay test.

## 4. Quy tac CSV de Jira log dep

Moi module nen co 1 file CSV data-driven test. CSV nen nam trong:

```text
automation/postman/<module-folder>/
```

Workflow se tu quet cac file `.csv` trong `automation/postman`.

CSV nen co it nhat cac cot bat buoc:

```csv
testId,testType,expectedStatus,expectedMessage,ExpectedResult
```

Y nghia:

| Cot | Bat buoc | Y nghia |
| --- | --- | --- |
| `testId` | Co | Ma testcase, vi du `R-001`, `U-002`, `P-003` |
| `testType` | Co | Ten chuc nang/module, vi du `REGISTER`, `LOGIN`, `USER_CREATE` |
| `expectedStatus` | Co | HTTP status mong muon, vi du `200`, `400`, `422` |
| `expectedMessage` | Co | Chuoi mong muon co trong response, vi du `password`, `validation`, `token` |
| `ExpectedResult` | Co | Mo ta ngan muc tieu testcase |

Ngoai cac cot tren, moi module them cac cot input rieng.

## 5. Mau CSV cho Auth

```csv
testId,testType,username,email,password,fullName,oldPassword,newPassword,confirmPassword,expectedStatus,expectedMessage,ExpectedResult
R-033,REGISTER,user33,user33@test.com,Pass@1,User 33,,,,400,password,Reject weak password missing length
C-006,CHANGE_PASSWORD,,,,,Oldpass@1,short,short,400,password,Reject too short new password
```

## 6. Mau CSV cho Product

```csv
testId,testType,productName,price,stock,categoryId,expectedStatus,expectedMessage,ExpectedResult
P-001,PRODUCT_CREATE,Keyboard,100000,10,1,201,created,Create product successfully
P-002,PRODUCT_CREATE,,100000,10,1,400,name,Reject empty product name
P-003,PRODUCT_CREATE,Mouse,-1,10,1,400,price,Reject negative price
```

## 7. Mau CSV cho User

```csv
testId,testType,userId,username,email,role,expectedStatus,expectedMessage,ExpectedResult
U-001,USER_GET,1,,,,200,id,Get user by valid id
U-002,USER_GET,999999,,,,404,not found,Reject unknown user id
U-003,USER_UPDATE,1,newname,new@test.com,USER,200,success,Update user successfully
```

## 8. Quy tac Postman collection

Moi request trong Postman nen:

1. Doc input tu CSV bang bien `{{columnName}}`.
2. Assert status theo `expectedStatus`.
3. Assert message theo `expectedMessage`.
4. Ten assertion nen co `testId` de log de doc.

Vi du assertion:

```javascript
const expectedStatus = Number(pm.iterationData.get("expectedStatus"));
const expectedMessage = pm.iterationData.get("expectedMessage");
const testId = pm.iterationData.get("testId");

pm.test(`${testId}: Expected HTTP status ${expectedStatus}`, function () {
  pm.response.to.have.status(expectedStatus);
});

pm.test(`${testId}: Response contains expected message`, function () {
  pm.expect(pm.response.text().toLowerCase()).to.include(expectedMessage.toLowerCase());
});
```

## 9. Jira log se co nhung thong tin gi

Khi CI fail, Jira sub-task se co:

```text
Run link
Branch
Commit
CSV source
testId
testType
Endpoint
Input
Expected status/message
Actual status/response
Assertion
Error
Fix hint
```

Vi du:

```text
1. [R-033] REGISTER / Register
CSV: automation/postman/.../Auth-Testcase.csv
Report: auth-blackbox-newman.json, iteration: 33
Endpoint: POST http://localhost:8080/api/auth/register
Input: username=user33, email=user33@test.com, password=Pass@1
Expected: HTTP 400, message contains "password"
Actual: HTTP 200, response: registration successful ...
Assertion: R-033: Expected HTTP status 400
Error: expected 200 to deeply equal 400
Fix hint: check backend validation/handler for REGISTER.
```

## 10. Jira fields tu dong

Workflow se tu set cho sub-task CI fail:

```text
Parent = task co trong commit, vi du KCPM-88
Assignee = nguoi commit neu map duoc email Jira
Priority = JIRA_DEFAULT_PRIORITY, mac dinh High
Due date = ngay hien tai + JIRA_DUE_DAYS
Labels khi fail = ci-fail, github-actions, automation-test, blackbox, newman
Labels khi pass = ci-passed, ci-resolved, github-actions, automation-test, blackbox, newman
```

## 11. Quy tac fix loi

1. Mo sub-task CI fail tren Jira.
2. Doc `Failure summary`.
3. Xem `testId`, `Endpoint`, `Input`, `Expected`, `Actual`.
4. Sua backend hoac testcase neu testcase sai.
5. Commit lai voi cung ma task Jira:

```bash
git commit -m "KCPM-88 fix user validation"
```

6. Push len GitHub.
7. Neu CI pass, sub-task se duoc comment `CI passed` va co gang chuyen sang Done.

## 12. Nhung loi can tranh

- Khong commit ma khong co ma Jira.
- Khong dat script sai format, vi CI se khong chay.
- Khong commit file report trong `automation/reports`.
- Khong dat CSV thieu `testId`, `testType`, `expectedStatus`, `expectedMessage`.
- Khong dung chung `testId` cho nhieu testcase khac nhau trong cung module.
- Khong sua workflow neu chi them module moi; chi can them script `test:<module>:blackbox`.
