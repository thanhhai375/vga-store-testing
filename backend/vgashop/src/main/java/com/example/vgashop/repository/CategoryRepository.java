package com.example.vgashop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Category;

/**
 * Repository for {@link Category} entity.
 * Supports keyword search, active status filtering, and soft-delete-aware queries.
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /** Returns paginated categories whose name contains the given keyword. */
    Page<Category> findByNameContaining(String keyWord, Pageable pageable);

    /** Returns all active categories, paginated. */
    Page<Category> findByActiveTrue(Pageable pageable);

    /** Returns true if a category with the given name already exists (case-insensitive). */
    boolean existsByNameIgnoreCase(String name);

    /** Returns paginated categories filtered by active status. */
    Page<Category> findByActive(Boolean active, Pageable pageable);

    /** Returns paginated categories matching a name keyword and active status. */
    Page<Category> findByNameContainingIgnoreCaseAndActive(String keyword, Boolean active, Pageable pageable);

    /** Returns all non-deleted categories, paginated. */
    Page<Category> findByDeletedFalse(Pageable pageable);

    /** Finds a category by ID and soft-delete flag. */
    Optional<Category> findByIdAndDeleted(Long id, boolean deleted);

    /** Returns true if a non-deleted category with the given ID exists. */
    boolean existsByIdAndDeleted(Long id, boolean deleted);
}
