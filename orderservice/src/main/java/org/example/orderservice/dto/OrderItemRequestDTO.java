package org.example.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemRequestDTO {
    private Integer productId;
    private Integer variantId;
    private Integer quantity;
    private Float productPriceBefore;
    private Float productPriceAfter;
    
    // Product metadata
    private String productName;
    private String productImage;
    private String color;
    private String size;
}
