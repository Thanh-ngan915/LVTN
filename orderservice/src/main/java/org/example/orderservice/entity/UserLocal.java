package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_local")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLocal {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "full_name", columnDefinition = "TEXT")
    private String fullName;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updateAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}
