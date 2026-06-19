package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AdminSettlementStatsDTO {
    private Double totalRevenue;        // tổng giá trị đơn (gross) toàn sàn
    private Double totalCommissionFee;  // tổng phí sàn thu về
    private Long totalCompletedOrders;  // tổng đơn hoàn thành
}