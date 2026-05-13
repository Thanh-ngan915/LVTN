package com.example.storeservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "store")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    @Id
    private String id;

    private String name;
    private String image;
    private String location;
    private String description;
    private String status; // pending | active | banned

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
        this.status = "pending"; // mặc định chờ duyệt
    }
}
