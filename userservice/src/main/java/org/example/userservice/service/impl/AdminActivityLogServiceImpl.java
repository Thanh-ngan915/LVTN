package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.AdminActivityLogDTO;
import org.example.userservice.dto.AdminActivityRequest;
import org.example.userservice.entity.AdminActivityLog;
import org.example.userservice.repository.AdminActivityLogRepository;
import org.example.userservice.service.AdminActivityLogService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminActivityLogServiceImpl implements AdminActivityLogService {

    private final AdminActivityLogRepository repository;

    @Override
    public AdminActivityLogDTO logActivity(AdminActivityRequest request) {
        AdminActivityLog log = AdminActivityLog.builder()
                .adminId(request.getAdminId())
                .adminName(request.getAdminName())
                .action(request.getAction())
                .target(request.getTarget())
                .category(request.getCategory())
                .isRead(false)
                .build();
        AdminActivityLog saved = repository.save(log);
        return toDTO(saved);
    }

    @Override
    public List<AdminActivityLogDTO> getAllLogs() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public long countUnread() {
        return repository.countByIsReadFalse();
    }

    @Override
    public void markAllAsRead() {
        repository.markAllAsRead();
    }

    @Override
    public void clearAll() {
        repository.deleteAllLogs();
    }

    private AdminActivityLogDTO toDTO(AdminActivityLog entity) {
        return AdminActivityLogDTO.builder()
                .id(entity.getId())
                .adminId(entity.getAdminId())
                .adminName(entity.getAdminName())
                .action(entity.getAction())
                .target(entity.getTarget())
                .category(entity.getCategory())
                .isRead(entity.getIsRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
