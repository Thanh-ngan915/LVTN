package org.example.productservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Client gọi sang store-service để lấy storeId của user hiện tại từ Access Token.
 * Luồng: Token -> userId -> store-service /api/stores/my-store -> storeId
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class StoreClient {

    private final WebClient webClient;

    @Value("${store.service.url:http://localhost:8090}")
    private String storeServiceUrl;

    /**
     * Gọi store-service lấy thông tin shop của userId.
     * Truyền token gốc để store-service có thể xác thực nếu cần.
     *
     * @param userId userId lấy từ JWT token
     * @param bearerToken Access token đầy đủ (Bearer xxx)
     * @return storeId (UUID) hoặc null nếu user chưa có shop
     */
    public String getStoreIdByUserId(String userId, String bearerToken) {
        try {
            Map<?, ?> response = webClient.get()
                    .uri(storeServiceUrl + "/api/stores/my-store?userId=" + userId)
                    .header("Authorization", bearerToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("id")) {
                String storeId = (String) response.get("id");
                log.info("Resolved storeId {} for userId {}", storeId, userId);
                return storeId;
            }
        } catch (Exception e) {
            log.warn("Could not fetch store for userId {}: {}", userId, e.getMessage());
        }
        return null;
    }
}
