package com.example.storeservice.repository;

import com.example.storeservice.entity.ProductPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, String> {
    List<ProductPromotion> findBySalePromotionIdAndIsDelete(String salePromotionId, Boolean isDelete);
    boolean existsByProductIdAndSalePromotionId(String productId, String salePromotionId);
    boolean existsByProductIdAndSalePromotionIdAndIsDelete(String productId, String salePromotionId, Boolean isDelete);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(pp) FROM ProductPromotion pp JOIN SalePromotion sp ON pp.salePromotionId = sp.id " +
           "WHERE pp.productId = :productId AND pp.isDelete = false " +
           "AND sp.status != 0 AND sp.startDate <= :endDate AND sp.endDate >= :startDate " +
           "AND sp.id != :currentPromotionId")
    long countOverlappingPromotions(
            @org.springframework.data.repository.query.Param("productId") String productId,
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate,
            @org.springframework.data.repository.query.Param("currentPromotionId") String currentPromotionId);
}