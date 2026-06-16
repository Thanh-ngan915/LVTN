package org.example.orderservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentimentResultDTO {

    private String sentiment;
    @JsonProperty("isMatch")// "positive" | "neutral" | "negative"
    private Boolean isMatch;    // comment có khớp số sao không
    private double confidence;  // 0.0 - 1.0
    private String reason;      // giải thích tiếng Việt
    private Double stars;
    private boolean analyzed;
    private String error;

    public static SentimentResultDTO skipped() {
        return SentimentResultDTO.builder()
                .analyzed(false)
                .isMatch(true)
                .build();
    }
    public static SentimentResultDTO error(String message) {
        return SentimentResultDTO.builder()
                .analyzed(false).isMatch(true).error(message).build();
    }
}