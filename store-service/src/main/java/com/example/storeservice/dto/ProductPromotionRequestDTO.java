package com.example.storeservice.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductPromotionRequestDTO {
    private String productId;
    private Float priceAfter;
    private Integer quantity;
}