package com.example.storeservice.repository;

import com.example.storeservice.entity.ProductPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, String> {
    List<ProductPromotion> findBySalePromotionIdAndIsDelete(String salePromotionId, Boolean isDelete);
    boolean existsByProductIdAndSalePromotionId(String productId, String salePromotionId);
    boolean existsByProductIdAndSalePromotionIdAndIsDelete(String productId, String salePromotionId, Boolean isDelete);
}