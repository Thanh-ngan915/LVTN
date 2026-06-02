package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productorderrefund")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductOrderRefund {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "order_refund_id", length = 50, nullable = false)
    private String orderRefundId;

    @Column(name = "product_id", length = 50)
    private String productId;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "description", length = 50)
    private String description;
}