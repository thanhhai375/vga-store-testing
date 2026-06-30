# Quy tac CSV automation cho Product Admin

File nay quy dinh cac cot nen co khi chuyen Product Admin sang data-driven test bang Postman/Newman.

---

## 1. Cot bat buoc

| Cot | Vi du | Muc dich |
| :--- | :--- | :--- |
| `testId` | `PA-CP-001` | Ma test case de Jira log dung loi |
| `module` | `PRODUCT_ADMIN` | Ten module |
| `function` | `CREATE_PRODUCT` | Function/API dang test |
| `technique` | `EP+BVA` | Ky thuat test |
| `endpoint` | `/api/admin/products` | Endpoint loi |
| `method` | `POST` | HTTP method |
| `input` | `price=0` | Du lieu chinh cua case |
| `expectedStatus` | `400` | HTTP status mong doi |
| `expectedMessage` | `price` | Message/keyword mong doi |
| `priority` | `High` | Do uu tien |
| `status` | `Ready` | Trang thai testcase |

---

## 2. Cot theo function

### Create Product

| Cot | Ghi chu |
| :--- | :--- |
| `name` | Ten san pham |
| `price` | Gia san pham |
| `stock` | Ton kho |
| `brandId` | Brand ton tai/khong ton tai |
| `categoryId` | Category ton tai/khong ton tai |
| `description` | Mo ta |
| `imageMode` | `valid`, `missing`, `invalidType` neu test upload |

### List Product

| Cot | Ghi chu |
| :--- | :--- |
| `page` | Gia tri page |
| `size` | Gia tri size |
| `sortBy` | Field sap xep |
| `keyword` | Tu khoa tim kiem neu API ho tro |

### Detail/Update/Delete Product

| Cot | Ghi chu |
| :--- | :--- |
| `productIdMode` | `existing`, `notFound`, `deleted`, `invalidFormat` |
| `stock` | Dung cho update stock |

---

## 3. Mau CSV de nhom copy

```csv
testId,module,function,technique,method,endpoint,input,name,price,stock,brandId,categoryId,productIdMode,expectedStatus,expectedMessage,priority,status
PA-CP-001,PRODUCT_ADMIN,CREATE_PRODUCT,EP,POST,/api/admin/products,valid payload,RTX Test 4060,1000000,10,existing,existing,,200,success,High,Ready
PA-CP-007,PRODUCT_ADMIN,CREATE_PRODUCT,BVA,POST,/api/admin/products,price=0,RTX Test 4060,0,10,existing,existing,,400,price,High,Ready
PA-US-006,PRODUCT_ADMIN,UPDATE_STOCK,BVA,PUT,/api/admin/products/{productId}/stock,stock=-1,,,,,existing,-1,400,stock,High,Ready
PA-DP-005,PRODUCT_ADMIN,DELETE_PRODUCT,StateTransition,DELETE,/api/admin/products/{productId},delete already deleted,,,,,deleted,,404,not found,Medium,Ready
```

---

## 4. Quy tac dat ma testcase

| Prefix | Function |
| :--- | :--- |
| `PA-CP` | Product Admin - Create Product |
| `PA-LP` | Product Admin - List Product |
| `PA-PD` | Product Admin - Product Detail |
| `PA-US` | Product Admin - Update Stock |
| `PA-DP` | Product Admin - Delete Product |

---

## 5. Quy tac de Jira log de fix

Moi testcase nen dam bao co du:

- `testId`
- `function`
- `endpoint`
- `input`
- `expectedStatus`
- `expectedMessage`
- `priority`

Khi GitHub Actions fail, Jira subtask can hien du thong tin:

```text
Test ID: PA-CP-007
Function: CREATE_PRODUCT
Endpoint: POST /api/admin/products
Input: price=0
Expected: HTTP 400, message contains "price"
Actual: HTTP 200, product was created
Fix hint: Backend dang accept gia bang 0, can validate price > 0.
```
