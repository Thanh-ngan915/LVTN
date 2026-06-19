package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.AdminResolveDTO;
import org.example.orderservice.dto.ApiResponse;
import org.example.orderservice.dto.ComplaintResponseDTO;
import org.example.orderservice.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints/admin")
@RequiredArgsConstructor
public class AdminComplaintController {

    private final ComplaintService complaintService;

    /** GET /api/admin/complaints/pending */
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDTO>>> pending(
            @RequestHeader(value = "X-User-Id", required = false) String adminId
    ) {
        if (adminId == null || adminId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.getPendingComplaints(), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** POST /api/admin/complaints/{complaintId}/approve */
    @PostMapping("/{complaintId}/approve")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> approve(
            @PathVariable String complaintId,
            @RequestBody AdminResolveDTO req,
            @RequestHeader(value = "X-User-Id", required = false) String adminId
    ) {
        if (adminId == null || adminId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.approveComplaint(complaintId, adminId, req),
                    "✅ Chấp thuận - Đã hoàn tiền cho khách"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** POST /api/admin/complaints/{complaintId}/reject */
    @PostMapping("/{complaintId}/reject")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> reject(
            @PathVariable String complaintId,
            @RequestBody AdminResolveDTO req,
            @RequestHeader(value = "X-User-Id", required = false) String adminId
    ) {
        if (adminId == null || adminId.isBlank())
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.rejectComplaint(complaintId, adminId, req),
                    "❌ Từ chối - Shop giữ tiền"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}