package org.example.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_activity_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID của admin thực hiện hành động */
    @Column(name = "admin_id", length = 50, nullable = false)
    private String adminId;

    /** Tên hiển thị của admin */
    @Column(name = "admin_name", length = 255)
    private String adminName;

    /** Mô tả hành động, VD: "Phê duyệt shop", "Khóa tài khoản" */
    @Column(name = "action", length = 255, nullable = false)
    private String action;

    /** Đối tượng bị tác động, VD: tên shop, tên user */
    @Column(name = "target", length = 255)
    private String target;

    /** Phân loại hành động để dễ lọc */
    @Column(name = "category", length = 50)
    private String category;

    /** Đã đọc chưa (dùng để đếm badge) */
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isRead == null) this.isRead = false;
    }
}
