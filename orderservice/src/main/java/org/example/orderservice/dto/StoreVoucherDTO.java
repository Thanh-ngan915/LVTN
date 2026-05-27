package org.example.orderservice.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreVoucherDTO {
    private String id;
    private String code;
    private String title;
    private String description;
    private Integer initQuantity;
    private Integer currentQuantity;
    private Integer status; // 1 = active, 0 = inactive
    private Integer type; // 1 = fixed, 2 = percent
    private String storeId;
    private Double percent;
    private Integer maximum;
    private String startDate;
    private String endDate;
    private List<String> categoryShortnames;
    private PriceConditionDTO priceCondition;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PriceConditionDTO {
        private Float totalMin;
        private Float totalMax;
        private Float priceMin;
    }
}
