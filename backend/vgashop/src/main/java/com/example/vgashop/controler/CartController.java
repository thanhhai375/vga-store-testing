package com.example.vgashop.controler;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.dto.AddToCartRequest;
import com.example.vgashop.dto.CartResponse;
import com.example.vgashop.dto.UpdateCartItemRequest;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    @GetMapping
    public ApiResponse<CartResponse> getMyCart() {
        CartResponse response = cartService.getMyCart();
        return ApiResponse.success("Lấy giỏ hành thành công", response);
    }
    // Delete
    // Cart
    @PostMapping("/add")
    public ApiResponse<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartResponse response = cartService.addToCart(request);
        return ApiResponse.success("Thêm vào giỏ hàng thành công", response);
    }

    // Update existing
    @PutMapping("/items/{cartItemId}")
    public ApiResponse<CartResponse> updateCartItem(@PathVariable Long cartItemId, @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse response = cartService.updateCartItem(cartItemId, request);
        return ApiResponse.success("Cập nhật số lượng thành công", response);
    }
    // Delete
    @DeleteMapping("/items/{cartItemId}")
    public ApiResponse<CartResponse> removeCartItem(@PathVariable Long cartItemId) {
        CartResponse cart = cartService.removeCartItem(cartItemId);
        return ApiResponse.success("Xóa item thành công", cart);
    }

    // Delete
    @DeleteMapping
    public ApiResponse<Void> clearCart() {
        cartService.clearCart();
        return ApiResponse.message("Đã xóa toàn bộ giỏ hàng");
    }
}
