package org.example.userservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminActivityLogDTO {
    private Long id;
    private String adminId;
    private String adminName;
    private String action;
    private String target;
    private String category;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
