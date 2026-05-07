package org.example.orderservice.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.dto.UserSyncMessage;
import org.example.orderservice.entity.UserLocal;
import org.example.orderservice.repository.UserLocalRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "spring.kafka.bootstrap-servers")
public class UserSyncConsumer {

    private final UserLocalRepository userLocalRepository;

    /**
     * Lắng nghe topic "user-sync" để đồng bộ dữ liệu user từ usersdb → ordersdb
     */
    @KafkaListener(topics = "user-sync", groupId = "orderservice-group")
    public void consumeUserSync(UserSyncMessage message) {
        log.info("Received user sync message: userId={}, username={}, action={}",
                message.getUserId(), message.getUsername(), message.getAction());

        try {
            Optional<UserLocal> existingUser = userLocalRepository.findById(message.getUserId());

            if (existingUser.isPresent()) {
                // Update existing user
                UserLocal user = existingUser.get();
                if (message.getFullName() != null) user.setFullName(message.getFullName());
                if (message.getImage() != null) user.setImage(message.getImage());
                if (message.getUsername() != null) user.setUsername(message.getUsername());
                userLocalRepository.save(user);
                log.info("Updated user_local: userId={}", message.getUserId());
            } else {
                // Create new user
                UserLocal user = UserLocal.builder()
                        .id(message.getUserId())
                        .fullName(message.getFullName())
                        .image(message.getImage())
                        .username(message.getUsername())
                        .build();
                userLocalRepository.save(user);
                log.info("Created user_local: userId={}", message.getUserId());
            }
        } catch (Exception e) {
            log.error("Failed to process user sync message: {}", e.getMessage(), e);
        }
    }
}
