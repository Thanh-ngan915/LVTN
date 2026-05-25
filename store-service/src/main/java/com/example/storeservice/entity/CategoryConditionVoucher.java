package com.example.storeservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "category_condition_voucher")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryConditionVoucher {
    @Id
    private String id;

    @Column(name = "voucher_id")
    private String voucherId;

    @Column(name = "category_shortname")
    private String categoryShortname;
    
    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
    }
}
