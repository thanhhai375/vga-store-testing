package com.example.vgashop.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.vgashop.dto.AuthResponse;
import com.example.vgashop.dto.GoogleLoginRequest;
import com.example.vgashop.dto.RegisterRequest;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository       userRepository;
    private final JwtUtil              jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository  = userRepository;
        this.jwtUtil         = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new DuplicateResourceException("Email is already in use");
        if (userRepository.existsByUsername(req.getUsername()))
            throw new DuplicateResourceException("Username is already taken");

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName());
        user.setRole(Role.USER);
        user.setStatus(true);

        User saved = userRepository.save(user);
        return new AuthResponse(jwtUtil.generateToken(saved.getUsername(), saved.getRole()),
                saved.getUsername(), saved.getEmail(), saved.getRole().name(), saved.getId(),
                "Registration successful");
    }

    public AuthResponse register(UserDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername()))
            throw new DuplicateResourceException("Username is already taken");
        if (userRepository.existsByEmail(dto.getEmail()))
            throw new DuplicateResourceException("Email is already in use");

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole().toUpperCase()) : Role.USER);
        user.setStatus(true);

        User saved = userRepository.save(user);
        return new AuthResponse(jwtUtil.generateToken(saved.getUsername(), saved.getRole()),
                saved.getUsername(), saved.getEmail(), saved.getRole().name(), saved.getId(),
                "Registration successful");
    }

    public AuthResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password"));

        if (Boolean.TRUE.equals(user.isDeleted()))
            throw new RuntimeException("Account does not exist or has been removed");
        if (Boolean.FALSE.equals(user.getStatus()))
            throw new RuntimeException("Account is disabled. Please contact support.");
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid username or password");

        return new AuthResponse(jwtUtil.generateToken(user.getUsername(), user.getRole()),
                user.getUsername(), user.getEmail(), user.getRole().name(), user.getId(),
                "Login successful");
    }

    public AuthResponse googleLogin(GoogleLoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail()).orElse(null);

        if (user == null) {
            String prefix   = normalizeGoogleUsernamePrefix(req.getEmail().split("@")[0]);
            String username = prefix;
            
            if (username.length() > 50 || !username.matches("^[A-Za-z0-9_]+$")) {
                throw new RuntimeException("Generated username is invalid");
            }

            int    counter  = 1;
            while (userRepository.existsByUsername(username)) {
                username = prefix + counter++;
                if (username.length() > 50) {
                    throw new RuntimeException("Generated username is invalid");
                }
            }

            user = new User();
            user.setUsername(username);
            user.setEmail(req.getEmail());
            user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            user.setFullName(req.getName());
            user.setRole(Role.USER);
            user.setStatus(true);
            user = userRepository.save(user);
        } else {
            if (Boolean.TRUE.equals(user.isDeleted()))
                throw new RuntimeException("Account does not exist or has been removed");
            if (Boolean.FALSE.equals(user.getStatus()))
                throw new RuntimeException("Account is disabled");
        }

        return new AuthResponse(jwtUtil.generateToken(user.getUsername(), user.getRole()),
                user.getUsername(), user.getEmail(), user.getRole().name(), user.getId(),
                "Login successful");
    }

    private String normalizeGoogleUsernamePrefix(String prefix) {
        return prefix.replaceAll("[^A-Za-z0-9_]", "_");
    }
}
