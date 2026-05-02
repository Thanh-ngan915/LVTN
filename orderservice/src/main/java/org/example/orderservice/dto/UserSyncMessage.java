package org.example.orderservice.dto;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSyncMessage implements Serializable {
    private String userId;
    private String username;
    private String fullName;
    private String image;
    private String action; // "CREATE" or "UPDATE"
}
