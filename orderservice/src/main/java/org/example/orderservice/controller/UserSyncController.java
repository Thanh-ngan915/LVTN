package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.dto.ApiResponse;
import org.example.orderservice.entity.UserLocal;
import org.example.orderservice.repository.UserLocalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * REST endpoint thay thế Kafka để đồng bộ user thủ công.
 * Sử dụng khi không bật Kafka.
 */
@RestController
@RequestMapping("/api/user-sync")
@RequiredArgsConstructor
@Slf4j
public class UserSyncController {

    private final UserLocalRepository userLocalRepository;

    /**
     * Đồng bộ user từ usersdb → ordersdb (thay thế Kafka)
     * POST /api/user-sync
     * Body: { "userId": "...", "username": "...", "fullName": "...", "image": "..." }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserLocal>> syncUser(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String username = body.get("username");
        String fullName = body.get("fullName");
        String image = body.get("image");

        if (userId == null || username == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("userId và username là bắt buộc"));
        }

        try {
            Optional<UserLocal> existing = userLocalRepository.findById(userId);
            UserLocal user;
            if (existing.isPresent()) {
                user = existing.get();
                if (fullName != null) user.setFullName(fullName);
                if (image != null) user.setImage(image);
                if (username != null) user.setUsername(username);
                userLocalRepository.save(user);
                log.info("Updated user_local via REST: userId={}", userId);
            } else {
                user = UserLocal.builder()
                        .id(userId)
                        .fullName(fullName)
                        .image(image)
                        .username(username)
                        .build();
                userLocalRepository.save(user);
                log.info("Created user_local via REST: userId={}", userId);
            }
            return ResponseEntity.ok(ApiResponse.success(user, "User synced successfully"));
        } catch (Exception e) {
            log.error("Failed to sync user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Sync failed: " + e.getMessage()));
        }
    }
}
