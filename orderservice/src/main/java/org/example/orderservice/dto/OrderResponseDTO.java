package org.example.orderservice.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {
    private Integer id;
    private String userId;
    private String storeId;
    private Float total;
    private Float discount;
    private Float pay;
    private Float shippingFee;
    private Integer voucherId;
    private Integer deliveryInformationId;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String createdAt;
    private DeliveryInformationDTO deliveryInformation;
    private VoucherInfoDTO voucherInfo;
    private List<ProductOrderItemDTO> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductOrderItemDTO {
        private Integer productId;
        private String productName;
        private String productImage;
        private String color;
        private String size;
        private Integer quantity;
        private Float priceBefore;
        private Float priceAfter;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VoucherInfoDTO {
        private Integer id;
        private String code;
        private String name;
        private String discountType;
        private Float discountValue;
        private Float maxDiscount;
    }
}
