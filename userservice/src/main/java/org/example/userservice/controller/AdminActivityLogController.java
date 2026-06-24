package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.AdminActivityLogDTO;
import org.example.userservice.dto.AdminActivityRequest;
import org.example.userservice.service.AdminActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/activities")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminActivityLogController {

    private final AdminActivityLogService activityLogService;

    /**
     * POST /api/admin/activities
     * Ghi log hành động mới của admin
     */
    @PostMapping
    public ResponseEntity<AdminActivityLogDTO> logActivity(@RequestBody AdminActivityRequest request) {
        AdminActivityLogDTO dto = activityLogService.logActivity(request);
        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/admin/activities
     * Lấy toàn bộ danh sách log (mới nhất trước)
     */
    @GetMapping
    public ResponseEntity<List<AdminActivityLogDTO>> getAllLogs() {
        return ResponseEntity.ok(activityLogService.getAllLogs());
    }

    /**
     * GET /api/admin/activities/unread-count
     * Đếm số thông báo chưa đọc — dùng để hiển thị badge
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = activityLogService.countUnread();
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * PATCH /api/admin/activities/read-all
     * Đánh dấu tất cả thông báo là đã đọc
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        activityLogService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/admin/activities
     * Xóa toàn bộ log
     */
    @DeleteMapping
    public ResponseEntity<Void> clearAll() {
        activityLogService.clearAll();
        return ResponseEntity.ok().build();
    }
}
