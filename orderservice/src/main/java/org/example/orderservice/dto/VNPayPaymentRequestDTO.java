package org.example.orderservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VNPayPaymentRequestDTO {
    /**
     * ID đơn hàng đã tạo
     */
    private Integer orderId;

    /**
     * Số tiền cần thanh toán (VND, không nhân 100)
     */
    private Long amount;

    /**
     * Thông tin đơn hàng hiển thị trên trang VNPay
     */
    private String orderInfo;

    /**
     * Phương thức: "VNPAY" = cổng chung, "VNPAY_WALLET" = ví VNPay
     */
    private String bankCode; // null | "VNPAYQR"
}
