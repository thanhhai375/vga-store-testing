package com.example.vgashop.whitebox_test.authentication.data;

import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public final class AuthIntegrationTestData {

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    private AuthIntegrationTestData() {
    }

    public static String registerJson(String username, String email, String password, String fullName) {
        return """
                {
                  "username": "%s",
                  "email": "%s",
                  "password": "%s",
                  "fullName": "%s"
                }
                """.formatted(username, email, password, fullName);
    }

    public static String loginJson(String username, String password) {
        return """
                {
                  "username": "%s",
                  "password": "%s"
                }
                """.formatted(username, password);
    }

    public static String googleLoginJson(String email, String name) {
        return """
                {
                  "email": "%s",
                  "name": "%s"
                }
                """.formatted(email, name);
    }

    public static String registerAdminJson(String username, String email, String password, String fullName, String role) {
        String roleField = role == null ? "" : """
                  ,"role": "%s"
                """.formatted(role);

        return """
                {
                  "username": "%s",
                  "email": "%s",
                  "password": "%s",
                  "fullName": "%s"%s
                }
                """.formatted(username, email, password, fullName, roleField);
    }

    public static User user(String username, String email, String rawPassword) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(PASSWORD_ENCODER.encode(rawPassword));
        user.setFullName("Integration Test User");
        user.setRole(Role.USER);
        user.setStatus(true);
        user.setDeleted(false);
        return user;
    }
}
