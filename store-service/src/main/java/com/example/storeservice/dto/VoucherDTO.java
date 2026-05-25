package com.example.storeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDTO {
    private String id;
    private String code;
    private String title;
    private String description;
    private Integer initQuantity;
    private Integer currentQuantity;
    private Integer status;
    private Integer type;
    private String storeId;
    private Double percent;
    private Integer maximum;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private List<String> categoryShortnames;
    private VoucherRequestDTO.PriceConditionDTO priceCondition;
}
