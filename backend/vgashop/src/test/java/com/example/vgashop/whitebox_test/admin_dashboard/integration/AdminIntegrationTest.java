package com.example.vgashop.whitebox_test.admin_dashboard.integration;

import com.example.vgashop.entity.User;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:vgashop_admin_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.show-sql=false"
})
class AdminIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private String adminToken;
    private String userToken;
    private User adminUser;
    private User normalUser;

    @BeforeEach
    void setup() throws Exception {
        userRepository.deleteAll();

        adminUser = userRepository.save(AdminDashboardTestData.createAdminUser("admin_test", "admin@test.com"));
        normalUser = userRepository.save(AdminDashboardTestData.createNormalUser("user_test", "user@test.com"));

        // Get Admin Token
        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(AdminDashboardTestData.loginJson("admin_test", "Password@123")))
                .andReturn();
        adminToken = JsonPath.read(adminResult.getResponse().getContentAsString(), "$.token");

        // Get Normal User Token
        MvcResult userResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(AdminDashboardTestData.loginJson("user_test", "Password@123")))
                .andReturn();
        userToken = JsonPath.read(userResult.getResponse().getContentAsString(), "$.token");
    }

    @Test
    @DisplayName("ADMIN_INT_001 - Role-based testing: Normal User is blocked from Admin API")
    void adminApi_accessedByNormalUser_returnsForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ADMIN_INT_002 - Boundary Value Analysis: Page < 0 returns bad request")
    void getAllUsers_withNegativePage_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/admin/users?page=-1")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("ADMIN_INT_003 - Boundary Value Analysis: Size < 1 returns bad request")
    void getAllProducts_withZeroSize_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/admin/products?size=0")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("ADMIN_INT_004 - Condition testing: Admin cannot delete themselves")
    void deleteUser_whenDeletingSelf_returnsBadRequest() throws Exception {
        mockMvc.perform(delete("/api/admin/users/" + adminUser.getId())
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Không thể xóa tài khoản đang đăng nhập!"));
    }

    @Test
    @DisplayName("ADMIN_INT_005 - Statement coverage: Admin soft deletes normal user")
    void deleteUser_whenDeletingOtherUser_success() throws Exception {
        mockMvc.perform(delete("/api/admin/users/" + normalUser.getId())
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        User deletedUser = userRepository.findById(normalUser.getId()).orElseThrow();
        assertTrue(deletedUser.isDeleted());
    }

    @Test
    @DisplayName("ADMIN_INT_006 - Statement coverage: Admin toggles normal user status")
    void toggleUserStatus_whenOtherUser_success() throws Exception {
        mockMvc.perform(put("/api/admin/users/" + normalUser.getId() + "/status")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        User updatedUser = userRepository.findById(normalUser.getId()).orElseThrow();
        assertFalse(updatedUser.getStatus()); // status was true initially, so it should be false now
    }

    @Test
    @DisplayName("ADMIN_INT_007 - Condition testing: Admin cannot toggle their own status")
    void toggleUserStatus_whenSelf_returnsBadRequest() throws Exception {
        mockMvc.perform(put("/api/admin/users/" + adminUser.getId() + "/status")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Không thể khóa tài khoản đang đăng nhập!"));
    }

    @Test
    @DisplayName("ADMIN_INT_008 - Statement coverage: Change user role")
    void changeUserRole_success() throws Exception {
        mockMvc.perform(get("/api/admin/users/" + normalUser.getId() + "/role?role=ADMIN")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        User updatedUser = userRepository.findById(normalUser.getId()).orElseThrow();
        assertEquals(com.example.vgashop.entity.Role.ADMIN, updatedUser.getRole());
    }
}
