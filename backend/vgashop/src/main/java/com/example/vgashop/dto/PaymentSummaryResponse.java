package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.vgashop.entity.PaymentMethod;
import com.example.vgashop.entity.PaymentStatus;

public class PaymentSummaryResponse {

    private Long paymentId;
    private String orderCode;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;

    public PaymentSummaryResponse() {}

    public PaymentSummaryResponse(Long paymentId, String orderCode, BigDecimal amount, PaymentMethod paymentMethod,
            PaymentStatus paymentStatus, LocalDateTime createdAt) {
        this.paymentId = paymentId;
        this.orderCode = orderCode;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
    }

    // setter getter

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
}

