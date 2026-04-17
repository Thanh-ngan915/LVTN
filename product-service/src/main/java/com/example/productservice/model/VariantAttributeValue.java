package com.example.productservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "variant_attribute_values")
@Data
public class VariantAttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @ManyToOne
    @JoinColumn(name = "attribute_id")
    private Attribute attribute;

    @Column(name = "attribute_value")
    private String value; // Ví dụ: "Red", "L", "Silk"
}
