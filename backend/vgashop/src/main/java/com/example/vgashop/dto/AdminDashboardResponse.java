package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;


// Dashboard
public class AdminDashboardResponse {

    private Long totalUsers; // User
    private Long totalOrders; // Order
    private Long todayOrders; // Order
    private BigDecimal totalRevenue; // Total
    private BigDecimal todayRevenue; // Revenue
    private Long totalProducts; // Product
    private Long lowStockProducts; // Product
    private LocalDateTime lastUpdated; // Update existing

    // Constuctor

    public AdminDashboardResponse() {}

    public AdminDashboardResponse(Long totalUsers, Long totalOrders, Long todayOrders, BigDecimal totalRevenue, BigDecimal todayRevenue, Long totalProducts, Long lowStockProducts, LocalDateTime lastUpdated) {
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.todayOrders = todayOrders;
        this.totalRevenue = totalRevenue;
        this.todayRevenue = todayRevenue;
        this.totalProducts = totalProducts;
        this.lowStockProducts = lowStockProducts;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTodayOrders() {
        return todayOrders;
    }

    public void setTodayOrders(Long todayOrders) {
        this.todayOrders = todayOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(Long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
}

