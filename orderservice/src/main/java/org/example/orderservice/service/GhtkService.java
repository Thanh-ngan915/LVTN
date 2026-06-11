package org.example.orderservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.dto.ShippingFeeRequestDTO;
import org.example.orderservice.dto.ShippingFeeResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Service tích hợp API Giao Hàng Tiết Kiệm (GHTK) để tính phí vận chuyển.
 * API docs: https://docs.giaohangtietkiem.vn/#tinh-phi-dich-vu
 */
@Slf4j
@Service
public class GhtkService {

    private static final String GHTK_FEE_URL = "https://services.giaohangtietkiem.vn/services/shipment/fee";
    private static final float DEFAULT_FEE = 30_000f;

    @Value("${ghtk.api-token}")
    private String apiToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Tính phí vận chuyển qua GHTK API.
     * Nếu gọi API thất bại → trả về phí mặc định 30,000đ.
     */
    public ShippingFeeResponseDTO calculateShippingFee(ShippingFeeRequestDTO request) {
        try {
            // Validate địa chỉ người nhận
            if (isEmpty(request.getProvince()) || isEmpty(request.getDistrict())) {
                return defaultFee("Thiếu địa chỉ người nhận");
            }

            // Địa chỉ giao hàng mặc định của shop (Hà Nội - TP.HCM cho môi trường test)
            String pickProvince = isEmpty(request.getPickProvince()) ? "TP. Hồ Chí Minh" : request.getPickProvince();
            String pickDistrict = isEmpty(request.getPickDistrict()) ? "Quận 1" : request.getPickDistrict();
            String pickAddress = isEmpty(request.getPickAddress()) ? "1 Nguyễn Huệ" : request.getPickAddress();

            int weight = (request.getWeight() != null && request.getWeight() > 0) ? request.getWeight() : 500;
            int value = (request.getValue() != null && request.getValue() > 0) ? Math.round(request.getValue()) : 0;

            // Build URL với query params (dùng fromUriString cho Spring 6+)
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(GHTK_FEE_URL)
                    .queryParam("pick_province", pickProvince)
                    .queryParam("pick_district", pickDistrict)
                    .queryParam("pick_address", pickAddress)
                    .queryParam("province", request.getProvince())
                    .queryParam("district", request.getDistrict())
                    .queryParam("weight", weight)
                    .queryParam("value", value)
                    .queryParam("transport", "road"); // road = đường bộ, fly = đường hàng không

            if (!isEmpty(request.getWard())) {
                builder.queryParam("ward", request.getWard());
            }
            if (!isEmpty(request.getAddress())) {
                builder.queryParam("address", request.getAddress());
            }

            java.net.URI uri = builder.build().encode().toUri();
            log.info("Gọi GHTK API: {}", uri.toString());

            // Set headers với API token
            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", apiToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Raw GHTK response: {}", response.getBody());
                return parseGhtkResponse(response.getBody());
            } else {
                log.warn("GHTK trả về HTTP {}", response.getStatusCode());
                return defaultFee("GHTK không phản hồi hợp lệ");
            }

        } catch (Exception e) {
            log.error("Lỗi gọi GHTK API: {}", e.getMessage());
            return defaultFee("Lỗi kết nối GHTK: " + e.getMessage());
        }
    }

    /**
     * Parse response JSON từ GHTK:
     * {
     *   "success": true,
     *   "message": "OK! Tính phí vận chuyển thành công.",
     *   "fee": {
     *     "name": "Chuyển phát thường",
     *     "fee": 22000,
     *     "insurance_fee": 0,
     *     "include_vat": 0,
     *     "cost_id": "V1",
     *     "delivery_type": "xteam",
     *     "a": 22000,
     *     "dt": "2nd"
     *   }
     * }
     */
    private ShippingFeeResponseDTO parseGhtkResponse(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            boolean success = root.path("success").asBoolean(false);

            if (!success) {
                String msg = root.path("message").asText("GHTK thất bại");
                log.warn("GHTK báo lỗi: {}", msg);
                return defaultFee(msg);
            }

            JsonNode feeNode = root.path("fee");
            float fee = (float) feeNode.path("fee").asDouble(DEFAULT_FEE);
            float insuranceFee = (float) feeNode.path("insurance_fee").asDouble(0);
            String serviceName = feeNode.path("name").asText("Chuyển phát thường");
            String dt = feeNode.path("dt").asText("");
            String message = root.path("message").asText("OK");

            // Estimate delivery days from "dt" field (e.g., "2nd" = 2 days)
            int deliveryDays = estimateDeliveryDays(dt);

            log.info("GHTK tính phí thành công: {}đ, dịch vụ: {}", fee, serviceName);

            return ShippingFeeResponseDTO.builder()
                    .fee(fee)
                    .insuranceFee(insuranceFee)
                    .service(serviceName)
                    .deliveryDays(deliveryDays)
                    .serviceLabel(serviceName)
                    .message(message)
                    .fromGhtk(true)
                    .build();

        } catch (Exception e) {
            log.error("Lỗi parse response GHTK: {}", e.getMessage());
            return defaultFee("Lỗi đọc dữ liệu GHTK");
        }
    }

    private int estimateDeliveryDays(String dt) {
        if (dt == null || dt.isBlank()) return 3;
        try {
            // dt có dạng "2nd", "3rd", "1st"...
            String digits = dt.replaceAll("[^0-9]", "");
            return digits.isEmpty() ? 3 : Integer.parseInt(digits);
        } catch (Exception e) {
            return 3;
        }
    }

    private ShippingFeeResponseDTO defaultFee(String reason) {
        log.info("Dùng phí vận chuyển mặc định {}đ. Lý do: {}", DEFAULT_FEE, reason);
        return ShippingFeeResponseDTO.builder()
                .fee(DEFAULT_FEE)
                .insuranceFee(0f)
                .service("Chuyển phát tiêu chuẩn")
                .deliveryDays(3)
                .serviceLabel("Chuyển phát tiêu chuẩn")
                .message(reason)
                .fromGhtk(false)
                .build();
    }

    private boolean isEmpty(String s) {
        return s == null || s.isBlank();
    }
}
