package com.example.vgashop.config;

import com.example.vgashop.entity.*;
import com.example.vgashop.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Date;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            BlogRepository blogRepository,
            ReviewRepository reviewRepository,
            ServicePolicyRepository servicePolicyRepository,
            SystemSettingRepository systemSettingRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {

        return args -> {

            // Seed Admin User if not exists
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@vgastore.com");
                admin.setPassword(passwordEncoder.encode("123"));
                admin.setFullName("System Admin");
                admin.setRole(Role.ADMIN);
                admin.setStatus(true);
                userRepository.save(admin);
                System.out.println(">>> [SEEDER] Created default Admin account: admin / 123");
            }

            // Error handling
            try {
                jdbcTemplate.execute("ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL");
            } catch (Exception e) {
                System.out.println("Cột user_id trong reviews đã cho phép Null hoặc CSDL không hỗ trợ lệnh này.");
            }

            // Seed Settings
            if (systemSettingRepository.count() == 0) {
                systemSettingRepository.save(SystemSetting.builder().settingKey("BANK_ID").settingValue("970436").description("Mã BIN Ngân hàng (Vietcombank)").build());
                systemSettingRepository.save(SystemSetting.builder().settingKey("BANK_ACC_NO").settingValue("1234567890").description("Số tài khoản").build());
                systemSettingRepository.save(SystemSetting.builder().settingKey("BANK_ACC_NAME").settingValue("CONG TY VGA STORE").description("Tên chủ tài khoản").build());
            }

        };
    }
}
