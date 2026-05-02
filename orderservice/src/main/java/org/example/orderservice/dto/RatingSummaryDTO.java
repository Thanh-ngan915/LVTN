package org.example.orderservice.dto;

import lombok.*;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingSummaryDTO {
    private Double averageStars;
    private Long totalRatings;
    private Map<Integer, Long> starCounts;
}
