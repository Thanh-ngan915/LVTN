package com.example.storeservice.repository;

import com.example.storeservice.entity.StoreSalePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StoreSalePromotionRepository extends JpaRepository<StoreSalePromotion, String> {
    List<StoreSalePromotion> findByStoreIdAndStatus(String storeId, Integer status);
    boolean existsBySalePromotionIdAndStoreId(String salePromotionId, String storeId);
    Optional<StoreSalePromotion> findBySalePromotionId(String salePromotionId);
    Optional<StoreSalePromotion> findByStoreIdAndSalePromotionId(String storeId, String salePromotionId);
}