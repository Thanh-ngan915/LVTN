package com.example.storeservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductPromotionDTO {
    private String id;
    private String productId;
    private String salePromotionId;
    private String name;
    private String image;
    private Float priceAfter;
    private Integer quantity;
    private Integer bought;
    private Boolean isDelete;
}