package org.example.userservice.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.userservice.entity.Policy;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PolicyEventProducer {

    private static final String TOPIC = "policy-events";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishPolicyCreated(Policy policy) {
        PolicyEvent event = new PolicyEvent("CREATED", policy.getId());
        kafkaTemplate.send(TOPIC, String.valueOf(policy.getId()), event);
    }

    public void publishPolicyUpdated(Policy policy) {
        PolicyEvent event = new PolicyEvent("UPDATED", policy.getId());
        kafkaTemplate.send(TOPIC, String.valueOf(policy.getId()), event);
    }

    public void publishPolicyDeleted(String policyId) {
        PolicyEvent event = new PolicyEvent("DELETED", policyId);
        kafkaTemplate.send(TOPIC, policyId, event);
    }

    @Data
    @AllArgsConstructor
    public static class PolicyEvent {
        private String eventType;
        private String policyId;
    }
}
