package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "StoreSalePromotion")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StoreSalePromotion {
    @Id
    private String id;
    private String salePromotionId;
    private String storeId;
    private Integer status;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime updateAt;
    private LocalDateTime createdAt;
}