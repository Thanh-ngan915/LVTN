package org.example.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "voucher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code", length = 100, nullable = false, unique = true)
    private String code;

    @Column(name = "name", length = 200)
    private String name;

    // Tên cũ trong SQL gốc
    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Schema mới (thêm sau)
    @Column(name = "discount_type", length = 20)
    private String discountType; // PERCENT, FIXED

    @Column(name = "discount_value")
    private Float discountValue;

    @Column(name = "min_order_value")
    private Float minOrderValue;

    @Column(name = "max_discount")
    private Float maxDiscount;

    // Schema cũ (giữ lại để tương thích)
    @Column(name = "type", length = 50)
    private String type; // percent | fixed

    @Column(name = "percent")
    private Double percent;

    @Column(name = "maximum")
    private Integer maximum;

    @Column(name = "store_id", length = 100)
    private String storeId;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "used_count")
    private Integer usedCount;

    // status là varchar (đã ALTER từ int sang varchar)
    @Column(name = "status", length = 20)
    private String status; // active, inactive, expired

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "active";
        if (this.usedCount == null) this.usedCount = 0;
        if (this.minOrderValue == null) this.minOrderValue = 0f;
        if (this.title == null && this.name != null) this.title = this.name;
        if (this.title == null) this.title = "Voucher";
        // Sync type/discountType for backward compatibility
        if (this.discountType == null && this.type != null) {
            this.discountType = this.type.toUpperCase().equals("PERCENT") ? "PERCENT" : "FIXED";
        }
        if (this.type == null && this.discountType != null) {
            this.type = this.discountType.toLowerCase();
        }
    }

    /**
     * Lấy loại giảm giá (ưu tiên discountType mới, fallback sang type cũ)
     */
    public String getEffectiveDiscountType() {
        if (this.discountType != null) return this.discountType;
        if (this.type != null) return this.type.equalsIgnoreCase("percent") ? "PERCENT" : "FIXED";
        return "FIXED";
    }

    /**
     * Lấy giá trị giảm (ưu tiên discountValue mới, fallback sang percent cũ)
     */
    public Float getEffectiveDiscountValue() {
        if (this.discountValue != null) return this.discountValue;
        if (this.percent != null) return this.percent.floatValue();
        return 0f;
    }

    /**
     * Lấy giảm tối đa (ưu tiên maxDiscount mới, fallback sang maximum cũ)
     */
    public Float getEffectiveMaxDiscount() {
        if (this.maxDiscount != null) return this.maxDiscount;
        if (this.maximum != null) return this.maximum.floatValue();
        return null;
    }
}
