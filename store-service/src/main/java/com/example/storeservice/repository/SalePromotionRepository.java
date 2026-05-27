package com.example.storeservice.repository;

import com.example.storeservice.entity.SalePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SalePromotionRepository extends JpaRepository<SalePromotion, String> {
}