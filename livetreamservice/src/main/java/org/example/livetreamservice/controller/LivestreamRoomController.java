package org.example.livetreamservice.controller;

import org.example.livetreamservice.config.LiveKitConfig;
import org.example.livetreamservice.dto.CreateRoomRequest;
import org.example.livetreamservice.dto.JoinRoomRequest;
import org.example.livetreamservice.dto.RoomResponse;
import org.example.livetreamservice.dto.TokenResponse;
import org.example.livetreamservice.service.LivestreamRoomService;
import org.example.livetreamservice.service.LivestreamParticipantService;
import org.example.livetreamservice.service.LiveKitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/livestream/rooms")
@RequiredArgsConstructor
@Slf4j
public class LivestreamRoomController {
    private final LivestreamRoomService roomService;
    private final LivestreamParticipantService participantService;
    private final LiveKitService livekitService;
    private final LiveKitConfig livekitConfig;

    /**
     * API để tạo phòng livestream
     * POST /api/livestream/rooms/create
     * Header: userId, username
     */
    @PostMapping("/create")
    public ResponseEntity<?> createRoom(
            @RequestHeader("userId") Long userId,
            @RequestHeader("username") String username,
            @RequestBody CreateRoomRequest request) {
        try {
            log.info("Creating room - Host: {} ({})", username, userId);
            RoomResponse room = roomService.createRoom(userId, username, request);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            log.error("Error creating room: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để lấy token tham gia phòng
     * POST /api/livestream/rooms/{roomName}/join
     */
    @PostMapping("/{roomName}/join")
    public ResponseEntity<?> joinRoom(
            @PathVariable String roomName,
            @RequestHeader("userId") Long userId,
            @RequestHeader("username") String username,
            @RequestBody JoinRoomRequest request) {
        try {
            log.info("User {} ({}) joining room: {}", username, userId, roomName);
            
            // Lấy thông tin phòng
            Optional<RoomResponse> room = roomService.getRoomByName(roomName);
            if (room.isEmpty()) {
                return ResponseEntity.badRequest().body("Room not found");
            }
            
            Long roomId = room.get().getId();
            boolean isHost = room.get().getHostId().equals(userId);
            
            // Kiểm tra nếu là host thì lấy token chủ phòng, không thì lấy token viewer
            String token;
            String role;
            if (isHost) {
                token = livekitService.generateHostToken(roomName, username);
                role = "HOST";
            } else {
                token = livekitService.generateViewerToken(roomName, username);
                role = "VIEWER";
                // Thêm participant vào database
                participantService.addParticipant(roomId, userId, username, "VIEWER");
            }
            
            TokenResponse response = TokenResponse.builder()
                    .token(token)
                    .livekitUrl(livekitConfig.getUrl())
                    .role(role)
                    .message("Token generated successfully")
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error joining room: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để lấy thông tin phòng
     * GET /api/livestream/rooms/{roomId}
     */
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable Long roomId) {
        try {
            Optional<RoomResponse> room = roomService.getRoomById(roomId);
            if (room.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(room.get());
        } catch (Exception e) {
            log.error("Error getting room: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để lấy danh sách phòng đang hoạt động
     * GET /api/livestream/rooms
     */
    @GetMapping
    public ResponseEntity<?> getActiveRooms() {
        try {
            List<RoomResponse> rooms = roomService.getActiveRooms();
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            log.error("Error getting active rooms: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để lấy danh sách phòng của host
     * GET /api/livestream/rooms/host/{hostId}
     */
    @GetMapping("/host/{hostId}")
    public ResponseEntity<?> getHostRooms(@PathVariable Long hostId) {
        try {
            List<RoomResponse> rooms = roomService.getHostRooms(hostId);
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            log.error("Error getting host rooms: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để kết thúc phòng livestream
     * POST /api/livestream/rooms/{roomName}/end
     * Header: userId (phải là host)
     */
    @PostMapping("/{roomName}/end")
    public ResponseEntity<?> endRoom(
            @PathVariable String roomName,
            @RequestHeader("userId") Long userId) {
        try {
            Optional<RoomResponse> room = roomService.getRoomByName(roomName);
            if (room.isEmpty()) {
                return ResponseEntity.badRequest().body("Room not found");
            }
            
            // Kiểm tra quyền - chỉ host mới có thể kết thúc phòng
            if (!room.get().getHostId().equals(userId)) {
                return ResponseEntity.status(403).body("Only host can end the room");
            }
            
            roomService.endRoom(roomName);
            return ResponseEntity.ok("Room ended successfully");
        } catch (Exception e) {
            log.error("Error ending room: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * API để leave phòng
     * POST /api/livestream/rooms/{roomName}/leave
     * Header: userId
     */
    @PostMapping("/{roomName}/leave")
    public ResponseEntity<?> leaveRoom(
            @PathVariable String roomName,
            @RequestHeader("userId") Long userId) {
        try {
            Optional<RoomResponse> room = roomService.getRoomByName(roomName);
            if (room.isEmpty()) {
                return ResponseEntity.badRequest().body("Room not found");
            }
            
            Long roomId = room.get().getId();
            participantService.removeParticipant(roomId, userId);
            livekitService.removeParticipant(roomName, userId.toString());
            
            return ResponseEntity.ok("Left room successfully");
        } catch (Exception e) {
            log.error("Error leaving room: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
