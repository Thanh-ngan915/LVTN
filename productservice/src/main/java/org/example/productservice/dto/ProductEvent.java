package org.example.productservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEvent {
    private String action; // CREATE, UPDATE, DELETE
    private Integer id;
    private String name;
    private String description;
    private String categoryName;
    private String status;
    private java.util.List<String> imageUrls;
}
