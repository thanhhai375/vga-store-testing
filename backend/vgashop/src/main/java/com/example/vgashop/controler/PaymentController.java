package com.example.vgashop.controler;

import com.example.vgashop.dto.PaymentRequest;
import com.example.vgashop.dto.PaymentResponse;
import com.example.vgashop.dto.PaymentSummaryResponse;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.service.PaymentService;
import com.example.vgashop.utils.MomoUtils;
import com.example.vgashop.utils.VNPayUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService    paymentService;
    private final PaymentRepository paymentRepository;
    private final OrderRepository   orderRepository;

    public PaymentController(PaymentService paymentService, PaymentRepository paymentRepository,
            OrderRepository orderRepository) {
        this.paymentService    = paymentService;
        this.paymentRepository = paymentRepository;
        this.orderRepository   = orderRepository;
    }

    @PostMapping("/orders/{orderId}")
    public ApiResponse<PaymentResponse> createPayment(@PathVariable Long orderId,
            @Valid @RequestBody PaymentRequest request, HttpServletRequest httpRequest) {
        return ApiResponse.success("Payment request created",
                paymentService.createPayment(orderId, request, resolveClientIp(httpRequest)));
    }

    @GetMapping
    public ApiResponse<Page<PaymentSummaryResponse>> getMyPayments(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String direction) {
        return ApiResponse.success("Payments retrieved",
                paymentService.getMyPayments(size, page, sortBy, direction));
    }

    @GetMapping("/admin/all")
    public ApiResponse<Page<PaymentSummaryResponse>> getAllPayments(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String direction) {
        return ApiResponse.success("All payments retrieved",
                paymentService.getAllPayments(size, page, sortBy, direction));
    }

    @GetMapping("/admin/{paymentId}")
    public ApiResponse<PaymentResponse> getPaymentById(@PathVariable Long paymentId) {
        return ApiResponse.success("Payment retrieved", paymentService.getPaymentById(paymentId));
    }

    @GetMapping("/admin/status")
    public ApiResponse<Page<PaymentSummaryResponse>> getPaymentsByStatus(
            @RequestParam PaymentStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String direction) {
        return ApiResponse.success("Payments retrieved",
                paymentService.getPaymentsByStatus(status, size, page, sortBy, direction));
    }

    @PostMapping("/admin/{paymentId}/status")
    public ApiResponse<PaymentResponse> updatePaymentStatus(@PathVariable Long paymentId,
            @RequestParam PaymentStatus status,
            @RequestParam(required = false) String transactionCode) {
        return ApiResponse.success("Payment status updated",
                paymentService.updatePaymentStatus(paymentId, status, transactionCode));
    }

    @GetMapping("/vnpay/callback")
    public ApiResponse<String> vnpayCallback(@RequestParam Map<String, String> params) {
        try {
            if (!VNPayUtils.verifySignature(params, paymentService.getVnpayHashSecret())) {
                return ApiResponse.error("Invalid VNPay signature");
            }

            if (!"00".equals(params.get("vnp_ResponseCode"))) {
                return ApiResponse.success("Payment failed or cancelled", "FAILED");
            }

            Payment payment = paymentRepository
                    .findByTransactionCodeAndDeletedFalse(params.get("vnp_TxnRef")).orElse(null);
            if (payment == null) return ApiResponse.error("Transaction not found");

            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.PAID);
            orderRepository.save(order);

            return ApiResponse.success("Payment successful", "OK");
        } catch (Exception e) {
            return ApiResponse.error("Callback error: " + e.getMessage());
        }
    }

    @PostMapping("/momo/callback")
    public ApiResponse<String> momoCallback(@RequestBody Map<String, Object> params) {
        try {
            if (!MomoUtils.verifySignature(params, paymentService.getMomoSecretKey())) {
                return ApiResponse.error("Invalid MoMo signature");
            }

            if (!"0".equals(String.valueOf(params.get("resultCode")))) {
                return ApiResponse.success("Payment failed", "FAILED");
            }

            Payment payment = paymentRepository
                    .findByTransactionCodeAndDeletedFalse(String.valueOf(params.get("orderId"))).orElse(null);
            if (payment == null) return ApiResponse.error("Transaction not found");

            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.PAID);
            orderRepository.save(order);

            return ApiResponse.success("Payment successful", "OK");
        } catch (Exception e) {
            return ApiResponse.error("Callback error: " + e.getMessage());
        }
    }

    private String resolveClientIp(HttpServletRequest request) {
        String[] headers = {"X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP"};
        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isBlank() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.contains(",") ? ip.split(",")[0].trim() : ip;
            }
        }
        return request.getRemoteAddr();
    }
}
