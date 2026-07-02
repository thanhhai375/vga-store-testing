package com.example.vgashop.controler;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.example.vgashop.dto.AdminDashboardResponse;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.dto.ProductAdminResponse;
import com.example.vgashop.dto.ProductImageDTO;
import com.example.vgashop.dto.UserAdminResponse;
import com.example.vgashop.dto.BlogDTO;
import com.example.vgashop.entity.Brand;
import com.example.vgashop.entity.Category;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.Review;
import com.example.vgashop.entity.Blog;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;
import com.example.vgashop.dto.ProductImageDTO;
import com.example.vgashop.dto.UserAdminResponse;
import com.example.vgashop.entity.Brand;
import com.example.vgashop.entity.Category;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.Review;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.repository.ReviewRepository;
import com.example.vgashop.service.AdminService;
import com.example.vgashop.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final ReviewRepository reviewRepository;

    public AdminController(AdminService adminService, ProductService productService,
            ReviewRepository reviewRepository) {
        this.adminService = adminService;
        this.productService = productService;
        this.reviewRepository = reviewRepository;
    }

    // Dashboard
    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse dashboard = adminService.getDashboard();
        return ApiResponse.success("Lấy dashboard thành công", dashboard);
    }

    // Dashboard
    @GetMapping("/dashboard/stats")
    public ApiResponse<AdminDashboardResponse> getDashboardStats() {
        AdminDashboardResponse dashboard = adminService.getDashboard();
        return ApiResponse.success("Lấy thống kê dashboard thành công", dashboard);
    }

    // Retrieve all
    @GetMapping("/users")
    public ApiResponse<Page<UserAdminResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        Page<UserAdminResponse> users = adminService.getAllUsers(page, size, sortBy, direction, search, role);
        return ApiResponse.success("Lấy danh sách người dùng thành công", users);
    }

    @PostMapping("/users")
    public ApiResponse<UserAdminResponse> createUser(@Valid @RequestBody com.example.vgashop.dto.UserDTO dto) {
        UserAdminResponse createdUser = adminService.createUser(dto);
        return ApiResponse.success("Tạo cấu hình người dùng thành công", createdUser);
    }


    @GetMapping("/users/{userId}/role")
    public ApiResponse<String> changeUserRole(@PathVariable Long userId, @RequestParam String role) {
        adminService.changeUserRole(userId, role);
        return ApiResponse.success("Cập nhật quyền người dùng thành công", "OK");
    }

    @PutMapping("/users/{userId}/status")
    public ApiResponse<String> toggleUserStatus(@PathVariable Long userId, Principal principal) {
        adminService.toggleUserStatus(userId, principal.getName());
        return ApiResponse.success("Cập nhật trạng thái người dùng thành công", "OK");
    }

    @DeleteMapping("/users/{userId}")
    public ApiResponse<String> deleteUser(@PathVariable Long userId, Principal principal) {
        adminService.softDeleteUser(userId, principal.getName());
        return ApiResponse.success("Đã xóa người dùng thành công", "OK");
    }

    // Retrieve all
    @GetMapping("/orders")
    public ApiResponse<Page<OrderSummaryResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String status) {
        Page<OrderSummaryResponse> orders = adminService.getAllOrders(page, size, sortBy, direction, status);
        return ApiResponse.success("Lấy tất cả đơn hàng thành công", orders);
    }

    // Update existing
    @PutMapping("/orders/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse order = adminService.updateOrderStatus(orderId, request);
        return ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", order);
    }


    // Retrieve all

    @GetMapping("/products")
    public ApiResponse<Page<ProductAdminResponse>> getAllProductsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search) {
        validateAdminProductPage(page, size);
        Page<ProductAdminResponse> products = adminService.getAllProductForAdmin(page, size, search);
        return ApiResponse.success("Lấy danh sách sản phẩm thành công", products);
    }

    // Update existing
    @PutMapping("/products/{productId}/stock")
    public ApiResponse<String> updateProductStock(@PathVariable Long productId, @RequestParam Integer stock) {
        adminService.updateProductStock(productId, stock);
        return ApiResponse.success("Cập nhật số lượng tồn kho thành công", "OK");
    }

    // Product
    @DeleteMapping("/products/{productId}")
    public ApiResponse<String> softDeleteProduct(@PathVariable Long productId) {
        adminService.softDeleteProduct(productId);
        return ApiResponse.success("Đã xóa mềm sản phẩm thành công", "OK");
    }

    // Product
    @GetMapping("/products/{productId}")
    public ApiResponse<Product> getProductById(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        return ApiResponse.success("Lấy sản phẩm thành công", product);
    }

    // Product
    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Product> createProduct(@Valid @ModelAttribute ProductImageDTO dto) {
        validateProductImageDto(dto);
        Product saved = productService.createProductWithImage(dto);
        return ApiResponse.success("Tạo sản phẩm thành công", saved);
    }

    // Product
    @PutMapping(value = "/products/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Product> updateProduct(@PathVariable Long productId, @ModelAttribute ProductImageDTO dto) {
        validateProductImageDto(dto);
        Product updated = productService.updateProductWithImage(productId, dto);
        return ApiResponse.success("Cập nhật sản phẩm thành công", updated);
    }
    private void validateAdminProductPage(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page khong duoc am");
        }
        if (size < 1) {
            throw new IllegalArgumentException("Size phai lon hon hoac bang 1");
        }
    }

    private void validateProductImageDto(ProductImageDTO dto) {
        if (dto.getPrice() == null || dto.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Gia san pham phai lon hon 0");
        }
    }


    @GetMapping("/categories")
    public ApiResponse<Page<Category>> getAllCategoriesForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<Category> categorys = adminService.getAllCategoriesForAdmin(page, size);
        return ApiResponse.success("Lấy danh sách danh mục thành công", categorys);
    }


    @PostMapping("/categories")
    public ApiResponse<Category> addCategory(@Valid @RequestBody Category category) {
        Category savedCategory = adminService.addCategories(category);
        return ApiResponse.success("Thêm danh mục thành công", savedCategory);
    }

    @PutMapping("/categories/{categoryId}")
    public ApiResponse<Category> updateCategory(@PathVariable Long categoryId, @Valid @RequestBody Category category) {
        Category updatedCategory = adminService.updateCategory(categoryId, category);
        return ApiResponse.success("Cập nhật danh mục thành công", updatedCategory);
    }

    @DeleteMapping("/categories/{categoryId}")
    public ApiResponse<String> deleteCategory(@PathVariable Long categoryId) {
        adminService.deleteCategory(categoryId);
        return ApiResponse.success("Đã xóa danh mục thành công", "OK");
    }


    @GetMapping("/brands")
    public ApiResponse<Page<Brand>> getAllBrandsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<Brand> brands = adminService.getAllBrandsForAdmin(page, size);
        return ApiResponse.success("Lấy danh sách thương hiệu thành công", brands);
    }


    @PostMapping("/brands")
    public ApiResponse<Brand> addBrand(@Valid @RequestBody Brand brand) {
        Brand savedBrand = adminService.addBrand(brand);
        return ApiResponse.success("Thêm thương hiệu thành công", savedBrand);
    }

    @PutMapping("/brands/{brandId}")
    public ApiResponse<Brand> updateBrand(@PathVariable Long brandId, @Valid @RequestBody Brand brand) {
        Brand updatedBrand = adminService.updateBrand(brandId, brand);
        return ApiResponse.success("Cập nhật thương hiệu thành công", updatedBrand);
    }

    @DeleteMapping("/brands/{brandId}")
    public ApiResponse<String> deleteBrand(@PathVariable Long brandId) {
        adminService.deleteBrand(brandId);
        return ApiResponse.success("Đã xóa thương hiệu thành công", "OK");
    }


    @PostMapping(value = "/blogs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Blog> createBlog(@RequestPart("blog") @Valid BlogDTO dto, @RequestPart(value = "image", required = false) MultipartFile image) {
        Blog createdBlog = adminService.createBlog(dto, image);
        return ApiResponse.success("Tạo bài viết thành công", createdBlog);
    }

    @PutMapping(value = "/blogs/{blogId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Blog> updateBlog(@PathVariable Long blogId, @RequestPart("blog") @Valid BlogDTO dto, @RequestPart(value = "image", required = false) MultipartFile image) {
        Blog updatedBlog = adminService.updateBlog(blogId, dto, image);
        return ApiResponse.success("Cập nhật bài viết thành công", updatedBlog);
    }

    @DeleteMapping("/blogs/{blogId}")
    public ApiResponse<String> deleteBlog(@PathVariable Long blogId) {
        adminService.deleteBlog(blogId);
        return ApiResponse.success("Đã xóa bài viết thành công", "OK");
    }

    // Review
    @GetMapping("/reviews")
    public ApiResponse<List<Map<String, Object>>> getAllReviews() {
        List<Review> all = reviewRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<Map<String, Object>> dtos = all.stream().map(r -> {
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("id", r.getId());
            dto.put("rating", r.getRating());
            dto.put("comment", r.getComment());
            dto.put("createdAt", r.getCreatedAt());
            String name = r.getGuestName();
            if (r.getUser() != null) {
                String fn = r.getUser().getFullName();
                String un = r.getUser().getUsername();
                name = (fn != null && !fn.isBlank()) ? fn : un;
            }
            dto.put("guestName", name != null ? name : "Khách ẩn danh");
            if (r.getUser() != null) {
                Map<String, Object> u = new LinkedHashMap<>();
                u.put("id", r.getUser().getId());
                u.put("username", r.getUser().getUsername());
                dto.put("user", u);
            } else { dto.put("user", null); }
            if (r.getProduct() != null) {
                Map<String, Object> p = new LinkedHashMap<>();
                p.put("id", r.getProduct().getId());
                p.put("name", r.getProduct().getName());
                dto.put("product", p);
            }
            return dto;
        }).collect(Collectors.toList());
        return ApiResponse.success("Lấy danh sách đánh giá thành công", dtos);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ApiResponse<String> deleteReview(@PathVariable Long reviewId) {
        reviewRepository.deleteById(reviewId);
        return ApiResponse.success("Xóa đánh giá thành công", "OK");
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOrderDetailsForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getOrderDetailsForAdmin(id));
    }


    @GetMapping("/dashboard/charts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardCharts(
            @RequestParam(required = false, defaultValue = "6months")
            String period,

            @RequestParam(required = false)
            @org.springframework.format.annotation.DateTimeFormat(
                    iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
            java.time.LocalDate startDate,

            @RequestParam(required = false)
            @org.springframework.format.annotation.DateTimeFormat(
                    iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
            java.time.LocalDate endDate) {

     if (startDate != null
            && endDate != null
            && startDate.isAfter(endDate)) {

         return ResponseEntity.badRequest().body(
                java.util.Map.of(
                        "message",
                        "startDate must not be after endDate"
                )
        );
    }

     return ResponseEntity.ok(
            adminService.getDashboardCharts(period)
    );
}


    @PutMapping("/pin-top/{entityType}/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> pinToTop(@PathVariable String entityType, @PathVariable Long id) {
        adminService.pinToTop(entityType, id);
        return ApiResponse.success("Đã đẩy mục này lên đầu thành công", "OK");
    }
}
