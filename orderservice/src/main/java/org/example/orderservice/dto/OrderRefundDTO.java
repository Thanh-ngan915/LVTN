package org.example.orderservice.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OrderRefundDTO {
    private String id;
    private String orderId;
    private String status;          // pending | approved | rejected
    private String title;
    private String description;
    private String createdBy;
    private String createdAt;
    private List<ProductOrderRefundDTO> products;
}