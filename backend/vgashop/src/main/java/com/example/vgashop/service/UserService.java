package com.example.vgashop.service;

import com.example.vgashop.dto.ChangePasswordRequest;
import com.example.vgashop.dto.UserAddressDto;
import com.example.vgashop.dto.UserProfileRequest;
import com.example.vgashop.dto.UserProfileResponse;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.entity.UserAddress;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // ==========================================

    // ==========================================
    public UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDtoProfile(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String username, UserProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setDob(request.getDob());
        
        return mapToDtoProfile(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng!");
        }
        
        if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu mới không được trùng mật khẩu cũ!");
        }
        
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserProfileResponse addAddress(String username, UserAddressDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserAddress address = new UserAddress();
        address.setUser(user);
        address.setRecipientName(dto.getRecipientName());
        address.setPhone(dto.getPhone());
        address.setDetailedAddress(dto.getDetailedAddress());
        
        // Address
        if (dto.getIsDefault() != null && dto.getIsDefault() || user.getAddresses().isEmpty()) {
            user.getAddresses().forEach(a -> a.setIsDefault(false));
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }
        
        user.getAddresses().add(address);
        return mapToDtoProfile(userRepository.save(user));
    }

    @Transactional
    public UserProfileResponse deleteAddress(String username, Long addressId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getAddresses().removeIf(a -> a.getId().equals(addressId));
        return mapToDtoProfile(userRepository.save(user));
    }

    private UserProfileResponse mapToDtoProfile(User user) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setPhone(user.getPhone());
        dto.setGender(user.getGender());
        dto.setDob(user.getDob());
        
        if (user.getAddresses() != null) {
            dto.setAddresses(user.getAddresses().stream().map(a -> 
                new UserAddressDto(a.getId(), a.getRecipientName(), a.getPhone(), a.getDetailedAddress(), a.getIsDefault())
            ).collect(Collectors.toList()));
        }
        return dto;
    }

    // ==========================================

    // ==========================================
    
    public Page<User> getAllUsers(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findByDeletedFalse(pageable);
    }

    public Page<User> searchUsers(String keyWord, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("username").ascending()); // NOTE: "name" changed to "username"
        if (keyWord == null || keyWord.trim().isEmpty()) {
            return userRepository.findByDeletedFalse(pageable);
        }
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyWord.trim(), keyWord.trim(), pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id));
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.trim().isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng đang đăng nhập");
        }
        return userRepository.findByUsernameAndDeletedFalse(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + username));
    }

    public User createUser(UserDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateResourceException("Username '" + dto.getUsername() + "' đã tồn tại!");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email '" + dto.getEmail() + "' đã tồn tại!");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setAvatar(dto.getAvatar());
        user.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole().toUpperCase()) : Role.USER);

        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDTO dto) {
        return userRepository.findByIdAndDeleted(id, false)
                .map(user -> {
                    if (!user.getUsername().equals(dto.getUsername()) && userRepository.existsByUsername(dto.getUsername())) {
                        throw new DuplicateResourceException("UserName '" + dto.getUsername() + "' đã tồn tại!");
                    }
                    if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
                        throw new DuplicateResourceException("Email '" + dto.getEmail() + "' đã tồn tại!");
                    }

                    user.setUsername(dto.getUsername());
                    user.setEmail(dto.getEmail());
                    user.setFullName(dto.getFullName());
                    user.setPhone(dto.getPhone());
                    user.setAddress(dto.getAddress());
                    user.setAvatar(dto.getAvatar());
                    if (dto.getRole() != null) {
                        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
                    }

                    return userRepository.save(user);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsByIdAndDeleted(id, false)) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id);
        }

        User user = userRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id));
        user.setDeleted(true);
        userRepository.save(user);
    }

    // ============================================================
    // [OWASP A03] Các method SQL Injection – chỉ dùng đào tạo bảo mật
    // ============================================================

    /**
     * Lấy thông tin của người dùng theo username bằng native SQL nối chuỗi.
     * Payload dump toàn bộ user: username = ' OR '1'='1
     * Payload lấy user cụ thể: username = admin' OR '1'='1' AND username='victim
     * Payload UNION: username = ' UNION SELECT id,username,password,full_name,email,address,avatar,role,status,deleted,created_at,updated_at,phone,gender,dob FROM users--
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getUserInfoVulnerable(String username) {
        // Cố ý nối chuỗi username vào SQL → SQL Injection
        String sql = "SELECT id, username, email, full_name, phone, role, status, created_at "
                   + "FROM users WHERE username = '" + username + "'";
        List<Object[]> rows = entityManager.createNativeQuery(sql).getResultList();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("id",         row[0]);
            map.put("username",   row[1]);
            map.put("email",      row[2]);
            map.put("full_name",  row[3]);
            map.put("phone",      row[4]);
            map.put("role",       row[5]);
            map.put("status",     row[6]);
            map.put("created_at", row[7]);
            result.add(map);
        }
        return result;
    }

    /**
     * Lấy danh sách tài khoản ADMIN bằng native SQL nối chuỗi.
     * Payload leo thậng quyền: role = 'USER' OR '1'='1
     * Payload UNION dump password: role = 'ADMIN' UNION SELECT id,username,password,email,5,6,7,8 FROM users--
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAdminListVulnerable(String role) {
        // Cố ý nối chuỗi role vào SQL → SQL Injection
        String sql = "SELECT id, username, email, full_name, role, status, created_at "
                   + "FROM users WHERE role = '" + role + "' AND deleted = false";
        List<Object[]> rows = entityManager.createNativeQuery(sql).getResultList();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("id",         row[0]);
            map.put("username",   row[1]);
            map.put("email",      row[2]);
            map.put("full_name",  row[3]);
            map.put("role",       row[4]);
            map.put("status",     row[5]);
            map.put("created_at", row[6]);
            result.add(map);
        }
        return result;
    }

    /**
     * Thống kê tài khoản theo trạng thái (active/inactive) bằng native SQL nối chuỗi.
     * Payload Boolean-based blind: status = '1' AND SLEEP(5)--  (MySQL time-based)
     * Payload dump dữ liệu: status = '1' UNION SELECT count(*),username,password,4,5,6,7 FROM users--
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAccountStatsByStatusVulnerable(String status) {
        // Cố ý nối chuỗi status vào SQL → SQL Injection (Boolean-based + Time-based Blind)
        String sql = "SELECT role, COUNT(*) as total, SUM(CASE WHEN status = true THEN 1 ELSE 0 END) as active_count "
                   + "FROM users WHERE deleted = false AND status = " + status
                   + " GROUP BY role";
        List<Object[]> rows = entityManager.createNativeQuery(sql).getResultList();
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("role",         row[0]);
            map.put("total",        row[1]);
            map.put("active_count", row[2]);
            result.add(map);
        }
        return result;
    }
}
