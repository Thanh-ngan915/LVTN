package com.example.chatbotservice.service;

import com.example.chatbotservice.model.ChatHistory;
import com.example.chatbotservice.model.ChatSession;
import com.example.chatbotservice.repository.ChatHistoryRepository;
import com.example.chatbotservice.repository.ChatSessionRepository;
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
    private final String FASTAPI_URL = "http://127.0.0.1:8000/api/ai/chat";

    public String processChat(String userId, String sessionId, String userMessage) {
        // KIỂM TRA VÀ TẠO SESSION NẾU CHƯA CÓ TRONG BẢNG CHAT_SESSIONS
        if (!chatSessionRepository.existsById(sessionId)) {
            ChatSession newSession = new ChatSession();
            newSession.setId(sessionId);
            newSession.setUserId(userId);
            // Lấy 30 ký tự đầu của tin nhắn làm tiêu đề
            String title = userMessage.length() > 30 ? userMessage.substring(0, 30) + "..." : userMessage;
            newSession.setTitle(title);
            chatSessionRepository.save(newSession);
        }

        // 1. Lưu tin nhắn User vào chat_messages
        saveMessage(userId, sessionId, userMessage, "user");

        // 2. Lấy ngữ cảnh (giữ nguyên logic subList của Ngân là rất tốt)
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

        // 3. Chuẩn bị payload gửi sang FastAPI (Python)
        Map<String, Object> body = new HashMap<>();
        body.put("message", userMessage);
        body.put("history", context);

        try {
            // Gửi request sang Python
            Map<String, Object> fastApiResponse = restTemplate.postForObject(FASTAPI_URL, body, Map.class);

            if (fastApiResponse != null && fastApiResponse.containsKey("reply")) {
                String aiReply = fastApiResponse.get("reply").toString();

                // 4. Lưu câu trả lời của AI vào DB
                saveMessage(userId, sessionId, aiReply, "assistant");
                return aiReply;
            }
            return "Lỗi: Bộ não AI phản hồi không đúng định dạng.";

        } catch (Exception e) {
            // Log lỗi chi tiết để Ngân dễ debug khi làm luận văn
            System.err.println("Lỗi kết nối FastAPI: " + e.getMessage());
            return "Lỗi: Không thể kết nối với bộ não AI (FastAPI đang tắt?)";
        }
    }

    private void saveMessage(String userId, String sessionId, String content, String role) {
        ChatHistory chat = new ChatHistory();
        chat.setUserId(userId);
        chat.setSessionId(sessionId);
        chat.setContent(content);
        chat.setRole(role);
        chat.setCreatedAt(LocalDateTime.now());
        chatHistoryRepository.save(chat);
    }
}