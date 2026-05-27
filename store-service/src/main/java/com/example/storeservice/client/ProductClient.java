package com.example.storeservice.client;

import com.example.storeservice.dto.ProductDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Component
@RequiredArgsConstructor
public class ProductClient {

    private final RestTemplate restTemplate;

    @Value("${product.service.url}")
    private String productServiceUrl;

    @Data
    static class ProductResponse {
        private ProductDTO data;
    }

    public ProductDTO getProductById(String productId, String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<ProductResponse> response = restTemplate.exchange(
                productServiceUrl + "/api/products/" + productId,
                HttpMethod.GET,
                entity,
                ProductResponse.class
        );
        return response.getBody().getData();
    }
}