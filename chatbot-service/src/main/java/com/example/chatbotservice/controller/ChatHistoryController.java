package com.example.chatbotservice.controller;

import com.example.chatbotservice.dto.ChatMessageResponse;
import com.example.chatbotservice.dto.ChatRequest;
import com.example.chatbotservice.dto.ImageDTO;
import com.example.chatbotservice.model.ChatHistory;
import com.example.chatbotservice.model.ChatSession;
import com.example.chatbotservice.repository.ChatHistoryRepository;
import com.example.chatbotservice.repository.ChatSessionRepository;
import com.example.chatbotservice.service.ChatService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatHistoryController {

    private final ChatService chatService;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping()
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        String userId = request.getUserId();
        String userMessage = request.getMessage();
        String sessionId = request.getSessionId();

        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }

        Map<String, Object> result = chatService.processChat(
                userId, sessionId, userMessage, request.getLastProductIds());

        Map<String, Object> response = new HashMap<>();
        response.put("reply", result.get("reply"));
        response.put("images", result.get("images"));
        response.put("is_single_product", result.get("is_single_product"));
        response.put("product_url", result.get("product_url"));
        response.put("sessionId", sessionId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getSessions(@RequestParam String userId) {
        return ResponseEntity.ok(chatSessionRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable String sessionId) {
        List<ChatHistory> historyList = chatHistoryRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);

        List<ChatMessageResponse> result = historyList.stream().map(h -> {
            ChatMessageResponse dto = new ChatMessageResponse();
            dto.setId(h.getId());
            dto.setRole(h.getRole());
            dto.setContent(h.getContent());
            dto.setCreatedAt(h.getCreatedAt());
            dto.setSingleProduct(h.getSingleProduct());
            dto.setProductUrl(h.getProductUrl());

            List<ImageDTO> images = new ArrayList<>();
            if (h.getImages() != null && !h.getImages().isEmpty()) {
                try {
                    List<Map<String, String>> raw = objectMapper.readValue(
                            h.getImages(), new TypeReference<List<Map<String, String>>>() {});
                    images = raw.stream()
                            .map(m -> new ImageDTO(m.get("product_id"), m.get("url")))
                            .collect(Collectors.toList());
                } catch (Exception e) {
                    images = new ArrayList<>();
                }
            }
            dto.setImages(images);
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Map<String, Object>> deleteSession(@PathVariable String sessionId) {
        if (!chatSessionRepository.existsById(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Xóa toàn bộ tin nhắn thuộc session này trước
        chatHistoryRepository.deleteBySessionId(sessionId);
        // Rồi xóa session
        chatSessionRepository.deleteById(sessionId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("sessionId", sessionId);
        return ResponseEntity.ok(response);
    }
}