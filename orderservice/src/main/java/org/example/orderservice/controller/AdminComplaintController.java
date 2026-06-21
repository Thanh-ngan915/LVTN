package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.AdminResolveDTO;
import org.example.orderservice.dto.ApiResponse;
import org.example.orderservice.dto.ComplaintResponseDTO;
import org.example.orderservice.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")  // Chỉ ADMIN mới được vào controller này
public class AdminComplaintController {

    private final ComplaintService complaintService;

    /** Lấy adminId từ JWT (SecurityContext), không dùng header thủ công */
    private String getCurrentAdminId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        Object principal = auth.getPrincipal();
        return principal instanceof String ? (String) principal : null;
    }

    /** GET /api/complaints/admin/pending */
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDTO>>> pending() {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.getPendingComplaints(), "OK"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** POST /api/complaints/admin/{complaintId}/approve */
    @PostMapping("/{complaintId}/approve")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> approve(
            @PathVariable String complaintId,
            @RequestBody AdminResolveDTO req
    ) {
        String adminId = getCurrentAdminId();
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.approveComplaint(complaintId, adminId, req),
                    "✅ Chấp thuận - Đã hoàn tiền cho khách"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** POST /api/complaints/admin/{complaintId}/reject */
    @PostMapping("/{complaintId}/reject")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> reject(
            @PathVariable String complaintId,
            @RequestBody AdminResolveDTO req
    ) {
        String adminId = getCurrentAdminId();
        try {
            return ResponseEntity.ok(ApiResponse.success(
                    complaintService.rejectComplaint(complaintId, adminId, req),
                    "❌ Từ chối - Shop giữ tiền"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}