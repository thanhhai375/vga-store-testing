package com.example.vgashop.controler;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.dto.ProductDTO;
import com.example.vgashop.dto.ProductImageDTO;
import com.example.vgashop.entity.Brand;
import com.example.vgashop.entity.Category;
import com.example.vgashop.entity.Product;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.BrandService;
import com.example.vgashop.service.CategoryService;
import com.example.vgashop.service.ProductService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;


@RestController
@RequestMapping("api/products")
@CrossOrigin
public class ProductController {
    private final ProductService productService;
    private final BrandService brandService;
    private final CategoryService categoryService;

    public ProductController(ProductService productService, BrandService brandService, CategoryService categoryService) {
        this.productService = productService;
        this.brandService = brandService;
        this.categoryService = categoryService;
    }

    // get all + pagination
    @GetMapping
    public ApiResponse<Page<Product>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue= "id") String sortBy,
        @RequestParam(defaultValue= "asc") String direction
    ) {
        // return productService.getAllProducts(PageRequest.of(page, size));

        Page<Product> data = productService.getAllProducts(page, size, sortBy, direction);
        return ApiResponse.success("Lấy danh sách sản phẩm thành công", data);
    }

    // Search
    @GetMapping("/search")
    public ApiResponse<Page<Product>> search(
        @RequestParam String keyWord,
        @RequestParam(defaultValue= "0") int page,
        @RequestParam(defaultValue= "10") int size
    ) {
        Page<Product> data = productService.searchProducts(keyWord, PageRequest.of(page, size));
        return ApiResponse.success("Tìm kiếm sản phẩm thành công", data);
    }


    public Page<Product> filterBrand(@RequestParam String brand) {
        return productService.filterByBrand(brand);
    }

    // Search
    // Search
    @GetMapping("/filter")
    public ApiResponse<Page<Product>> filter(
        @RequestParam(required = false) String keyWord,
            @RequestParam(required = false) List<Long> brandIds,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        // Validation for pagination
        if (page < 0) {
            throw new IllegalArgumentException("Số trang phải lớn hơn hoặc bằng 0");
        }
        if (size < 1) {
            throw new IllegalArgumentException("Số lượng hiển thị phải lớn hơn hoặc bằng 1");
        }

        // Validation for price parameters
        if (minPrice != null && minPrice < 0) {
            throw new IllegalArgumentException("Giá không được nhỏ hơn 0");
        }
        if (maxPrice != null && maxPrice < 0) {
            throw new IllegalArgumentException("Giá không được nhỏ hơn 0");
        }

        // Check for overflow (values too large)
        if (minPrice != null && minPrice > Double.MAX_VALUE) {
            throw new IllegalArgumentException("Giá trị vượt quá giới hạn cho phép (Overflow)");
        }
        if (maxPrice != null && maxPrice > Double.MAX_VALUE) {
            throw new IllegalArgumentException("Giá trị vượt quá giới hạn cho phép (Overflow)");
        }

        Page<Product> data = productService.filterProducts(keyWord, brandIds, minPrice, maxPrice,
                page, size, sortBy, direction);

        return ApiResponse.success("Lọc sản phẩm thành công", data);
    }


    // @GetMapping("/filter")
    // public Page<Product> filter(

    //     @RequestParam(required= false)
    //     String keyWord,

    //     @RequestParam(required= false)
    //     List<Long> brandIds,

    //     @RequestParam(required= false)
    //     Double minPrice,

    //     @RequestParam(required= false)
    //     Double maxPrice,

    //     @RequestParam(defaultValue = "0")
    //     int page,
    //     @RequestParam(defaultValue = "10")
    //     int size,
    //     @RequestParam(defaultValue= "id")
    //     String sortBy,
    //     @RequestParam(defaultValue= "asc")
    //     String direction

    // ) {
    //     return productService.filterProducts(keyWord, brandIds, minPrice, maxPrice, page, size, sortBy, direction);
    // }

    // By ID
    @GetMapping("/{id}")
   public ApiResponse<Product> getById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ApiResponse.success("Lấy sản phẩm thành công", product);
    }


    // @PostMapping
    // public Product create(@RequestBody Product product) {
    //     return productService.creatProduct(product);
    // }
    @PostMapping
    public ApiResponse<Product> create(@Valid @RequestBody ProductDTO dto) {
        Product product = convertDtoToEntity(dto);
        Product saved = productService.creatProduct(product);

        return ApiResponse.success("Tạo sản phẩm thành công", saved);
    }

    // Update existing
    // @PutMapping("/{id}")
    // public Product update(@PathVariable Long id, @RequestBody Product product) {
    //     return productService.updateProduct(id, product);
    // }

    @PutMapping("/{id}")
    public ApiResponse<Product> update(@PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
        Product product = convertDtoToEntity(dto);
        Product updated = productService.updateProduct(id, product);

        return ApiResponse.success("Cập nhật sản phẩm thành công", updated);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.message("Xóa sản phẩm thành công");
    }

    // Product
    @PostMapping("/upload") 
    @PreAuthorize("hasRole('ADMIN')") // Chỉ admin mới được phép tạo sản phẩm kèm ảnh
    public ApiResponse<Product> createWithImage(@Valid @ModelAttribute ProductImageDTO dto) {
        System.out.println("User authorities: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        Product saved = productService.createProductWithImage(dto);
        return ApiResponse.success("Tạo sản phẩm kèm ảnh thành công", saved);
    }


    private Product convertDtoToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setOldPrice(dto.getOldPrice());
        product.setDescription(dto.getDescription());
        product.setStock(dto.getStock());
        product.setImgUrl(dto.getImgUrl());
        product.setSku(dto.getSku());

       // map id -> object
       if (dto.getBrandId() != null) {
        Brand brand = brandService.getBrandId(dto.getBrandId());
        product.setBrand(brand);
       }

       if (dto.getCategoryID() != null) {
        Category category = categoryService.getCategoryById(dto.getCategoryID());
        product.setCategory(category);
       }
        return product;
    }
}
