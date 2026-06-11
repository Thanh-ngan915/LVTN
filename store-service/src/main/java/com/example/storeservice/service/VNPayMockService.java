// com/example/storeservice/service/VNPayMockService.java
package com.example.storeservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
public class VNPayMockService {

    private final Random random = new Random();

    public record DisburseResult(
            boolean success,
            String transactionCode,  // VNP-xxxx nếu success
            String failReason         // lý do nếu failed
    ) {}

    /**
     * Giả lập VNPay chuyển tiền ra tài khoản ngân hàng.
     * Delay 1-3 giây, 85% thành công, 15% thất bại.
     */
    public DisburseResult disburse(String storeId, Double amount,
                                   String bankAccount, String bankName) {
        log.info("[VNPay Mock] Disbursing {} to {} - {}", amount, bankName, bankAccount);

        // Giả lập thời gian xử lý
        try {
            long delay = 1000 + random.nextInt(2000); // 1-3 giây
            Thread.sleep(delay);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 85% thành công
        boolean success = random.nextInt(100) < 85;

        if (success) {
            String txCode = "VNP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            log.info("[VNPay Mock] SUCCESS - txCode: {}", txCode);
            return new DisburseResult(true, txCode, null);
        } else {
            // Các lý do thất bại ngẫu nhiên
            String[] reasons = {
                    "Số tài khoản không tồn tại",
                    "Ngân hàng thụ hưởng tạm thời gián đoạn",
                    "Vượt hạn mức giao dịch trong ngày",
                    "Tên chủ tài khoản không khớp"
            };
            String reason = reasons[random.nextInt(reasons.length)];
            log.warn("[VNPay Mock] FAILED - reason: {}", reason);
            return new DisburseResult(false, null, reason);
        }
    }
}