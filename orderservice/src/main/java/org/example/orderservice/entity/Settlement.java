package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "settlement")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Settlement {
    @Id
    private String id;

    @Column(name = "order_id")
    private String orderId;

    @Column(name = "store_id")
    private String storeId;

    @Column(name = "gross_amount")
    private Double grossAmount;

    @Column(name = "commission_fee")
    private Double commissionFee;

    @Column(name = "shipping_fee")
    private Double shippingFee;

    @Column(name = "net_amount")
    private Double netAmount;

    private String status;
    // PENDING | SETTLED | FAILED

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        this.status = "PENDING";
    }
}