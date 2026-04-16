package com.example.chatbotservice.controller;

import com.example.chatbotservice.model.ChatHistory;
import com.example.chatbotservice.repository.ChatHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatHistoryController {
    private final ChatHistoryRepository chatHistoryRepository;
    private final String FASTAPI_URL = "http://127.0.0.1:8000/api/ai/chat";
    @PostMapping()
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String userMessage = request.get("message");

        // 1. Lưu tin nhắn của User vào MySQL
        ChatHistory userChat = new ChatHistory();
        userChat.setUserId(userId);
        userChat.setContent(userMessage);
        userChat.setRole("user");
        userChat.setCreatedAt(LocalDateTime.now());
        chatHistoryRepository.save(userChat);

        // 2. Gọi sang FastAPI (Python) để lấy câu trả lời từ Gemini
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> fastApiBody = new HashMap<>();
        fastApiBody.put("message", userMessage);

        Map<String, String> response = new HashMap<>();
        try {
            // Gửi request sang Python
            Map<String, Object> fastApiResponse = restTemplate.postForObject(FASTAPI_URL, fastApiBody, Map.class);
            String aiReply = fastApiResponse.get("reply").toString();

            // 3. Lưu câu trả lời của AI vào MySQL
            ChatHistory aiChat = new ChatHistory();
            aiChat.setUserId(userId);
            aiChat.setContent(aiReply);
            aiChat.setRole("assistant");
            aiChat.setCreatedAt(LocalDateTime.now());
            chatHistoryRepository.save(aiChat);

            response.put("reply", aiReply);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("reply", "Lỗi: Không thể kết nối với bộ não AI (FastAPI)");
            return ResponseEntity.status(500).body(response);
        }
    }
}