package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_promotion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPromotion {
    @Id
    private String id;

    @Column(name = "product_id")
    private String productId;
    @Column(name = "sale_promotion_id")
    private String salePromotionId;
  
    private String name;
    private String image;
    private Integer quantity;
    private Integer bought;

    @Column(name = "price_after")
    private Float priceAfter;

    @Column(name = "is_delete")
    private Boolean isDelete;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

