package com.example.vgashop.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentMethod;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.Product;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.repository.ProductRepository;

@Service
public class PaymentExpiryScheduler {

    private static final int EXPIRY_MINUTES = 15;

    private final OrderRepository   orderRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;

    public PaymentExpiryScheduler(OrderRepository orderRepository,
            PaymentRepository paymentRepository, ProductRepository productRepository) {
        this.orderRepository   = orderRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
    }

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void expireUnpaidBankTransferOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(EXPIRY_MINUTES);
        List<Order> expired  = orderRepository.findExpiredPendingOrders(cutoff);

        for (Order order : expired) {
            Payment payment = paymentRepository.findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(order.getId()).orElse(null);

            if (payment != null && payment.getPaymentMethod() != PaymentMethod.BANK_TRANSFER) {
                continue;
            }

            if (payment != null) {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
            }

            for (OrderItem item : order.getItems()) {
                Product p = item.getProduct();
                p.setStock(p.getStock() + item.getQuantity());
                productRepository.save(p);
            }

            order.setStatus(OrderStatus.CANCELLED);
            order.setPaymentStatus(PaymentStatus.UNPAID);
            String existingNote = order.getNote() != null ? order.getNote() + " | " : "";
            order.setNote(existingNote + "[SYSTEM]: Payment expired after " + EXPIRY_MINUTES + " minutes");
            orderRepository.save(order);
        }
    }
}
