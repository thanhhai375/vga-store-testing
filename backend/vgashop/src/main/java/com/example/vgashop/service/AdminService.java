package com.example.vgashop.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.dto.AdminDashboardResponse;
import com.example.vgashop.repository.BrandRepository;
import com.example.vgashop.repository.CategoryRepository;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.repository.BlogRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.example.vgashop.dto.OrderItemResponse;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.dto.ProductAdminResponse;
import com.example.vgashop.dto.UserAdminResponse;
import com.example.vgashop.dto.BlogDTO;
import com.example.vgashop.entity.Category;
import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.entity.Blog;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.Date;
import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.Brand;

@Service
public class AdminService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final PaymentRepository paymentRepository;
    private final BlogRepository blogRepository;

    // Constructor injection
    public AdminService(BrandRepository brandRepository, CategoryRepository categoryRepository,
            OrderRepository orderRepository, PaymentRepository paymentRepository, ProductRepository productRepository,
            UserRepository userRepository, BlogRepository blogRepository) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
    }

    // Dashboard
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        log.info("Admin đang lấy dữ liệu dashboard");

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        // Retrieve all
        List<Order> allOrders = orderRepository.findAll().stream()
                .filter(o -> !o.isDeleted())
                .collect(Collectors.toList());

        long totalOrders = 0;
        long todayOrders = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal todayRevenue = BigDecimal.ZERO;

        for (Order o : allOrders) {
            // Order
            if (o.getStatus() != OrderStatus.CANCELLED && o.getStatus() != OrderStatus.CANCEL_REQUESTED) {
                totalOrders++;
                BigDecimal amt = o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO;
                totalRevenue = totalRevenue.add(amt);

                // Order
                if (o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startOfToday)) {
                    todayOrders++;
                    todayRevenue = todayRevenue.add(amt);
                }
            }
        }

        Long totalUsers = userRepository.countByDeletedFalse();
        Long totalProducts = productRepository.countByDeletedFalse();

        // Error handling
        Long lowStockProducts = 0L;
        try {
            lowStockProducts = productRepository.countLowStock(10);
        } catch (Exception e) {
            log.warn("Lỗi đếm hàng tồn kho: {}", e.getMessage());
        }

        return new AdminDashboardResponse(
                totalUsers != null ? totalUsers : 0L,
                totalOrders,
                todayOrders,
                totalRevenue,
                todayRevenue,
                totalProducts != null ? totalProducts : 0L,
                lowStockProducts,
                LocalDateTime.now());
    }

    // User
    @Transactional(readOnly = true)
    public Page<UserAdminResponse> getAllUsers(int page, int size, String sortBy, String direction, String search, String roleStr) {
        log.info("Admin lấy danh sách user - search: {}, role: {}", search, roleStr);

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Role roleObj = null;
        if (roleStr != null && !roleStr.trim().isEmpty()) {
            try {
                roleObj = Role.valueOf(roleStr.toUpperCase());
            } catch (Exception e) {
                log.warn("Lọc role không tồn tại: {}", roleStr);
            }
        }
        
        String querySearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        Page<User> users = userRepository.searchActiveUsers(querySearch, roleObj, pageable);

        Page<UserAdminResponse> result = users.map(user -> new UserAdminResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.isDeleted(),
                user.getCreatedAt(),
                user.getUpdatedAt()));

        log.info("Trả về {} users cho Admin", result.getTotalElements());
        return result;
    }


    @Transactional
    public UserAdminResponse createUser(com.example.vgashop.dto.UserDTO dto) {
        log.info("Admin tạo user mới: {}", dto.getUsername());

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new com.example.vgashop.exception.DuplicateResourceException("Username đã tồn tại!");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new com.example.vgashop.exception.DuplicateResourceException("Email đã tồn tại!");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(dto.getPassword()));
        
        user.setFullName(dto.getFullName());
        user.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole().toUpperCase()) : Role.USER);
        user.setStatus(true);

        User saved = userRepository.save(user);
        
        return new UserAdminResponse(saved.getId(), saved.getUsername(), saved.getEmail(), 
                                     saved.getFullName(), saved.getPhone(), saved.getRole(), 
                                     saved.getStatus(), saved.isDeleted(), saved.getCreatedAt(), saved.getUpdatedAt());
    }


    @Transactional
    public void changeUserRole(Long userId, String newRole) {
        log.info("Admin thay đổi role userId={} thành {}", userId, newRole);

        User user = userRepository.findByIdAndDeleted(userId, false)
                .orElseThrow(() -> new ResourceNotFoundException("KHông tìm thấy người dùng với ID: " + userId));

        try {
            user.setRole(Role.valueOf(newRole.toUpperCase()));
            userRepository.save(user);
            log.info("Đã thay đổi role userId={} thành {}", userId, newRole);
        } catch (IllegalArgumentException e) {
            log.error("Role không hợp lệ: {}", newRole);
            throw new IllegalArgumentException("Role không hợp lệ. Các Role hợp lệ là: ADMIN, USER, STAFF");
        }
    }

    // Status
    @Transactional
    public void toggleUserStatus(Long userId, String currentAdminUsername) {
        log.info("Admin '{}' toggle status userId={}", currentAdminUsername, userId);

        User user = userRepository.findByIdAndDeleted(userId, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với ID:" + userId));

        // Guard 1: Không thể tự khóa chính mình
        if (user.getUsername().equals(currentAdminUsername)) {
            throw new IllegalStateException("Không thể khóa tài khoản đang đăng nhập!");
        }

        // Guard 2: Không thể khóa tài khoản ADMIN khác
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Không thể khóa tài khoản Quản trị viên!");
        }

        boolean newStatus = !user.getStatus();
        user.setStatus(newStatus);
        userRepository.save(user);

        log.info("Đã thay đổi status userId={} thành {} bởi admin '{}'", userId, newStatus, currentAdminUsername);
    }

    // Delete (soft)
    @Transactional
    public void softDeleteUser(Long userId, String currentAdminUsername) {
        log.info("Admin '{}' xóa mềm userId={}", currentAdminUsername, userId);
        User user = userRepository.findByIdAndDeleted(userId, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với ID:" + userId));

        // Guard 1: Không thể tự xóa chính mình
        if (user.getUsername().equals(currentAdminUsername)) {
            throw new IllegalStateException("Không thể xóa tài khoản đang đăng nhập!");
        }

        // Guard 2: Không thể xóa tài khoản ADMIN khác
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Không thể xóa tài khoản Quản trị viên!");
        }

        user.setDeleted(true);
        userRepository.save(user);
        log.info("Đã xóa mềm (deleted=true) userId={} bởi admin '{}'", userId, currentAdminUsername);
    }


    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getAllOrders(int page, int size, String sortBy, String direction, String status) {
        log.info("Admin lấy danh sách tất cả đơn hàng - page: {}, status: {}", page, status);

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Order> orders;
        if (status != null && !status.isBlank()) {
            try {
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                orders = orderRepository.findByStatusAndDeletedFalse(orderStatus, pageable);
            } catch (IllegalArgumentException e) {
                orders = orderRepository.findByDeletedFalse(pageable);
            }
        } else {
            orders = orderRepository.findByDeletedFalse(pageable);
        }

        Page<OrderSummaryResponse> result = orders.map(this::convertToOrderSummary);
        log.info("Trả về {} đơn hàng cho Admin", result.getTotalElements());
        return result;
    }

    // Update existing
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        log.info("Admin cập nhật trạng thái đơn hàng {} thành {}", orderId, request.getStatus());

        Order order = orderRepository.findByIdAndDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        order.setStatus(request.getStatus());

        switch (request.getStatus()) {
            case CONFIRMED -> order.setConfirmedAt(LocalDateTime.now());
            case SHIPPING -> order.setShippedAt(LocalDateTime.now());
            case DELIVERED -> order.setDeliveredAt(LocalDateTime.now());
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Đã cập nhật trạng thái đơn hàng {} thành {}", orderId, request.getStatus());

        return convertToOrderResponse(savedOrder);
    }


    @Transactional(readOnly = true)
    public Page<ProductAdminResponse> getAllProductForAdmin(int page, int size, String search) {
        log.info("Admin lấy danh sách sản phẩm - page: {}, search: {}", page, search);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.DESC, "id")));
        
        Page<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.searchAdminProducts(search.trim(), pageable);
        } else {
            products = productRepository.findByDeletedFalse(pageable);
        }

        Page<ProductAdminResponse> result = products.map(p -> new ProductAdminResponse(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getStock(),
                p.getBrand() != null ? p.getBrand().getName() : "N/A",
                p.getCategory() != null ? p.getCategory().getName() : "N/A",
                p.getStatus(),
                p.getImgUrl() != null ? p.getImgUrl() : ""));

        log.info("Trả về {} sản phẩm cho Admin", result.getTotalElements());
        return result;
    }

    // Update existing
    @Transactional
    public void updateProductStock(Long productId, Integer stock) {
        log.info("Admin cập nhật stock sản phẩm {} thành {}", productId, stock);

        Product products = productRepository.findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        if (stock < 0) {
            log.warn("Stock âm không hợp lệ: {}", stock);
            throw new IllegalArgumentException("Stock không được âm");
        }

        products.setStock(stock);
        productRepository.save(products);

        log.info("Đã cập nhật stock sản phẩm {} thành {}", productId, stock);
    }


    @Transactional(readOnly = true)
    public Page<Category> getAllCategoriesForAdmin(int page, int size) {
        log.info("Admin lấy danh sách category - page: {}", page);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.ASC, "id")));
        return categoryRepository.findByDeletedFalse(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Brand> getAllBrandsForAdmin(int page, int size) {
        log.info("Admin lấy danh sách brand - page: {}", page);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.ASC, "id")));
        return brandRepository.findByDeletedFalse(pageable);
    }

    // CONVERT METHODS
    private OrderSummaryResponse convertToOrderSummary(Order order) {
        int totalItems = order.getItems().stream()
                .filter(item -> !item.isDeleted())
                .mapToInt(OrderItem::getQuantity)
                .sum();



        return new OrderSummaryResponse(
                order.getId(),
                order.getOrderCode(),
                order.getFullName(),
                order.getPhone(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getCreatedAt(),
                totalItems);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .filter(item -> !item.isDeleted())
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImgUrl(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getSubtotal()))
                .collect(Collectors.toList());

        String paymentMethodStr = "Chưa rõ";
        try {
            com.example.vgashop.entity.Payment payment = paymentRepository.findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(order.getId()).orElse(null);
            if (payment != null && payment.getPaymentMethod() != null) {
                paymentMethodStr = payment.getPaymentMethod().name();
            }
        } catch (Exception e) {
            log.warn("Không lấy được paymentMethod cho order {}: {}", order.getId(), e.getMessage());
        }

        return new OrderResponse(
                order.getId(),
                order.getOrderCode(),
                order.getTotalAmount(),
                order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO,
                order.getStatus(),
                order.getPaymentStatus(),
                order.getShippingAddress(),
                order.getPhone(),
                order.getNote() != null ? order.getNote() : "",
                order.getCreatedAt(),
                order.getConfirmedAt(),
                order.getShippedAt(),
                order.getDeliveredAt(),
                itemResponses,
                order.getFullName() != null && !order.getFullName().trim().isEmpty() ? order.getFullName() : (order.getUser() != null ? order.getUser().getUsername() : "Khách ẩn danh"),
                order.getUser() != null ? order.getUser().getEmail() : "Không có",
                paymentMethodStr
        );
    }

    // Delete
    @Transactional
    public void softDeleteProduct(Long productId) {
        log.info("Admin soft delete sản phẩm ID: {}", productId);

        Product product = productRepository.findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        product.setDeleted(true);
        productRepository.save(product);

        log.info("Đã soft delete sản phẩm ID: {}", productId);
    }


    @Transactional
    public Category addCategories(Category category) {
        log.info("Admin thêm category mới: {}", category.getName());

        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category categoryReq) {
        log.info("Admin cập nhật category ID: {}", id);
        Category category = categoryRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));
        
        category.setName(categoryReq.getName());
        category.setDescription(categoryReq.getDescription());
        category.setActive(categoryReq.getActive());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        log.info("Admin xóa category ID: {}", id);
        Category category = categoryRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));
                category.setDeleted(true);
        categoryRepository.save(category);
    }


    @Transactional
    public Brand addBrand(Brand brand) {
        log.info("Admin thêm brand mới: {}", brand.getName());

        if (brandRepository.existsByNameIgnoreCase(brand.getName())) {
            throw new IllegalArgumentException("Tên thương hiệu đã tồn tại");
        }

        return brandRepository.save(brand);
    }

    @Transactional
    public Brand updateBrand(Long id, Brand brandReq) {
        log.info("Admin cập nhật brand ID: {}", id);
        Brand brand = brandRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));
        
        brand.setName(brandReq.getName());
        brand.setDescription(brandReq.getDescription());
        brand.setStatus(brandReq.getStatus());
        return brandRepository.save(brand);
    }

    @Transactional
    public void deleteBrand(Long id) {
        log.info("Admin xóa brand ID: {}", id);
        Brand brand = brandRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));
                brand.setDeleted(true);
        brandRepository.save(brand);
    }


    @Transactional
    public Blog createBlog(BlogDTO dto, MultipartFile image) {
        log.info("Admin thêm blog mới: {}", dto.getTitle());
        Blog blog = new Blog();
        blog.setTitle(dto.getTitle());
        blog.setCategory(dto.getCategory());
        blog.setExcerpt(dto.getExcerpt());
        blog.setAuthor(dto.getAuthor() != null ? dto.getAuthor() : "Admin");
        blog.setContent(dto.getContent());
        blog.setPublishedDate(new Date());
        blog.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        blog.setTags(dto.getTags());
        
        if (image != null && !image.isEmpty()) {
            blog.setThumbnail(uploadBlogImage(image));
        } else {
            blog.setThumbnail("");
        }

        return blogRepository.save(blog);
    }

    @Transactional
    public Blog updateBlog(Long id, BlogDTO dto, MultipartFile image) {
        log.info("Admin cập nhật blog ID: {}", id);
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));
        
        blog.setTitle(dto.getTitle());
        blog.setCategory(dto.getCategory());
        // Null-safe: keep existing value if DTO sends null
        if (dto.getExcerpt() != null) blog.setExcerpt(dto.getExcerpt());
        if (dto.getAuthor() != null && !dto.getAuthor().isBlank()) blog.setAuthor(dto.getAuthor());
        if (dto.getContent() != null) blog.setContent(dto.getContent());
        // Fix: old DB records may have NULL views — default to 0
        if (blog.getViews() == null) blog.setViews(0);
        if (dto.getFeatured() != null) blog.setFeatured(dto.getFeatured());
        if (dto.getTags() != null) blog.setTags(dto.getTags());

        if (image != null && !image.isEmpty()) {
            blog.setThumbnail(uploadBlogImage(image));
        }

        return blogRepository.save(blog);
    }

    @Transactional
    public void deleteBlog(Long id) {
        log.info("Admin xóa blog ID: {}", id);
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));


        blog.setDeleted(true);
        blogRepository.save(blog);
    }

    private String uploadBlogImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get("uploads", "blogs").toAbsolutePath();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFileName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile()); // absolute path — no temp dir issues
            return "/uploads/blogs/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Không thể upload ảnh Blog: " + e.getMessage(), e);
        }
    }

    // Order
    @Transactional(readOnly = true)
    public OrderResponse getOrderDetailsForAdmin(Long orderId) {
        Order order = orderRepository.findByIdAndDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));
        return convertToOrderResponse(order);
    }

    // Total
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getDashboardCharts(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate;

        java.util.Map<String, java.util.Map<String, Object>> timeStats = new java.util.LinkedHashMap<>();
        java.time.format.DateTimeFormatter dayFormatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM");


        if ("today".equals(period)) {
            startDate = now.toLocalDate().atStartOfDay();
            for (int i = 0; i <= 23; i++) {
                String label = String.format("%02d:00", i); // 00:00, 01:00... 23:00
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else if ("7days".equals(period)) {
            startDate = now.minusDays(6).toLocalDate().atStartOfDay();
            for (int i = 6; i >= 0; i--) {
                String label = now.minusDays(i).format(dayFormatter);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else if ("1month".equals(period)) {
            startDate = now.minusDays(29).toLocalDate().atStartOfDay();
            for (int i = 29; i >= 0; i--) {
                String label = now.minusDays(i).format(dayFormatter);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else if ("1year".equals(period)) {
            startDate = now.minusMonths(11).withDayOfMonth(1).toLocalDate().atStartOfDay();
            for (int i = 11; i >= 0; i--) {
                LocalDateTime m = now.minusMonths(i);
                String label = "T" + m.getMonthValue() + "/" + (m.getYear() % 100);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else { // Default
            startDate = now.minusMonths(5).withDayOfMonth(1).toLocalDate().atStartOfDay();
            for (int i = 5; i >= 0; i--) {
                LocalDateTime m = now.minusMonths(i);
                String label = "T" + m.getMonthValue() + "/" + (m.getYear() % 100);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        }

        // Order
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> !o.isDeleted() && o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startDate))
                .collect(Collectors.toList());

        java.util.Map<String, Integer> brandSales = new java.util.HashMap<>();

        for (Order order : orders) {
            String label;
            if ("today".equals(period)) {
                label = String.format("%02d:00", order.getCreatedAt().getHour());
            } else if ("7days".equals(period) || "1month".equals(period)) {
                label = order.getCreatedAt().format(dayFormatter);
            } else {
                label = "T" + order.getCreatedAt().getMonthValue() + "/" + (order.getCreatedAt().getYear() % 100);
            }

            if (timeStats.containsKey(label)) {
                java.util.Map<String, Object> data = timeStats.get(label);

                if (order.getStatus() == OrderStatus.DELIVERED || order.getPaymentStatus() == PaymentStatus.SUCCESS) {
                    BigDecimal currentRev = (BigDecimal) data.get("revenue");
                    data.put("revenue",
                            currentRev.add(order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO));
                }
                // Status
                if (order.getStatus() == OrderStatus.DELIVERED) {
                    data.put("delivered", (Integer) data.get("delivered") + 1);
                } else if (order.getStatus() == OrderStatus.CANCELLED) {
                    data.put("cancelled", (Integer) data.get("cancelled") + 1);
                }
            }


            if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCEL_REQUESTED) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        if (!item.isDeleted() && item.getProduct() != null && item.getProduct().getBrand() != null) {
                            String brandName = item.getProduct().getBrand().getName();
                            brandSales.put(brandName, brandSales.getOrDefault(brandName, 0) + item.getQuantity());
                        }
                    }
                }
            }
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("chartData", new java.util.ArrayList<>(timeStats.values()));

        List<java.util.Map<String, Object>> brandDataList = brandSales.entrySet().stream()
                .map(e -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("name", e.getKey());
                    map.put("sold", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        response.put("brandData", brandDataList);
        return response;
    }


    @org.springframework.transaction.annotation.Transactional
    public void pinToTop(String entityType, Long id) {
        int newPriority = (int) -(System.currentTimeMillis() / 1000);
        switch (entityType.toLowerCase()) {
            case "product":
                Product product = productRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
                product.setDisplayOrder(newPriority);
                productRepository.save(product);
                break;
            case "blog":
                Blog blog = blogRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));
                blog.setDisplayOrder(newPriority);
                blogRepository.save(blog);
                break;
            case "category":
                Category category = categoryRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));
                category.setDisplayOrder(newPriority);
                categoryRepository.save(category);
                break;
            case "brand":
                Brand brand = brandRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));
                brand.setDisplayOrder(newPriority);
                brandRepository.save(brand);
                break;
            default:
                throw new IllegalArgumentException("Loại thực thể không hợp lệ");
        }
    }
}
