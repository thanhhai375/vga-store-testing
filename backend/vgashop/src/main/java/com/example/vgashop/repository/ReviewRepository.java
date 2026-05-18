package com.example.vgashop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.vgashop.entity.Review;

import java.util.List;

/**
 * Repository for {@link Review} entity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** Returns all reviews for the given product, ordered by creation date descending. */
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    /** Returns all reviews for the given blog post, ordered by creation date descending. */
    List<Review> findByBlogIdOrderByCreatedAtDesc(Long blogId);

    /** Returns true if the specified user has already submitted a review for the given product. */
    boolean existsByUser_IdAndProduct_Id(Long userId, Long productId);
}
