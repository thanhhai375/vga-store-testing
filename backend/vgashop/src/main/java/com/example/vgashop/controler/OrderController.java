package com.example.vgashop.controler;

import com.example.vgashop.dto.CreateOrderRequest;
import com.example.vgashop.dto.OrderRequest;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest req, Authentication auth) {
        try {
            return ResponseEntity.ok(orderService.placeOrder(req, auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrdersList(Authentication auth) {
        try {
            return ResponseEntity.ok(orderService.getUserOrders(auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ApiResponse.success("Order created", orderService.createOrderFromCart(request));
    }

    @GetMapping
    public ApiResponse<Page<OrderSummaryResponse>> getMyOrdersPage(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String direction) {
        return ApiResponse.success("Orders retrieved",
                orderService.getMyOrders(page, size, sortBy, direction));
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long orderId) {
        return ApiResponse.success("Order retrieved", orderService.getOrderById(orderId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(orderService.cancelOrder(id, reason));
    }

    @GetMapping("/admin/all")
    public ApiResponse<Page<OrderSummaryResponse>> getAllOrders(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String direction) {
        return ApiResponse.success("All orders retrieved",
                orderService.getAllOrders(page, size, sortBy, direction));
    }

    @PutMapping("/admin/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ApiResponse.success("Order status updated", orderService.updateOrderStatus(orderId, request));
    }
}
