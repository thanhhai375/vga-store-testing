package com.example.vgashop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class AddToCartRequest {

    @NotNull(message= "Product ID không được để trống")
    private Long productId;

    // BUG-002: Lỗ hổng cho phép truyền số lượng âm
    // @Min(value = 1, message= "Số lượng phải lớn hơn hoặc bằng 1")
    private Integer quantity;

    // Default
    public AddToCartRequest() {}

    public AddToCartRequest(Long productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

