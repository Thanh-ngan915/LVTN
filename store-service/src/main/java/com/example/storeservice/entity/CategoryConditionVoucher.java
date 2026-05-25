package com.example.storeservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name="category_condition_voucher")
@Data @Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryConditionVoucher {
    @Id
    private String id;
    @Column(name="voucher_id")
    private String voucherId;
    @Column(name = "category_shortname")
    private String categoryShortname;
    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
    }
}
