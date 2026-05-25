package com.example.storeservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Integer productId;

    private String name;
    private Float image;
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
