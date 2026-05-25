package com.example.storeservice.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VoucherRequestDTO {
    private String code;
    private String title;
    private String description;
    private Integer initQuantity;
    private Integer type; //1: percent, 2: fixed
    private Double percent;
    private Integer maximum;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<String> categoryShortnames;   // điều kiện theo category
    private PriceConditionDTO priceCondition;  // điều kiện theo giá
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PriceConditionDTO {
        private Float totalMin;
        private Float totalMax;
        private Float priceMin;
    }
}
