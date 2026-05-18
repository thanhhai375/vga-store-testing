package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.util.List;


// Cart
public class CartResponse {

    private Long cartId;
    private BigDecimal totalAmount; // Cart
    // Cart
    private Integer totalItems;
    private List<CartItemResponse> items; // Cart


    // Default
    public CartResponse() {}

    public CartResponse(Long cartId, BigDecimal totalAmount, Integer totalItems, List<CartItemResponse> items) {
        this.cartId = cartId;
        this.totalAmount = totalAmount;
        this.totalItems = totalItems;
        this.items = items;
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }
}

