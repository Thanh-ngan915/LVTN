package com.example.productservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String sku; // Ví dụ: HM-BRACELET-RED-L

    private Double price;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    // QUAN HỆ: Nhiều biến thể thuộc về một sản phẩm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // QUAN HỆ: Một biến thể có nhiều giá trị thuộc tính (Màu: Đỏ, Size: L)
    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL)
    private List<VariantAttributeValue> attributeValues;
}