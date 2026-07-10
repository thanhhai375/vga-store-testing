package com.example.vgashop.whitebox_test.user_profile.integration;

import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.ArrayList;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:vgashop_user_profile_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.show-sql=false",
        "jwt.secret=0123456789abcdef0123456789abcdef",
        "app.cors.allowed-origins=http://localhost:5173,http://localhost:5174"
})
class UserProfileIntegrationTest {

    private static final String USERNAME = "profile_user";
    private static final String EMAIL = "profile_user@example.com";
    private static final String RAW_PASSWORD = "Password@123";

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String token;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User user = new User();
        user.setUsername(USERNAME);
        user.setEmail(EMAIL);
        user.setPassword(passwordEncoder.encode(RAW_PASSWORD));
        user.setFullName("Profile Test User");
        user.setRole(Role.USER);
        user.setStatus(true);
        user.setDeleted(false);
        user.setPhone("0900000000");
        user.setGender("Nam");
        user.setDob(LocalDate.of(2000, 1, 1));
        user.setAddresses(new ArrayList<>());
        userRepository.save(user);

        token = jwtUtil.generateToken(USERNAME, Role.USER);
    }

    @Test
    @DisplayName("USER_PROFILE_WB_001 - Get profile returns current authenticated user")
    void getProfile_withValidToken_returnsCurrentUserProfile() throws Exception {
        mockMvc.perform(get("/api/users/profile")
                        .header("Authorization", bearerToken())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Success"))
                .andExpect(jsonPath("$.data.username").value(USERNAME))
                .andExpect(jsonPath("$.data.email").value(EMAIL))
                .andExpect(jsonPath("$.data.role").value("USER"))
                .andExpect(jsonPath("$.data.phone").value("0900000000"));
    }

    @Test
    @DisplayName("USER_PROFILE_WB_002 - Update profile saves phone gender and date of birth")
    void updateProfile_withValidRequest_persistsProfileFields() throws Exception {
        mockMvc.perform(put("/api/users/profile")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "profile_user_updated",
                                  "phone": "0912345678",
                                  "gender": "Nu",
                                  "dob": "2001-06-18"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Cập nhật hồ sơ thành công"))
                .andExpect(jsonPath("$.data.username").value("profile_user_updated"))
                .andExpect(jsonPath("$.data.phone").value("0912345678"))
                .andExpect(jsonPath("$.data.gender").value("Nu"))
                .andExpect(jsonPath("$.data.dob").value("2001-06-18"));
    }

    @Test
    @DisplayName("USER_PROFILE_WB_003 - Add first address marks it as default")
    void addAddress_withoutExistingAddresses_marksAddressAsDefault() throws Exception {
        mockMvc.perform(post("/api/users/addresses")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "recipientName": "Nguyen Van A",
                                  "phone": "0987654321",
                                  "detailedAddress": "123 Nguyen Hue, Quan 1, TP HCM",
                                  "isDefault": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đã thêm địa chỉ"))
                .andExpect(jsonPath("$.data.addresses", hasSize(1)))
                .andExpect(jsonPath("$.data.addresses[0].recipientName").value("Nguyen Van A"))
                .andExpect(jsonPath("$.data.addresses[0].isDefault").value(true));
    }

    @Test
    @DisplayName("USER_PROFILE_WB_004 - Change password rejects wrong old password")
    void changePassword_withWrongOldPassword_returnsBadRequest() throws Exception {
        mockMvc.perform(put("/api/users/change-password")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "oldPassword": "WrongPassword@123",
                                  "newPassword": "NewPassword@123",
                                  "confirmPassword": "NewPassword@123"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Mật khẩu cũ không đúng!"));
    }

    @Test
    @DisplayName("USER_PROFILE_WB_005 - Change password rejects weak new password by validation")
    void changePassword_withWeakNewPassword_returnsValidationBadRequest() throws Exception {
        mockMvc.perform(put("/api/users/change-password")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "oldPassword": "Password@123",
                                  "newPassword": "12345678",
                                  "confirmPassword": "12345678"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.newPassword").exists());
    }

    @Test
    @DisplayName("USER_PROFILE_WB_006 - Change password success stores encoded new password")
    void changePassword_withValidRequest_updatesEncodedPassword() throws Exception {
        mockMvc.perform(put("/api/users/change-password")
                        .header("Authorization", bearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "oldPassword": "Password@123",
                                  "newPassword": "NewPassword@123",
                                  "confirmPassword": "NewPassword@123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đổi mật khẩu thành công"));

        User updatedUser = userRepository.findByUsername(USERNAME).orElseThrow();
        assertTrue(passwordEncoder.matches("NewPassword@123", updatedUser.getPassword()));
    }

    @Test
    @DisplayName("USER_PROFILE_WB_007 - Unauthenticated profile request is rejected")
    void getProfile_withoutToken_returnsForbiddenOrUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/profile")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }

    private String bearerToken() {
        return "Bearer " + token;
    }
}
