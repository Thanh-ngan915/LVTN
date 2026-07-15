package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.ApiResponse;
import org.example.orderservice.dto.ComplaintResponseDTO;
import org.example.orderservice.dto.ComplaintShopReplyDTO;
import org.example.orderservice.service.ComplaintService;
import org.example.orderservice.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/complaints")
@RequiredArgsConstructor
public class SellerComplaintController {

    private final ComplaintService complaintService;
    private final OrderService orderService;

    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer "))
            return authHeader.substring(7);
        return null;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintResponseDTO>>> getStoreComplaints(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            String storeId = orderService.getStoreIdByUserId(userId, token);
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.getStoreComplaints(storeId), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{complaintId}/reply")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> replyComplaint(
            @PathVariable String complaintId,
            @RequestBody ComplaintShopReplyDTO req,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        String token = extractToken(authHeader);
        try {
            String storeId = orderService.getStoreIdByUserId(userId, token);
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.replyComplaintByShop(complaintId, storeId, req),
                    "Phản hồi khiếu nại thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
