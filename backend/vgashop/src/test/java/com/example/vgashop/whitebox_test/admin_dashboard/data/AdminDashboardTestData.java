package com.example.vgashop.whitebox_test.admin_dashboard.data;

import com.example.vgashop.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AdminDashboardTestData {

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public static User createAdminUser(String username, String email) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("Password@123"));
        user.setRole(com.example.vgashop.entity.Role.ADMIN);
        user.setStatus(true);
        user.setFullName("Admin User");
        user.setPhone("0123456789");
        user.setDeleted(false);
        return user;
    }

    public static User createNormalUser(String username, String email) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("Password@123"));
        user.setRole(com.example.vgashop.entity.Role.USER);
        user.setStatus(true);
        user.setFullName("Normal User");
        user.setPhone("0987654321");
        user.setDeleted(false);
        return user;
    }

    public static String loginJson(String username, String password) {
        return String.format("""
                {
                    "username": "%s",
                    "password": "%s"
                }
                """, username, password);
    }
}
