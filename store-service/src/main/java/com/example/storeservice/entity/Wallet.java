package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallet")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {
    @Id
    private String id;

    @Column(name = "store_id")
    private String storeId;

    @Column(name = "available_balance")
    private Double availableBalance;

    @Column(name = "pending_balance")
    private Double pendingBalance;

    @Column(name = "reserved_balance")
    private Double reservedBalance;

    @Column(name = "total_earned")
    private Double totalEarned;

    @Column(name = "total_withdrawn")
    private Double totalWithdrawn;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Version
    private Long version;

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        this.availableBalance = 0.0;
        this.pendingBalance = 0.0;
        this.reservedBalance = 0.0;
        this.totalEarned = 0.0;
        this.totalWithdrawn = 0.0;
    }
}