package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "withdrawal_request")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalRequest {
    @Id
    private String id;

    @Column(name = "store_id")
    private String storeId;

    @Column(name = "wallet_id")
    private String walletId;

    private Double amount;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_holder_name")
    private String accountHolderName;

    private String status;
    // PENDING | APPROVED | PROCESSING | COMPLETED | REJECTED

    @Column(name = "reject_reason")
    private String rejectReason;

    @Column(name = "processed_by")
    private String processedBy;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column
    private String vnpayTransactionCode;

    @Column
    private String vnpayFailReason;

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        this.status = "PENDING";
    }
}