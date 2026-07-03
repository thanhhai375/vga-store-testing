# Huong dan test va quy tac CI White-box Backend

File nay ap dung cho white-box test backend Java/Spring Boot trong GitHub Actions.

Muc tieu cua file:

- Huong dan viet test white-box dung vi tri, dung ten file de CI nhan dien.
- Quy dinh branch, commit, Jira subtask va cach CI gom loi.
- Giam loi "Module keyword was detected, but no matching *Test.java file was found under whitebox_test".

## 1. Pham vi ap dung

White-box backend la test JUnit/Maven chay truc tiep tren source backend:

```text
backend/vgashop
```

Thu muc bat buoc cho white-box test:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/<module>/.../*Test.java
```

Vi du dung:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/product/ProductServiceTest.java
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/authentication/integration/AuthIntegrationTest.java
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/cart/CartServiceWhiteboxTest.java
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/user_profile/integration/UserProfileIntegrationTest.java
```

Quy tac quan trong:

- File test phai nam duoi `whitebox_test`.
- Module phai la thu muc con cua `whitebox_test`, vi du `product`, `authentication`, `cart`, `user_profile`.
- Ten file Java phai ket thuc bang `Test.java`.
- Ten class nen trung voi ten file.
- Khong dat file ngoai `whitebox_test` neu muon CI white-box nhan dien.

## 2. Cau truc file test

Moi module nen co cau truc rieng:

```text
whitebox_test/
  product/
    ProductServiceTest.java
    ProductControllerTest.java
  authentication/
    integration/
      AuthIntegrationTest.java
    data/
      AuthIntegrationTestData.java
  cart/
    CartServiceWhiteboxTest.java
  user_profile/
    integration/
      UserProfileIntegrationTest.java
```

Duoc phep tao thu muc con nhu `integration`, `unit`, `data`, `fixture`, nhung file test chinh van phai ket thuc bang `Test.java`.

File du lieu ho tro co the khong can ket thuc bang `Test.java`, vi du:

```text
AuthIntegrationTestData.java
ProductTestData.java
```

Nhung moi module bat buoc phai co it nhat mot file test chinh:

```text
*Test.java
```

Neu module `product` khong co file nao dang `*Test.java`, CI se bao loi discovery.

## 3. Quy tac dat ten module

Module trong branch/Jira/CI phai khop voi thu muc duoi `whitebox_test`.

| Module | Thu muc test nen dung |
| --- | --- |
| Auth, Authentication | `whitebox_test/authentication` |
| Cart | `whitebox_test/cart` |
| User Profile | `whitebox_test/user_profile` |
| Product | `whitebox_test/product` |
| Category | `whitebox_test/category` |
| Brand | `whitebox_test/brand` |
| Order | `whitebox_test/order` |
| Payment | `whitebox_test/payment` |

Neu branch la:

```text
whitebox/KCPM-131-product
```

thi CI se ky vong co test Product duoi:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/product
```

va trong do phai co file:

```text
*Test.java
```

Vi du:

```text
ProductServiceTest.java
ProductControllerTest.java
ProductRepositoryTest.java
```

## 4. Quy tac branch

Branch viet test white-box cho task cha:

```text
whitebox/<jira-key>-<module>
```

Vi du:

```text
whitebox/KCPM-128-auth
whitebox/KCPM-91-cart
whitebox/KCPM-131-product
```

Branch fix loi CI cho subtask:

```text
fixWhitebox/<jira-key-subtask>-<module>
```

Vi du:

```text
fixWhitebox/KCPM-160-auth
fixWhitebox/KCPM-161-cart
fixWhitebox/KCPM-170-product
```

CI doc `branch name`, `PR title`, va `commit message` de lay Jira key va module can chay.

## 5. Quy tac commit va PR

Commit khi viet test cho task cha nen co key task cha:

```text
KCPM-131 add product white-box tests
```

Commit khi fix subtask loi CI phai co key subtask:

```text
KCPM-170 fix product white-box test discovery
```

Neu mot commit fix nhieu subtask, ghi tat ca key:

```text
KCPM-170 KCPM-171 fix backend white-box product and cart tests
```

Quy tac chon key:

- Branch whitebox ban dau dung key task cha.
- Branch fix dung key subtask loi.
- Commit fix phai co key subtask loi.
- PR title nen co key task/subtask tuong ung.
- Neu CI gom nhieu loi trong cung mot module, chi can fix tren mot branch/subtask do, nhung comment Jira phai duoc doc de biet tat ca file/testcase dang fail.

## 6. Cach chay test local

Chay toan bo white-box test:

```text
cd backend/vgashop
.\mvnw.cmd -Pwhitebox test
```

Chay mot class test:

```text
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=ProductServiceTest test
```

Chay nhieu class test:

```text
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=ProductServiceTest,ProductControllerTest test
```

Tren GitHub Actions/Linux:

```text
cd backend/vgashop
./mvnw -Pwhitebox -Dtest=ProductServiceTest test
```

CI white-box khong start backend bang Docker Compose. Test chay bang Maven/JUnit, co the dung:

- Spring Boot test.
- MockMvc.
- H2/test database.
- Mockito/mock object.
- In-memory data hoac test fixture rieng.

## 7. Yeu cau noi dung white-box test

White-box test phai dua tren cau truc logic ben trong code, khong chi test API theo input/output nhu black-box.

Moi module nen bao phu:

- Statement coverage: cac dong/flow chinh duoc thuc thi.
- Branch/Decision coverage: cac nhanh `if/else`, validate fail/success, exception path.
- Condition coverage: dieu kien con trong bieu thuc logic.
- Data flow: du lieu request -> service -> repository/entity -> response.
- Error path: input sai, entity khong ton tai, permission/auth fail neu co.


## 8. Checklist truoc khi push

Truoc khi push branch white-box, kiem tra:

- Da tao thu muc module duoi `whitebox_test`.
- Co it nhat mot file `*Test.java` trong module do.
- Ten file va ten class khop nhau.
- Module trong branch khop voi thu muc test.
- Test chay pass local bang `.\mvnw.cmd -Pwhitebox -Dtest=<TestClass> test`.
- Khong dua test white-box vao sai thu muc nhu `src/main`, `automation`, hoac `docs`.
- Commit message co Jira key dung.

Lenh kiem tra nhanh file test:

```text
dir backend\vgashop\src\test\java\com\example\vgashop\whitebox_test\<module>\*Test.java /s
```

Vi du Product:

```text
dir backend\vgashop\src\test\java\com\example\vgashop\whitebox_test\product\*Test.java /s
```

## 9. Loi thuong gap va cach sua

### 9.1 Khong tim thay file `*Test.java`

Thong bao:

```text
Module keyword was detected, but no matching *Test.java file was found under whitebox_test.
```

Nguyen nhan:

- Chua tao file test cho module.
- File nam sai thu muc.
- Thu muc module khong khop keyword tren branch.
- Ten file khong ket thuc bang `Test.java`.

Cach sua:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/product/ProductServiceTest.java
```

### 9.2 Sai ten file

Sai:

```text
ProductTests.java
ProductWhitebox.java
product_test.java
TestProduct.java
```

Dung:

```text
ProductServiceTest.java
ProductControllerTest.java
ProductWhiteboxTest.java
```

### 9.3 Sai thu muc module

Sai:

```text
whitebox_test/products/ProductServiceTest.java
whitebox_test/product_test/ProductServiceTest.java
```

Dung:

```text
whitebox_test/product/ProductServiceTest.java
```


## 11. Khi CI fail

CI se:

- Tao subtask neu la loi moi.
- Update/comment vao subtask cu neu loi cu tai phat.
- Gan label `ci-failure`, `whitebox`, `backend`, `junit`, `maven`, `jacoco`, `module-...`.
- Gan assignee theo nguoi commit neu map duoc email Jira.
- Dua task cha ve `In Progress` neu Jira workflow cho phep. 

Nguoi fix can:

- Doc `FAILURE REASON` va `FIX HINT`.
- Checkout hoac tao branch `fixWhitebox/<jira-key-subtask>-<module>`.
- Sua test/code lien quan.
- Chay lai Maven local.
- Commit co key subtask.
- Push va tao PR neu team yeu cau.

## 12. Khi CI pass

CI se:

- Comment pass vao task cha.
- Neu da tung co subtask loi CI, comment pass vao subtask do.
- Doi label subtask loi sang `ci-passed`, `ci-resolved`.
- Chuyen subtask loi sang `Done/Resolved` neu Jira workflow cho phep.
- Chuyen task cha sang `Done` neu Jira workflow cho phep.

## 13. Mau nhanh cho module Product

Neu task la:

```text
KCPM-131 - [Auto test] Whitebox test voi Product
```

Branch nen la:

```text
whitebox/KCPM-131-product
```

Can co file:

```text
backend/vgashop/src/test/java/com/example/vgashop/whitebox_test/product/ProductServiceTest.java
```

Lenh chay local:

```text
cd backend/vgashop
.\mvnw.cmd -Pwhitebox -Dtest=ProductServiceTest test
```

Commit:

```text
KCPM-131 add product white-box service tests
```

Neu CI tao subtask loi `KCPM-170`, branch fix:

```text
fixWhitebox/KCPM-170-product
```

Commit fix:

```text
KCPM-170 fix product white-box test discovery
```
