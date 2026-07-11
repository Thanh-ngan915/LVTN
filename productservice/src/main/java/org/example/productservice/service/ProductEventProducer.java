package org.example.productservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.productservice.dto.ProductEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductEventProducer {

    private static final String TOPIC = "product-created";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendProductCreatedEvent(ProductEvent event) {
        log.info("Sending product event to Kafka topic {}: {}", TOPIC, event);
        kafkaTemplate.send(TOPIC, String.valueOf(event.getId()), event);
    }
}
