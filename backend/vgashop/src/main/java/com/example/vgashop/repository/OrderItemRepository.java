package com.example.vgashop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;

/**
 * Repository for {@link OrderItem} entity.
 */
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /** Returns all non-deleted items belonging to the specified order. */
    List<OrderItem> findByOrder_IdAndDeletedFalse(Long orderId);

    /**
     * Returns true if the specified user has at least one order item
     * for the given product in an order with the given status.
     * Used to verify purchase eligibility before allowing a review.
     */
    boolean existsByOrder_User_IdAndOrder_StatusAndProduct_Id(
        Long userId,
        com.example.vgashop.entity.OrderStatus status,
        Long productId
    );
}
