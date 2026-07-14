package com.example.storeservice.service;

import com.example.storeservice.dto.StoreEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreEventProducer {

    private static final String TOPIC = "store-events";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendStoreCreatedEvent(StoreEvent event) {
        event.setAction("CREATE");
        log.info("Sending store event to Kafka topic {}: {}", TOPIC, event);
        kafkaTemplate.send(TOPIC, event.getId(), event);
    }

    public void sendStoreUpdatedEvent(StoreEvent event) {
        event.setAction("UPDATE");
        log.info("Sending store event to Kafka topic {}: {}", TOPIC, event);
        kafkaTemplate.send(TOPIC, event.getId(), event);
    }

    public void sendStoreDeletedEvent(String storeId) {
        StoreEvent event = StoreEvent.builder()
                .action("DELETE")
                .id(storeId)
                .build();
        log.info("Sending store event to Kafka topic {}: {}", TOPIC, event);
        kafkaTemplate.send(TOPIC, storeId, event);
    }
}
