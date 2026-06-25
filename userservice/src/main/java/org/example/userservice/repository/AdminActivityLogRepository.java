package org.example.userservice.repository;

import org.example.userservice.entity.AdminActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Long> {

    /** Lấy tất cả log, sắp xếp mới nhất trước */
    List<AdminActivityLog> findAllByOrderByCreatedAtDesc();

    /** Đếm số log chưa đọc */
    long countByIsReadFalse();

    /** Đánh dấu tất cả là đã đọc */
    @Modifying
    @Transactional
    @Query("UPDATE AdminActivityLog a SET a.isRead = true WHERE a.isRead = false")
    void markAllAsRead();

    /** Xóa tất cả log */
    @Modifying
    @Transactional
    @Query("DELETE FROM AdminActivityLog")
    void deleteAllLogs();
}
