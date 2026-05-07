package org.example.productservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.productservice.dto.CartItemDTO;
import org.example.productservice.model.CartItem;
import org.example.productservice.model.Product;
import org.example.productservice.model.ProductImage;
import org.example.productservice.repository.CartItemRepository;
import org.example.productservice.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CartItemDTO> getCartByUserId(String userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return cartItems.stream()
                .map(this::toCartItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CartItemDTO addToCart(String userId, String productId, Integer quantity) {
        if (quantity == null || quantity < 1) {
            quantity = 1;
        }

        // Kiểm tra sản phẩm tồn tại
        Optional<Product> productOpt = productRepository.findById(Integer.parseInt(productId));
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }

        Product product = productOpt.get();
        if (product.getCurrentQuantity() != null && product.getCurrentQuantity() < quantity) {
            throw new RuntimeException("Sản phẩm không đủ số lượng trong kho");
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId);

        CartItem cartItem;
        if (existingItem.isPresent()) {
            // Nếu đã có → cộng thêm số lượng
            cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;

            if (product.getCurrentQuantity() != null && product.getCurrentQuantity() < newQuantity) {
                throw new RuntimeException("Tổng số lượng vượt quá hàng tồn kho (còn " + product.getCurrentQuantity() + " sản phẩm)");
            }

            cartItem.setQuantity(newQuantity);
            cartItem = cartItemRepository.save(cartItem);
            log.info("Updated cart item: userId={}, productId={}, newQuantity={}", userId, productId, newQuantity);
        } else {
            // Nếu chưa có → tạo mới
            cartItem = CartItem.builder()
                    .id("cart-" + UUID.randomUUID().toString().substring(0, 8))
                    .userId(userId)
                    .productId(productId)
                    .quantity(quantity)
                    .build();
            cartItem = cartItemRepository.save(cartItem);
            log.info("Added to cart: userId={}, productId={}, quantity={}", userId, productId, quantity);
        }

        return toCartItemDTO(cartItem);
    }

    @Override
    @Transactional
    public CartItemDTO updateCartItem(String cartItemId, Integer quantity, String userId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng"));

        // Kiểm tra quyền sở hữu
        if (!cartItem.getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật sản phẩm này");
        }

        if (quantity == null || quantity < 1) {
            throw new RuntimeException("Số lượng phải lớn hơn 0");
        }

        // Kiểm tra tồn kho
        Optional<Product> productOpt = productRepository.findById(Integer.parseInt(cartItem.getProductId()));
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (product.getCurrentQuantity() != null && product.getCurrentQuantity() < quantity) {
                throw new RuntimeException("Sản phẩm không đủ số lượng trong kho (còn " + product.getCurrentQuantity() + ")");
            }
        }

        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);
        log.info("Updated cart quantity: cartItemId={}, quantity={}", cartItemId, quantity);

        return toCartItemDTO(cartItem);
    }

    @Override
    @Transactional
    public void removeFromCart(String cartItemId, String userId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng"));

        if (!cartItem.getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa sản phẩm này");
        }

        cartItemRepository.delete(cartItem);
        log.info("Removed from cart: cartItemId={}, userId={}", cartItemId, userId);
    }

    @Override
    @Transactional
    public void clearCart(String userId) {
        cartItemRepository.deleteByUserId(userId);
        log.info("Cleared cart for userId={}", userId);
    }

    @Override
    public long getCartItemCount(String userId) {
        return cartItemRepository.countByUserId(userId);
    }

    /**
     * Convert CartItem → CartItemDTO kèm thông tin sản phẩm
     */
    private CartItemDTO toCartItemDTO(CartItem cartItem) {
        CartItemDTO.CartItemDTOBuilder builder = CartItemDTO.builder()
                .id(cartItem.getId())
                .userId(cartItem.getUserId())
                .productId(cartItem.getProductId())
                .quantity(cartItem.getQuantity())
                .createdAt(cartItem.getCreatedAt() != null ? cartItem.getCreatedAt().toString() : null);

        // Lấy thông tin sản phẩm
        try {
            Optional<Product> productOpt = productRepository.findById(Integer.parseInt(cartItem.getProductId()));
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                builder.productName(product.getName())
                        .priceBefore(product.getPriceBefore())
                        .priceAfter(product.getPriceAfter())
                        .storeId(product.getStoreId())
                        .status(product.getStatus());

                // Lấy ảnh đầu tiên
                if (product.getImages() != null && !product.getImages().isEmpty()) {
                    builder.productImage(product.getImages().get(0).getUrl());
                }

                // Lấy tên danh mục
                if (product.getCategoryEntity() != null) {
                    builder.categoryName(product.getCategoryEntity().getName());
                }
            }
        } catch (Exception e) {
            log.warn("Could not load product info for productId={}: {}", cartItem.getProductId(), e.getMessage());
        }

        return builder.build();
    }
}
