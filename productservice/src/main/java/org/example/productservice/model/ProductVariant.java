package org.example.productservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Entity
@Table(name = "ProductVariant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "size", length = 50)
    private String size;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "price_before")
    private Float priceBefore;

    @Column(name = "price_after")
    private Float priceAfter;

    @Column(name = "init_quantity")
    private Integer initQuantity;

    @Column(name = "current_quantity")
    private Integer currentQuantity;

    @Column(name = "sold")
    private Integer sold;

    @Column(name = "sku", length = 100)
    private String sku;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;
}
