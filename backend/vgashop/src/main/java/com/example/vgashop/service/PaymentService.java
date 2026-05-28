package com.example.vgashop.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.dto.PaymentRequest;
import com.example.vgashop.dto.PaymentResponse;
import com.example.vgashop.dto.PaymentSummaryResponse;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.utils.MomoUtils;
import com.example.vgashop.utils.VNPayUtils;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository   orderRepository;
    private final UserService       userService;

    @Value("${vnpay.tmn-code}")    private String vnpayTmnCode;
    @Value("${vnpay.hash-secret}") private String vnpayHashSecret;
    @Value("${vnpay.url}")         private String vnpayUrl;
    @Value("${vnpay.return-url}")  private String vnpayReturnUrl;

    @Value("${momo.partner-code}") private String momoPartnerCode;
    @Value("${momo.access-key}")   private String momoAccessKey;
    @Value("${momo.secret-key}")   private String momoSecretKey;
    @Value("${momo.ipn-url}")      private String momoIpnUrl;
    @Value("${momo.return-url}")   private String momoReturnUrl;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository,
            UserService userService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository   = orderRepository;
        this.userService       = userService;
    }

    @Transactional
    public PaymentResponse createPayment(Long orderId, PaymentRequest request, String clientIp) {
        User user = userService.getCurrentUser();

        Order order = orderRepository.findByIdAndUser_IdAndDeletedFalse(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot create payment for a cancelled order");
        }

        paymentRepository.findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(orderId).ifPresent(existing -> {
            if (existing.getPaymentStatus() == PaymentStatus.SUCCESS) {
                throw new IllegalArgumentException("Order has already been paid");
            }
        });

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setTransactionCode("PAY-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());

        switch (request.getPaymentMethod()) {
            case COD:
                payment.setNote("Cash on delivery");
                break;
            case BANK_TRANSFER:
                payment.setNote("Bank transfer. Ref: " + order.getOrderCode());
                break;
            case VNPAY:
                payment.setPaymentUrl(VNPayUtils.createPaymentUrl(
                        order, payment.getTransactionCode(), vnpayReturnUrl,
                        clientIp, vnpayTmnCode, vnpayHashSecret, vnpayUrl));
                payment.setNote("VNPay");
                break;
            case MOMO:
                payment.setPaymentUrl(MomoUtils.createPaymentUrl(
                        order, payment.getTransactionCode(), momoReturnUrl,
                        momoPartnerCode, momoAccessKey, momoSecretKey, momoIpnUrl));
                payment.setNote("MoMo");
                break;
        }

        return toPaymentResponse(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus newStatus, String transactionCode) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));

        payment.setPaymentStatus(newStatus);

        if (newStatus == PaymentStatus.SUCCESS) {
            payment.setPaidAt(LocalDateTime.now());
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.PAID);
            orderRepository.save(order);
        } else if (newStatus == PaymentStatus.FAILED) {
            payment.getOrder().setPaymentStatus(PaymentStatus.UNPAID);
            orderRepository.save(payment.getOrder());
        }

        if (transactionCode != null && !transactionCode.isEmpty()) {
            payment.setTransactionCode(transactionCode);
        }

        return toPaymentResponse(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        userService.getCurrentUser();
        return toPaymentResponse(paymentRepository.findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment for order: " + orderId)));
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        return toPaymentResponse(paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId)));
    }

    @Transactional(readOnly = true)
    public Page<PaymentSummaryResponse> getMyPayments(int size, int page, String sortBy, String direction) {
        User user = userService.getCurrentUser();
        return paymentRepository
                .findByOrder_User_IdAndDeletedFalse(user.getId(), pageable(page, size, sortBy, direction))
                .map(this::toPaymentSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<PaymentSummaryResponse> getAllPayments(int size, int page, String sortBy, String direction) {
        return paymentRepository
                .findByDeletedFalse(pageable(page, size, sortBy, direction))
                .map(this::toPaymentSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<PaymentSummaryResponse> getPaymentsByStatus(PaymentStatus status, int size, int page,
            String sortBy, String direction) {
        return paymentRepository
                .findByPaymentStatusAndDeletedFalse(status, pageable(page, size, sortBy, direction))
                .map(this::toPaymentSummaryResponse);
    }

    public String getVnpayHashSecret() { return vnpayHashSecret; }
    public String getMomoSecretKey()   { return momoSecretKey; }

    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private PaymentResponse toPaymentResponse(Payment p) {
        return new PaymentResponse(p.getId(), p.getOrder().getId(), p.getOrder().getOrderCode(),
                p.getAmount(), p.getPaymentMethod(), p.getPaymentStatus(),
                p.getTransactionCode(), p.getPaymentUrl(), p.getPaidAt(), p.getNote());
    }

    private PaymentSummaryResponse toPaymentSummaryResponse(Payment p) {
        return new PaymentSummaryResponse(p.getId(), p.getOrder().getOrderCode(),
                p.getAmount(), p.getPaymentMethod(), p.getPaymentStatus(), p.getCreatedAt());
    }
}
