package com.example.storeservice.service;

import com.example.storeservice.dto.ProductPromotionDTO;
import com.example.storeservice.dto.ProductPromotionRequestDTO;
import java.util.List;

public interface ProductPromotionService {
    ProductPromotionDTO addProductToPromotion(String userId, String storeId, String salePromotionId, ProductPromotionRequestDTO request, String accessToken);
    List<ProductPromotionDTO> getProductsByPromotion(String salePromotionId);
    void removeProductFromPromotion(String userId, String storeId, String id);
}