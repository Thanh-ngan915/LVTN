package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

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

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    @Column(name = "store_id", nullable = false, length = 100)
    private String storeId;

    @Column(name = "total", nullable = false)
    private Float total;

    @Column(name = "discount", nullable = false)
    private Float discount;

    @Column(name = "pay", nullable = false)
    private Float pay;

    @Column(name = "voucher_id")
    private Integer voucherId;

    @Column(name = "shop_voucher_id")
    private String shopVoucherId;

    @Column(name = "shop_discount", nullable = false)
    private Float shopDiscount;

    @Column(name = "delivery_information_id", nullable = false)
    private Integer deliveryInformationId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_information_id", insertable = false, updatable = false)
    private DeliveryInformation deliveryInformation;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    private List<ProductOrder> items;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "payment_method", length = 20)
    private String paymentMethod; // COD, VNPAY

    @Column(name = "payment_status", length = 20)
    private String paymentStatus; // pending, paid

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        if (this.status == null) this.status = "pending";
        if (this.shopDiscount == null) this.shopDiscount = 0f;
        if (this.total == null) this.total = 0f;
        if (this.discount == null) this.discount = 0f;
        if (this.pay == null) this.pay = 0f;
        if (this.paymentMethod == null) this.paymentMethod = "COD";
        if (this.paymentStatus == null) this.paymentStatus = "pending";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}
