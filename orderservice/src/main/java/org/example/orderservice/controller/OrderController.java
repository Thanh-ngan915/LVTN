package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.service.GhtkService;
import org.example.orderservice.service.OrderService;
import org.example.orderservice.service.RatingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final RatingService ratingService;
    private final GhtkService ghtkService;
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

    /**
     * Tính phí vận chuyển qua GHTK API
     * POST /api/orders/shipping-fee
     */
    @PostMapping("/shipping-fee")
    public ResponseEntity<ApiResponse<ShippingFeeResponseDTO>> calculateShippingFee(
            @RequestBody ShippingFeeRequestDTO request
    ) {
        try {
            ShippingFeeResponseDTO result = ghtkService.calculateShippingFee(request);
            return ResponseEntity.ok(ApiResponse.success(result, "Tính phí vận chuyển thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi tính phí vận chuyển: " + e.getMessage()));
        }
    }

    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingDTO>> createRating(
            @RequestBody RatingRequestDTO  request,
            @RequestHeader(value = "X-User-Name", required = false) String username
    ){
        try {
            if (username == null || username.isBlank()) {
                return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
            }
            RatingDTO rating = ratingService.createRating(request, username);
            return ResponseEntity.ok(ApiResponse.success(rating, "Đánh giá thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/ratings/product/{productId}")
    public ResponseEntity<ApiResponse<Page<RatingDTO>>> getRatingsByProduct(
            @PathVariable Integer productId,
            @RequestParam(required = false) Integer star,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RatingDTO> ratings = ratingService.getRatingsByProductId(productId, star, pageable);
        return ResponseEntity.ok(ApiResponse.success(ratings, "OK"));
    }

    /**
     * Lấy thống kê đơn hàng theo phòng Livestream
     * GET /api/orders/livestream/{roomId}/stats
     */
    @GetMapping("/livestream/{roomId}/stats")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getLivestreamStats(@PathVariable Long roomId) {
        try {
            java.util.Map<String, Object> stats = orderService.getLivestreamStats(roomId);
            return ResponseEntity.ok(ApiResponse.success(stats, "Lấy thống kê thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi lấy thống kê: " + e.getMessage()));
        }
    }

}
//    public ResponseEntity<ApiResponse<Page<RatingDTO>>> getRatingsByProduct(
//            @PathVariable Integer productId,
//            @RequestParam(required = false) Integer star,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//        Page<RatingDTO> ratings = ratingService.getRatingsByProductId(productId, star, pageable);
//        return ResponseEntity.ok(ApiResponse.success(ratings, "OK"));
//    }
