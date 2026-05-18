package com.example.vgashop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Brand;

/**
 * Repository for {@link Brand} entity.
 * Supports keyword search, status filtering, and soft-delete-aware queries.
 */
public interface BrandRepository extends JpaRepository<Brand, Long> {

    /** Returns paginated brands whose name contains the given keyword. */
    Page<Brand> findByNameContaining(String keyWord, Pageable pageable);

    /** Returns true if a brand with the given name already exists (case-insensitive). Used for duplicate validation. */
    boolean existsByNameIgnoreCase(String name);

    /** Returns paginated brands filtered by active status. */
    Page<Brand> findByStatus(Boolean status, Pageable pageable);

    /** Returns paginated brands matching a name keyword and active status. */
    Page<Brand> findByNameContainingIgnoreCaseAndStatus(String keyword, Boolean status, Pageable pageable);

    /** Returns all non-deleted brands, paginated. */
    Page<Brand> findByDeletedFalse(Pageable pageable);

    /**
     * Finds a brand by ID and soft-delete flag.
     * Used by getById and update operations.
     */
    Optional<Brand> findByIdAndDeleted(Long id, boolean deleted);

    /** Returns true if a non-deleted brand with the given ID exists. */
    boolean existsByIdAndDeleted(Long id, boolean deleted);
}
