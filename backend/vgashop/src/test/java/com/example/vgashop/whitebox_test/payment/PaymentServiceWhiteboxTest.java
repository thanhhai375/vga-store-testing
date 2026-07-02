package com.example.vgashop.whitebox_test.payment;

import com.example.vgashop.dto.PaymentRequest;
import com.example.vgashop.dto.PaymentResponse;
import com.example.vgashop.dto.PaymentSummaryResponse;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentMethod;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.service.PaymentService;
import com.example.vgashop.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceWhiteboxTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserService userService;

    private PaymentService paymentService;
    private User currentUser;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService(
                paymentRepository,
                orderRepository,
                userService
        );

        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("payment_user");

        lenient()
                .when(userService.getCurrentUser())
                .thenReturn(currentUser);

        ReflectionTestUtils.setField(
                paymentService,
                "vnpayTmnCode",
                "TEST-TMN"
        );
        ReflectionTestUtils.setField(
                paymentService,
                "vnpayHashSecret",
                "TEST-VNPAY-SECRET"
        );
        ReflectionTestUtils.setField(
                paymentService,
                "vnpayUrl",
                "https://sandbox.vnpay.test/pay"
        );
        ReflectionTestUtils.setField(
                paymentService,
                "vnpayReturnUrl",
                "https://localhost/vnpay-return"
        );

        ReflectionTestUtils.setField(
                paymentService,
                "momoPartnerCode",
                "TEST-PARTNER"
        );
        ReflectionTestUtils.setField(
                paymentService,
                "momoAccessKey",
                "TEST-ACCESS"
        );
        ReflectionTestUtils.setField(
                paymentService,
                "momoSecretKey",
                "TEST-MOMO-SECRET"
        );
        ReflectionTestUtils.setField(
                paymentService,
                "momoIpnUrl",
                "https://localhost/momo-ipn"
        );
        ReflectionTestUtils.setField(
                paymentService,
                "momoReturnUrl",
                "https://localhost/momo-return"
        );
    }

    private Order createOrder(Long id) {
        Order order = new Order();
        order.setId(id);
        order.setUser(currentUser);
        order.setOrderCode("ORD-" + id);
        order.setTotalAmount(new BigDecimal("1500000"));
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setDeleted(false);
        return order;
    }

    private Payment createPayment(
            Long id,
            Order order,
            PaymentMethod method,
            PaymentStatus status
    ) {
        Payment payment = new Payment();
        payment.setId(id);
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(method);
        payment.setPaymentStatus(status);
        payment.setTransactionCode("OLD-TX");
        payment.setDeleted(false);
        return payment;
    }

    private PaymentRequest request(PaymentMethod method) {
        PaymentRequest request = new PaymentRequest();
        request.setPaymentMethod(method);
        return request;
    }

    @Test
    @DisplayName("WB-PAY-001 - createPayment: order not found")
    void createPayment_orderNotFound_throwException() {
        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(99L, 1L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.createPayment(
                        99L,
                        request(PaymentMethod.COD),
                        "127.0.0.1"
                )
        );

        assertEquals("Order not found: 99", exception.getMessage());
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("WB-PAY-002 - createPayment: cancelled order")
    void createPayment_cancelledOrder_throwException() {
        Order order = createOrder(10L);
        order.setStatus(OrderStatus.CANCELLED);

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(10L, 1L))
                .thenReturn(Optional.of(order));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.createPayment(
                        10L,
                        request(PaymentMethod.COD),
                        "127.0.0.1"
                )
        );

        assertEquals(
                "Cannot create payment for a cancelled order",
                exception.getMessage()
        );

        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("WB-PAY-003 - createPayment: order already paid")
    void createPayment_existingSuccessfulPayment_throwException() {
        Order order = createOrder(10L);
        Payment existingPayment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.SUCCESS
        );

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(10L, 1L))
                .thenReturn(Optional.of(order));

        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(10L))
                .thenReturn(Optional.of(existingPayment));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.createPayment(
                        10L,
                        request(PaymentMethod.COD),
                        "127.0.0.1"
                )
        );

        assertEquals(
                "Order has already been paid",
                exception.getMessage()
        );

        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("WB-PAY-004 - createPayment: COD success")
    void createPayment_cod_success() {
        Order order = createOrder(10L);

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(10L, 1L))
                .thenReturn(Optional.of(order));

        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(10L))
                .thenReturn(Optional.empty());

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> {
                    Payment payment = invocation.getArgument(0);
                    payment.setId(100L);
                    return payment;
                });

        PaymentResponse response = paymentService.createPayment(
                10L,
                request(PaymentMethod.COD),
                "127.0.0.1"
        );

        assertNotNull(response);
        assertEquals(100L, response.getPaymentId());
        assertEquals(10L, response.getOrderId());
        assertEquals(PaymentMethod.COD, response.getPaymentMethod());
        assertEquals(PaymentStatus.PENDING, response.getPaymentStatus());
        assertEquals("Cash on delivery", response.getNote());
        assertNull(response.getPaymentUrl());
        assertTrue(response.getTransactionCode().startsWith("PAY-"));

        ArgumentCaptor<Payment> captor =
                ArgumentCaptor.forClass(Payment.class);

        verify(paymentRepository).save(captor.capture());

        Payment savedPayment = captor.getValue();

        assertEquals(order, savedPayment.getOrder());
        assertEquals(order.getTotalAmount(), savedPayment.getAmount());
    }

    @Test
    @DisplayName("WB-PAY-005 - createPayment: bank transfer success")
    void createPayment_bankTransfer_success() {
        Order order = createOrder(20L);

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(20L, 1L))
                .thenReturn(Optional.of(order));

        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(20L))
                .thenReturn(Optional.empty());

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> {
                    Payment payment = invocation.getArgument(0);
                    payment.setId(200L);
                    return payment;
                });

        PaymentResponse response = paymentService.createPayment(
                20L,
                request(PaymentMethod.BANK_TRANSFER),
                "127.0.0.1"
        );

        assertEquals(PaymentMethod.BANK_TRANSFER, response.getPaymentMethod());
        assertEquals(
                "Bank transfer. Ref: ORD-20",
                response.getNote()
        );
        assertNull(response.getPaymentUrl());
    }

    @Test
    @DisplayName("WB-PAY-006 - updatePaymentStatus: payment not found")
    void updatePaymentStatus_notFound_throwException() {
        when(paymentRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.updatePaymentStatus(
                        999L,
                        PaymentStatus.SUCCESS,
                        "TX-999"
                )
        );

        assertEquals(
                "Payment not found: 999",
                exception.getMessage()
        );

        verify(orderRepository, never()).save(any(Order.class));
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    @DisplayName("WB-PAY-007 - updatePaymentStatus: SUCCESS")
    void updatePaymentStatus_success_updateOrder() {
        Order order = createOrder(10L);
        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.PENDING
        );

        when(paymentRepository.findById(100L))
                .thenReturn(Optional.of(payment));

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.updatePaymentStatus(
                100L,
                PaymentStatus.SUCCESS,
                "TX-SUCCESS"
        );

        assertEquals(PaymentStatus.SUCCESS, response.getPaymentStatus());
        assertEquals("TX-SUCCESS", response.getTransactionCode());
        assertNotNull(response.getPaidAt());

        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        assertEquals(PaymentStatus.PAID, order.getPaymentStatus());

        verify(orderRepository).save(order);
        verify(paymentRepository).save(payment);
    }

    @Test
    @DisplayName("WB-PAY-008 - updatePaymentStatus: FAILED")
    void updatePaymentStatus_failed_updateOrder() {
        Order order = createOrder(10L);
        order.setPaymentStatus(PaymentStatus.PAID);

        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.PENDING
        );

        when(paymentRepository.findById(100L))
                .thenReturn(Optional.of(payment));

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.updatePaymentStatus(
                100L,
                PaymentStatus.FAILED,
                "TX-FAILED"
        );

        assertEquals(PaymentStatus.FAILED, response.getPaymentStatus());
        assertEquals(PaymentStatus.UNPAID, order.getPaymentStatus());

        verify(orderRepository).save(order);
        verify(paymentRepository).save(payment);
    }

    @Test
    @DisplayName("WB-PAY-009 - updatePaymentStatus: empty transaction code")
    void updatePaymentStatus_emptyTransactionCode_keepOldCode() {
        Order order = createOrder(10L);

        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.PENDING
        );

        when(paymentRepository.findById(100L))
                .thenReturn(Optional.of(payment));

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.updatePaymentStatus(
                100L,
                PaymentStatus.PENDING,
                ""
        );

        assertEquals("OLD-TX", response.getTransactionCode());
        assertEquals(PaymentStatus.PENDING, response.getPaymentStatus());

        verify(orderRepository, never()).save(any(Order.class));
        verify(paymentRepository).save(payment);
    }

    @Test
    @DisplayName("WB-PAY-010 - getPaymentByOrderId: success")
    void getPaymentByOrderId_success() {
        Order order = createOrder(10L);
        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.PENDING
        );

        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(10L))
                .thenReturn(Optional.of(payment));

        PaymentResponse response =
                paymentService.getPaymentByOrderId(10L);

        assertEquals(100L, response.getPaymentId());
        assertEquals(10L, response.getOrderId());

        verify(userService).getCurrentUser();
    }

    @Test
    @DisplayName("WB-PAY-011 - getPaymentByOrderId: not found")
    void getPaymentByOrderId_notFound_throwException() {
        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.getPaymentByOrderId(99L)
        );

        assertEquals(
                "No payment for order: 99",
                exception.getMessage()
        );
    }

    @Test
    @DisplayName("WB-PAY-012 - getPaymentById: success")
    void getPaymentById_success() {
        Order order = createOrder(10L);
        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.SUCCESS
        );

        when(paymentRepository.findById(100L))
                .thenReturn(Optional.of(payment));

        PaymentResponse response =
                paymentService.getPaymentById(100L);

        assertEquals(100L, response.getPaymentId());
        assertEquals(PaymentStatus.SUCCESS, response.getPaymentStatus());
    }

    @Test
    @DisplayName("WB-PAY-013 - getPaymentById: not found")
    void getPaymentById_notFound_throwException() {
        when(paymentRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.getPaymentById(999L)
        );

        assertEquals(
                "Payment not found: 999",
                exception.getMessage()
        );
    }

    @Test
    @DisplayName("WB-PAY-014 - getMyPayments: descending pagination")
    void getMyPayments_descending_success() {
        Order order = createOrder(10L);
        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.SUCCESS
        );

        when(paymentRepository.findByOrder_User_IdAndDeletedFalse(
                eq(1L),
                any(Pageable.class)
        )).thenReturn(new PageImpl<>(List.of(payment)));

        Page<PaymentSummaryResponse> result =
                paymentService.getMyPayments(10, 0, "id", "desc");

        assertEquals(1, result.getTotalElements());
        assertEquals(100L, result.getContent().get(0).getPaymentId());

        ArgumentCaptor<Pageable> captor =
                ArgumentCaptor.forClass(Pageable.class);

        verify(paymentRepository)
                .findByOrder_User_IdAndDeletedFalse(eq(1L), captor.capture());

        Pageable pageable = captor.getValue();

        assertEquals(0, pageable.getPageNumber());
        assertEquals(10, pageable.getPageSize());
        assertEquals(
                Sort.Direction.DESC,
                pageable.getSort().getOrderFor("id").getDirection()
        );
    }

    @Test
    @DisplayName("WB-PAY-015 - getAllPayments: ascending pagination")
    void getAllPayments_ascending_success() {
        Order order = createOrder(10L);
        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.BANK_TRANSFER,
                PaymentStatus.PENDING
        );

        when(paymentRepository.findByDeletedFalse(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(payment)));

        Page<PaymentSummaryResponse> result =
                paymentService.getAllPayments(5, 1, "id", "asc");

        assertEquals(1, result.getTotalElements());

        ArgumentCaptor<Pageable> captor =
                ArgumentCaptor.forClass(Pageable.class);

        verify(paymentRepository)
                .findByDeletedFalse(captor.capture());

        Pageable pageable = captor.getValue();

        assertEquals(1, pageable.getPageNumber());
        assertEquals(5, pageable.getPageSize());
        assertEquals(
                Sort.Direction.ASC,
                pageable.getSort().getOrderFor("id").getDirection()
        );
    }

    @Test
    @DisplayName("WB-PAY-016 - getPaymentsByStatus: filter status")
    void getPaymentsByStatus_success() {
        Order order = createOrder(10L);
        Payment payment = createPayment(
                100L,
                order,
                PaymentMethod.COD,
                PaymentStatus.FAILED
        );

        when(paymentRepository.findByPaymentStatusAndDeletedFalse(
                eq(PaymentStatus.FAILED),
                any(Pageable.class)
        )).thenReturn(new PageImpl<>(List.of(payment)));

        Page<PaymentSummaryResponse> result =
                paymentService.getPaymentsByStatus(
                        PaymentStatus.FAILED,
                        20,
                        0,
                        "id",
                        "desc"
                );

        assertEquals(1, result.getTotalElements());
        assertEquals(
                PaymentStatus.FAILED,
                result.getContent().get(0).getPaymentStatus()
        );

        verify(paymentRepository)
                .findByPaymentStatusAndDeletedFalse(
                        eq(PaymentStatus.FAILED),
                        any(Pageable.class)
                );
    }


    @Test
    @DisplayName("WB-PAY-017 - createPayment: existing failed payment still allows new payment")
    void createPayment_existingFailedPayment_success() {
        Order order = createOrder(30L);

        Payment existingPayment = createPayment(
                300L,
                order,
                PaymentMethod.COD,
                PaymentStatus.FAILED
        );

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(30L, 1L))
                .thenReturn(Optional.of(order));

        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(30L))
                .thenReturn(Optional.of(existingPayment));

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> {
                    Payment payment = invocation.getArgument(0);
                    payment.setId(301L);
                    return payment;
                });

        PaymentResponse response = paymentService.createPayment(
                30L,
                request(PaymentMethod.COD),
                "127.0.0.1"
        );

        assertEquals(301L, response.getPaymentId());
        assertEquals(PaymentStatus.PENDING, response.getPaymentStatus());
        assertEquals("Cash on delivery", response.getNote());

        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    @DisplayName("WB-PAY-018 - createPayment: VNPay success with fake configuration")
    void createPayment_vnpay_success() {
        Order order = createOrder(40L);

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(40L, 1L))
                .thenReturn(Optional.of(order));

        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(40L))
                .thenReturn(Optional.empty());

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> {
                    Payment payment = invocation.getArgument(0);
                    payment.setId(400L);
                    return payment;
                });

        PaymentResponse response = paymentService.createPayment(
                40L,
                request(PaymentMethod.VNPAY),
                ""
        );

        assertEquals(PaymentMethod.VNPAY, response.getPaymentMethod());
        assertEquals(PaymentStatus.PENDING, response.getPaymentStatus());
        assertEquals("VNPay", response.getNote());
        assertNotNull(response.getPaymentUrl());

        assertTrue(
                response.getPaymentUrl()
                        .startsWith("https://sandbox.vnpay.test/pay?")
        );
        assertTrue(
                response.getPaymentUrl()
                        .contains("vnp_TmnCode=TEST-TMN")
        );
        assertTrue(
                response.getPaymentUrl()
                        .contains("vnp_IpAddr=127.0.0.1")
        );
        assertTrue(
                response.getPaymentUrl()
                        .contains("vnp_SecureHash=")
        );
    }

    @Test
    @DisplayName("WB-PAY-019 - createPayment: MoMo success with fake configuration")
    void createPayment_momo_success() {
        Order order = createOrder(50L);

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(50L, 1L))
                .thenReturn(Optional.of(order));

        when(paymentRepository
                .findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(50L))
                .thenReturn(Optional.empty());

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> {
                    Payment payment = invocation.getArgument(0);
                    payment.setId(500L);
                    return payment;
                });

        PaymentResponse response = paymentService.createPayment(
                50L,
                request(PaymentMethod.MOMO),
                "127.0.0.1"
        );

        assertEquals(PaymentMethod.MOMO, response.getPaymentMethod());
        assertEquals(PaymentStatus.PENDING, response.getPaymentStatus());
        assertEquals("MoMo", response.getNote());
        assertNotNull(response.getPaymentUrl());

        assertTrue(
                response.getPaymentUrl()
                        .startsWith(
                                "https://test-payment.momo.vn/v2/gateway/api/create?"
                        )
        );
        assertTrue(
                response.getPaymentUrl()
                        .contains("partnerCode=TEST-PARTNER")
        );
        assertTrue(
                response.getPaymentUrl()
                        .contains("amount=1500000")
        );
        assertTrue(
                response.getPaymentUrl()
                        .contains("signature=")
        );
    }

    @Test
    @DisplayName("WB-PAY-020 - updatePaymentStatus: null transaction code keeps old code")
    void updatePaymentStatus_nullTransactionCode_keepOldCode() {
        Order order = createOrder(60L);

        Payment payment = createPayment(
                600L,
                order,
                PaymentMethod.COD,
                PaymentStatus.PENDING
        );

        when(paymentRepository.findById(600L))
                .thenReturn(Optional.of(payment));

        when(paymentRepository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PaymentResponse response = paymentService.updatePaymentStatus(
                600L,
                PaymentStatus.PENDING,
                null
        );

        assertEquals("OLD-TX", response.getTransactionCode());
        assertEquals(PaymentStatus.PENDING, response.getPaymentStatus());

        verify(orderRepository, never()).save(any(Order.class));
        verify(paymentRepository).save(payment);
    }
}