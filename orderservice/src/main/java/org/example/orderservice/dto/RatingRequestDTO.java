package org.example.orderservice.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingRequestDTO {
    private Integer orderId;
    private Integer storeId;
    private Double stars;
    private String comment;
    private List<String> materialUrls;
}
