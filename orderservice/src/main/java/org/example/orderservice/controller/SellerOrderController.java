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

    /**
     * Danh sách đơn hàng của shop, lọc theo status (tuỳ chọn).
     * GET /api/seller/orders?status=pending
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getStoreOrders(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) String status
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrdersBySellerUserId(userId, status),
                    "Lấy danh sách đơn hàng thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Thống kê đơn hàng shop: doanh thu, số đơn theo trạng thái.
     * GET /api/seller/orders/stats
     *
     * QUAN TRỌNG: endpoint này phải khai báo TRƯỚC /{orderId}
     * để tránh Spring hiểu "stats" là orderId.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<SellerOrderStatsDTO>> getOrderStats(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrderStatsBySellerUserId(userId), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Chi tiết một đơn hàng (chỉ seller của shop đó mới xem được).
     * GET /api/seller/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderDetail(
            @PathVariable Integer orderId,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrderDetailForSeller(orderId, userId), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng.
     * PUT /api/seller/orders/{orderId}/status
     * Body: { "status": "confirmed", "note": "..." }
     *
     * Các chuyển trạng thái hợp lệ:
     *   pending   → confirmed  (xác nhận đơn)
     *   pending   → cancelled  (từ chối đơn)
     *   confirmed → shipping   (giao cho vận chuyển)
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestBody SellerOrderUpdateDTO updateDTO,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.updateOrderStatusBySeller(orderId, updateDTO, userId),
                    "Cập nhật trạng thái thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Lịch sử thay đổi trạng thái của đơn hàng (audit trail).
     * GET /api/seller/orders/{orderId}/flow
     */
    @GetMapping("/{orderId}/flow")
    public ResponseEntity<ApiResponse<List<OrderFlowDTO>>> getOrderFlow(
            @PathVariable Integer orderId,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getOrderFlow(orderId, userId), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // =========================================================================
    // HOÀN TRẢ (REFUND)
    // =========================================================================

    /**
     * Seller xem danh sách yêu cầu hoàn trả của shop.
     * GET /api/seller/orders/refunds?status=pending
     */
    @GetMapping("/refunds")
    public ResponseEntity<ApiResponse<List<OrderRefundDTO>>> getRefunds(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) String status
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.getRefundsByStore(userId, status),
                    "Lấy danh sách hoàn trả thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Seller duyệt hoặc từ chối yêu cầu hoàn trả.
     * PUT /api/seller/orders/refunds/{refundId}/review
     * Body: { "status": "approved" | "rejected", "note": "..." }
     */
    @PutMapping("/refunds/{refundId}/review")
    public ResponseEntity<ApiResponse<OrderRefundDTO>> reviewRefund(
            @PathVariable String refundId,
            @RequestBody OrderRefundReviewDTO reviewDTO,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    orderService.reviewRefund(refundId, reviewDTO, userId),
                    "Xử lý yêu cầu hoàn trả thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}