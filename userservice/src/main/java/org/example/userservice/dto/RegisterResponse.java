package org.example.userservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponse {

    private String username;
    private String userId;
    private String fullName;
    private String email;
    private String role;
    private String message;
    private LocalDateTime createdAt;
}
