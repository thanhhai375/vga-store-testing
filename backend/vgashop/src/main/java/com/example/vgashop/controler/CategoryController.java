package com.example.vgashop.controler;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.dto.CategoryDTO;
import com.example.vgashop.entity.Category;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.CategoryService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Retrieve all
    @GetMapping
    public ApiResponse<Page<Category>> getAll(
        @RequestParam(defaultValue= "0")
        int page,
        @RequestParam(defaultValue= "10") int size,
        @RequestParam(defaultValue= "name") String sortBy,
        @RequestParam(defaultValue= "asc") String direction
    )  {
        Sort sort = direction.equalsIgnoreCase("desc")
             ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
             
         Sort finalSort = Sort.by(Sort.Direction.ASC, "displayOrder").and(sort);

         PageRequest pageable = PageRequest.of(page, size, finalSort);
         Page<Category> data = categoryService.getAllCategories(pageable);

         return ApiResponse.success("Lấy danh sách danh mục thành công!", data);
    }


    @GetMapping("/active")
    public ApiResponse<Page<Category>> getActive(
        @RequestParam(defaultValue= "0")
        int page,
        @RequestParam(defaultValue= "10")
        int size
    ) {
        Page<Category> data =  categoryService.getActiveCategories(
            PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.ASC, "id")))
        );
        return ApiResponse.success("Lấy danh mục đang active thành công", data);
    }

    // Search
    @GetMapping("/search")
    public ApiResponse<Page<Category>> searchCategorys(
        @RequestParam String keyWord,
        @RequestParam(defaultValue= "0")
        int page,
        @RequestParam(defaultValue= "10")
        int size
    ) {
        Page<Category> data = categoryService.searchCategory(keyWord, PageRequest.of(page, size));
        return ApiResponse.success("Tìm kiếm danh mục thành công", data);
    }


    @GetMapping("/filter")
    public ApiResponse<Page<Category>> filterCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Page<Category> data = categoryService.filterCategories(keyword, active, page, size, sortBy, direction);
        return ApiResponse.success("Lọc danh mục thành công", data);
    }

    // By ID
    @GetMapping("/{id}")
    public ApiResponse<Category> getById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ApiResponse.success("Lấy danh mục thành công", category);
    }


    // @PostMapping
    // public ResponseEntity<Category> create(@RequestBody Category category) {
    //     return ResponseEntity.ok(categoryService.createCategory(category));
    // }

    @PostMapping
    public ApiResponse<Category> create(
            @Valid @RequestBody CategoryDTO dto) {    


        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setActive(dto.isActive());

        Category save = categoryService.createCategory(category);
        return ApiResponse.success("Tạo danh mục thành công", save);
    }

    // Update existing
    // @PutMapping("/{id}")
    // public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category newCategory) {
    //     return ResponseEntity.ok(categoryService.updateCategory(id, newCategory));
    // }

    // Update existing
    @PutMapping("/{id}")
    public ApiResponse<Category> update(@PathVariable Long id, @Valid @RequestBody CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setActive(dto.isActive());

        Category updated = categoryService.updateCategory(id, category);
        return ApiResponse.success("Cập nhật danh mục thành công", updated);
    }


    // Delete
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.message("Xóa danh mục thành công");
    }
}
