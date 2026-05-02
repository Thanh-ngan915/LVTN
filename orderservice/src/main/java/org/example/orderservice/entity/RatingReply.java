package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratingreply")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "url", columnDefinition = "TEXT")
    private String url;

    @Column(name = "rating_id", nullable = false)
    private Integer ratingId;

    @Column(name = "rating_reply_id")
    private Integer ratingReplyId;

    @Column(name = "stars")
    private Double stars;

    @Column(name = "is_reply", nullable = false)
    private Boolean isReply;

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
        if (this.isReply == null) this.isReply = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }
}
