package org.example.userservice.service;

import org.example.userservice.dto.AdminActivityLogDTO;
import org.example.userservice.dto.AdminActivityRequest;

import java.util.List;

public interface AdminActivityLogService {

    /** Ghi log một hành động của admin */
    AdminActivityLogDTO logActivity(AdminActivityRequest request);

    /** Lấy toàn bộ log, mới nhất trước */
    List<AdminActivityLogDTO> getAllLogs();

    /** Đếm số log chưa đọc */
    long countUnread();

    /** Đánh dấu tất cả là đã đọc */
    void markAllAsRead();

    /** Xóa toàn bộ log */
    void clearAll();
}
