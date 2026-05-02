package com.example.chatbotservice.controller;

import com.example.chatbotservice.model.ChatHistory;
import com.example.chatbotservice.model.ChatSession;
import com.example.chatbotservice.repository.ChatHistoryRepository;
import com.example.chatbotservice.repository.ChatSessionRepository;
import com.example.chatbotservice.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatHistoryController {

    private final ChatService chatService;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatHistoryRepository chatHistoryRepository;

    @PostMapping()
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String userMessage = request.get("message");
        String sessionId = request.get("sessionId");

        // Nếu client không gửi sessionId (Chat mới), tạo một UUID mới
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }

        String aiReply = chatService.processChat(userId, sessionId, userMessage);

        Map<String, String> response = new HashMap<>();
        response.put("reply", aiReply);
        response.put("sessionId", sessionId); // Trả về sessionId để Frontend lưu lại cho lượt chat kế tiếp

        return ResponseEntity.ok(response);
    }
    // Lấy danh sách các cuộc trò chuyện ở Sidebar
    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getSessions(@RequestParam String userId) {
        return ResponseEntity.ok(chatSessionRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    // Lấy lại tin nhắn khi click vào một session cũ
    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatHistory>> getMessages(@PathVariable String sessionId) {
        return ResponseEntity.ok(chatHistoryRepository.findBySessionIdOrderByCreatedAtAsc(sessionId));
    }
}