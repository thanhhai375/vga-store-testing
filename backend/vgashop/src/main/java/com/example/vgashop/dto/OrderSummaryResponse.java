package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.PaymentStatus;

public class OrderSummaryResponse {

    private Long orderId;
    private String orderCode;
    private String fullName;
    private String phone;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt; // Error handling
    private Integer totalItems;

    public OrderSummaryResponse() {
    }

    public OrderSummaryResponse(Long orderId, String orderCode, String fullName, String phone,
            BigDecimal totalAmount, OrderStatus status, PaymentStatus paymentStatus,
            LocalDateTime createdAt, Integer totalItems) {
        this.orderId = orderId;
        this.orderCode = orderCode;
        this.fullName = fullName;
        this.phone = phone;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
        this.totalItems = totalItems;
    }


    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
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

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }
}
