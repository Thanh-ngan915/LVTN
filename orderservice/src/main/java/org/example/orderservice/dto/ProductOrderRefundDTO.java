package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductOrderRefundDTO {
    private String id;
    private String orderRefundId;
    private String productId;
    private Integer quantity;
    private String description;
}