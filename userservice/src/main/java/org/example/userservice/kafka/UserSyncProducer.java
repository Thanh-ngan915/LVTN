package org.example.userservice.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.dto.UserSyncMessage;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "spring.kafka.bootstrap-servers")
public class UserSyncProducer {

    private final KafkaTemplate<String, UserSyncMessage> kafkaTemplate;

    private static final String TOPIC = "user-sync";

    /**
     * Gửi thông tin user đến topic "user-sync" để các service khác đồng bộ
     */
    public void sendUserSync(UserSyncMessage message) {
        try {
            kafkaTemplate.send(TOPIC, message.getUserId(), message);
            log.info("Sent user sync message: userId={}, username={}, action={}",
                    message.getUserId(), message.getUsername(), message.getAction());
        } catch (Exception e) {
            log.error("Failed to send user sync message: {}", e.getMessage(), e);
        }
    }
}
