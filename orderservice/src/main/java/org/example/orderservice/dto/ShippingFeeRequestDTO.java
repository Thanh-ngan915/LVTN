package org.example.orderservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingFeeRequestDTO {
    /** Địa chỉ chi tiết người nhận */
    private String pickAddress;    // Địa chỉ shop (lấy từ store-service)
    private String pickProvince;   // Tỉnh/thành của shop
    private String pickDistrict;   // Quận/huyện của shop
    private String pickWard;       // Phường/xã của shop (optional)

    private String address;        // Địa chỉ chi tiết người nhận
    private String province;       // Tỉnh/thành người nhận
    private String district;       // Quận/huyện người nhận
    private String ward;           // Phường/xã người nhận

    /** ID shop để lấy địa chỉ pickup tự động */
    private String storeId;

    /** Cân nặng hàng (gram), mặc định 500g */
    private Integer weight;

    /** Giá trị đơn hàng (để tính bảo hiểm) */
    private Float value;
}
