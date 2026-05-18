package com.example.vgashop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Cart
public class UpdateCartItemRequest {

    @NotNull(message= "Số lượng không được để trống")
    @Min(value = 1, message= "Số lượng phải lớn hơn hoặc bằng 1")
    private Integer quantity;

    // Default
    public UpdateCartItemRequest() {}

    public UpdateCartItemRequest(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getQuantity() {
        return quantity;
    }   

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

