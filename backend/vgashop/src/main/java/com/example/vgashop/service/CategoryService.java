package com.example.vgashop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.vgashop.entity.Category;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.CategoryRepository;

@Service
public class CategoryService {

    
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Retrieve all
    public Page<Category> getAllCategories(Pageable pageable) {
        return  categoryRepository.findByDeletedFalse(pageable);
    }

    public Page<Category> getActiveCategories(Pageable pageable) {
        return categoryRepository.findByActiveTrue(pageable);
    }

    // get by id

    public Category getCategoryById(Long id) {
        return categoryRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID " + id));
    }

    // Search
    public Page<Category> searchCategory(String keyWord, Pageable pageable) {
        if (keyWord == null || keyWord.trim().isEmpty()) {
            return getAllCategories(pageable);
        }
        return categoryRepository.findByNameContaining(keyWord.trim(), pageable);
    }

    // List
    public Page<Category> filterCategories(String keyWord, Boolean active, int page, int size, String sortBy, String direction) {
        keyWord = (keyWord == null) ? "" : keyWord.trim();

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
                
        Sort finalSort = Sort.by(Sort.Direction.ASC, "displayOrder").and(sort);

        PageRequest pageable = PageRequest.of(page, size, finalSort);


        if (keyWord.isEmpty() && active == null) {
            return categoryRepository.findAll(pageable);
        }


        if (keyWord.isEmpty()) {
            return categoryRepository.findByActive(active, pageable);
        }


        if (active == null) {
            return categoryRepository.findByNameContaining(keyWord, pageable);
        }


        return categoryRepository.findByNameContainingIgnoreCaseAndActive(keyWord, active, pageable);
    }




    public Category createCategory(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new DuplicateResourceException("Tên danh mục '" + category.getName() + "' đã tồn tại!");
        }
        return categoryRepository.save(category);
    }

    // Update existing


    public Category updateCategory(Long id, Category newCategory) {
        return categoryRepository.findByIdAndDeleted(id, false)
                .map(category -> {

                    if (!category.getName().equalsIgnoreCase(newCategory.getName()) &&
                        categoryRepository.existsByNameIgnoreCase(newCategory.getName())) {
                        throw new DuplicateResourceException("Tên danh mục '" + newCategory.getName() + "' đã tồn tại!");
                    }

                    category.setName(newCategory.getName());
                    category.setDescription(newCategory.getDescription());
                    category.setActive(newCategory.getActive());

                    return categoryRepository.save(category);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID " + id));
    }

    // Delete

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsByIdAndDeleted(id, false)) {
            throw new ResourceNotFoundException("Không tìm thấy danh mục có ID " + id);
        }
        // categoryRepository.findById(id);

        Category category = categoryRepository.findByIdAndDeleted(id, false)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID " + id));

        // Hard delete to trigger DB constraints for demo
        categoryRepository.delete(category);
    }
}
