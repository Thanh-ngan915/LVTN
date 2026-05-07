package com.example.productservice.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private List<String> imageUrls;
    private List<VariantDTO> variants;

    @Data
    public static class VariantDTO {
        private String sku;
        private Double price;
        private Integer stock;
        private Map<String, String> attributes;
    }
}
