package org.example.orderservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.entity.Order;
import org.example.orderservice.repository.OrderRepository;
import org.example.orderservice.service.VNPayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class VNPayController {

    private final VNPayService vnPayService;
    private final OrderRepository orderRepository;

    // ──────────────────────────────────────────────────────────────────────
    // 1. Tạo URL thanh toán VNPay (cổng chung) – gọi sau khi đã tạo đơn
    // POST /api/orders/vnpay-payment
    // ──────────────────────────────────────────────────────────────────────
    @PostMapping("/vnpay-payment")
    public ResponseEntity<ApiResponse<VNPayPaymentResponseDTO>> createPayment(
            @RequestBody VNPayPaymentRequestDTO request,
            HttpServletRequest httpRequest
    ) {
        try {
            String baseUrl = getBaseUrl(httpRequest);
            String orderId = String.valueOf(request.getOrderId());
            String orderInfo = "Thanh toan don hang #" + orderId;
            String paymentUrl = vnPayService.createOrder(request.getAmount(), orderInfo, baseUrl, orderId, httpRequest);

            VNPayPaymentResponseDTO response = VNPayPaymentResponseDTO.builder()
                    .paymentUrl(paymentUrl)
                    .orderId(request.getOrderId())
                    .build();

            return ResponseEntity.ok(ApiResponse.success(response, "Tạo URL thanh toán thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi tạo thanh toán: " + e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    // 2. Tạo URL thanh toán bằng VÍ VNPay (vnp_BankCode = VNPAYQR)
    // POST /api/orders/vnpay-wallet-payment
    // ──────────────────────────────────────────────────────────────────────
    @PostMapping("/vnpay-wallet-payment")
    public ResponseEntity<ApiResponse<VNPayPaymentResponseDTO>> createWalletPayment(
            @RequestBody VNPayPaymentRequestDTO request,
            HttpServletRequest httpRequest
    ) {
        try {
            String baseUrl = getBaseUrl(httpRequest);
            String orderId = String.valueOf(request.getOrderId());
            String orderInfo = "Thanh toan vi VNPay don hang #" + orderId;
            String paymentUrl = vnPayService.createOrderWithWallet(request.getAmount(), orderInfo, baseUrl, orderId, httpRequest);

            VNPayPaymentResponseDTO response = VNPayPaymentResponseDTO.builder()
                    .paymentUrl(paymentUrl)
                    .orderId(request.getOrderId())
                    .build();

            return ResponseEntity.ok(ApiResponse.success(response, "Tạo URL thanh toán ví VNPay thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Lỗi tạo thanh toán ví: " + e.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    // 3. Nhận callback từ VNPay sau khi thanh toán
    // GET /api/orders/vnpay-callback
    // ──────────────────────────────────────────────────────────────────────
    @GetMapping("/vnpay-callback")
    public ResponseEntity<ApiResponse<String>> vnpayCallback(HttpServletRequest request) {
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo      = request.getParameter("vnp_OrderInfo");
        String transactionNo  = request.getParameter("vnp_TransactionNo");
        String amountStr      = request.getParameter("vnp_Amount");
        String responseCode   = request.getParameter("vnp_ResponseCode");

        if (paymentStatus == 1) {
            // Thanh toán thành công – cập nhật paymentStatus của đơn hàng
            updateOrderPaymentStatus(orderInfo, "paid");
            return ResponseEntity.ok(
                ApiResponse.success(transactionNo,
                    "Thanh toán thành công! Mã GD: " + transactionNo)
            );
        } else if (paymentStatus == 0) {
            // Thanh toán thất bại / bị huỷ
            updateOrderPaymentStatus(orderInfo, "failed");
            return ResponseEntity.ok(
                ApiResponse.<String>builder()
                    .success(false)
                    .message("Thanh toán thất bại hoặc bị huỷ (ResponseCode: " + responseCode + ")")
                    .build()
            );
        } else {
            // Sai chữ ký
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Chữ ký không hợp lệ"));
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Cập nhật paymentStatus cho đơn hàng dựa vào vnp_OrderInfo
     * vnp_OrderInfo format: "Thanh toan don hang #<orderId>"
     */
    private void updateOrderPaymentStatus(String orderInfo, String status) {
        if (orderInfo == null) return;
        try {
            // Tách orderId từ chuỗi orderInfo
            String idStr = orderInfo.replaceAll(".*#(\\d+).*", "$1");
            Integer orderId = Integer.parseInt(idStr.trim());
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            orderOpt.ifPresent(order -> {
                order.setPaymentStatus(status);
                if ("paid".equals(status)) {
                    order.setStatus("confirmed");
                }
                orderRepository.save(order);
            });
        } catch (Exception e) {
            // Log nhưng không throw – tránh ảnh hưởng response callback
            System.err.println("[VNPay] Lỗi cập nhật đơn hàng: " + e.getMessage());
        }
    }

    private String getBaseUrl(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }
}
