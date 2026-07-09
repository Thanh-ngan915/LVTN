package com.example.chatbotservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String sessionId;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String role;

    @Column(columnDefinition = "TEXT")
    private String images;

    private Boolean singleProduct;

    @Column(columnDefinition = "TEXT")
    private String productUrl;

    private LocalDateTime createdAt;
}