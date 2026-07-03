# CART WHITEBOX TEST REPORT

## 1. Thông tin chung

- **Module:** CartService
- **Loại kiểm thử:** White-box unit test
- **Framework:** JUnit 5 + Mockito
- **File nguồn:** `CartServiceWhiteboxTest.java`
- **Tổng số test case:** 15
- **Class kiểm thử:** `com.example.vgashop.whitebox_test.cart.CartServiceWhiteboxTest`

## 2. Mục tiêu kiểm thử

Kiểm tra các nhánh xử lý bên trong `CartService`: tạo cart mới, validate quantity, kiểm tra product tồn tại, kiểm tra tồn kho, thêm/cộng dồn item, cập nhật item, xóa item, clear cart và convert response bỏ qua item đã xóa.

## 3. Mock và dữ liệu test

- `CartRepository`: giả lập tìm/lưu Cart.
- `CartItemRepository`: giả lập thao tác CartItem.
- `ProductRepository`: giả lập tìm Product theo ID và trạng thái deleted.
- `UserService`: giả lập current user `cart_user`, id = 1.
- Product mẫu: `RTX Test`, `imgUrl = rtx.png`, `deleted = false`.

## 4. Ma trận bao phủ nhánh

| ID | Điều kiện white-box | Method test | Nhánh/path | Kết quả mong đợi | Coverage |
|---|---|---|---|---|---|
| WB-CART-001 | getMyCart: no existing cart -> create new cart | getMyCart_noExistingCart_createNewCart | find cart empty | save new cart | Statement/Branch |
| WB-CART-002 | addToCart: quantity <= 0 -> throw exception | addToCart_quantityZero_throwException | quantity <= 0 | throw IllegalArgumentException | Branch |
| WB-CART-003 | addToCart: product not found -> throw exception | addToCart_productNotFound_throwException | product not found | throw ResourceNotFoundException | Branch |
| WB-CART-004 | addToCart: stock < quantity -> throw exception | addToCart_stockNotEnough_throwException | stock < quantity | throw IllegalArgumentException | Branch |
| WB-CART-005 | addToCart: existingItem == null -> add new item | addToCart_newItem_success | existingItem == null | add new item | Branch |
| WB-CART-006 | addToCart: existingItem != null -> increase quantity | addToCart_existingItem_success | existingItem != null | increase quantity | Branch |
| WB-CART-007 | addToCart: existingItem newQuantity > stock -> throw exception | addToCart_existingItemOverStock_throwException | newQuantity > stock | throw exception | Branch |
| WB-CART-008 | updateCartItem: cart not found -> throw exception | updateCartItem_cartNotFound_throwException | cart not found | throw exception | Branch |
| WB-CART-009 | updateCartItem: quantity <= 0 -> remove item | updateCartItem_quantityZero_removeItem | quantity <= 0 in update | remove item | Branch |
| WB-CART-010 | updateCartItem: quantity > stock -> throw exception | updateCartItem_overStock_throwException | quantity > stock in update | throw exception | Branch |
| WB-CART-011 | updateCartItem: valid quantity -> update item | updateCartItem_validQuantity_success | valid update quantity | update item | Statement |
| WB-CART-012 | removeCartItem: item exists -> remove success | removeCartItem_success | item exists remove | mark deleted/remove | Statement |
| WB-CART-013 | removeCartItem: item not found -> throw exception | removeCartItem_notFound_throwException | item not found remove | throw exception | Branch |
| WB-CART-014 | clearCart: existing cart -> mark items deleted and clear list | clearCart_existingCart_success | existing cart clear | mark items deleted | Loop/Statement |
| WB-CART-015 | convertToCartResponse: ignore deleted item | convertToCartResponse_ignoreDeletedItem | deleted item in response | ignore deleted item | Branch |


## 5. Lệnh chạy đề xuất

```bash
cd backend/vgashop
mvn -Dtest=CartServiceWhiteboxTest test
```

## 6. Kết luận

Bộ test white-box bao phủ các nhánh chính trong `CartService`, đặc biệt là các điều kiện lỗi và điều kiện rẽ nhánh: `quantity <= 0`, `product not found`, `stock < quantity`, `existingItem == null/!= null`, `cart not found`, `item not found` và lọc item đã xóa khi convert response.
