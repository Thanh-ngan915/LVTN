package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderFlowDTO {
    private String id;
    private String orderId;
    private String status;
    private String note;
    private String createdBy;
    private String createdAt;
}