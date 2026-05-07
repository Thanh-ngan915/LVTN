package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "`order`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "store_id", nullable = false)
    private Integer storeId;

    @Column(name = "total", nullable = false)
    private Float total;

    @Column(name = "discount", nullable = false)
    private Float discount;

    @Column(name = "pay", nullable = false)
    private Float pay;

    @Column(name = "voucher_id")
    private Integer voucherId;

    @Column(name = "delivery_information_id", nullable = false)
    private Integer deliveryInformationId;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        if (this.status == null) this.status = "pending";
        if (this.total == null) this.total = 0f;
        if (this.discount == null) this.discount = 0f;
        if (this.pay == null) this.pay = 0f;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}
