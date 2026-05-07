package org.example.productservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.productservice.dto.AddToCartRequest;
import org.example.productservice.dto.ApiResponse;
import org.example.productservice.dto.CartItemDTO;
import org.example.productservice.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Lấy giỏ hàng của user
     * GET /api/cart
     * Header: X-User-Id: userId
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemDTO>>> getCart(
            @RequestHeader(value = "X-User-Id") String userId
    ) {
        List<CartItemDTO> cartItems = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(cartItems, "Lấy giỏ hàng thành công"));
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     * POST /api/cart
     * Header: X-User-Id: userId
     * Body: { "productId": "1", "quantity": 2 }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CartItemDTO>> addToCart(
            @RequestHeader(value = "X-User-Id") String userId,
            @RequestBody AddToCartRequest request
    ) {
        try {
            CartItemDTO cartItem = cartService.addToCart(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(ApiResponse.success(cartItem, "Đã thêm vào giỏ hàng!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     * PUT /api/cart/{cartItemId}
     * Header: X-User-Id: userId
     * Body: { "quantity": 3 }
     */
    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<CartItemDTO>> updateCartItem(
            @PathVariable String cartItemId,
            @RequestBody Map<String, Integer> body,
            @RequestHeader(value = "X-User-Id") String userId
    ) {
        try {
            Integer quantity = body.get("quantity");
            CartItemDTO cartItem = cartService.updateCartItem(cartItemId, quantity, userId);
            return ResponseEntity.ok(ApiResponse.success(cartItem, "Cập nhật giỏ hàng thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * DELETE /api/cart/{cartItemId}
     * Header: X-User-Id: userId
     */
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable String cartItemId,
            @RequestHeader(value = "X-User-Id") String userId
    ) {
        try {
            cartService.removeFromCart(cartItemId, userId);
            return ResponseEntity.ok(ApiResponse.success(null, "Đã xóa khỏi giỏ hàng!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Xóa toàn bộ giỏ hàng
     * DELETE /api/cart
     * Header: X-User-Id: userId
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @RequestHeader(value = "X-User-Id") String userId
    ) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Đã xóa toàn bộ giỏ hàng!"));
    }

    /**
     * Đếm số lượng sản phẩm trong giỏ hàng
     * GET /api/cart/count
     * Header: X-User-Id: userId
     */
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getCartCount(
            @RequestHeader(value = "X-User-Id") String userId
    ) {
        long count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Cart count"));
    }
}
