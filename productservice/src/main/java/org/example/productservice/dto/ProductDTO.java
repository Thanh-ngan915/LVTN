package org.example.productservice.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Integer id;
    private String name;
    private Float priceBefore;
    private Float priceAfter;
    private Integer initQuantity;
    private Integer currentQuantity;
    private Integer sold;
    private String description;
    private String status;
    private String categoryShortname;
    private String categoryName;
    private String storeId;
    private Double rate;
    private List<String> imageUrls;
    private List<VariantDTO> variants;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VariantDTO {
        private Integer id;
        private String size;
        private String color;
        private Float priceBefore;
        private Float priceAfter;
        private Integer currentQuantity;
        private Integer sold;
        private String sku;
    }
}
