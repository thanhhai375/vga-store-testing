package com.example.vgashop.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.dto.CreateOrderRequest;
import com.example.vgashop.dto.OrderItemResponse;
import com.example.vgashop.dto.OrderRequest;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.entity.Cart;
import com.example.vgashop.entity.CartItem;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.CartRepository;
import com.example.vgashop.repository.OrderItemRepository;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository     orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository      cartRepository;
    private final ProductRepository   productRepository;
    private final UserRepository      userRepository;
    private final UserService         userService;
    private final PaymentRepository   paymentRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
            CartRepository cartRepository, ProductRepository productRepository,
            UserRepository userRepository, UserService userService, PaymentRepository paymentRepository) {
        this.orderRepository     = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository      = cartRepository;
        this.productRepository   = productRepository;
        this.userRepository      = userRepository;
        this.userService         = userService;
        this.paymentRepository   = paymentRepository;
    }

    @Transactional
    public Map<String, Object> placeOrder(OrderRequest req, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setFullName(req.getFullName());
        order.setPhone(req.getPhone());
        order.setShippingAddress(req.getAddress());
        order.setNote(req.getNote());
        order.setOrderCode("VGA-" + LocalDateTime.now().toLocalDate() + "_"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderRequest.OrderItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

            if (product.getStock() == null || product.getStock() < itemReq.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for '" + product.getName() + "'. Available: " + product.getStock());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());
            items.add(item);
            total += product.getPrice().doubleValue() * item.getQuantity();

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(BigDecimal.valueOf(total));
        order.setItems(items);
        Order saved = orderRepository.save(order);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("orderId",   saved.getId());
        resp.put("orderCode", saved.getOrderCode());
        resp.put("status",    saved.getStatus().name());
        resp.put("totalPrice", saved.getTotalAmount());
        resp.put("fullName",  saved.getFullName());
        resp.put("phone",     saved.getPhone());
        resp.put("address",   saved.getShippingAddress());
        return resp;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orderRepository.findByUserIdOrderByIdDesc(user.getId())) {
            Map<String, Object> o = new LinkedHashMap<>();
            o.put("id",         order.getId());
            o.put("orderCode",  order.getOrderCode());
            o.put("status",     order.getStatus().name());
            o.put("totalAmount", order.getTotalAmount());
            o.put("itemCount",  order.getItems() != null ? order.getItems().size() : 0);
            o.put("createdAt",  order.getCreatedAt() != null ? order.getCreatedAt().toString() : "");
            o.put("productIds", order.getItems() != null
                    ? order.getItems().stream().filter(i -> i.getProduct() != null)
                            .map(i -> i.getProduct().getId()).collect(Collectors.toList())
                    : new ArrayList<>());
            result.add(o);
        }
        return result;
    }

    @Transactional
    public OrderResponse createOrderFromCart(CreateOrderRequest request) {
        User currentUser = userService.getCurrentUser();

        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (cart.getCartItems().isEmpty())
            throw new IllegalArgumentException("Cart is empty");

        Order order = new Order();
        order.setUser(currentUser);
        order.setOrderCode("VGA-" + LocalDateTime.now().toLocalDate() + "_"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setShippingAddress(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setNote(request.getNote() != null ? request.getNote() : "");
        order.setFullName((currentUser.getFullName() != null && !currentUser.getFullName().isEmpty())
                ? currentUser.getFullName() : currentUser.getUsername());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity())
                throw new IllegalArgumentException("Insufficient stock for '" + product.getName() + "'");

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            order.getItems().add(orderItem);

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.calculateTotal();
        Order savedOrder = orderRepository.save(order);

        cart.getCartItems().forEach(item -> item.setDeleted(true));
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);

        return toOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getMyOrders(int page, int size, String sortBy, String direction) {
        User user = userService.getCurrentUser();
        return orderRepository.findByUser_IdAndDeletedFalse(user.getId(), pageable(page, size, sortBy, direction))
                .map(this::toOrderSummaryResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        User user = userService.getCurrentUser();
        return toOrderResponse(orderRepository.findByIdAndUser_IdAndDeletedFalse(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, String reason) {
        User user = userService.getCurrentUser();
        Order order = orderRepository.findByIdAndUser_IdAndDeletedFalse(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED)
            throw new IllegalArgumentException("Order can only be cancelled when PENDING or CONFIRMED");

        order.setStatus(OrderStatus.CANCEL_REQUESTED);

        if (reason != null && !reason.trim().isEmpty()) {
            String current   = order.getNote() != null ? order.getNote() : "";
            String separator = current.isEmpty() ? "" : " | ";
            order.setNote(current + separator + "[CANCEL REASON]: " + reason);
        }

        return toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findByIdAndDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(request.getStatus());

        switch (request.getStatus()) {
            case CONFIRMED -> {
                order.setConfirmedAt(LocalDateTime.now());
                order.setPaymentStatus(PaymentStatus.PAID);
            }
            case SHIPPING -> {
                order.setShippedAt(LocalDateTime.now());
                if (order.getPaymentStatus() == PaymentStatus.UNPAID) {
                    order.setPaymentStatus(PaymentStatus.PAID);
                }
            }
            case DELIVERED -> {
                order.setDeliveredAt(LocalDateTime.now());
                if (order.getPaymentStatus() == PaymentStatus.UNPAID) {
                    order.setPaymentStatus(PaymentStatus.PAID);
                }
            }
            case CANCELLED -> {
                if (oldStatus != OrderStatus.CANCELLED) {
                    for (OrderItem item : order.getItems()) {
                        Product p = item.getProduct();
                        p.setStock(p.getStock() + item.getQuantity());
                        productRepository.save(p);
                    }
                }
            }
        }
        return toOrderResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getAllOrders(int page, int size, String sortBy, String direction) {
        return orderRepository.findByDeletedFalse(pageable(page, size, sortBy, direction))
                .map(this::toOrderSummaryResponse);
    }

    private Pageable pageable(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return PageRequest.of(page, size, sort);
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .filter(item -> !item.isDeleted())
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(), item.getProduct().getName(),
                        item.getProduct().getImgUrl(), item.getPrice(),
                        item.getQuantity(), item.getSubtotal()))
                .collect(Collectors.toList());

        String paymentMethod = "UNKNOWN";
        try {
            Payment payment = paymentRepository.findByOrder_IdAndDeletedFalse(order.getId()).orElse(null);
            if (payment != null && payment.getPaymentMethod() != null)
                paymentMethod = payment.getPaymentMethod().name();
        } catch (Exception ignored) {}

        String name  = (order.getFullName() != null && !order.getFullName().trim().isEmpty())
                ? order.getFullName() : (order.getUser() != null ? order.getUser().getUsername() : "Guest");
        String email = order.getUser() != null ? order.getUser().getEmail() : "";

        return new OrderResponse(order.getId(), order.getOrderCode(), order.getTotalAmount(),
                order.getDiscountAmount(), order.getStatus(), order.getPaymentStatus(),
                order.getShippingAddress(), order.getPhone(), order.getNote(),
                order.getCreatedAt(), order.getConfirmedAt(), order.getShippedAt(),
                order.getDeliveredAt(), items, name, email, paymentMethod);
    }

    private OrderSummaryResponse toOrderSummaryResponse(Order order) {
        int totalItems = order.getItems().stream()
                .filter(item -> !item.isDeleted())
                .mapToInt(OrderItem::getQuantity).sum();
        return new OrderSummaryResponse(order.getId(), order.getOrderCode(), order.getFullName(),
                order.getPhone(), order.getTotalAmount(), order.getStatus(),
                order.getPaymentStatus(), order.getCreatedAt(), totalItems);
    }
}