package com.example.vgashop.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;

/**
 * Repository for {@link Order} entity.
 * Provides queries for user-facing order history, admin management,
 * and dashboard statistics.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /** Returns paginated non-deleted orders belonging to the specified user. */
    Page<Order> findByUser_IdAndDeletedFalse(Long userId, Pageable pageable);

    /** Returns paginated non-deleted orders belonging to a user, filtered by status. */
    Page<Order> findByUser_IdAndStatusAndDeletedFalse(Long userId, OrderStatus status, Pageable pageable);

    /** Finds a non-deleted order by its order code. */
    Optional<Order> findByOrderCodeAndDeletedFalse(String orderCode);

    /**
     * Finds a non-deleted order by ID and user ID.
     * Ensures users can only access their own orders.
     */
    Optional<Order> findByIdAndUser_IdAndDeletedFalse(Long id, Long userId);

    Optional<Order> findByIdAndDeletedFalse(Long id);

    /** Returns all non-deleted orders, paginated (admin). */
    Page<Order> findByDeletedFalse(Pageable pageable);

    /** Returns all non-deleted orders filtered by status (admin). */
    Page<Order> findByStatusAndDeletedFalse(OrderStatus status, Pageable pageable);

    /** Returns true if a non-deleted order with the given ID exists. */
    boolean existsByIdAndDeletedFalse(Long id);

    /** Returns the total count of non-deleted orders (admin dashboard). */
    long countByDeletedFalse();

    /** Returns the count of non-deleted orders created after the given datetime. */
    long countByCreatedAtAfterAndDeletedFalse(LocalDateTime dateTime);

    /** Returns the count of non-deleted orders created on or after the given start-of-day timestamp. */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.deleted = false AND o.createdAt >= :startOfDay")
    long countTodayOrders(@Param("startOfDay") LocalDateTime startOfDay);

    /** Returns all orders for the given user, sorted by ID descending (most recent first). */
    List<Order> findByUserIdOrderByIdDesc(Long userId);

    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' AND o.paymentStatus = 'UNPAID' AND o.deleted = false AND o.createdAt < :cutoff")
    List<Order> findExpiredPendingOrders(@Param("cutoff") LocalDateTime cutoff);
}
