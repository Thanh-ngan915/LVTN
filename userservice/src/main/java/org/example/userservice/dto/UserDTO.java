package org.example.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String id;
    @NotBlank(message = "Username cannot be blank")
    private String username;
    private String fullName;
    @Email(message = "Email should be valid")
    private String email;
    private String image;
    private LocalDateTime birthday;
    private String address;
    private String status;
    private String rankId;
    private String storeRoleId;
    private String role;
    private LocalDateTime createdAt;
}
