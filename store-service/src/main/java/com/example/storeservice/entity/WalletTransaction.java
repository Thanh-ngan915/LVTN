package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallet_transaction")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction {
    @Id
    private String id;

    @Column(name = "wallet_id")
    private String walletId;

    private String type;
    // ORDER_RECEIVED | WITHDRAWAL | REFUND_DEDUCT

    private Double amount;

    private String direction;
    // IN | OUT

    @Column(name = "balance_before")
    private Double balanceBefore;

    @Column(name = "balance_after")
    private Double balanceAfter;

    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "reference_type")
    private String referenceType;
    // ORDER | WITHDRAWAL | REFUND

    private String note;

    private String status;
    // COMPLETED | FAILED

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
    }
}