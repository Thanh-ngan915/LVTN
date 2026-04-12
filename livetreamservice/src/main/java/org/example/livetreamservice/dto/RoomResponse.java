package org.example.livetreamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long id;
    private String roomName;
    private String title;
    private String description;
    private Long hostId;
    private String hostName;
    private String status;
    private Integer currentViewers;
    private Integer maxViewers;
    private String thumbnail;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private LocalDateTime createdAt;
}
