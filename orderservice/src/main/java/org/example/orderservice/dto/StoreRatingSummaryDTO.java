package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class StoreRatingSummaryDTO {
    private Double averageStars;
    private Long totalRatings;
    private Map<Integer, Long> starCounts;
    private Long repliedCount;
    private Long pendingCount;
    private Double repliedRate;
    private Long commentCount;
    private Double commentRate;
    private Long lowStarPendingCount;       // 1-2 sao chưa phản hồi
    private List<DailyTrendDTO> dailyTrend; // 30 ngày gần nhất
}
