package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
public class SellerOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getStoreOrders(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrdersBySellerUserId(userId, status, token),
                    "Lấy danh sách đơn hàng thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<SellerOrderStatsDTO>> getOrderStats(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrderStatsBySellerUserId(userId, token), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderDetail(
            @PathVariable Integer orderId,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrderDetailForSeller(orderId, userId, token), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }


    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestBody SellerOrderUpdateDTO updateDTO,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.updateOrderStatusBySeller(orderId, updateDTO, userId, token),
                    "Cập nhật trạng thái thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/flow")
    public ResponseEntity<ApiResponse<List<OrderFlowDTO>>> getOrderFlow(
            @PathVariable Integer orderId,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrderFlow(orderId, userId, token), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/refunds")
    public ResponseEntity<ApiResponse<List<OrderRefundDTO>>> getRefunds(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getRefundsByStore(userId, status, token),
                    "Lấy danh sách hoàn trả thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/refunds/{refundId}/review")
    public ResponseEntity<ApiResponse<OrderRefundDTO>> reviewRefund(
            @PathVariable String refundId,
            @RequestBody OrderRefundReviewDTO reviewDTO,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.reviewRefund(refundId, reviewDTO, userId, token),
                    "Xử lý yêu cầu hoàn trả thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer "))
            return authHeader.substring(7);
        return null;
    }
}