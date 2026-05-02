package org.example.productservice.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private String id;
    private String userId;
    private String productId;
    private Integer quantity;
    private String createdAt;

    // Thông tin sản phẩm kèm theo
    private String productName;
    private Float priceBefore;
    private Float priceAfter;
    private String productImage;
    private String categoryName;
    private String storeId;
    private String status;
}
