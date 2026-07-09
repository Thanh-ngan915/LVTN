package com.example.chatbotservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatMessageResponse {
    private Long id;
    private String role;
    private String content;
    private LocalDateTime createdAt;
    private List<ImageDTO> images;

    @JsonProperty("is_single_product")
    private Boolean singleProduct;

    @JsonProperty("product_url")
    private String productUrl;
}