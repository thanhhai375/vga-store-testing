package com.example.vgashop.controler;

import com.example.vgashop.dto.AuthResponse;
import com.example.vgashop.dto.GoogleLoginRequest;
import com.example.vgashop.dto.LoginRequest;
import com.example.vgashop.dto.RegisterRequest;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.AuthService;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTRATION FOR NORMAL USERS (FROM PROFILE / UI)
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            AuthResponse resp = authService.register(req);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // REGISTRATION FROM ADMIN/BE (FALLBACK)
    @PostMapping("/register-admin")
    public ApiResponse<AuthResponse> registerAdmin(@Valid @RequestBody UserDTO dto) {
        AuthResponse response = authService.register(dto);
        return ApiResponse.success("Đăng ký thành công", response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            AuthResponse resp = authService.login(req.getUsername(), req.getPassword());
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * [OWASP A03 - SQL INJECTION] Endpoint đăng nhập lỗ hổng – chỉ dùng để kiểm thử bảo mật.
     * Payload bypass xác thực:
     *   username: admin'--          password: anything
     *   username: ' OR '1'='1'--   password: anything
     * Payload lấy token admin:
     *   username: ' OR role='ADMIN'--   password: x
     */
    @PostMapping("/login-vulnerable")
    public ResponseEntity<?> loginVulnerable(@RequestBody LoginRequest req) {
        try {
            AuthResponse resp = authService.loginVulnerable(req.getUsername(), req.getPassword());
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest req) {
        try {
            AuthResponse resp = authService.googleLogin(req);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
