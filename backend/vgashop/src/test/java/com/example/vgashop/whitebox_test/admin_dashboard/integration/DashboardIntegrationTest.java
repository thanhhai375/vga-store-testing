package com.example.vgashop.whitebox_test.admin_dashboard.integration;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.User;
import com.example.vgashop.entity.Brand;
import com.example.vgashop.entity.Category;
import com.example.vgashop.repository.BrandRepository;
import com.example.vgashop.repository.CategoryRepository;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.whitebox_test.admin_dashboard.data.AdminDashboardTestData;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:vgashop_dashboard_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.show-sql=false"
})
class DashboardIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private String adminToken;

    @BeforeEach
    void setup() throws Exception {
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Setup Admin user
        User adminUser = userRepository.save(AdminDashboardTestData.createAdminUser("admin_dash", "admin_dash@test.com"));

        // 2. Setup Normal users (2 normal + 1 admin = 3 users)
        userRepository.save(AdminDashboardTestData.createNormalUser("user1", "user1@test.com"));
        userRepository.save(AdminDashboardTestData.createNormalUser("user2", "user2@test.com"));

        Brand brand = new Brand();
        brand.setName("Test Brand");
        brand.setDeleted(false);
        brandRepository.save(brand);

        Category cat = new Category();
        cat.setName("Test Category");
        cat.setDeleted(false);
        categoryRepository.save(cat);

        // 3. Setup Products
        Product p1 = new Product();
        p1.setName("Product 1");
        p1.setPrice(new BigDecimal("100000"));
        p1.setStock(5); // Low stock (<= 10)
        p1.setBrand(brand);
        p1.setCategory(cat);
        p1.setDeleted(false);
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Product 2");
        p2.setPrice(new BigDecimal("200000"));
        p2.setStock(20); // Normal stock
        p2.setBrand(brand);
        p2.setCategory(cat);
        p2.setDeleted(false);
        productRepository.save(p2);

        // 4. Setup Orders
        Order o1 = new Order();
        o1.setUser(adminUser);
        o1.setOrderCode("ORD001");
        o1.setShippingAddress("Test Address 1");
        o1.setFullName("Test User 1");
        o1.setPhone("0123456789");
        o1.setStatus(OrderStatus.DELIVERED);
        o1.setTotalAmount(new BigDecimal("150000"));
        o1.setCreatedAt(LocalDateTime.now());
        o1.setDeleted(false);
        orderRepository.save(o1);

        Order o2 = new Order();
        o2.setUser(adminUser);
        o2.setOrderCode("ORD002");
        o2.setShippingAddress("Test Address 2");
        o2.setFullName("Test User 2");
        o2.setPhone("0987654321");
        o2.setStatus(OrderStatus.CANCELLED); // Should not be counted in revenue
        o2.setTotalAmount(new BigDecimal("300000"));
        o2.setCreatedAt(LocalDateTime.now().minusDays(1));
        o2.setDeleted(false);
        orderRepository.save(o2);

        // Login to get token
        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(AdminDashboardTestData.loginJson("admin_dash", "Password@123")))
                .andReturn();
        adminToken = JsonPath.read(adminResult.getResponse().getContentAsString(), "$.token");
    }

    @Test
    @DisplayName("DASH_INT_001 - Data aggregation testing: Dashboard returns correct statistics")
    void getDashboard_returnsCorrectAggregatedData() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalUsers").value(3)) // 1 admin + 2 users
                .andExpect(jsonPath("$.data.totalProducts").value(2))
                .andExpect(jsonPath("$.data.lowStockProducts").value(1))
                .andExpect(jsonPath("$.data.totalOrders").value(1)) // 1 DELIVERED, 1 CANCELLED (not counted)
                .andExpect(jsonPath("$.data.totalRevenue").value(150000.0));
    }
}
