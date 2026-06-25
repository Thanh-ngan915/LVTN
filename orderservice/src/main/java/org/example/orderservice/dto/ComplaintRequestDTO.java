// ComplaintRequestDTO.java
package org.example.orderservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequestDTO {
    private Integer orderId;
    private String reason;      // WRONG_ITEM | DAMAGED_ITEM | NOT_RECEIVED | QUALITY_ISSUE | OTHER
    private String description;
    private List<String> images;
}