package org.example.livetreamservice.repository;

import org.example.livetreamservice.entity.LivestreamRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface LivestreamRoomRepository extends JpaRepository<LivestreamRoom, Long> {
    Optional<LivestreamRoom> findByRoomName(String roomName);
    List<LivestreamRoom> findByStatus(String status);
    List<LivestreamRoom> findByHostId(Long hostId);
    Optional<LivestreamRoom> findByRoomNameAndHostId(String roomName, Long hostId);
}
