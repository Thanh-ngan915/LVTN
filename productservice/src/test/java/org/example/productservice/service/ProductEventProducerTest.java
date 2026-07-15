package org.example.productservice.service;

import org.example.productservice.dto.ProductEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class ProductEventProducerTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    private ProductEventProducer productEventProducer;

    @BeforeEach
    void setUp() {
        productEventProducer = new ProductEventProducer(kafkaTemplate);
    }

    @Test
    void testSendProductCreatedEvent() {
        ProductEvent event = ProductEvent.builder()
                .id(1)
                .name("Test Product")
                .description("Test Description")
                .categoryName("Test Category")
                .build();

        productEventProducer.sendProductCreatedEvent(event);

        verify(kafkaTemplate).send(eq("product-created"), eq("1"), eq(event));
    }
}
