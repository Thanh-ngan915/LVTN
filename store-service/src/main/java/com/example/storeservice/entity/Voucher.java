package com.example.storeservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "voucher")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    @Id
    private String id;

    private String code;
    private String title;
    private String description;
    
    @Column(name = "init_quantity")
    private Integer initQuantity;
    
    @Column(name = "current_quantity")
    private Integer currentQuantity;
    
    private Integer status;
    private Integer type;
    
    @Column(name = "store_id")
    private String storeId;
    
    private Double percent;
    private Integer maximum;
    
    @Column(name = "start_date")
    private LocalDateTime startDate;
    
    @Column(name = "end_date")
    private LocalDateTime endDate;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Column(name = "update_at")
    private LocalDateTime updateAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
