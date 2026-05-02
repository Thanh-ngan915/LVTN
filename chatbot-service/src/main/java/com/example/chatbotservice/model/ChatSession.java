package com.example.chatbotservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="chat_sessions")
@Data
public class ChatSession {
    @Id
    private String id;
    private String userId;
    private String title;
    private LocalDateTime createdAt =  LocalDateTime.now();
}
