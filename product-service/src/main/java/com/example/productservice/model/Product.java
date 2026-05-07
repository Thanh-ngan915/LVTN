package com.example.productservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @Column(length = 50)
    private String id;

    private String name;
    private String description;

    @Column(name = "price_before")
    private Double priceBefore;

    @Column(name = "price_after")
    private Double priceAfter;

    @Column(name = "current_quantity")
    private Integer currentQuantity;

    private String status;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;

    // QUAN HỆ: Một sản phẩm có nhiều ảnh
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images;
}
