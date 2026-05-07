package org.example.productservice.repository;

import org.example.productservice.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {

    /**
     * Lấy tất cả sản phẩm trong giỏ hàng của user
     */
    List<CartItem> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Tìm sản phẩm cụ thể trong giỏ hàng của user
     */
    Optional<CartItem> findByUserIdAndProductId(String userId, String productId);

    /**
     * Đếm số lượng sản phẩm trong giỏ hàng
     */
    long countByUserId(String userId);

    /**
     * Xóa tất cả sản phẩm trong giỏ hàng của user
     */
    void deleteByUserId(String userId);
}
