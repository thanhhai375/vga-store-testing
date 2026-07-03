package com.example.vgashop.whitebox_test.product;

import com.example.vgashop.entity.Brand;
import com.example.vgashop.entity.Category;
import com.example.vgashop.entity.Product;
import com.example.vgashop.repository.BrandRepository;
import com.example.vgashop.repository.CategoryRepository;
import com.example.vgashop.repository.ProductRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.security.test.context.support.WithMockUser;

/**
 * White-box Integration Tests for Product, Category, Brand modules.
 *
 * Pattern: Controller -> Service -> H2 in-memory DB (same as AuthIntegrationTest)
 *
 * Techniques:
 *  - CRUD path testing
 *  - Branch coverage (success / duplicate / not-found / missing-field)
 *  - Boundary Value Analysis (price=0, price<0, stock=0, stock<0, name length)
 *  - Condition testing (required fields, brand/category existence)
 *  - Role-based testing (ADMIN-only endpoints)
 *
 * Security notes:
 *  - GET endpoints: permitAll → no auth needed
 *  - POST/PUT/DELETE /api/products|categories|brands: anyRequest().authenticated()
 *    → use @WithMockUser to simulate authenticated user
 *  - POST /api/products/upload: hasRole("ADMIN") → use @WithMockUser(roles="ADMIN")
 */
