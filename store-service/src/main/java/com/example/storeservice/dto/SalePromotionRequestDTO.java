package com.example.storeservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SalePromotionRequestDTO {
    private String title;
    private String description;
    private String type;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}