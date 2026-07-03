package com.example.vgashop.whitebox_test.authentication.integration;

import com.example.vgashop.entity.User;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.whitebox_test.authentication.data.AuthIntegrationTestData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:vgashop_auth_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.show-sql=false"
})
class AuthIntegrationTest {

    private static final String VALID_REGISTER_PASSWORD = "Password@123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("AUTH_INT_001 - Register success saves user and returns token")
    void register_withValidRequest_savesUserAndReturnsToken() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerJson(
                                "auth_user_001",
                                "auth_user_001@example.com",
                                VALID_REGISTER_PASSWORD,
                                "Auth User 001")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(nullValue())))
                .andExpect(jsonPath("$.username").value("auth_user_001"))
                .andExpect(jsonPath("$.email").value("auth_user_001@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.message").value("Registration successful"));

        assertTrue(userRepository.existsByUsername("auth_user_001"));
        assertTrue(userRepository.existsByEmail("auth_user_001@example.com"));
    }

    @Test
    @DisplayName("AUTH_INT_002 - Register duplicate username returns bad request")
    void register_withDuplicateUsername_returnsBadRequest() throws Exception {
        userRepository.save(AuthIntegrationTestData.user(
                "existing_user",
                "existing_user@example.com",
                "123456"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerJson(
                                "existing_user",
                                "new_email@example.com",
                                VALID_REGISTER_PASSWORD,
                                "Duplicate Username")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Username is already taken"));
    }

    @Test
    @DisplayName("AUTH_INT_003 - Register duplicate email returns bad request")
    void register_withDuplicateEmail_returnsBadRequest() throws Exception {
        userRepository.save(AuthIntegrationTestData.user(
                "existing_user",
                "existing_email@example.com",
                "123456"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerJson(
                                "new_user",
                                "existing_email@example.com",
                                VALID_REGISTER_PASSWORD,
                                "Duplicate Email")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email is already in use"));
    }

    @Test
    @DisplayName("AUTH_INT_004 - Login success returns JWT token")
    void login_withValidCredentials_returnsToken() throws Exception {
        userRepository.save(AuthIntegrationTestData.user(
                "login_user",
                "login_user@example.com",
                "123456"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.loginJson("login_user", "123456")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(nullValue())))
                .andExpect(jsonPath("$.username").value("login_user"))
                .andExpect(jsonPath("$.email").value("login_user@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    @DisplayName("AUTH_INT_005 - Login wrong password returns bad request")
    void login_withWrongPassword_returnsBadRequest() throws Exception {
        userRepository.save(AuthIntegrationTestData.user(
                "wrong_password_user",
                "wrong_password_user@example.com",
                "123456"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.loginJson("wrong_password_user", "wrong-password")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @DisplayName("AUTH_INT_006 - Login missing user returns bad request")
    void login_withMissingUser_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.loginJson("missing_user", "123456")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    @DisplayName("AUTH_INT_007 - Login disabled user returns bad request")
    void login_withDisabledUser_returnsBadRequest() throws Exception {
        User user = AuthIntegrationTestData.user(
                "disabled_user",
                "disabled_user@example.com",
                "123456");
        user.setStatus(false);
        userRepository.save(user);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.loginJson("disabled_user", "123456")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Account is disabled. Please contact support."));
    }

    @Test
    @DisplayName("AUTH_INT_008 - Login deleted user returns bad request")
    void login_withDeletedUser_returnsBadRequest() throws Exception {
        User user = AuthIntegrationTestData.user(
                "deleted_user",
                "deleted_user@example.com",
                "123456");
        user.setDeleted(true);
        userRepository.save(user);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.loginJson("deleted_user", "123456")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Account does not exist or has been removed"));
    }

    @Test
    @DisplayName("AUTH_INT_009 - Register validation rejects short username")
    void register_withInvalidUsername_returnsValidationBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerJson(
                                "ab",
                                "valid_user@example.com",
                                VALID_REGISTER_PASSWORD,
                                "Invalid Username")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.username").exists());
    }

    @Test
    @DisplayName("AUTH_INT_010 - Register validation rejects invalid email")
    void register_withInvalidEmail_returnsValidationBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerJson(
                                "valid_user",
                                "invalid-email",
                                VALID_REGISTER_PASSWORD,
                                "Invalid Email")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.email").exists());
    }

    @Test
    @DisplayName("AUTH_INT_011 - Register validation rejects weak password")
    void register_withWeakPassword_returnsValidationBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerJson(
                                "valid_user",
                                "valid_user@example.com",
                                "123456",
                                "Weak Password")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.password").exists());
    }

    @Test
    @DisplayName("AUTH_INT_012 - Login validation rejects blank username")
    void login_withBlankUsername_returnsValidationBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.loginJson("", "123456")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.username").exists());
    }

    @Test
    @DisplayName("AUTH_INT_013 - Login validation rejects blank password")
    void login_withBlankPassword_returnsValidationBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.loginJson("login_user", "")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.password").exists());
    }

    @Test
    @DisplayName("AUTH_INT_014 - Register admin success uses requested role")
    @WithMockUser(roles = "ADMIN")
    void registerAdmin_withValidRole_returnsApiResponseAndToken() throws Exception {
        mockMvc.perform(post("/api/auth/register-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerAdminJson(
                                "admin_auth_user",
                                "admin_auth_user@example.com",
                                VALID_REGISTER_PASSWORD,
                                "Admin Auth User",
                                "ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token", not(nullValue())))
                .andExpect(jsonPath("$.data.username").value("admin_auth_user"))
                .andExpect(jsonPath("$.data.role").value("ADMIN"));
    }

    @Test
    @DisplayName("AUTH_INT_015 - Register admin defaults role to USER")
    @WithMockUser(roles = "ADMIN")
    void registerAdmin_withoutRole_defaultsToUser() throws Exception {
        mockMvc.perform(post("/api/auth/register-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.registerAdminJson(
                                "default_role_user",
                                "default_role_user@example.com",
                                VALID_REGISTER_PASSWORD,
                                "Default Role User",
                                null)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.role").value("USER"));
    }

    @Test
    @DisplayName("AUTH_INT_016 - Google login creates new user when email is unknown")
    void googleLogin_withNewEmail_createsUserAndReturnsToken() throws Exception {
        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                "google_user@example.com",
                                "Google User")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(nullValue())))
                .andExpect(jsonPath("$.username").value("google_user"))
                .andExpect(jsonPath("$.email").value("google_user@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.message").value("Login successful"));

        assertTrue(userRepository.existsByUsername("google_user"));
    }

    @Test
    @DisplayName("AUTH_INT_017 - Google login appends counter when username prefix exists")
    void googleLogin_withExistingUsernamePrefix_createsUniqueUsername() throws Exception {
        userRepository.save(AuthIntegrationTestData.user(
                "conflict",
                "other_email@example.com",
                "123456"));
        userRepository.save(AuthIntegrationTestData.user(
                "conflict1",
                "other_email_1@example.com",
                "123456"));

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                "conflict@example.com",
                                "Conflict User")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("conflict2"))
                .andExpect(jsonPath("$.token", not(nullValue())));

        assertTrue(userRepository.existsByUsername("conflict2"));
    }

    @Test
    @DisplayName("AUTH_INT_018 - Google login existing active user returns token without creating duplicate")
    void googleLogin_withExistingActiveEmail_returnsExistingUser() throws Exception {
        userRepository.save(AuthIntegrationTestData.user(
                "existing_google",
                "existing_google@example.com",
                "123456"));

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                "existing_google@example.com",
                                "Existing Google")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("existing_google"))
                .andExpect(jsonPath("$.email").value("existing_google@example.com"))
                .andExpect(jsonPath("$.token", not(nullValue())));
    }

    @Test
    @DisplayName("AUTH_INT_019 - Google login disabled existing user returns bad request")
    void googleLogin_withDisabledExistingUser_returnsBadRequest() throws Exception {
        User user = AuthIntegrationTestData.user(
                "disabled_google",
                "disabled_google@example.com",
                "123456");
        user.setStatus(false);
        userRepository.save(user);

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                "disabled_google@example.com",
                                "Disabled Google")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Account is disabled"));
    }

    @Test
    @DisplayName("AUTH_INT_020 - Google login validation rejects invalid email")
    void googleLogin_withInvalidEmail_returnsValidationBadRequest() throws Exception {
        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                "not-an-email",
                                "Google User")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.email").exists());
    }

    @Test
    @DisplayName("AUTH_INT_021 - Google login deleted existing user returns bad request")
    void googleLogin_withDeletedExistingUser_returnsBadRequest() throws Exception {
        User user = AuthIntegrationTestData.user(
                "deleted_google",
                "deleted_google@example.com",
                "123456");
        user.setDeleted(true);
        user.setStatus(true);
        userRepository.save(user);

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                "deleted_google@example.com",
                                "Deleted Google")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Account does not exist or has been removed"));
    }

    @Test
    @DisplayName("AUTH_INT_022 - Google login rejects email prefix that would create username longer than 50 characters")
    void googleLogin_withLongEmailPrefix_rejectsInvalidGeneratedUsername() throws Exception {
        String longLocalPart = "a".repeat(51);
        String email = longLocalPart + "@example.com";

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                email,
                                "Long Prefix Google")))
                .andExpect(status().isBadRequest());

        assertFalse(userRepository.existsByEmail(email));
        assertFalse(userRepository.existsByUsername(longLocalPart));
    }

    @Test
    @DisplayName("AUTH_INT_023 - Google login rejects email prefix with characters invalid for username rule")
    void googleLogin_withInvalidUsernameCharactersInEmailPrefix_rejectsGeneratedUsername() throws Exception {
        String email = "john.doe+tag@example.com";

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(AuthIntegrationTestData.googleLoginJson(
                                email,
                                "Invalid Prefix Google")))
                .andExpect(status().isBadRequest());

        assertFalse(userRepository.existsByEmail(email));
        assertFalse(userRepository.existsByUsername("john.doe+tag"));
    }
}
