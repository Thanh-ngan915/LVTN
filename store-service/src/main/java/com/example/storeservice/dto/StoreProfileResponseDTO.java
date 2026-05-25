package com.example.storeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreProfileResponseDTO {
    private StoreDTO store;
    
    // UI Stats (can be populated by feign clients later)
    @Builder.Default
    private int productCount = 0;
    
    @Builder.Default
    private int followerCount = 0;
    
    @Builder.Default
    private double rating = 0.0;
    
    @Builder.Default
    private double responseRate = 0.0;

    private List<VoucherDTO> vouchers;
    private List<SalePromotionDTO> promotions;
}
