package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.ApiResponse;
import org.example.orderservice.dto.ComplaintRequestDTO;
import org.example.orderservice.dto.ComplaintResponseDTO;
import org.example.orderservice.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    /** POST /api/complaints */
    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> create(
            @RequestBody ComplaintRequestDTO req,
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.createComplaint(userId, req),
                    "Gửi khiếu nại thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** GET /api/complaints/my */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDTO>>> myComplaints(
            @RequestHeader(value = "X-User-Id", required = false) String userId
    ) {
        if (userId == null || userId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.getMyComplaints(userId), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** GET /api/complaints/order/{orderId} */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> getByOrderId(
            @PathVariable Integer orderId
    ) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.getComplaintByOrderId(orderId), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}