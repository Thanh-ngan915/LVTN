package org.example.orderservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VNPayPaymentResponseDTO {
    /**
     * URL redirect đến trang thanh toán VNPay
     */
    private String paymentUrl;

    /**
     * ID đơn hàng tương ứng
     */
    private Integer orderId;
}
