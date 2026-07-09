package com.example.chatbotservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private String userId;
    private String message;
    private String sessionId;
    private List<String> lastProductIds;
}