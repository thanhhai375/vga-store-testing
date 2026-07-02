package com.example.vgashop.whitebox_test.cart;

import static org.mockito.Mockito.lenient;
import com.example.vgashop.dto.AddToCartRequest;
import com.example.vgashop.dto.CartResponse;
import com.example.vgashop.dto.UpdateCartItemRequest;
import com.example.vgashop.entity.Cart;
import com.example.vgashop.entity.CartItem;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.CartItemRepository;
import com.example.vgashop.repository.CartRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.service.CartService;
import com.example.vgashop.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceWhiteboxTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserService userService;

    private CartService cartService;
    private User user;

    @BeforeEach
    void setUp() {
        cartService = new CartService(
                cartRepository,
                cartItemRepository,
                productRepository,
                userService
        );

        user = new User();
        user.setId(1L);
        user.setUsername("cart_user");

        lenient().when(userService.getCurrentUser()).thenReturn(user);
    }

    private Product product(Long id, int stock, BigDecimal price) {
        Product product = new Product();
        product.setId(id);
        product.setName("RTX Test");
        product.setImgUrl("rtx.png");
        product.setStock(stock);
        product.setPrice(price);
        product.setDeleted(false);
        return product;
    }

    private Cart cart(Long id) {
        Cart cart = new Cart();
        cart.setId(id);
        cart.setUser(user);
        cart.setTotalAmount(BigDecimal.ZERO);
        return cart;
    }

    private CartItem cartItem(Long id, Cart cart, Product product, int quantity) {
        CartItem item = new CartItem();
        item.setId(id);
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setDeleted(false);
        return item;
    }

    @Test
    @DisplayName("WB-CART-001 - getMyCart: no existing cart -> create new cart")
    void getMyCart_noExistingCart_createNewCart() {
        Cart newCart = cart(10L);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class)))
                .thenReturn(newCart);

        CartResponse response = cartService.getMyCart();

        assertNotNull(response);
        assertEquals(10L, response.getCartId());
        assertEquals(0, response.getTotalItems());
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    @DisplayName("WB-CART-002 - addToCart: quantity <= 0 -> throw exception")
    void addToCart_quantityZero_throwException() {
        AddToCartRequest request = new AddToCartRequest(1L, 0);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> cartService.addToCart(request)
        );

        assertEquals("Số lượng phải lớn hơn hoặc bằng 1", ex.getMessage());
        verify(cartRepository, never()).save(any());
    }

    @Test
    @DisplayName("WB-CART-003 - addToCart: product not found -> throw exception")
    void addToCart_productNotFound_throwException() {
        Cart cart = cart(10L);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndDeleted(99L, false))
                .thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> cartService.addToCart(new AddToCartRequest(99L, 1))
        );

        assertEquals("Không tìm thấy sản phẩm", ex.getMessage());
    }

    @Test
    @DisplayName("WB-CART-004 - addToCart: stock < quantity -> throw exception")
    void addToCart_stockNotEnough_throwException() {
        Cart cart = cart(10L);
        Product product = product(1L, 2, BigDecimal.valueOf(100000));

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndDeleted(1L, false))
                .thenReturn(Optional.of(product));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> cartService.addToCart(new AddToCartRequest(1L, 3))
        );

        assertEquals("Sản phẩm không đủ số lượng trong kho", ex.getMessage());
    }

    @Test
    @DisplayName("WB-CART-005 - addToCart: existingItem == null -> add new item")
    void addToCart_newItem_success() {
        Cart cart = cart(10L);
        Product product = product(1L, 10, BigDecimal.valueOf(100000));

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndDeleted(1L, false))
                .thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.addToCart(new AddToCartRequest(1L, 2));

        assertEquals(1, cart.getCartItems().size());
        assertEquals(2, response.getTotalItems());
        assertEquals(1L, response.getItems().get(0).getProductId());
        verify(cartRepository).save(cart);
    }

    @Test
    @DisplayName("WB-CART-006 - addToCart: existingItem != null -> increase quantity")
    void addToCart_existingItem_success() {
        Cart cart = cart(10L);
        Product product = product(1L, 10, BigDecimal.valueOf(100000));
        CartItem item = cartItem(100L, cart, product, 2);
        cart.getCartItems().add(item);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndDeleted(1L, false))
                .thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.addToCart(new AddToCartRequest(1L, 3));

        assertEquals(1, cart.getCartItems().size());
        assertEquals(5, item.getQuantity());
        assertEquals(5, response.getTotalItems());
    }

    @Test
    @DisplayName("WB-CART-007 - addToCart: existingItem newQuantity > stock -> throw exception")
    void addToCart_existingItemOverStock_throwException() {
        Cart cart = cart(10L);
        Product product = product(1L, 4, BigDecimal.valueOf(100000));
        CartItem item = cartItem(100L, cart, product, 3);
        cart.getCartItems().add(item);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(productRepository.findByIdAndDeleted(1L, false))
                .thenReturn(Optional.of(product));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> cartService.addToCart(new AddToCartRequest(1L, 2))
        );

        assertEquals("Sản phẩm không đủ số lượng trong kho", ex.getMessage());
    }

    @Test
    @DisplayName("WB-CART-008 - updateCartItem: cart not found -> throw exception")
    void updateCartItem_cartNotFound_throwException() {
        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> cartService.updateCartItem(100L, new UpdateCartItemRequest(2))
        );

        assertEquals("Giỏ hàng không tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("WB-CART-009 - updateCartItem: quantity <= 0 -> remove item")
    void updateCartItem_quantityZero_removeItem() {
        Cart cart = cart(10L);
        Product product = product(1L, 10, BigDecimal.valueOf(100000));
        CartItem item = cartItem(100L, cart, product, 2);
        cart.getCartItems().add(item);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.updateCartItem(100L, new UpdateCartItemRequest(0));

        assertEquals(0, cart.getCartItems().size());
        assertEquals(0, response.getTotalItems());
    }

    @Test
    @DisplayName("WB-CART-010 - updateCartItem: quantity > stock -> throw exception")
    void updateCartItem_overStock_throwException() {
        Cart cart = cart(10L);
        Product product = product(1L, 3, BigDecimal.valueOf(100000));
        CartItem item = cartItem(100L, cart, product, 1);
        cart.getCartItems().add(item);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> cartService.updateCartItem(100L, new UpdateCartItemRequest(5))
        );

        assertEquals("Vượt quá số lượng tồn kho của sản phẩm", ex.getMessage());
    }

    @Test
    @DisplayName("WB-CART-011 - updateCartItem: valid quantity -> update item")
    void updateCartItem_validQuantity_success() {
        Cart cart = cart(10L);
        Product product = product(1L, 10, BigDecimal.valueOf(100000));
        CartItem item = cartItem(100L, cart, product, 1);
        cart.getCartItems().add(item);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.updateCartItem(100L, new UpdateCartItemRequest(4));

        assertEquals(4, item.getQuantity());
        assertEquals(4, response.getTotalItems());
    }

    @Test
    @DisplayName("WB-CART-012 - removeCartItem: item exists -> remove success")
    void removeCartItem_success() {
        Cart cart = cart(10L);
        Product product = product(1L, 10, BigDecimal.valueOf(100000));
        CartItem item = cartItem(100L, cart, product, 1);
        cart.getCartItems().add(item);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CartResponse response = cartService.removeCartItem(100L);

        assertEquals(0, cart.getCartItems().size());
        assertEquals(0, response.getTotalItems());
    }

    @Test
    @DisplayName("WB-CART-013 - removeCartItem: item not found -> throw exception")
    void removeCartItem_notFound_throwException() {
        Cart cart = cart(10L);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> cartService.removeCartItem(999L)
        );

        assertEquals("Không tìm thấy item trong giỏ", ex.getMessage());
    }

    @Test
    @DisplayName("WB-CART-014 - clearCart: existing cart -> mark items deleted and clear list")
    void clearCart_existingCart_success() {
        Cart cart = cart(10L);
        Product product = product(1L, 10, BigDecimal.valueOf(100000));
        CartItem item = cartItem(100L, cart, product, 2);
        cart.getCartItems().add(item);

        when(cartRepository.findByUser_IdAndDeletedFalse(1L))
                .thenReturn(Optional.of(cart));

        cartService.clearCart();

        assertTrue(item.isDeleted());
        assertEquals(0, cart.getCartItems().size());
        assertEquals(BigDecimal.ZERO, cart.getTotalAmount());
        verify(cartRepository).save(cart);
    }

    @Test
    @DisplayName("WB-CART-015 - convertToCartResponse: ignore deleted item")
    void convertToCartResponse_ignoreDeletedItem() {
        Cart cart = cart(10L);
        Product product1 = product(1L, 10, BigDecimal.valueOf(100000));
        Product product2 = product(2L, 10, BigDecimal.valueOf(200000));

        CartItem activeItem = cartItem(100L, cart, product1, 2);
        CartItem deletedItem = cartItem(101L, cart, product2, 3);
        deletedItem.setDeleted(true);

        cart.getCartItems().add(activeItem);
        cart.getCartItems().add(deletedItem);

        CartResponse response = cartService.convertToCartResponse(cart);

        assertEquals(2, response.getTotalItems());
        assertEquals(1, response.getItems().size());
        assertEquals(1L, response.getItems().get(0).getProductId());
    }
}