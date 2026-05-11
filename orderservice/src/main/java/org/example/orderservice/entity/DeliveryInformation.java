package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveryinformation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    @Column(name = "recipient_name", length = 200)
    private String recipientName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "province", length = 200)
    private String province;

    @Column(name = "district", length = 200)
    private String district;

    @Column(name = "ward", length = 200)
    private String ward;

    @Column(name = "address_detail", columnDefinition = "TEXT")
    private String addressDetail;

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isDefault == null) this.isDefault = false;
    }
}
