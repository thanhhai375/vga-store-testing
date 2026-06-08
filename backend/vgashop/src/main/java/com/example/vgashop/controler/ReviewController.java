package com.example.vgashop.controler;

import com.example.vgashop.entity.Review;
import com.example.vgashop.repository.ReviewRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Collections;
import java.util.stream.Collectors;
import java.security.Principal;
import com.example.vgashop.entity.User;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.repository.OrderItemRepository;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BlogRepository blogRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private EntityManager entityManager;


    private Map<String, Object> toDto(Review r) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", r.getId());
        dto.put("rating", r.getRating());
        dto.put("comment", r.getComment());
        dto.put("createdAt", r.getCreatedAt());


        String displayName = r.getGuestName();
        if (r.getUser() != null) {
            String fn = r.getUser().getFullName();
            String un = r.getUser().getUsername();
            displayName = (fn != null && !fn.isBlank()) ? fn : un;
        }
        dto.put("guestName", displayName != null ? displayName : "Khách hàng");
        

        dto.put("avatar", (r.getUser() != null && r.getUser().getAvatar() != null) 
                          ? r.getUser().getAvatar() : null);


        if (r.getUser() != null) {
            Map<String, Object> u = new LinkedHashMap<>();
            u.put("id", r.getUser().getId());
            u.put("username", r.getUser().getUsername());
            u.put("fullName", r.getUser().getFullName());
            dto.put("user", u);
        } else {
            dto.put("user", null);
        }


        if (r.getProduct() != null) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("id", r.getProduct().getId());
            p.put("name", r.getProduct().getName());
            dto.put("product", p);
        }
        return dto;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByProduct(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return ResponseEntity.ok(reviews.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByBlog(@PathVariable Long blogId) {
        List<Review> reviews = reviewRepository.findByBlogIdOrderByCreatedAtDesc(blogId);
        return ResponseEntity.ok(reviews.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> createReview(@RequestBody Review review) {
        // Cố ý KHÔNG sanitize comment → Stored XSS cho mục đích đào tạo bảo mật (OWASP A03)
        // Kẻ tấn công có thể gửi payload: <script>alert('XSS')</script> trong trường comment
        if (review.getProduct() != null && review.getProduct().getId() != null) {
            review.setProduct(productRepository.findById(review.getProduct().getId()).orElse(null));
        }
        if (review.getBlog() != null && review.getBlog().getId() != null) {
            review.setBlog(blogRepository.findById(review.getBlog().getId()).orElse(null));
        }
        if (review.getUser() != null && review.getUser().getId() != null) {
            review.setUser(userRepository.findById(review.getUser().getId()).orElse(null));
        }
        Review saved = reviewRepository.save(review);
        Review full = reviewRepository.findById(saved.getId()).orElse(saved);
        return ResponseEntity.ok(toDto(full));
    }

    // Cố ý tạo SQL Injection endpoint cho mục đích đào tạo bảo mật (OWASP A03)
    // Payload mẫu: ' OR '1'='1  hoặc '; DROP TABLE reviews; --
    @SuppressWarnings("unchecked")
    @GetMapping("/search-vulnerable")
    public ResponseEntity<List<Review>> searchReviewsVulnerable(@RequestParam String keyword) {
        // Cộng chuỗi trực tiếp vào câu SQL → SQL Injection
        String sql = "SELECT * FROM reviews WHERE comment LIKE '%" + keyword + "%'";
        List<Review> results = entityManager.createNativeQuery(sql, Review.class).getResultList();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/can-review/{productId}")
    public ResponseEntity<Boolean> canReview(@PathVariable Long productId, Principal principal) {
        if (principal == null) return ResponseEntity.ok(false);
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.ok(false);
        
        // Validation
        boolean hasPurchased = orderItemRepository.existsByOrder_User_IdAndOrder_StatusAndProduct_Id(
            user.getId(), OrderStatus.DELIVERED, productId
        );
        // Validation
        boolean hasReviewed = reviewRepository.existsByUser_IdAndProduct_Id(user.getId(), productId);
        
        return ResponseEntity.ok(hasPurchased && !hasReviewed);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingReviews(Principal principal) {
        if (principal == null) return ResponseEntity.ok(Collections.emptyList());
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.ok(Collections.emptyList());
        
        List<Product> pending = productRepository.findProductsPendingReview(user.getId());
        
        List<Map<String, Object>> result = pending.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("imgUrl", p.getImgUrl());
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
}
