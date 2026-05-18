package com.example.vgashop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.vgashop.entity.Blog;

import java.util.List;

/**
 * Repository for {@link Blog} entity.
 */
@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    /** Returns all blog posts marked as featured. */
    List<Blog> findByFeaturedTrue();

    /** Returns all blog posts belonging to the given category. */
    List<Blog> findByCategory(String category);

    List<Blog> findByDeletedFalse(org.springframework.data.domain.Sort sort);
}
