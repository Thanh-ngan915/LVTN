package org.example.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_wallet")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserWallet {

    @Id
    private String id;

    @Column(name = "user_id", unique = true)
    private String userId;

    @Column(name = "available_balance")
    private Double availableBalance;

    @Column(name = "total_received")
    private Double totalReceived;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
        this.availableBalance = 0.0;
        this.totalReceived = 0.0;
    }
}