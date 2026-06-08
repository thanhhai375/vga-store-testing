package com.example.vgashop.controler;

import com.example.vgashop.dto.ChangePasswordRequest;
import com.example.vgashop.dto.UserAddressDto;
import com.example.vgashop.dto.UserProfileRequest;
import com.example.vgashop.dto.UserProfileResponse;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.entity.User;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ==========================================

    // ==========================================

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(Principal principal) {
        UserProfileResponse profile = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Success", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(Principal principal, @RequestBody UserProfileRequest request) {
        UserProfileResponse profile = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hồ sơ thành công", profile));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(Principal principal, @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<UserProfileResponse>> addAddress(Principal principal, @RequestBody UserAddressDto dto) {
        UserProfileResponse profile = userService.addAddress(principal.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Đã thêm địa chỉ", profile));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> deleteAddress(Principal principal, @PathVariable Long id) {
        UserProfileResponse profile = userService.deleteAddress(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa địa chỉ", profile));
    }


    // ==========================================
    // Dashboard
    // ==========================================

    // Retrieve all
    @GetMapping
    public ApiResponse<Page<User>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue= "id") String sortBy,
        @RequestParam(defaultValue= "asc") String direction
    ) {
        Page<User> data = userService.getAllUsers(page, size, sortBy, direction);
        return ApiResponse.success("Lấy danh sách người dùng thành công", data);
    }

    // Search
    @GetMapping("/search")
    public ApiResponse<Page<User>> search(
        @RequestParam String keyWord,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<User> data = userService.searchUsers(keyWord, page, size);
        return ApiResponse.success("Tìm kiếm người dùng thành công", data);
    }

    // By ID
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ApiResponse.success("Lấy thông tin người dùng thành công", user);
    }


    @PostMapping
    public ApiResponse<User> create(@Valid @RequestBody UserDTO dto) {
        User saved = userService.createUser(dto);
        return ApiResponse.success("Tạo mới người dùng thành công", saved);
    }

    // Update existing
    @PutMapping("/{id}")
    public ApiResponse<User> update(@PathVariable Long id, @Valid @RequestBody UserDTO dto) {
        User updated = userService.updateUser(id, dto);
        return ApiResponse.success("Cập nhật user thành công", updated);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAdmin(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.success("Xóa người dùng thành công", null);
    }

    // ============================================================
    // [OWASP A03] SQL Injection endpoints – chỉ dùng đào tạo bảo mật
    // ============================================================

    /**
     * Lấy thông tin người dùng theo username – dễ bị SQL Injection.
     * Payload dump toàn bộ DB:
     *   GET /api/users/info-vulnerable?username=' OR '1'='1
     * Payload UNION lấy password hash:
     *   GET /api/users/info-vulnerable?username=' UNION SELECT 1,username,password,email,phone,role,status,created_at FROM users--
     */
    @GetMapping("/info-vulnerable")
    public ApiResponse<?> getUserInfoVulnerable(@RequestParam String username) {
        return ApiResponse.success("Thông tin người dùng (vulnerable)", userService.getUserInfoVulnerable(username));
    }

    /**
     * Lấy danh sách tài khoản theo role – dễ bị SQL Injection.
     * Payload lấy tất cả tài khoản kể cả admin:
     *   GET /api/users/admin-list-vulnerable?role=ADMIN
     *   GET /api/users/admin-list-vulnerable?role=' OR '1'='1'--
     * Payload UNION dump password:
     *   GET /api/users/admin-list-vulnerable?role=ADMIN' UNION SELECT id,username,password,email,role,status,now() FROM users--
     */
    @GetMapping("/admin-list-vulnerable")
    public ApiResponse<?> getAdminListVulnerable(@RequestParam(defaultValue = "ADMIN") String role) {
        return ApiResponse.success("Danh sách tài khoản theo role (vulnerable)", userService.getAdminListVulnerable(role));
    }

    /**
     * Thống kê tài khoản theo trạng thái – dễ bị SQL Injection (Time-based Blind + Boolean-based).
     * Payload time-based blind (MySQL):
     *   GET /api/users/stats-vulnerable?status=1 AND SLEEP(5)--
     * Payload UNION dump dữ liệu:
     *   GET /api/users/stats-vulnerable?status=1 UNION SELECT username,password,email FROM users--
     */
    @GetMapping("/stats-vulnerable")
    public ApiResponse<?> getAccountStatsVulnerable(@RequestParam(defaultValue = "true") String status) {
        return ApiResponse.success("Thống kê tài khoản (vulnerable)", userService.getAccountStatsByStatusVulnerable(status));
    }
}
