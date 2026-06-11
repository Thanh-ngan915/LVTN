package org.example.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "token", length = 255, unique = true, nullable = false)
    private String token;

    @Column(name = "username", length = 100, nullable = false)
    private String username;

    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Builder.Default
    @Column(name = "is_used", nullable = false, columnDefinition = "boolean default false")
    private boolean isUsed = false;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}
