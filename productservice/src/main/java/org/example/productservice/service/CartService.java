package org.example.productservice.service;

import org.example.productservice.dto.CartItemDTO;

import java.util.List;

public interface CartService {

    /**
     * Lấy giỏ hàng của user
     */
    List<CartItemDTO> getCartByUserId(String userId);

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    CartItemDTO addToCart(String userId, String productId, Integer quantity);

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    CartItemDTO updateCartItem(String cartItemId, Integer quantity, String userId);

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    void removeFromCart(String cartItemId, String userId);

    /**
     * Xóa toàn bộ giỏ hàng
     */
    void clearCart(String userId);

    /**
     * Đếm số lượng sản phẩm trong giỏ hàng
     */
    long getCartItemCount(String userId);
}
