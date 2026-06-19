package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "order_complaint")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "order_id", nullable = false)
    private Integer orderId;          // khớp với Order.id (Integer)

    @Column(name = "buyer_id", nullable = false, length = 100)
    private String buyerId;           // khớp với Order.userId

    @Column(name = "shop_id", nullable = false, length = 100)
    private String shopId;            // khớp với Order.storeId

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false, length = 30)
    private ComplaintReason reason;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "order_complaint_image",
            joinColumns = @JoinColumn(name = "complaint_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> images;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ComplaintStatus status;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "resolved_by", length = 100)
    private String resolvedBy;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "update_at")           // theo convention update_at của bạn
    private LocalDateTime updateAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updateAt  = LocalDateTime.now();
        if (this.status == null) this.status = ComplaintStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }

    public enum ComplaintReason {
        WRONG_ITEM, DAMAGED_ITEM, NOT_RECEIVED, QUALITY_ISSUE, OTHER
    }

    public enum ComplaintStatus {
        PENDING, APPROVED, REJECTED
    }
}