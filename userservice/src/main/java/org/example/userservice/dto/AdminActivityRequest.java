package org.example.userservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminActivityRequest {
    private String adminId;
    private String adminName;
    private String action;
    private String target;
    private String category;
}
