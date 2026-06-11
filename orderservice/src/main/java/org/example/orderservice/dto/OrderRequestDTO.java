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

    // Voucher sàn (store_id IS NULL)
    private Integer platformVoucherId;

    // Voucher của shop (store_id = storeId của đơn)
    private String shopVoucherId;

    // Tương thích ngược: nếu FE cũ gửi voucherId, coi như platformVoucherId
    private Integer voucherId;

    private String paymentMethod; // COD, VNPAY

    // ID của phòng livestream nếu đơn hàng được đặt từ livestream
    private Long livestreamRoomId;

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

