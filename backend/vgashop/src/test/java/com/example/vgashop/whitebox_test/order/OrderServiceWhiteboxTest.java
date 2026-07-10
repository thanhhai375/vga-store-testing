package com.example.vgashop.whitebox_test.order;

import com.example.vgashop.dto.CreateOrderRequest;
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
import com.example.vgashop.entity.PaymentMethod;
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
import com.example.vgashop.service.OrderService;
import com.example.vgashop.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceWhiteboxTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private PaymentRepository paymentRepository;

    private OrderService orderService;
    private User currentUser;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(
                orderRepository,
                orderItemRepository,
                cartRepository,
                productRepository,
                userRepository,
                userService,
                paymentRepository
        );

        currentUser = user(1L, "order_user", "Order User");
        lenient().when(userService.getCurrentUser()).thenReturn(currentUser);
        lenient().when(paymentRepository.findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(anyLong()))
                .thenReturn(Optional.empty());
    }

    // ---------------------------------------------------------------------
    // Path testing + data-flow testing: direct order creation
    // ---------------------------------------------------------------------
    /*
     * Mục tiêu: Kiểm tra luồng tạo đơn hàng trực tiếp thành công.
     * Dữ liệu kiểm tra: User tồn tại, sản phẩm tồn tại, số lượng đặt nhỏ hơn tồn kho.
     * Kết quả mong đợi:
     * - Order được lưu với trạng thái PENDING và thanh toán UNPAID.
     * - Dữ liệu Product được sao chép đúng sang OrderItem.
     * - Tổng tiền được tính đúng và tồn kho sản phẩm bị giảm.
     */

    @Test
    @DisplayName("WB-ORDER-001 - placeOrder success copies product data into OrderItem and reduces stock")
    void placeOrder_validRequest_persistsOrderItemsAndReducesStock() {
        Product product = product(10L, "RTX 5090", 5, "1200000");
        OrderRequest request = directOrderRequest("Nguyen Van A", "0912345678", 10L, 2);

        when(userRepository.findByUsername("order_user")).thenReturn(Optional.of(currentUser));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(100L);
            return saved;
        });

        Map<String, Object> result = orderService.placeOrder(request, "order_user");

        assertEquals(100L, result.get("orderId"));
        assertEquals("PENDING", result.get("status"));
        assertEquals(new BigDecimal("2400000.0"), result.get("totalPrice"));
        assertEquals(3, product.getStock());

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();

        assertEquals(currentUser, savedOrder.getUser());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals(PaymentStatus.UNPAID, savedOrder.getPaymentStatus());
        assertEquals(1, savedOrder.getItems().size());

        OrderItem savedItem = savedOrder.getItems().get(0);
        assertSame(savedOrder, savedItem.getOrder());
        assertSame(product, savedItem.getProduct());
        assertEquals(2, savedItem.getQuantity());
        assertEquals(new BigDecimal("1200000"), savedItem.getPrice());
        verify(productRepository).save(product);
    }
    /*
     * Mục tiêu: Kiểm tra đường ngoại lệ khi username không tồn tại.
     * Nhánh kiểm tra: userRepository trả về Optional.empty().
     * Kết quả mong đợi:
     * - Ném ResourceNotFoundException.
     * - Không lưu Order vào database.
     */

    @Test
    @DisplayName("WB-ORDER-002 - placeOrder user does not exist follows exception path")
    void placeOrder_userNotFound_throwsResourceNotFound() {
        when(userRepository.findByUsername("missing_user")).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.placeOrder(directOrderRequest("A", "0912345678", 10L, 1), "missing_user")
        );

        assertEquals("User not found: missing_user", exception.getMessage());
        verify(orderRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra nhánh validation số điện thoại không hợp lệ.
     * Dữ liệu kiểm tra: Số điện thoại chỉ có 3 ký tự.
     * Kết quả mong đợi:
     * - Ném IllegalArgumentException.
     * - Không tiếp tục truy vấn sản phẩm.
     */

    @Test
    @DisplayName("WB-ORDER-003 - placeOrder invalid phone follows validation branch")
    void placeOrder_invalidPhone_throwsIllegalArgument() {
        when(userRepository.findByUsername("order_user")).thenReturn(Optional.of(currentUser));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.placeOrder(directOrderRequest("A", "123", 10L, 1), "order_user")
        );

        assertEquals("Số điện thoại không hợp lệ (phone error)", exception.getMessage());
        verify(productRepository, never()).findById(anyLong());
    }
    /*
     * Mục tiêu: Kiểm tra đường ngoại lệ khi productId không tồn tại.
     * Nhánh kiểm tra: productRepository trả về Optional.empty().
     * Kết quả mong đợi:
     * - Ném ResourceNotFoundException.
     * - Không lưu Order.
     */

    @Test
    @DisplayName("WB-ORDER-004 - placeOrder product does not exist follows exception path")
    void placeOrder_productNotFound_throwsResourceNotFound() {
        when(userRepository.findByUsername("order_user")).thenReturn(Optional.of(currentUser));
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.placeOrder(directOrderRequest("A", "0912345678", 99L, 1), "order_user")
        );

        assertEquals("Product not found: 99", exception.getMessage());
        verify(orderRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra nhánh short-circuit khi stock của sản phẩm bằng null.
     * Dữ liệu kiểm tra: Product tồn tại nhưng product.getStock() trả về null.
     * Kết quả mong đợi:
     * - Ném IllegalArgumentException vì không đủ tồn kho.
     * - Không cập nhật sản phẩm.
     */

    @Test
    @DisplayName("WB-ORDER-005 - placeOrder null stock follows first short-circuit branch")
    void placeOrder_nullStock_throwsIllegalArgument() {
        Product product = product(10L, "RTX", 1, "100000");
        product.setStock(null);

        when(userRepository.findByUsername("order_user")).thenReturn(Optional.of(currentUser));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.placeOrder(directOrderRequest("A", "0912345678", 10L, 1), "order_user")
        );

        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(productRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra nhánh số lượng đặt lớn hơn số lượng tồn kho.
     * Dữ liệu kiểm tra: Tồn kho bằng 1 nhưng user đặt 2 sản phẩm.
     * Kết quả mong đợi:
     * - Ném IllegalArgumentException.
     * - Không lưu Order.
     */

    @Test
    @DisplayName("WB-ORDER-006 - placeOrder quantity exceeds stock follows second stock branch")
    void placeOrder_insufficientStock_throwsIllegalArgument() {
        Product product = product(10L, "RTX", 1, "100000");

        when(userRepository.findByUsername("order_user")).thenReturn(Optional.of(currentUser));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.placeOrder(directOrderRequest("A", "0912345678", 10L, 2), "order_user")
        );

        assertTrue(exception.getMessage().contains("Available: 1"));
        verify(orderRepository, never()).save(any());
    }

    // ---------------------------------------------------------------------
    // History path + branches in mapping
    // ---------------------------------------------------------------------
    /*
     * Mục tiêu: Kiểm tra luồng lấy lịch sử đơn hàng của user.
     * Dữ liệu kiểm tra: Một Order có thời gian tạo và một OrderItem.
     * Kết quả mong đợi:
     * - Ánh xạ đúng itemCount, productIds và createdAt.
     * - Danh sách lịch sử có đúng một phần tử.
     */

    @Test
    @DisplayName("WB-ORDER-007 - getUserOrders maps item count product IDs and created time")
    void getUserOrders_existingHistory_mapsOrderData() {
        Product product = product(10L, "RTX", 5, "100000");
        Order order = order(100L, currentUser, OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.of(2026, 7, 2, 10, 30));
        order.getItems().add(orderItem(order, product, 2));

        when(userRepository.findByUsername("order_user")).thenReturn(Optional.of(currentUser));
        when(orderRepository.findByUserIdOrderByIdDesc(1L)).thenReturn(List.of(order));

        List<Map<String, Object>> history = orderService.getUserOrders("order_user");

        assertEquals(1, history.size());
        assertEquals(1, history.get(0).get("itemCount"));
        assertEquals(List.of(10L), history.get(0).get("productIds"));
        assertEquals("2026-07-02T10:30", history.get(0).get("createdAt"));
    }
    /*
     * Mục tiêu: Kiểm tra các nhánh null trong quá trình ánh xạ lịch sử đơn hàng.
     * Dữ liệu kiểm tra: Order có items = null và createdAt = null.
     * Kết quả mong đợi:
     * - itemCount bằng 0.
     * - productIds là danh sách rỗng.
     * - createdAt là chuỗi rỗng.
     */

    @Test
    @DisplayName("WB-ORDER-008 - getUserOrders handles null items and null createdAt")
    void getUserOrders_nullItems_returnsEmptyMappingValues() {
        Order order = order(101L, currentUser, OrderStatus.PENDING);
        order.setItems(null);
        order.setCreatedAt(null);

        when(userRepository.findByUsername("order_user")).thenReturn(Optional.of(currentUser));
        when(orderRepository.findByUserIdOrderByIdDesc(1L)).thenReturn(List.of(order));

        List<Map<String, Object>> history = orderService.getUserOrders("order_user");

        assertEquals(0, history.get(0).get("itemCount"));
        assertEquals(List.of(), history.get(0).get("productIds"));
        assertEquals("", history.get(0).get("createdAt"));
    }
    /*
     * Mục tiêu: Kiểm tra đường ngoại lệ khi lấy lịch sử của user không tồn tại.
     * Nhánh kiểm tra: userRepository không tìm thấy username.
     * Kết quả mong đợi:
     * - Ném ResourceNotFoundException.
     * - Không gọi OrderRepository để lấy lịch sử.
     */

    @Test
    @DisplayName("WB-ORDER-009 - getUserOrders user does not exist follows exception path")
    void getUserOrders_userNotFound_throwsResourceNotFound() {
        when(userRepository.findByUsername("missing_user")).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.getUserOrders("missing_user")
        );

        assertEquals("User not found: missing_user", exception.getMessage());
        verify(orderRepository, never()).findByUserIdOrderByIdDesc(anyLong());
    }

    // ---------------------------------------------------------------------
    // Checkout path + data-flow testing from CartItem to OrderItem
    // ---------------------------------------------------------------------
    /*
     * Mục tiêu: Kiểm tra toàn bộ luồng checkout từ Cart sang Order.
     * Dữ liệu kiểm tra: Cart có hai sản phẩm với giá và số lượng khác nhau.
     * Kết quả mong đợi:
     * - CartItem được chuyển đúng thành OrderItem.
     * - Tổng tiền và tồn kho được cập nhật chính xác.
     * - CartItem bị đánh dấu deleted và Cart được làm rỗng sau khi đặt hàng.
     */

    @Test
    @DisplayName("WB-ORDER-010 - createOrderFromCart copies cart data saves order and clears cart")
    void createOrderFromCart_validCart_copiesDataAndClearsCart() {
        Product productA = product(10L, "RTX A", 10, "100000");
        Product productB = product(11L, "RTX B", 8, "250000");
        Cart cart = cart(currentUser);
        CartItem itemA = cartItem(cart, productA, 2);
        CartItem itemB = cartItem(cart, productB, 1);
        cart.getCartItems().addAll(List.of(itemA, itemB));

        CreateOrderRequest request = checkoutRequest("123 Nguyen Hue", "0912345678", "Call first");

        when(cartRepository.findByUser_IdAndDeletedFalse(1L)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(200L);
            return saved;
        });
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.createOrderFromCart(request);

        assertEquals(200L, response.getOrderId());
        assertEquals(new BigDecimal("450000"), response.getTotalAmount());
        assertEquals(2, response.getItems().size());
        assertEquals(8, productA.getStock());
        assertEquals(7, productB.getStock());
        assertTrue(itemA.isDeleted());
        assertTrue(itemB.isDeleted());
        assertTrue(cart.getCartItems().isEmpty());
        assertEquals(BigDecimal.ZERO, cart.getTotalAmount());

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();
        assertEquals("Order User", savedOrder.getFullName());
        assertEquals("Call first", savedOrder.getNote());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals(PaymentStatus.UNPAID, savedOrder.getPaymentStatus());
        assertEquals(2, savedOrder.getItems().size());
        assertEquals(2, savedOrder.getItems().get(0).getQuantity());
        assertEquals(new BigDecimal("100000"), savedOrder.getItems().get(0).getPrice());
        verify(productRepository).save(productA);
        verify(productRepository).save(productB);
        verify(cartRepository).save(cart);
    }
    /*
     * Mục tiêu: Kiểm tra đường ngoại lệ khi current user chưa có Cart.
     * Nhánh kiểm tra: cartRepository trả về Optional.empty().
     * Kết quả mong đợi:
     * - Ném ResourceNotFoundException với thông báo Cart not found.
     * - Không lưu Order.
     */

    @Test
    @DisplayName("WB-ORDER-011 - createOrderFromCart cart does not exist follows exception path")
    void createOrderFromCart_cartNotFound_throwsResourceNotFound() {
        when(cartRepository.findByUser_IdAndDeletedFalse(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.createOrderFromCart(checkoutRequest("Address", "0912345678", null))
        );

        assertEquals("Cart not found", exception.getMessage());
        verify(orderRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra nhánh checkout với giỏ hàng rỗng.
     * Dữ liệu kiểm tra: Cart tồn tại nhưng không có CartItem.
     * Kết quả mong đợi:
     * - Ném IllegalArgumentException với thông báo Cart is empty.
     * - Không tạo Order mới.
     */

    @Test
    @DisplayName("WB-ORDER-012 - createOrderFromCart empty cart follows empty-order branch")
    void createOrderFromCart_emptyCart_throwsIllegalArgument() {
        Cart cart = cart(currentUser);
        when(cartRepository.findByUser_IdAndDeletedFalse(1L)).thenReturn(Optional.of(cart));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.createOrderFromCart(checkoutRequest("Address", "0912345678", null))
        );

        assertEquals("Cart is empty", exception.getMessage());
        verify(orderRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra đường ngoại lệ khi sản phẩm trong Cart không đủ tồn kho.
     * Dữ liệu kiểm tra: Tồn kho bằng 1 nhưng CartItem có quantity bằng 2.
     * Kết quả mong đợi:
     * - Ném IllegalArgumentException.
     * - Tồn kho không thay đổi và Order không được lưu.
     */

    @Test
    @DisplayName("WB-ORDER-013 - createOrderFromCart stock is insufficient follows exception path")
    void createOrderFromCart_insufficientStock_throwsIllegalArgument() {
        Product product = product(10L, "RTX", 1, "100000");
        Cart cart = cart(currentUser);
        cart.getCartItems().add(cartItem(cart, product, 2));

        when(cartRepository.findByUser_IdAndDeletedFalse(1L)).thenReturn(Optional.of(cart));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.createOrderFromCart(checkoutRequest("Address", "0912345678", null))
        );

        assertEquals("Insufficient stock for 'RTX'", exception.getMessage());
        assertEquals(1, product.getStock());
        verify(orderRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra các giá trị fallback khi note bằng null và fullName rỗng.
     * Nhánh kiểm tra:
     * - fullName rỗng thì dùng username.
     * - note null thì dùng chuỗi rỗng.
     * Kết quả mong đợi: OrderResponse chứa đúng các giá trị mặc định.
     */

    @Test
    @DisplayName("WB-ORDER-014 - createOrderFromCart null note and blank full name use fallback values")
    void createOrderFromCart_nullNoteAndBlankFullName_usesDefaults() {
        currentUser.setFullName("");
        Product product = product(10L, "RTX", 5, "100000");
        Cart cart = cart(currentUser);
        cart.getCartItems().add(cartItem(cart, product, 1));

        when(cartRepository.findByUser_IdAndDeletedFalse(1L)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(201L);
            return saved;
        });
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.createOrderFromCart(
                checkoutRequest("Address", "0912345678", null)
        );

        assertEquals("order_user", response.getFullName());
        assertEquals("", response.getNote());
    }

    // ---------------------------------------------------------------------
    // Owner branch + order detail + payment repository branch
    // ---------------------------------------------------------------------
    /*
     * Mục tiêu: Kiểm tra user xem chi tiết đơn hàng thuộc đúng quyền sở hữu.
     * Dữ liệu kiểm tra: Order thuộc current user và có Payment COD mới nhất.
     * Kết quả mong đợi:
     * - Trả đúng OrderResponse.
     * - Payment method, email và danh sách sản phẩm được ánh xạ chính xác.
     */

    @Test
    @DisplayName("WB-ORDER-015 - getOrderById correct owner returns detail and latest payment method")
    void getOrderById_correctOwner_returnsOrderWithPaymentMethod() {
        Order order = order(300L, currentUser, OrderStatus.CONFIRMED);
        Product product = product(10L, "RTX", 5, "100000");
        order.getItems().add(orderItem(order, product, 1));

        Payment payment = new Payment();
        payment.setPaymentMethod(PaymentMethod.COD);

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(300L, 1L)).thenReturn(Optional.of(order));
        when(paymentRepository.findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(300L))
                .thenReturn(Optional.of(payment));

        OrderResponse response = orderService.getOrderById(300L);

        assertEquals(300L, response.getOrderId());
        assertEquals("COD", response.getPaymentMethod());
        assertEquals("order_user@example.com", response.getEmail());
        assertEquals(1, response.getItems().size());
    }
    /*
     * Mục tiêu: Kiểm tra nhánh order không tồn tại hoặc không thuộc current user.
     * Nhánh kiểm tra: findByIdAndUser_IdAndDeletedFalse trả về Optional.empty().
     * Kết quả mong đợi: Ném ResourceNotFoundException với thông báo Order not found.
     */

    @Test
    @DisplayName("WB-ORDER-016 - getOrderById wrong owner or missing ID follows not-found branch")
    void getOrderById_wrongOwnerOrMissingOrder_throwsResourceNotFound() {
        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(999L, 1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.getOrderById(999L)
        );

        assertEquals("Order not found", exception.getMessage());
    }
    /*
     * Mục tiêu: Kiểm tra đường exception khi PaymentRepository gặp lỗi.
     * Nhánh kiểm tra: Repository ném RuntimeException trong lúc lấy payment.
     * Kết quả mong đợi:
     * - Lỗi payment được giữ bên trong service.
     * - OrderResponse vẫn được trả về với paymentMethod = UNKNOWN.
     */

    @Test
    @DisplayName("WB-ORDER-017 - getOrderById payment lookup exception is contained and returns UNKNOWN")
    void getOrderById_paymentRepositoryFails_returnsUnknownPaymentMethod() {
        Order order = order(301L, currentUser, OrderStatus.PENDING);
        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(301L, 1L)).thenReturn(Optional.of(order));
        when(paymentRepository.findFirstByOrder_IdAndDeletedFalseOrderByIdDesc(301L))
                .thenThrow(new RuntimeException("payment database error"));

        OrderResponse response = orderService.getOrderById(301L);

        assertEquals("UNKNOWN", response.getPaymentMethod());
    }

    // ---------------------------------------------------------------------
    // State transition testing for user cancellation
    // ---------------------------------------------------------------------
    /*
     * Mục tiêu: Kiểm tra chuyển trạng thái PENDING sang CANCEL_REQUESTED.
     * Dữ liệu kiểm tra: User gửi lý do hủy cho đơn đang PENDING.
     * Kết quả mong đợi:
     * - Trạng thái đổi thành CANCEL_REQUESTED.
     * - Lý do hủy được nối thêm vào note cũ.
     */

    @Test
    @DisplayName("WB-ORDER-018 - cancelOrder PENDING with reason moves to CANCEL_REQUESTED")
    void cancelOrder_pendingWithReason_movesToCancelRequested() {
        Order order = order(400L, currentUser, OrderStatus.PENDING);
        order.setNote("Old note");

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(400L, 1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        OrderResponse response = orderService.cancelOrder(400L, "Wrong address");

        assertEquals(OrderStatus.CANCEL_REQUESTED, response.getStatus());
        assertEquals("Old note | [CANCEL REASON]: Wrong address", order.getNote());
    }
    /*
     * Mục tiêu: Kiểm tra chuyển trạng thái CONFIRMED sang CANCEL_REQUESTED khi không có lý do.
     * Dữ liệu kiểm tra: reason chỉ gồm khoảng trắng.
     * Kết quả mong đợi:
     * - Trạng thái vẫn được đổi thành CANCEL_REQUESTED.
     * - Note không bị thêm nội dung lý do rỗng.
     */

    @Test
    @DisplayName("WB-ORDER-019 - cancelOrder CONFIRMED without reason still moves to CANCEL_REQUESTED")
    void cancelOrder_confirmedWithoutReason_movesToCancelRequested() {
        Order order = order(401L, currentUser, OrderStatus.CONFIRMED);

        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(401L, 1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        OrderResponse response = orderService.cancelOrder(401L, "   ");

        assertEquals(OrderStatus.CANCEL_REQUESTED, response.getStatus());
        assertEquals("", order.getNote());
    }
    /*
     * Mục tiêu: Kiểm tra đường chuyển trạng thái không hợp lệ khi đơn đang SHIPPING.
     * Nhánh kiểm tra: User chỉ được hủy khi trạng thái là PENDING hoặc CONFIRMED.
     * Kết quả mong đợi:
     * - Ném IllegalArgumentException.
     * - Order không được lưu lại.
     */

    @Test
    @DisplayName("WB-ORDER-020 - cancelOrder SHIPPING follows invalid-state exception path")
    void cancelOrder_shipping_throwsIllegalArgument() {
        Order order = order(402L, currentUser, OrderStatus.SHIPPING);
        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(402L, 1L)).thenReturn(Optional.of(order));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.cancelOrder(402L, "Too late")
        );

        assertEquals("Order can only be cancelled when PENDING or CONFIRMED", exception.getMessage());
        verify(orderRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra user hủy order sai ID hoặc order không thuộc quyền sở hữu.
     * Nhánh kiểm tra: Repository không tìm thấy order theo cả orderId và userId.
     * Kết quả mong đợi: Ném ResourceNotFoundException.
     */

    @Test
    @DisplayName("WB-ORDER-021 - cancelOrder wrong owner or invalid ID follows not-found path")
    void cancelOrder_wrongOwnerOrInvalidId_throwsResourceNotFound() {
        when(orderRepository.findByIdAndUser_IdAndDeletedFalse(999L, 1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.cancelOrder(999L, "Reason")
        );

        assertEquals("Order not found", exception.getMessage());
    }

    // ---------------------------------------------------------------------
    // Admin state updates + switch/branch coverage
    // ---------------------------------------------------------------------
    /*
     * Mục tiêu: Kiểm tra Admin chuyển trạng thái PENDING sang CONFIRMED.
     * Kết quả mong đợi:
     * - confirmedAt được ghi nhận.
     * - paymentStatus được chuyển sang PAID.
     * - OrderResponse trả về trạng thái CONFIRMED.
     */

    @Test
    @DisplayName("WB-ORDER-022 - updateOrderStatus CONFIRMED stamps time and marks payment paid")
    void updateOrderStatus_confirmed_setsConfirmedTimeAndPaid() {
        Order order = order(500L, currentUser, OrderStatus.PENDING);
        when(orderRepository.findByIdAndDeletedFalse(500L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        OrderResponse response = orderService.updateOrderStatus(500L, statusRequest(OrderStatus.CONFIRMED));

        assertEquals(OrderStatus.CONFIRMED, response.getStatus());
        assertEquals(PaymentStatus.PAID, response.getPaymentStatus());
        assertNotNull(order.getConfirmedAt());
    }
    /*
     * Mục tiêu: Kiểm tra chuyển trạng thái CONFIRMED sang SHIPPING khi payment đang UNPAID.
     * Kết quả mong đợi:
     * - shippedAt được ghi nhận.
     * - paymentStatus được chuyển từ UNPAID sang PAID.
     */

    @Test
    @DisplayName("WB-ORDER-023 - updateOrderStatus SHIPPING changes UNPAID to PAID")
    void updateOrderStatus_shippingFromUnpaid_setsShippedTimeAndPaid() {
        Order order = order(501L, currentUser, OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        when(orderRepository.findByIdAndDeletedFalse(501L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        OrderResponse response = orderService.updateOrderStatus(501L, statusRequest(OrderStatus.SHIPPING));

        assertEquals(OrderStatus.SHIPPING, response.getStatus());
        assertEquals(PaymentStatus.PAID, response.getPaymentStatus());
        assertNotNull(order.getShippedAt());
    }
    /*
     * Mục tiêu: Kiểm tra nhánh SHIPPING khi payment đã ở trạng thái PAID.
     * Kết quả mong đợi:
     * - paymentStatus vẫn giữ nguyên PAID.
     * - shippedAt được cập nhật.
     */

    @Test
    @DisplayName("WB-ORDER-024 - updateOrderStatus SHIPPING keeps an already PAID payment")
    void updateOrderStatus_shippingFromPaid_keepsPaymentPaid() {
        Order order = order(502L, currentUser, OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.PAID);
        when(orderRepository.findByIdAndDeletedFalse(502L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        orderService.updateOrderStatus(502L, statusRequest(OrderStatus.SHIPPING));

        assertEquals(PaymentStatus.PAID, order.getPaymentStatus());
        assertNotNull(order.getShippedAt());
    }
    /*
     * Mục tiêu: Kiểm tra chuyển trạng thái SHIPPING sang DELIVERED.
     * Dữ liệu kiểm tra: Order đang SHIPPING và payment đang UNPAID.
     * Kết quả mong đợi:
     * - deliveredAt được ghi nhận.
     * - paymentStatus được chuyển sang PAID.
     */

    @Test
    @DisplayName("WB-ORDER-025 - updateOrderStatus DELIVERED stamps time and pays unpaid order")
    void updateOrderStatus_delivered_setsDeliveredTimeAndPaid() {
        Order order = order(503L, currentUser, OrderStatus.SHIPPING);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        when(orderRepository.findByIdAndDeletedFalse(503L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        OrderResponse response = orderService.updateOrderStatus(503L, statusRequest(OrderStatus.DELIVERED));

        assertEquals(OrderStatus.DELIVERED, response.getStatus());
        assertEquals(PaymentStatus.PAID, response.getPaymentStatus());
        assertNotNull(order.getDeliveredAt());
    }
    /*
     * Mục tiêu: Kiểm tra lần đầu Admin chuyển đơn sang CANCELLED.
     * Dữ liệu kiểm tra: Order đang CANCEL_REQUESTED và có một OrderItem quantity = 2.
     * Kết quả mong đợi:
     * - Số lượng sản phẩm được hoàn lại tồn kho.
     * - ProductRepository được gọi để lưu sản phẩm.
     */

    @Test
    @DisplayName("WB-ORDER-026 - first transition to CANCELLED restores product stock")
    void updateOrderStatus_firstCancelled_restoresStock() {
        Product product = product(10L, "RTX", 3, "100000");
        Order order = order(504L, currentUser, OrderStatus.CANCEL_REQUESTED);
        order.getItems().add(orderItem(order, product, 2));

        when(orderRepository.findByIdAndDeletedFalse(504L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        orderService.updateOrderStatus(504L, statusRequest(OrderStatus.CANCELLED));

        assertEquals(5, product.getStock());
        verify(productRepository).save(product);
    }
    /*
     * Mục tiêu: Kiểm tra chống hoàn kho hai lần cho đơn đã CANCELLED.
     * Nhánh kiểm tra: oldStatus đã là CANCELLED.
     * Kết quả mong đợi:
     * - Tồn kho không thay đổi.
     * - ProductRepository không được gọi save.
     */

    @Test
    @DisplayName("WB-ORDER-027 - repeated CANCELLED update does not restore stock twice")
    void updateOrderStatus_alreadyCancelled_doesNotRestoreStockAgain() {
        Product product = product(10L, "RTX", 5, "100000");
        Order order = order(505L, currentUser, OrderStatus.CANCELLED);
        order.getItems().add(orderItem(order, product, 2));

        when(orderRepository.findByIdAndDeletedFalse(505L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        orderService.updateOrderStatus(505L, statusRequest(OrderStatus.CANCELLED));

        assertEquals(5, product.getStock());
        verify(productRepository, never()).save(any());
    }
    /*
     * Mục tiêu: Kiểm tra đường ngoại lệ khi Admin cập nhật orderId không tồn tại.
     * Nhánh kiểm tra: orderRepository trả về Optional.empty().
     * Kết quả mong đợi:
     * - Ném ResourceNotFoundException.
     * - Không lưu Order.
     */

    @Test
    @DisplayName("WB-ORDER-028 - updateOrderStatus invalid order ID follows exception path")
    void updateOrderStatus_orderNotFound_throwsResourceNotFound() {
        when(orderRepository.findByIdAndDeletedFalse(999L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.updateOrderStatus(999L, statusRequest(OrderStatus.CONFIRMED))
        );

        assertEquals("Order not found", exception.getMessage());
        verify(orderRepository, never()).save(any());
    }

    // ---------------------------------------------------------------------
    // Paginated history + pageable direction branch
    // ---------------------------------------------------------------------
    /*
     * Mục tiêu: Kiểm tra lịch sử đơn hàng phân trang của current user theo thứ tự giảm dần.
     * Dữ liệu kiểm tra: sortBy = createdAt và direction = desc.
     * Kết quả mong đợi:
     * - Tổng số lượng sản phẩm trong OrderSummary được tính đúng.
     * - Pageable sử dụng sắp xếp DESC.
     */

    @Test
    @DisplayName("WB-ORDER-029 - getMyOrders returns current user's paginated history in DESC order")
    void getMyOrders_descDirection_mapsSummary() {
        Order order = order(600L, currentUser, OrderStatus.PENDING);
        Product product = product(10L, "RTX", 5, "100000");
        order.getItems().add(orderItem(order, product, 3));
        Page<Order> page = new PageImpl<>(List.of(order));

        when(orderRepository.findByUser_IdAndDeletedFalse(eq(1L), any(Pageable.class))).thenReturn(page);

        Page<OrderSummaryResponse> result = orderService.getMyOrders(0, 10, "createdAt", "desc");

        assertEquals(1, result.getTotalElements());
        assertEquals(3, result.getContent().get(0).getTotalItems());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(orderRepository).findByUser_IdAndDeletedFalse(eq(1L), pageableCaptor.capture());
        assertTrue(pageableCaptor.getValue().getSort().getOrderFor("createdAt").isDescending());
    }
    /*
     * Mục tiêu: Kiểm tra nhánh sắp xếp tăng dần trong trang danh sách đơn hàng Admin.
     * Dữ liệu kiểm tra: sortBy = orderCode và direction = asc.
     * Kết quả mong đợi:
     * - Kết quả trang rỗng được xử lý đúng.
     * - Pageable sử dụng sắp xếp ASC.
     */

    @Test
    @DisplayName("WB-ORDER-030 - getAllOrders ASC direction follows alternative pageable branch")
    void getAllOrders_ascDirection_usesAscendingSort() {
        when(orderRepository.findByDeletedFalse(any(Pageable.class))).thenReturn(Page.empty());

        Page<OrderSummaryResponse> result = orderService.getAllOrders(0, 5, "orderCode", "asc");

        assertTrue(result.isEmpty());
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(orderRepository).findByDeletedFalse(pageableCaptor.capture());
        assertTrue(pageableCaptor.getValue().getSort().getOrderFor("orderCode").isAscending());
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    private User user(Long id, String username, String fullName) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(username + "@example.com");
        user.setDeleted(false);
        return user;
    }

    private Product product(Long id, String name, Integer stock, String price) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setStock(stock);
        product.setPrice(new BigDecimal(price));
        product.setImgUrl(name + ".png");
        product.setDeleted(false);
        return product;
    }

    private Cart cart(User user) {
        Cart cart = new Cart();
        cart.setId(20L);
        cart.setUser(user);
        cart.setCartItems(new ArrayList<>());
        cart.setTotalAmount(BigDecimal.ZERO);
        cart.setDeleted(false);
        return cart;
    }

    private CartItem cartItem(Cart cart, Product product, int quantity) {
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setDeleted(false);
        return item;
    }

    private Order order(Long id, User user, OrderStatus status) {
        Order order = new Order();
        order.setId(id);
        order.setUser(user);
        order.setOrderCode("VGA-TEST-" + id);
        order.setFullName(user.getFullName());
        order.setPhone("0912345678");
        order.setShippingAddress("123 Nguyen Hue");
        order.setNote("");
        order.setStatus(status);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setTotalAmount(new BigDecimal("100000"));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setCreatedAt(LocalDateTime.of(2026, 7, 2, 9, 0));
        order.setItems(new ArrayList<>());
        order.setDeleted(false);
        return order;
    }

    private OrderItem orderItem(Order order, Product product, int quantity) {
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setPrice(product.getPrice());
        item.setDeleted(false);
        return item;
    }

    private OrderRequest directOrderRequest(String fullName, String phone, Long productId, int quantity) {
        OrderRequest.OrderItemRequest item = new OrderRequest.OrderItemRequest();
        item.setProductId(productId);
        item.setQuantity(quantity);

        OrderRequest request = new OrderRequest();
        request.setFullName(fullName);
        request.setPhone(phone);
        request.setAddress("123 Nguyen Hue");
        request.setNote("Test note");
        request.setItems(List.of(item));
        return request;
    }

    private CreateOrderRequest checkoutRequest(String address, String phone, String note) {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setShippingAddress(address);
        request.setPhone(phone);
        request.setNote(note);
        return request;
    }

    private OrderStatusUpdateRequest statusRequest(OrderStatus status) {
        OrderStatusUpdateRequest request = new OrderStatusUpdateRequest();
        request.setStatus(status);
        return request;
    }
}



