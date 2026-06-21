package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shop_violation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopViolation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "shop_id", length = 100)
    private String shopId;

    @Column(name = "complaint_id", length = 50)
    private String complaintId;

    @Column(name = "order_id")
    private Integer orderId;           // Integer — khớp Order.id

    @Column(name = "violation_points")
    private Integer violationPoints;

    @Column(name = "penalty_amount")
    private Float penaltyAmount;       // Float — khớp với Order.pay

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}