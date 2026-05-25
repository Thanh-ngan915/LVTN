package com.example.storeservice.repository;

import com.example.storeservice.entity.SalePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalePromotionRepository extends JpaRepository<SalePromotion, String> {
}
