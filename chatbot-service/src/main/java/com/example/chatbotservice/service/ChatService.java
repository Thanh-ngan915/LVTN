package com.example.chatbotservice.service;

import com.example.chatbotservice.model.ChatHistory;
import com.example.chatbotservice.model.ChatSession;
import com.example.chatbotservice.repository.ChatHistoryRepository;
import com.example.chatbotservice.repository.ChatSessionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String FASTAPI_URL = System.getenv("FASTAPI_URL") != null ? System.getenv("FASTAPI_URL") : "http://127.0.0.1:8000/api/ai/chat";

    public Map<String, Object> processChat(String userId, String sessionId, String userMessage,
                                           List<String> lastProductIds) {

        if (!chatSessionRepository.existsById(sessionId)) {
            ChatSession newSession = new ChatSession();
            newSession.setId(sessionId);
            newSession.setUserId(userId);
            String title = userMessage.length() > 30 ? userMessage.substring(0, 30) + "..." : userMessage;
            newSession.setTitle(title);
            chatSessionRepository.save(newSession);
        }

        saveMessage(userId, sessionId, userMessage, "user", null, false, null);

        List<ChatHistory> history = chatHistoryRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        int contextLimit = 10;
        List<ChatHistory> recentHistory = history.size() > contextLimit
                ? history.subList(history.size() - contextLimit, history.size())
                : history;

        List<Map<String, String>> context = recentHistory.stream()
                .map(h -> {
                    Map<String, String> msg = new HashMap<>();
                    msg.put("role", h.getRole());
                    msg.put("content", h.getContent());
                    return msg;
                }).collect(Collectors.toList());

        Map<String, Object> body = new HashMap<>();
        body.put("message", userMessage);
        body.put("history", context);
        body.put("last_product_ids", lastProductIds != null ? lastProductIds : List.of());

        try {
            Map<String, Object> fastApiResponse = restTemplate.postForObject(FASTAPI_URL, body, Map.class);

            if (fastApiResponse != null && fastApiResponse.containsKey("reply")) {
                String aiReply = fastApiResponse.get("reply").toString();
                Object images = fastApiResponse.getOrDefault("images", List.of());
                boolean isSingleProduct = Boolean.TRUE.equals(fastApiResponse.get("is_single_product"));
                String productUrl = (String) fastApiResponse.get("product_url");   // có thể null

                String imagesJson;
                try {
                    imagesJson = objectMapper.writeValueAsString(images);
                } catch (Exception e) {
                    imagesJson = "[]";
                }

                saveMessage(userId, sessionId, aiReply, "assistant", imagesJson, isSingleProduct, productUrl);

                Map<String, Object> result = new HashMap<>();
                result.put("reply", aiReply);
                result.put("images", images);
                result.put("is_single_product", isSingleProduct);
                result.put("product_url", productUrl);
                return result;
            }

            return new HashMap<>(Map.of(
                    "reply", "Lỗi: Bộ não AI phản hồi không đúng định dạng.",
                    "images", List.of(),
                    "is_single_product", false
            )) {{
                put("product_url", null);
            }};

        } catch (Exception e) {
            System.err.println("Lỗi kết nối FastAPI: " + e.getMessage());
            return new HashMap<>(Map.of(
                    "reply", "Lỗi: Không thể kết nối với bộ não AI.",
                    "images", List.of(),
                    "is_single_product", false
            ));
        }
    }

    private void saveMessage(String userId, String sessionId, String content, String role,
                             String imagesJson, boolean isSingleProduct, String productUrl) {
        ChatHistory chat = new ChatHistory();
        chat.setUserId(userId);
        chat.setSessionId(sessionId);
        chat.setContent(content);
        chat.setRole(role);
        chat.setImages(imagesJson);
        chat.setSingleProduct(isSingleProduct);
        chat.setProductUrl(productUrl);
        chat.setCreatedAt(LocalDateTime.now());
        chatHistoryRepository.save(chat);
    }
}