package com.example.vgashop.whitebox_test.admin_dashboard.integration;

import com.example.vgashop.entity.SystemSetting;
import com.example.vgashop.repository.SystemSettingRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:vgashop_setting_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.show-sql=false"
})
class SystemSettingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    private String adminToken;
    private String userToken;

    @BeforeEach
    void setup() throws Exception {
        userRepository.deleteAll();
        systemSettingRepository.deleteAll();

        userRepository.save(AdminDashboardTestData.createAdminUser("admin_set", "admin_set@test.com"));
        userRepository.save(AdminDashboardTestData.createNormalUser("user_set", "user_set@test.com"));

        SystemSetting setting = new SystemSetting();
        setting.setSettingKey("SITE_NAME");
        setting.setSettingValue("VGA Store Test");
        systemSettingRepository.save(setting);

        // Get Admin Token
        MvcResult adminResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(AdminDashboardTestData.loginJson("admin_set", "Password@123")))
                .andReturn();
        adminToken = JsonPath.read(adminResult.getResponse().getContentAsString(), "$.token");

        // Get Normal User Token
        MvcResult userResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(AdminDashboardTestData.loginJson("user_set", "Password@123")))
                .andReturn();
        userToken = JsonPath.read(userResult.getResponse().getContentAsString(), "$.token");
    }

    @Test
    @DisplayName("SETTING_INT_001 - Public settings can be accessed without auth")
    void getPublicSettings_success() throws Exception {
        mockMvc.perform(get("/api/settings/public")
                .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.SITE_NAME").value("VGA Store Test"));
    }

    @Test
    @DisplayName("SETTING_INT_002 - Condition testing: Normal user cannot update settings")
    void updateSettings_byNormalUser_returnsForbidden() throws Exception {
        mockMvc.perform(put("/api/admin/settings")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"SITE_NAME\":\"Hacked Name\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("SETTING_INT_003 - Statement coverage: Admin can update settings")
    void updateSettings_byAdmin_success() throws Exception {
        mockMvc.perform(put("/api/admin/settings")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"SITE_NAME\":\"New Store Name\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cập nhật cấu hình thành công"));

        // Verify it was saved
        mockMvc.perform(get("/api/settings/public")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.SITE_NAME").value("New Store Name"));
    }
}
