package com.example.vgashop.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Cart;

/**
 * Repository for {@link Cart} entity.
 */
public interface CartRepository extends JpaRepository<Cart, Long> {

    /** Returns the active (non-deleted) cart for the given user. */
    Optional<Cart> findByUser_IdAndDeletedFalse(Long userId);

    /** Returns true if the given user has an active (non-deleted) cart. */
    boolean existsByUser_IdAndDeletedFalse(Long userId);
}
