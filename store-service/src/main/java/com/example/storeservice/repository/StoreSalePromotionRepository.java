package com.example.storeservice.repository;

import com.example.storeservice.entity.StoreSalePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreSalePromotionRepository extends JpaRepository<StoreSalePromotion, String> {
    List<StoreSalePromotion> findByStoreId(String storeId);
}
