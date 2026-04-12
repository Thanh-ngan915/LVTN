package org.example.livetreamservice.repository;

import org.example.livetreamservice.entity.LivestreamParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivestreamParticipantRepository extends JpaRepository<LivestreamParticipant, Long> {
    List<LivestreamParticipant> findByRoomId(Long roomId);
    List<LivestreamParticipant> findByRoomIdAndStatus(Long roomId, String status);
    Optional<LivestreamParticipant> findByRoomIdAndUserId(Long roomId, Long userId);
    Optional<LivestreamParticipant> findByRoomIdAndUsername(Long roomId, String username);
    List<LivestreamParticipant> findByUserIdAndStatus(Long userId, String status);
}
