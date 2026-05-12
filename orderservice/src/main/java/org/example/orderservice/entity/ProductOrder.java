package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productorder")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price_before", nullable = false)
    private Float priceBefore;

    @Column(name = "price_after", nullable = false)
    private Float priceAfter;

    @Column(name = "product_name", length = 500)
    private String productName;

    @Column(name = "product_image", length = 1000)
    private String productImage;

    @Column(name = "color", length = 100)
    private String color;

    @Column(name = "size", length = 50)
    private String size;
}
