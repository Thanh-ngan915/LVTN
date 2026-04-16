package com.example.chatbotservice.repository;

import com.example.chatbotservice.model.ChatHistory;
import com.example.chatbotservice.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, String> {
    List<ChatSession> findByUserIdOrderByCreatedAtDesc(String userId);
}
