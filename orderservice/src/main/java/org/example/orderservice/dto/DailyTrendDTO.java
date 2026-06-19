package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DailyTrendDTO {
    private String day;
    private Long count;
    private Double averageStars;
}
