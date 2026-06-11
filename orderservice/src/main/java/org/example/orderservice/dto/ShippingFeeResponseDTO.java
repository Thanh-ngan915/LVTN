package org.example.orderservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingFeeResponseDTO {
    /** Phí vận chuyển (đồng) */
    private Float fee;

    /** Phí bảo hiểm */
    private Float insuranceFee;

    /** Tên dịch vụ */
    private String service;

    /** Thời gian dự kiến giao hàng (ngày) */
    private Integer deliveryDays;

    /** Tên dịch vụ để hiển thị */
    private String serviceLabel;

    /** Thông báo từ GHTK (nếu có) */
    private String message;

    /** true nếu tính phí thành công từ GHTK, false nếu dùng phí mặc định */
    private Boolean fromGhtk;
}
