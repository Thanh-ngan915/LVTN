package com.example.storeservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "price_condition_voucher")
@Data
@Builder
@NoArgsConstructor
@Table(name="price_condition_voucher")
@Data @Builder @NoArgsConstructor
@AllArgsConstructor
public class PriceConditionVoucher {
    @Id
    private String id;

    @Column(name = "voucher_id")
    private String voucherId;

    @Column(name = "total_min")
    private Float totalMin;

    @Column(name = "total_max")
    private Float totalMax;

    @Column(name = "price_min")
    private Float priceMin;

    @Column(name = "price_max")
    private Float priceMax;
    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID().toString();
    }
}
