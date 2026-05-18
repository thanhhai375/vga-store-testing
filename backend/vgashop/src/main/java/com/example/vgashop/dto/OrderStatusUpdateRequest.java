package com.example.vgashop.dto;

import com.example.vgashop.entity.OrderStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Update existing
public class OrderStatusUpdateRequest {

    @NotNull(message= "Trạng thái đơn hàng không được để trống")
    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

}
