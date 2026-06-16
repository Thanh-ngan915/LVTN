package org.example.orderservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.dto.SentimentResultDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SentimentService {

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final List<String> POSITIVE_KEYWORDS =
            List.of("tuyệt vời", "tốt", "xuất sắc", "hài lòng", "thích", "okay", "oke", "ok",
                    "đẹp", "chất", "ngon", "xịn", "ưng", "hợp lý", "nhanh", "chuẩn",
                    "chất lượng tốt", "rất tốt", "hài lòng");

    private static final List<String> NEGATIVE_KEYWORDS =
            List.of("tệ", "xấu", "kém", "thất vọng", "tồi", "chán", "dở", "hỏng", "lỗi");

    private boolean isObviouslyPositive(String comment) {
        String lower = comment.toLowerCase();
        return POSITIVE_KEYWORDS.stream().anyMatch(lower::contains);
    }

    private boolean isObviouslyNegative(String comment) {
        String lower = comment.toLowerCase();
        return NEGATIVE_KEYWORDS.stream().anyMatch(lower::contains);
    }
    private static final double CONFIDENCE_THRESHOLD = 0.82;
    @Value("${huggingface.api.key:}")
    private String hfApiKey;

    private static final String API_URL =
            "https://router.huggingface.co/hf-inference/models/5CD-AI/Vietnamese-Sentiment-visobert/pipeline/text-classification";

    public SentimentResultDTO analyze(String comment, Double stars) {
        log.info("HF API KEY: '{}'", hfApiKey);
        if (comment == null || comment.isBlank() || stars == null) {
            return SentimentResultDTO.skipped();
        }
        if (hfApiKey == null || hfApiKey.isBlank()) {
            return SentimentResultDTO.skipped();
        }
        if (isObviouslyPositive(comment) && stars >= 4.0) {
            return SentimentResultDTO.skipped(); // rõ ràng khớp → bỏ qua AI
        }

        if (isObviouslyNegative(comment) && stars >= 4.0) {
            // negative comment + sao cao → KHÔNG khớp → cảnh báo
            return SentimentResultDTO.builder()
                    .sentiment("negative")
                    .isMatch(false)
                    .confidence(1.0)
                    .reason("Bình luận tiêu cực nhưng chọn " + stars.intValue() + " sao")
                    .stars(stars)
                    .analyzed(true)
                    .build();
        }
        if (isObviouslyNegative(comment) && stars <= 2.0) {
            // negative comment + sao thấp → KHỚP → cho qua
            return SentimentResultDTO.skipped();
        }
        if (isObviouslyPositive(comment) && stars <= 2.0) {
            return SentimentResultDTO.builder()
                    .sentiment("positive")
                    .isMatch(false)
                    .confidence(1.0)
                    .analyzed(true)
                    .reason("Bình luận tích cực nhưng chỉ chọn " + stars.intValue() + " sao")
                    .stars(stars)
                    .build();
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + hfApiKey);
            headers.set("Accept", "application/json");

            Map<String, String> body = Map.of("inputs", comment);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    API_URL, new HttpEntity<>(body, headers), String.class
            );

            log.info("HF Response status: {}", response.getStatusCode());
            log.info("HF Response body: {}", response.getBody());

            JsonNode root = objectMapper.readTree(response.getBody());
            if (root.has("error")) {
                log.warn("HuggingFace error: {}", root.get("error").asText());
                return SentimentResultDTO.skipped(); // hoặc fallback keyword
            }

            JsonNode labels = root.get(0);
            if (labels == null) {
                log.warn("HuggingFace response unexpected format: {}", response.getBody());
                return SentimentResultDTO.skipped();
            }

            String topLabel = "";
            double topScore = 0;
            for (JsonNode item : labels) {
                double score = item.path("score").asDouble();
                if (score > topScore) {
                    topScore = score;
                    topLabel = item.path("label").asText();
                }
            }

            String sentiment = switch (topLabel) {
                case "POS" -> "positive";
                case "NEG" -> "negative";
                case "NEU" -> "neutral";
                default    -> "neutral";
            };

            boolean isMatch = checkMatch(sentiment, stars);
            String reason = buildReason(sentiment, stars, isMatch);

            return SentimentResultDTO.builder()
                    .sentiment(sentiment)
                    .isMatch(isMatch)
                    .confidence(topScore)
                    .reason(reason)
                    .stars(stars)
                    .analyzed(true)
                    .build();

        } catch (Exception e) {
            log.warn("Sentiment analysis failed: {}", e.getMessage());
            return SentimentResultDTO.error("Không thể phân tích lúc này");
        }
    }

    private boolean checkMatch(String sentiment, Double stars) {
        if (stars >= 4.0 && sentiment.equals("negative")) return false;
        if (stars <= 2.0 && sentiment.equals("positive")) return false;
        return true;
    }

    private String buildReason(String sentiment, Double stars, boolean isMatch) {
        if (isMatch) return "Bình luận phù hợp với số sao";
        if (stars >= 4.0) return "Bình luận tiêu cực nhưng chọn " + stars.intValue() + " sao";
        return "Bình luận tích cực nhưng chỉ chọn " + stars.intValue() + " sao";
    }
}