package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class SellerOrderStatsDTO {

    private float totalRevenue;

    private long totalOrders;

    private long pendingCount;
    private long confirmedCount;
    private long shippingCount;
    private long deliveredCount;
    private long completedCount;
    private long cancelledCount;
}