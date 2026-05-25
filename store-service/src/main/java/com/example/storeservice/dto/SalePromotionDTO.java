package com.example.storeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalePromotionDTO {
    private String id;
    private String title;
    private String description;
    private String type;
    private Integer status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
