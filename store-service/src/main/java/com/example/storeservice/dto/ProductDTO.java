package com.example.storeservice.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductDTO {
    private String id;
    private String name;
    private String image;
    private Float priceBefore;
    private String storeId;
    private List<String> imageUrls;
}