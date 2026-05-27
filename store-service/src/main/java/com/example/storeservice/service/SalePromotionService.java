package com.example.storeservice.service;

import com.example.storeservice.dto.SalePromotionDTO;
import com.example.storeservice.dto.SalePromotionRequestDTO;
import java.util.List;

public interface SalePromotionService {
    SalePromotionDTO createSalePromotion(String userId, String storeId, SalePromotionRequestDTO request);
    List<SalePromotionDTO> getSalePromotionsByStore(String storeId);
    SalePromotionDTO getSalePromotionById(String id);
    SalePromotionDTO updateSalePromotion(String userId, String storeId, String id, SalePromotionRequestDTO request);
    void deleteSalePromotion(String userId, String storeId, String id);
    void restoreSalePromotion(String userId, String storeId, String id);
    List<SalePromotionDTO> getDeletedSalePromotions(String storeId);
}