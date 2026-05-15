package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Tạo đơn hàng mới (Mua Ngay)
     * POST /api/orders
     * Header: X-User-Id: userId
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(
            @RequestBody OrderRequestDTO request,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        try {
            if (userId == null || userId.isBlank()) {
                return ResponseEntity.status(401)
                        .body(ApiResponse.error("Vui lòng đăng nhập để đặt hàng"));
            }
            OrderResponseDTO order = orderService.createOrder(request, userId);
            return ResponseEntity.ok(ApiResponse.success(order, "Đặt hàng thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Lấy thông tin đơn hàng theo ID
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(@PathVariable Integer id) {
        try {
            OrderResponseDTO order = orderService.getOrderById(id);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Lấy danh sách đơn hàng của user
     * GET /api/orders/user
     * Header: X-User-Id: userId
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getOrdersByUser(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        try {
            if (userId == null || userId.isBlank()) {
                return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
            }
            List<OrderResponseDTO> orders = orderService.getOrdersByUser(userId);
            return ResponseEntity.ok(ApiResponse.success(orders, "Lấy đơn hàng thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Lấy voucher theo shop
     * GET /api/orders/vouchers/{storeId}
     */
    @GetMapping("/vouchers/{storeId}")
    public ResponseEntity<ApiResponse<List<VoucherDTO>>> getVouchersByStore(
            @PathVariable String storeId
    ) {
        try {
            List<VoucherDTO> vouchers = orderService.getVouchersByStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(vouchers, "Lấy voucher thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi lấy voucher: " + e.getMessage()));
        }
    }

    /**
     * Lấy địa chỉ giao hàng của user
     * GET /api/orders/delivery
     * Header: X-User-Id: userId
     */
    @GetMapping("/delivery")
    public ResponseEntity<ApiResponse<List<DeliveryInformationDTO>>> getDeliveryByUser(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        try {
            if (userId == null || userId.isBlank()) {
                return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
            }
            List<DeliveryInformationDTO> deliveries = orderService.getDeliveriesByUser(userId);
            return ResponseEntity.ok(ApiResponse.success(deliveries, "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> cancelOrder(
            @PathVariable Integer id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        try {
            if (userId == null || userId.isBlank()) {
                return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
            }
            OrderResponseDTO order = orderService.cancelOrder(id, userId);
            return ResponseEntity.ok(ApiResponse.success(order, "Hủy đơn hàng thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    
}
