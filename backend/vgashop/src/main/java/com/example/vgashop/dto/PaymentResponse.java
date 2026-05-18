package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.vgashop.entity.PaymentMethod;
import com.example.vgashop.entity.PaymentStatus;

public class PaymentResponse {

    private Long paymentId;
    private Long orderId;
    private String orderCode;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionCode;
    private String paymentUrl;
    private LocalDateTime paidAt;
    private String note;

    public  PaymentResponse() {}

     public PaymentResponse(Long paymentId, Long orderId, String orderCode, BigDecimal amount,
            PaymentMethod paymentMethod, PaymentStatus paymentStatus, String transactionCode, String paymentUrl,
            LocalDateTime paidAt, String note) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.orderCode = orderCode;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionCode = transactionCode;
        this.paymentUrl = paymentUrl;
        this.paidAt = paidAt;
        this.note = note;
    }

    // setter getter

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
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

    public String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

