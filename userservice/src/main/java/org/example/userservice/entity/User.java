package org.example.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "full_name", columnDefinition = "TEXT")
    private String fullName;

    @Column(name = "birthday")
    private LocalDateTime birthday;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "rankId", length = 50)
    private String rankId;

    @Column(name = "role", columnDefinition = "TEXT")
    private String role;

    @Column(name = "status", length = 10)
    private String status;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "permission", columnDefinition = "TEXT")
    private String permission;

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
