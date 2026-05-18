package com.example.vgashop.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.dto.CartResponse;
import com.example.vgashop.entity.User;
import com.example.vgashop.repository.CartItemRepository;
import com.example.vgashop.repository.CartRepository;
import com.example.vgashop.service.ProductService;
import com.example.vgashop.service.UserService;

import java.util.stream.Collectors;

import com.example.vgashop.dto.AddToCartRequest;
import com.example.vgashop.dto.CartItemResponse;
import com.example.vgashop.dto.UpdateCartItemRequest;
import com.example.vgashop.entity.Cart;
import com.example.vgashop.entity.CartItem;
import com.example.vgashop.entity.Product;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, UserService userService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    // Cart
    @Transactional(readOnly= true)
    public CartResponse getMyCart() {

        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseGet(() -> createNewCartForUser(currentUser));

        return convertToCartResponse(cart);
    }


    private Cart createNewCartForUser(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setTotalAmount(BigDecimal.ZERO);
       return cartRepository.save(cart);
    }

    // Cart
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseGet(() -> createNewCartForUser(currentUser));

        Product product = productRepository.findByIdAndDeleted(request.getProductId(), false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        
        // Validation
        if (product.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Sản phẩm không đủ số lượng trong kho");
        }

        // Cart
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) && !item.isDeleted())
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Cart
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStock()) {
                throw new IllegalArgumentException("Sản phẩm không đủ số lượng trong kho");
            }
            existingItem.setQuantity(newQuantity);
        } else {
            // Create new
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getCartItems().add(newItem);
        }

        cart.recalculateTotal(); // Update existing
        cartRepository.save(cart);
        return convertToCartResponse(cart);
    }

    // Update existing
    @Transactional
    public CartResponse updateCartItem(Long cartItemId, UpdateCartItemRequest request) {
        // Update existing
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        // Validation
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId) && !item.isDeleted())
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy item trong giỏ"));
        // Delete
        if (request.getQuantity() <= 0) {
            cart.getCartItems().remove(cartItem);
        } else {
            // Update existing
            if (request.getQuantity() > cartItem.getProduct().getStock()) {
                throw new IllegalArgumentException("Vượt quá số lượng tồn kho của sản phẩm");
            }
            cartItem.setQuantity(request.getQuantity());
        }

        cart.recalculateTotal(); // Update existing
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    // Delete
    @Transactional
    public CartResponse removeCartItem(Long cartItemId) {
        User currerentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currerentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        
        // Validation
        boolean removed = cart.getCartItems().removeIf(item -> item.getId().equals(cartItemId));

        if (!removed) {
            throw new ResourceNotFoundException("Không tìm thấy item trong giỏ");
        }

        cart.recalculateTotal(); // Update existing
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    // Delete
    @Transactional
    public void clearCart() {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        
        // Retrieve all
        cart.getCartItems().forEach(item -> item.setDeleted(true)); // Retrieve all
        cart.getCartItems().clear(); // Retrieve all
        cart.setTotalAmount(BigDecimal.ZERO); // Total
        cartRepository.save(cart);


        // Delete
        // cartRepository.save(cart);

    }


    public CartResponse convertToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
            .filter(item -> !item.isDeleted()) // Delete
            .map(item -> new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImgUrl(),
                item.getProduct().getPrice(),
                item.getQuantity(),
                item.getSubtotal()
            ))
            .collect(Collectors.toList());

        int totalItems = cart.getCartItems().stream()
            .filter(item -> !item.isDeleted())
            .mapToInt(CartItem::getQuantity)
            .sum();

        return new CartResponse(
            cart.getId(),
            cart.getTotalAmount(),
            totalItems,
            itemResponses
        );
    }
}
