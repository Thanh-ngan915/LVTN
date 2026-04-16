package org.example.productservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "Product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", columnDefinition = "TEXT")
    private String name;

    @Column(name = "price_before")
    private Float priceBefore;

    @Column(name = "price_after")
    private Float priceAfter;

    @Column(name = "init_quantity")
    private Integer initQuantity;

    @Column(name = "current_quantity")
    private Integer currentQuantity;

    @Column(name = "sold")
    private Integer sold;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "category", length = 50, insertable = false, updatable = false)
    private String categoryShortname;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category", referencedColumnName = "shortname")
    private Category categoryEntity;

    @Column(name = "store_id", length = 50)
    private String storeId;

    @Column(name = "voucher_id", length = 50)
    private String voucherId;

    @Column(name = "rate")
    private Double rate;

    @Column(name = "is_delete")
    private Boolean isDelete;

    @Column(name = "created_by", length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @Column(name = "update_at")
    private Timestamp updateAt;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductImage> images;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductVariant> variants;
}
