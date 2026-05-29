package com.example.vgashop.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentStatus;

/**
 * Repository for {@link Payment} entity.
 * Provides queries for payment lookup, user history, admin listing, and revenue reporting.
 */
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /** Finds the non-deleted payment record associated with the given order. */
    Optional<Payment> findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(Long orderId);

    /** Returns paginated non-deleted payments for the given user. */
    Page<Payment> findByOrder_User_IdAndDeletedFalse(Long userId, Pageable pageable);

    /** Returns all non-deleted payments, paginated (admin). */
    Page<Payment> findByDeletedFalse(Pageable pageable);

    /** Returns non-deleted payments filtered by payment status (admin). */
    Page<Payment> findByPaymentStatusAndDeletedFalse(PaymentStatus status, Pageable pageable);

    /** Returns true if a non-deleted payment exists for the given order. */
    boolean existsByOrder_IdAndDeletedFalse(Long orderId);

    /** Finds a non-deleted payment by its transaction code. */
    Optional<Payment> findByTransactionCodeAndDeletedFalse(String transactionCode);

    /** Returns the total revenue sum across all non-deleted completed payments (admin dashboard). */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.deleted = false")
    BigDecimal findTotalRevenue();

    /** Returns the total revenue for today, starting from the given start-of-day timestamp (admin dashboard). */
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.deleted = false AND p.paidAt >= :startOfDay")
    BigDecimal findTodayRevenue(@Param("startOfDay") LocalDateTime startOfDay);
}