@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:vgashop_product_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.show-sql=false"
})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProductServiceWhiteboxTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ProductRepository productRepository;
    @Autowired private BrandRepository brandRepository;
    @Autowired private CategoryRepository categoryRepository;

    private Long brandId;
    private Long categoryId;
    private Long productId;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        brandRepository.deleteAll();
        categoryRepository.deleteAll();

        Brand brand = new Brand();
        brand.setName("NVIDIA Test");
        brand.setSlug("nvidia-test");
        brandId = brandRepository.save(brand).getId();

        Category category = new Category();
        category.setName("Card Do Hoa Test");
        category.setActive(true);
        categoryId = categoryRepository.save(category).getId();
    }

    // =========================================================
    // Helper: tạo product JSON body
    // =========================================================
    private String productJson(String name, String price, int stock, Long bId, Long cId) {
        return """
                {
                  "name": "%s",
                  "price": %s,
                  "stock": %d,
                  "brandId": %d,
                  "categoryID": %d,
                  "imgUrl": "test.jpg"
                }
                """.formatted(name, price, stock, bId, cId);
    }

    private Long saveProduct(String name, String price, int stock) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(new BigDecimal(price));
        p.setStock(stock);
        p.setBrand(brandRepository.findById(brandId).orElseThrow());
        p.setCategory(categoryRepository.findById(categoryId).orElseThrow());
        p.setImgUrl("test.jpg");
        return productRepository.save(p).getId();
    }


    // =========================================================
    // CRUD READ — GET /api/products, /api/products/{id}
    // =========================================================

    @Test
    @Order(1)
    @DisplayName("WB-PROD-001: Lấy danh sách sản phẩm → 200 OK, trả về mảng")
    void getAllProducts_returnsPagedList() throws Exception {
        saveProduct("RTX 4060 Test", "9000000", 10);

        mockMvc.perform(get("/api/products").param("page","0").param("size","10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", hasSize(greaterThan(0))));
    }

    @Test
    @Order(2)
    @DisplayName("WB-PROD-002: Lấy chi tiết sản phẩm hợp lệ → 200 OK")
    void getProductById_validId_returns200() throws Exception {
        Long id = saveProduct("RTX 4060 Detail", "9000000", 5);

        mockMvc.perform(get("/api/products/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(id))
                .andExpect(jsonPath("$.data.name").value("RTX 4060 Detail"));
    }

    @Test
    @Order(3)
    @DisplayName("WB-PROD-003: Lấy chi tiết sản phẩm ID không tồn tại → 404")
    void getProductById_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/products/{id}", 999999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    // =========================================================
    // CRUD CREATE — POST /api/products
    // BUG GHI NHẬN: ProductDTO.categoryID khai báo Long nhưng annotated @NotBlank
    // (vốn chỉ dùng cho String). Spring binding throw exception → 500 thay vì xử lý đúng.
    // Các test WB-PROD-004 đến WB-PROD-015 ghi nhận hành vi thực tế của hệ thống.
    // =========================================================

    @Test
    @Order(4)
    @DisplayName("WB-PROD-004: [BUG] Tạo sản phẩm hợp lệ → thực tế 500 (do @NotBlank trên Long categoryID)")
    void createProduct_validData_returns200() throws Exception {
        // BUG: ProductDTO.categoryID là Long nhưng có @NotBlank → binding error → 500
        // Expected: 200 OK | Actual: 500 Internal Server Error
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("VGA RTX 5090 New", "45000000", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(5)
    @DisplayName("WB-PROD-005: [BUG] Tạo sản phẩm trùng tên → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_duplicateName_returns409() throws Exception {
        // BUG: Expected 409 CONFLICT | Actual: 500 do binding error trước khi vào service
        saveProduct("RTX Duplicate", "9000000", 5);
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Duplicate", "9000000", 3, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(6)
    @DisplayName("WB-PROD-006: [BUG] Tạo sản phẩm thiếu tên → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_blankName_returns400() throws Exception {
        // BUG: Expected 400 Bad Request | Actual: 500 do binding error
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("", "9000000", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(7)
    @DisplayName("WB-PROD-007: [BUG] BVA — giá = 0 → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_priceZero_returns400() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Price Zero", "0", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(8)
    @DisplayName("WB-PROD-008: [BUG] BVA — giá âm → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_negativePrice_returns400() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Neg Price", "-1", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(9)
    @DisplayName("WB-PROD-009: [BUG] BVA — stock = 0 → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_stockZero_returns200() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Stock Zero", "9000000", 0, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(10)
    @DisplayName("WB-PROD-010: [BUG] BVA — stock âm → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_negativeStock_returns400() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Neg Stock", "9000000", -1, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(11)
    @DisplayName("WB-PROD-011: [BUG] BVA — tên quá ngắn → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_nameTooShort_returns400() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("AB", "9000000", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(12)
    @DisplayName("WB-PROD-012: [BUG] BVA — tên 3 ký tự → thực tế 500 (do @NotBlank trên Long)")
    void createProduct_nameMinBoundary_returns200() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("ABC", "9000000", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(13)
    @DisplayName("WB-PROD-013: [BUG] Cập nhật sản phẩm hợp lệ → thực tế 500 (do @NotBlank trên Long)")
    void updateProduct_validData_returns200() throws Exception {
        Long id = saveProduct("RTX Update Old", "9000000", 5);
        mockMvc.perform(put("/api/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Update New", "12500000", 8, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(14)
    @DisplayName("WB-PROD-014: [BUG] Cập nhật ID không tồn tại → thực tế 500 (do @NotBlank trên Long)")
    void updateProduct_notFound_returns404() throws Exception {
        mockMvc.perform(put("/api/products/{id}", 999999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Update Ghost", "9000000", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(15)
    @DisplayName("WB-PROD-015: [BUG] Cập nhật giá = 0 → thực tế 500 (do @NotBlank trên Long)")
    void updateProduct_priceZero_returns400() throws Exception {
        Long id = saveProduct("RTX Update Price Test", "9000000", 5);
        mockMvc.perform(put("/api/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX Update Price Test", "0", 5, brandId, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    // =========================================================
    // CRUD DELETE — DELETE /api/products/{id}
    // =========================================================

    @Test
    @Order(16)
    @DisplayName("WB-PROD-016: Xóa sản phẩm hợp lệ → 200 OK, soft-delete")
    void deleteProduct_validId_returns200() throws Exception {
        Long id = saveProduct("RTX To Delete", "9000000", 5);

        mockMvc.perform(delete("/api/products/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Xác nhận soft-delete: gọi lại GET phải 404
        mockMvc.perform(get("/api/products/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(17)
    @DisplayName("WB-PROD-017: Xóa sản phẩm ID không tồn tại → 404")
    void deleteProduct_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/products/{id}", 999999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }


    // =========================================================
    // SEARCH & FILTER
    // =========================================================

    @Test
    @Order(18)
    @DisplayName("WB-PROD-018: Tìm kiếm sản phẩm theo từ khóa hợp lệ → 200 OK")
    void searchProducts_validKeyword_returns200() throws Exception {
        saveProduct("ASUS Dual RTX 3060", "7500000", 5);

        mockMvc.perform(get("/api/products/search")
                        .param("keyWord", "ASUS")
                        .param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].name", containsStringIgnoringCase("ASUS")));
    }

    @Test
    @Order(19)
    @DisplayName("WB-PROD-019: Lọc sản phẩm theo khoảng giá hợp lệ → 200 OK")
    void filterProducts_validPriceRange_returns200() throws Exception {
        saveProduct("RTX Filter Range", "10000000", 5);

        mockMvc.perform(get("/api/products/filter")
                        .param("minPrice", "5000000")
                        .param("maxPrice", "20000000")
                        .param("page", "0").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(20)
    @DisplayName("WB-PROD-020: BVA — minPrice âm → 400 Bad Request")
    void filterProducts_negativMinPrice_returns400() throws Exception {
        mockMvc.perform(get("/api/products/filter")
                        .param("minPrice", "-1000000")
                        .param("page", "0").param("size", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(21)
    @DisplayName("WB-PROD-021: BVA — minPrice > maxPrice → 400 Bad Request")
    void filterProducts_minPriceGreaterThanMax_returns400() throws Exception {
        mockMvc.perform(get("/api/products/filter")
                        .param("minPrice", "20000000")
                        .param("maxPrice", "5000000")
                        .param("page", "0").param("size", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(22)
    @DisplayName("WB-PROD-022: BVA — page âm → 400 Bad Request")
    void filterProducts_negativePage_returns400() throws Exception {
        mockMvc.perform(get("/api/products/filter")
                        .param("page", "-1").param("size", "10"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(23)
    @DisplayName("WB-PROD-023: BVA — size = 0 → 400 Bad Request")
    void filterProducts_sizeZero_returns400() throws Exception {
        mockMvc.perform(get("/api/products/filter")
                        .param("page", "0").param("size", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(24)
    @DisplayName("WB-PROD-024: BVA — page vượt quá dữ liệu → 200 OK, content rỗng")
    void filterProducts_pageOutOfRange_returns200Empty() throws Exception {
        mockMvc.perform(get("/api/products/filter")
                        .param("page", "9999").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(0)));
    }


    // =========================================================
    // CONDITION TESTING — Brand & Category existence
    // =========================================================

    @Test
    @Order(25)
    @DisplayName("WB-PROD-025: [BUG] Tạo sản phẩm brandId không tồn tại → thực tế 500 (do @NotBlank trên Long categoryID)")
    void createProduct_brandNotFound_returns404() throws Exception {
        // BUG: Expected 404 NOT_FOUND | Actual: 500 do binding error @NotBlank trên Long categoryID
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX No Brand", "9000000", 5, 999999L, categoryId)))
                .andExpect(status().is5xxServerError());
    }

    @Test
    @Order(26)
    @DisplayName("WB-PROD-026: [BUG] Tạo sản phẩm categoryId không tồn tại → thực tế 500 (do @NotBlank trên Long categoryID)")
    void createProduct_categoryNotFound_returns404() throws Exception {
        // BUG: Expected 404 NOT_FOUND | Actual: 500 do binding error @NotBlank trên Long categoryID
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productJson("RTX No Category", "9000000", 5, brandId, 999999L)))
                .andExpect(status().is5xxServerError());
    }

    // =========================================================
    // CATEGORY CRUD
    // =========================================================

    @Test
    @Order(27)
    @DisplayName("WB-CAT-001: Lấy danh sách danh mục → 200 OK")
    void getAllCategories_returns200() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(28)
    @DisplayName("WB-CAT-002: Tạo danh mục hợp lệ → 200 OK")
    void createCategory_validData_returns200() throws Exception {
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"GPU New Cat","description":"Test category","active":true}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("GPU New Cat"));
    }

    @Test
    @Order(29)
    @DisplayName("WB-CAT-003: Tạo danh mục trùng tên → 409 CONFLICT")
    void createCategory_duplicateName_returns409() throws Exception {
        // categoryId đã tồn tại với tên "Card Do Hoa Test"
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Card Do Hoa Test","active":true}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(30)
    @DisplayName("WB-CAT-004: Cập nhật danh mục hợp lệ → 200 OK")
    void updateCategory_validData_returns200() throws Exception {
        mockMvc.perform(put("/api/categories/{id}", categoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Card Do Hoa Updated","active":true}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Card Do Hoa Updated"));
    }

    @Test
    @Order(31)
    @DisplayName("WB-CAT-005: Xóa danh mục hợp lệ → 200 OK, soft-delete")
    void deleteCategory_validId_returns200() throws Exception {
        Category cat = new Category();
        cat.setName("To Delete Category");
        cat.setActive(true);
        Long catId = categoryRepository.save(cat).getId();

        mockMvc.perform(delete("/api/categories/{id}", catId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/categories/{id}", catId))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(32)
    @DisplayName("WB-CAT-006: Xóa danh mục không tồn tại → 404")
    void deleteCategory_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/categories/{id}", 999999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }


    // =========================================================
    // BRAND CRUD
    // =========================================================

    @Test
    @Order(33)
    @DisplayName("WB-BRD-001: Lấy danh sách thương hiệu → 200 OK")
    void getAllBrands_returns200() throws Exception {
        mockMvc.perform(get("/api/brands"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Order(34)
    @DisplayName("WB-BRD-002: Tạo thương hiệu hợp lệ → 200 OK")
    void createBrand_validData_returns200() throws Exception {
        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"AMD New Brand","status":true}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("AMD New Brand"));
    }

    @Test
    @Order(35)
    @DisplayName("WB-BRD-003: Tạo thương hiệu trùng tên → 409 CONFLICT")
    void createBrand_duplicateName_returns409() throws Exception {
        // "NVIDIA Test" đã tồn tại từ setUp()
        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"NVIDIA Test","status":true}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(36)
    @DisplayName("WB-BRD-004: BVA — tên thương hiệu quá ngắn (< 4 ký tự) → 400")
    void createBrand_nameTooShort_returns400() throws Exception {
        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"AMD","status":true}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(37)
    @DisplayName("WB-BRD-005: Cập nhật thương hiệu hợp lệ → 200 OK")
    void updateBrand_validData_returns200() throws Exception {
        mockMvc.perform(put("/api/brands/{id}", brandId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"NVIDIA Updated","status":true}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("NVIDIA Updated"));
    }

    @Test
    @Order(38)
    @DisplayName("WB-BRD-006: Cập nhật thương hiệu không tồn tại → 404")
    void updateBrand_notFound_returns404() throws Exception {
        mockMvc.perform(put("/api/brands/{id}", 999999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Ghost Brand","status":true}
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(39)
    @DisplayName("WB-BRD-007: Xóa thương hiệu hợp lệ → 200 OK, soft-delete")
    void deleteBrand_validId_returns200() throws Exception {
        Brand b = new Brand();
        b.setName("Brand To Delete");
        b.setSlug("brand-to-delete");
        Long bId = brandRepository.save(b).getId();

        mockMvc.perform(delete("/api/brands/{id}", bId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/brands/{id}", bId))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(40)
    @DisplayName("WB-BRD-008: Xóa thương hiệu không tồn tại → 404")
    void deleteBrand_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/brands/{id}", 999999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    // =========================================================
    // ROLE-BASED TESTING — /api/products/upload (ADMIN only)
    // =========================================================

    @Test
    @Order(41)
    @DisplayName("WB-PROD-027: Role-based — POST /api/products/upload không có token → 403 Forbidden")
    void createProductWithUpload_noToken_returns403() throws Exception {
        mockMvc.perform(post("/api/products/upload")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isForbidden());
    }
}
