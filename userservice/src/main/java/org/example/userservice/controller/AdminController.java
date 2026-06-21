package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.repository.StoreRoleRepository;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final StoreRoleRepository storeRoleRepository;
    private static final String CAN_MANAGE_USERS =
            "hasRole('ADMIN') and (hasAuthority('PERM_ALL') or hasAuthority('PERM_users'))";

    /**
     * GET /api/admin/stats
     * Thống kê nhanh — tất cả ADMIN đều gọi được (không cần PERM_users)
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();

        // Tổng số user trong DB (bao gồm tất cả 16)
        long total  = userRepository.count();
        long active = userRepository.countByStatus("ACTIVE");
        long banned = userRepository.countByStatus("BANNED");
        long admins = userRepository.countByRole("ADMIN");
        // Đếm SELLER từ user.role — đã được cập nhật đúng khi approveStore()
        long sellers = userRepository.countByRole("SELLER");

        stats.put("total",   total);
        stats.put("active",  active);
        stats.put("banned",  banned);
        stats.put("sellers", sellers);
        stats.put("admins",  admins);
        return ResponseEntity.ok(stats);
    }

    @PreAuthorize(CAN_MANAGE_USERS)
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Thay đổi role: USER / SELLER / ADMIN
    @PreAuthorize(CAN_MANAGE_USERS)
    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<String> changeRole(
            @PathVariable String userId,
            @RequestParam String role) {
        userService.changeUserRole(userId, role);
        return ResponseEntity.ok("Cập nhật role thành công");
    }

    // Khóa / mở tài khoản
    @PreAuthorize(CAN_MANAGE_USERS)
    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<String> changeStatus(
            @PathVariable String userId,
            @RequestParam String status) {  // ACTIVE / BANNED
        userService.changeUserStatus(userId, status);
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize(CAN_MANAGE_USERS)
    public ResponseEntity<UserDTO> getUserDetail(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }
}
