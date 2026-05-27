package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "store_sale_promotion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreSalePromotion {
    @Id
    private String id;

    @Column(name = "sale_promotion_id")
    private String salePromotionId;

    @Column(name = "store_id")
    private String storeId;

    private Integer status;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

