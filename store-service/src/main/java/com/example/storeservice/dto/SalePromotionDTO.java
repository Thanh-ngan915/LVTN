package com.example.storeservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SalePromotionDTO {
    private String id;
    private String title;
    private String description;
    private String type;
    private Integer status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String storeId;
}