package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orderrefund")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRefund {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "order_id", length = 50, nullable = false)
    private String orderId;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "title", length = 50)
    private String title;

    @Column(name = "description", length = 1000, columnDefinition = "TINYTEXT")
    private String description;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}