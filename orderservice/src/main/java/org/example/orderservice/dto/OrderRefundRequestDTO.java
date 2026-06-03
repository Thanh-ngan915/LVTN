package org.example.orderservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRefundRequestDTO {
    private String orderId;
    private String title;
    private String description;
    /** Danh sách sản phẩm muốn hoàn */
    private List<ProductRefundItemDTO> products;

    @Data
    public static class ProductRefundItemDTO {
        private String productId;
        private Integer quantity;
        private String description;
    }
}