package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "SalePromotion")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SalePromotion {
    @Id
    private String id;
    private String title;
    private String description;
    private String type;
    private Integer status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime updateAt;
    private LocalDateTime createdAt;
}