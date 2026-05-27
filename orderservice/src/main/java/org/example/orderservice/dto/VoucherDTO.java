package org.example.orderservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherDTO {
    private String id;
    private String code;
    private String name;
    private String description;
    private String discountType;
    private Float discountValue;
    private Float minOrderValue;
    private Float maxDiscount;
    private String storeId;
    private String startDate;
    private String endDate;
    private Integer quantity;
    private Integer usedCount;
    private String status;
    // true = voucher sàn (storeId IS NULL), false = voucher của shop
    private boolean isPlatform;
}

