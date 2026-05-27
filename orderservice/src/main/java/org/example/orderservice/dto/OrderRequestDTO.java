package org.example.orderservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {
    private Integer productId;
    private Integer variantId;
    private Integer quantity;
    private String storeId;
    private Float productPriceBefore;
    private Float productPriceAfter;
    private Integer voucherId;
    private String paymentMethod; // COD, VNPAY

    // Product metadata
    private String productName;
    private String productImage;
    private String color;
    private String size;

    // Delivery info
    private String recipientName;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String addressDetail;

    // Multi-item support
    private java.util.List<OrderItemRequestDTO> items;
}
