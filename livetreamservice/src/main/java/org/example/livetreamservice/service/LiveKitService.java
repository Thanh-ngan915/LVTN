package org.example.livetreamservice.service;

import io.livekit.server.*;
import org.example.livetreamservice.config.LiveKitConfig;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveKitService {
    private final LiveKitConfig livekitConfig;

    /**
     * Tạo access token cho người dùng tham gia phòng live
     * @param roomName Tên phòng
     * @param participantName Tên người tham gia
     * @param canPublish Có thể phát hình không
     * @param canPublishData Có thể phát data không
     * @return Access token JWT string
     */
    public String generateAccessToken(String roomName, String participantName, 
                                      boolean canPublish, boolean canPublishData) {
        try {
            log.info("Generating access token for room: {}, participant: {}, canPublish: {}", 
                     roomName, participantName, canPublish);
            
            // Create access token with LiveKit credentials
            AccessToken token = new AccessToken(
                livekitConfig.getApiKey(), 
                livekitConfig.getApiSecret()
            );
            
            // Set user identity and name
            token.setIdentity(participantName);
            token.setName(participantName);
            
            // Set token grants (permissions)
            token.addGrants(
                new RoomJoin(true),
                new RoomName(roomName),
                new CanPublish(canPublish),
                new CanPublishData(canPublishData),
                new CanSubscribe(true)
            );
            
            // ✅ FIX: Set metadata with room info and use a 24-hour expiration
            String metadata = String.format(
                "{\"room\":\"%s\",\"canPublish\":%b,\"canPublishData\":%b,\"participantName\":\"%s\"}", 
                roomName, canPublish, canPublishData, participantName
            );
            token.setMetadata(metadata);
            
            // Set TTL to 24 hours (86400 seconds)
            token.setTtl(86400);  // seconds

            log.info("Access token generated successfully for participant: {} in room: {}", 
                     participantName, roomName);
            return token.toJwt();
        } catch (Exception e) {
            log.error("Error generating access token: ", e);
            throw new RuntimeException("Failed to generate access token", e);
        }
    }

    /**
     * Tạo access token cho chủ phòng (có thể phát hình)
     */
    public String generateHostToken(String roomName, String participantName) {
        return generateAccessToken(roomName, participantName, true, true);
    }

    /**
     * Tạo access token cho khách (chỉ viewer)
     */
    public String generateViewerToken(String roomName, String participantName) {
        return generateAccessToken(roomName, participantName, false, false);
    }

    /**
     * Xóa phòng từ LiveKit (placeholder - thực hiện qua LiveKit Dashboard)
     */
    public void deleteRoom(String roomName) {
        try {
            log.info("Room deletion request for: {} (managed in LiveKit Cloud)", roomName);
            // LiveKit SDK 0.5.0 không support room deletion method
            // Rooms tự động cleanup sau khi last participant leaves
        } catch (Exception e) {
            log.error("Error deleting room: ", e);
        }
    }

    /**
     * Remove participant khỏi phòng (placeholder - disconnect through client)
     */
    public void removeParticipant(String roomName, String participantName) {
        try {
            log.info("Participant leave request for {} from room: {}", participantName, roomName);
            // LiveKit handles participant removal through client disconnect
            // Tracked in database via LivestreamParticipantService
        } catch (Exception e) {
            log.error("Error removing participant: ", e);
        }
    }
}
