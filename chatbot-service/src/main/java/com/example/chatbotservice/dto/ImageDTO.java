package com.example.chatbotservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageDTO {
    private String product_id;
    private String url;
}