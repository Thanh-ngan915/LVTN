package org.example.livetreamservice.controller;

import org.example.livetreamservice.entity.LivestreamParticipant;
import org.example.livetreamservice.service.LivestreamParticipantService;
import org.example.livetreamservice.service.LivestreamRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api/livestream/participants")
@RequiredArgsConstructor
@Slf4j
public class LivestreamParticipantController {
    private final LivestreamParticipantService participantService;
    private final LivestreamRoomService roomService;

    /**
     * API để lấy danh sách participants đang hoạt động trong phòng
     * GET /api/livestream/participants/rooms/{roomId}
     */
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getActiveParticipants(@PathVariable Long roomId) {
        try {
            List<LivestreamParticipant> participants = participantService.getActiveParticipants(roomId);
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            log.error("Error getting participants: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để kiểm tra xem user có phải là host
     * GET /api/livestream/participants/rooms/{roomId}/is-host/{userId}
     */
    @GetMapping("/rooms/{roomId}/is-host/{userId}")
    public ResponseEntity<?> isRoomHost(@PathVariable Long roomId, @PathVariable Long userId) {
        try {
            boolean isHost = participantService.isRoomHost(roomId, userId);
            return ResponseEntity.ok(java.util.Collections.singletonMap("isHost", isHost));
        } catch (Exception e) {
            log.error("Error checking host status: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để kiểm tra xem user có tham gia phòng
     * GET /api/livestream/participants/rooms/{roomId}/is-participant/{userId}
     */
    @GetMapping("/rooms/{roomId}/is-participant/{userId}")
    public ResponseEntity<?> isParticipantInRoom(@PathVariable Long roomId, @PathVariable Long userId) {
        try {
            boolean isParticipant = participantService.isParticipantInRoom(roomId, userId);
            return ResponseEntity.ok(java.util.Collections.singletonMap("isParticipant", isParticipant));
        } catch (Exception e) {
            log.error("Error checking participant status: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
