package com.example.vgashop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.vgashop.entity.Product;

/**
 * Repository for {@link Product} entity.
 * Provides derived queries for filtering, searching, soft-delete handling,
 * and admin dashboard statistics.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {

    /** Returns a paginated list of products whose name contains the given keyword (case-insensitive). */
    Page<Product> findByNameContaining(String keyWord, Pageable pageable);

    /** Returns a paginated list of products belonging to the specified brand name. */
    Page<Product> findByBrand_Name(String keyWord, Pageable pageable);

    /** Returns a paginated list of products belonging to the specified brand ID. */
    Page<Product> findByBrand_Id(Long brandId, Pageable pageable);

    /** Returns a paginated list of products whose brand ID is in the given list (multi-select filter). */
    Page<Product> findByBrand_IdIn(List<Long> brandIds, Pageable pageable);

    /** Returns a paginated list of products within the specified price range. */
    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);

    /** Returns products matching both a keyword (by name) and a brand name. */
    Page<Product> findByNameContainingAndBrand_Name(String keyWord, String brandName, Pageable pageable);

    /** Returns products matching both a keyword (by name) and a brand ID. */
    Page<Product> findByNameContainingAndBrand_Id(String keyWord, Long brandId, Pageable pageable);

    /** Returns products matching a keyword and within a price range. */
    Page<Product> findByNameContainingAndPriceBetween(String keyWord, Double minPrice, Double maxPrice, Pageable pageable);

    /** Returns products in a given brand and within a price range. */
    Page<Product> findByBrand_IdAndPriceBetween(Long brandId, Double minPrice, Double maxPrice, Pageable pageable);

    /** Full combined filter: keyword + multiple brand IDs + price range. */
    Page<Product> findByNameContainingAndBrand_IdInAndPriceBetween(String keyWord, List<Long> brandIds, Double minPrice, Double maxPrice, Pageable pageable);

    /** Returns true if a product with the given name already exists (case-insensitive). */
    boolean existsByNameIgnoreCase(String name);

    /** Returns true if a product with the given SKU already exists (case-insensitive). */
    boolean existsBySkuIgnoreCase(String sku);

    /** Returns all non-deleted products, paginated. */
    Page<Product> findByDeletedFalse(Pageable pageable);

    /** Search products for admin panel (by name, sku, category, brand) */
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.brand.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchAdminProducts(@Param("search") String search, Pageable pageable);

    /** Finds a product by ID and soft-delete flag. */
    Optional<Product> findByIdAndDeleted(Long id, boolean deleted);

    /** Returns true if a non-deleted product with the given ID exists. */
    boolean existsByIdAndDeleted(Long id, boolean deleted);

    /** Counts non-deleted products associated with the given brand. */
    long countByBrand_IdAndDeletedFalse(Long brandId);

    /** Counts non-deleted products associated with the given category. */
    long countByCategory_IdAndDeletedFalse(Long categoryId);

    /** Returns the total count of non-deleted products (used in admin dashboard). */
    Long countByDeletedFalse();

    /** Returns the count of non-deleted products with stock at or below the given threshold. */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.deleted = false AND p.stock <= :threshold")
    Long countLowStock(@Param("threshold") int threshold);

    /** Finds a non-deleted product by its ID. */
    Optional<Product> findByIdAndDeletedFalse(Long id);

    /**
     * Returns a distinct list of products that the specified user has received
     * (via a DELIVERED order) but has not yet submitted a review for.
     */
    @Query("SELECT DISTINCT p FROM Product p JOIN p.orderItems oi JOIN oi.order o " +
           "WHERE o.user.id = :userId AND o.status = 'DELIVERED' " +
           "AND p.id NOT IN (SELECT r.product.id FROM Review r WHERE r.user.id = :userId)")
    List<Product> findProductsPendingReview(@Param("userId") Long userId);
}
