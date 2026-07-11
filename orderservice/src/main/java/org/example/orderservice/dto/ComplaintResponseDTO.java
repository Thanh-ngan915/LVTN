// ComplaintResponseDTO.java
package org.example.orderservice.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponseDTO {
    private String id;
    private Integer orderId;
    private String buyerId;
    private String shopId;
    private String reason;
    private String description;
    private List<String> images;
    private String shopReply;
    private List<String> shopImages;
    private String status;        // PENDING | APPROVED | REJECTED
    private String adminNotes;
    private Boolean isShopFault;
    private String resolvedBy;
    private String createdAt;
    private String resolvedAt;
}