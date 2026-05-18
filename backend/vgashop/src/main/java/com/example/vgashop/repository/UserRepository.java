package com.example.vgashop.repository;

import com.example.vgashop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.vgashop.entity.Role;

/**
 * Repository for {@link User} entity.
 * Provides lookup by credentials, soft-delete-aware queries, and admin search/filter functionality.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // --- Soft-delete-aware queries ---

    /** Returns all non-deleted users, paginated. */
    Page<User> findByDeletedFalse(Pageable pageable);

    /** Finds a user by ID and soft-delete flag. */
    Optional<User> findByIdAndDeleted(Long id, boolean deleted);

    /** Returns true if a non-deleted user with the given ID exists. */
    boolean existsByIdAndDeleted(Long id, boolean deleted);

    /** Finds a non-deleted user by username. */
    Optional<User> findByUsernameAndDeletedFalse(String username);

    /** Returns paginated users whose username or email contains the given search terms (case-insensitive). */
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String username, String email, Pageable pageable);

    /**
     * Searches active (non-deleted) users by username/email keyword and optional role filter.
     * Both parameters are optional; passing null or empty string for search returns all active users.
     */
    @Query("SELECT u FROM User u WHERE u.deleted = false " +
           "AND (:search IS NULL OR :search = '' OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:role IS NULL OR u.role = :role)")
    Page<User> searchActiveUsers(@Param("search") String search, @Param("role") Role role, Pageable pageable);

    /** Returns the total count of non-deleted users (admin dashboard). */
    Long countByDeletedFalse();
}
