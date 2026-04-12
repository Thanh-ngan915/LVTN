package org.example.livetreamservice.service;

import org.example.livetreamservice.dto.CreateRoomRequest;
import org.example.livetreamservice.dto.RoomResponse;
import org.example.livetreamservice.entity.LivestreamRoom;
import org.example.livetreamservice.entity.LivestreamParticipant;
import org.example.livetreamservice.repository.LivestreamRoomRepository;
import org.example.livetreamservice.repository.LivestreamParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LivestreamRoomService {
    private final LivestreamRoomRepository roomRepository;
    private final LivestreamParticipantRepository participantRepository;
    private final LiveKitService livekitService;

    /**
     * Tạo phòng livestream mới
     */
    public RoomResponse createRoom(Long hostId, String hostName, CreateRoomRequest request) {
        log.info("Creating room for host: {} ({})", hostName, hostId);
        
        String roomName = "room_" + hostId + "_" + System.currentTimeMillis();
        
        LivestreamRoom room = new LivestreamRoom();
        room.setRoomName(roomName);
        room.setTitle(request.getTitle());
        room.setDescription(request.getDescription());
        room.setHostId(hostId);
        room.setHostName(hostName);
        room.setThumbnail(request.getThumbnail());
        room.setMaxViewers(request.getMaxViewers() != null ? request.getMaxViewers() : 1000);
        room.setStatus("ACTIVE");
        room.setCurrentViewers(0);
        room.setStartedAt(LocalDateTime.now());
        
        LivestreamRoom savedRoom = roomRepository.save(room);
        
        // Thêm host như participant đầu tiên
        LivestreamParticipant hostParticipant = new LivestreamParticipant();
        hostParticipant.setRoomId(savedRoom.getId());
        hostParticipant.setUserId(hostId);
        hostParticipant.setUsername(hostName);
        hostParticipant.setRole("HOST");
        hostParticipant.setStatus("ACTIVE");
        participantRepository.save(hostParticipant);
        
        log.info("Room created successfully: {}", roomName);
        return convertToResponse(savedRoom);
    }

    /**
     * Lấy thông tin phòng
     */
    public Optional<RoomResponse> getRoomById(Long roomId) {
        return roomRepository.findById(roomId).map(this::convertToResponse);
    }

    /**
     * Lấy thông tin phòng theo tên
     */
    public Optional<RoomResponse> getRoomByName(String roomName) {
        return roomRepository.findByRoomName(roomName).map(this::convertToResponse);
    }

    /**
     * Lấy danh sách phòng đang hoạt động
     */
    public List<RoomResponse> getActiveRooms() {
        return roomRepository.findByStatus("ACTIVE")
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách phòng của host
     */
    public List<RoomResponse> getHostRooms(Long hostId) {
        return roomRepository.findByHostId(hostId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật số lượng viewers
     */
    public void updateViewerCount(String roomName, int change) {
        Optional<LivestreamRoom> room = roomRepository.findByRoomName(roomName);
        if (room.isPresent()) {
            LivestreamRoom r = room.get();
            int newCount = Math.max(0, r.getCurrentViewers() + change);
            r.setCurrentViewers(newCount);
            roomRepository.save(r);
            log.info("Room {} viewer count updated to: {}", roomName, newCount);
        }
    }

    /**
     * Kết thúc phòng livestream
     */
    public void endRoom(String roomName) {
        Optional<LivestreamRoom> room = roomRepository.findByRoomName(roomName);
        if (room.isPresent()) {
            LivestreamRoom r = room.get();
            r.setStatus("ENDED");
            r.setEndedAt(LocalDateTime.now());
            roomRepository.save(r);
            
            // Xóa phòng khỏi LiveKit
            livekitService.deleteRoom(roomName);
            
            // Cập nhật tất cả participants tại phòng
            List<LivestreamParticipant> participants = participantRepository.findByRoomIdAndStatus(r.getId(), "ACTIVE");
            for (LivestreamParticipant p : participants) {
                p.setStatus("LEFT");
                p.setLeftAt(LocalDateTime.now());
                participantRepository.save(p);
            }
            
            log.info("Room ended: {}", roomName);
        }
    }

    /**
     * Chuyển đổi entity thành DTO
     */
    private RoomResponse convertToResponse(LivestreamRoom room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomName(room.getRoomName())
                .title(room.getTitle())
                .description(room.getDescription())
                .hostId(room.getHostId())
                .hostName(room.getHostName())
                .status(room.getStatus())
                .currentViewers(room.getCurrentViewers())
                .maxViewers(room.getMaxViewers())
                .thumbnail(room.getThumbnail())
                .startedAt(room.getStartedAt())
                .endedAt(room.getEndedAt())
                .createdAt(room.getCreatedAt())
                .build();
    }
}
