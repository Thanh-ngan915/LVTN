package org.example.livetreamservice.service;

import org.example.livetreamservice.entity.LivestreamParticipant;
import org.example.livetreamservice.entity.LivestreamRoom;
import org.example.livetreamservice.repository.LivestreamParticipantRepository;
import org.example.livetreamservice.repository.LivestreamRoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LivestreamParticipantService {
    private final LivestreamParticipantRepository participantRepository;
    private final LivestreamRoomRepository roomRepository;
    private final LivestreamRoomService roomService;

    /**
     * Thêm participant vào phòng
     */
    public LivestreamParticipant addParticipant(Long roomId, Long userId, String username, String role) {
        log.info("Adding participant {} ({}) to room {}", username, userId, roomId);
        
        Optional<LivestreamParticipant> existing = participantRepository.findByRoomIdAndUserId(roomId, userId);
        if (existing.isPresent()) {
            log.warn("Participant already exists in room: {}", roomId);
            return existing.get();
        }
        
        LivestreamParticipant participant = new LivestreamParticipant();
        participant.setRoomId(roomId);
        participant.setUserId(userId);
        participant.setUsername(username);
        participant.setRole(role);
        participant.setStatus("ACTIVE");
        participant.setJoinedAt(LocalDateTime.now());
        
        LivestreamParticipant saved = participantRepository.save(participant);
        
        // Cập nhật số viewers
        if ("VIEWER".equals(role)) {
            Optional<LivestreamRoom> room = roomRepository.findById(roomId);
            if (room.isPresent()) {
                roomService.updateViewerCount(room.get().getRoomName(), 1);
            }
        }
        
        log.info("Participant added successfully");
        return saved;
    }

    /**
     * Remove participant khỏi phòng
     */
    public void removeParticipant(Long roomId, Long userId) {
        log.info("Removing participant {} from room {}", userId, roomId);
        
        Optional<LivestreamParticipant> participant = participantRepository.findByRoomIdAndUserId(roomId, userId);
        if (participant.isPresent()) {
            LivestreamParticipant p = participant.get();
            p.setStatus("LEFT");
            p.setLeftAt(LocalDateTime.now());
            participantRepository.save(p);
            
            // Cập nhật số viewers
            if ("VIEWER".equals(p.getRole())) {
                Optional<LivestreamRoom> room = roomRepository.findById(roomId);
                if (room.isPresent()) {
                    roomService.updateViewerCount(room.get().getRoomName(), -1);
                }
            }
            
            log.info("Participant removed successfully");
        }
    }

    /**
     * Lấy danh sách participants đang hoạt động trong phòng
     */
    public List<LivestreamParticipant> getActiveParticipants(Long roomId) {
        return participantRepository.findByRoomIdAndStatus(roomId, "ACTIVE");
    }

    /**
     * Kiểm tra xem user có phải là host của phòng
     */
    public boolean isRoomHost(Long roomId, Long userId) {
        Optional<LivestreamParticipant> participant = participantRepository.findByRoomIdAndUserId(roomId, userId);
        return participant.isPresent() && "HOST".equals(participant.get().getRole());
    }

    /**
     * Kiểm tra xem user đã tham gia phòng
     */
    public boolean isParticipantInRoom(Long roomId, Long userId) {
        Optional<LivestreamParticipant> participant = participantRepository.findByRoomIdAndUserId(roomId, userId);
        return participant.isPresent() && "ACTIVE".equals(participant.get().getStatus());
    }
}
