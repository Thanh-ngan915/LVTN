package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ProductPromotion")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductPromotion {
    @Id
    private String id;
    private String productId;
    private String salePromotionId;
    private String name;
    private String image;
    private Float priceAfter;
    private Integer quantity;
    private Integer bought;
    @Column(name = "is_delete")
    private Boolean isDelete;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime updateAt;
    private LocalDateTime createdAt;
}