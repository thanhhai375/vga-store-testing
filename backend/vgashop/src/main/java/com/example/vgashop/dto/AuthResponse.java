package com.example.vgashop.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private Long userId;
    private String message;

    // Default constructor
    public AuthResponse() {}

    // Constructor from HEAD
    public AuthResponse(String token, String username, String email, String role, Long userId) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.userId = userId;
    }

    // Constructor from origin/be
    public AuthResponse(String token, String message, String role) {
        this.token = token;
        this.message = message;
        this.role = role;
    }

    // Constructor for all if needed
    public AuthResponse(String token, String username, String email, String role, Long userId, String message) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

