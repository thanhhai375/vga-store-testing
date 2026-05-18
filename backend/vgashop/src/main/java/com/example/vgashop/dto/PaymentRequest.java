package com.example.vgashop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.example.vgashop.entity.PaymentMethod;

public class PaymentRequest {

    @NotNull(message= "Phương thức thanh toán không được để trống")
    private PaymentMethod paymentMethod;

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
}

