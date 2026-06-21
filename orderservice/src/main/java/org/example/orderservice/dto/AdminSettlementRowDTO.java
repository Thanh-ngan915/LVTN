package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AdminSettlementRowDTO {
    private String orderId;
    private String storeId;
    private String completedAt;     // = settlement.createdAt
    private Double grossAmount;
    private Double commissionRate;  // tính động: fee/gross*100, không hardcode 5%
    private Double commissionFee;
    private String status;
}