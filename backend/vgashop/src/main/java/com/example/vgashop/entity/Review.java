package com.example.vgashop.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = true) // nullable to allow guest reviews
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id")
    private Blog blog;

    @Column(nullable = false)
    private Integer rating = 5;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    // Display name for guest reviewers (used when user is null)
    @Column(name = "guest_name", length = 100)
    private String guestName;

}
