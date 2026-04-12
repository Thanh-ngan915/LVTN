package org.example.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "storerole")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreRole {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "store_role", length = 50)
    private String storeRole;

    @Column(name = "status", length = 10)
    private String status;

    @Column(name = "role", length = 20)
    private String role;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

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
