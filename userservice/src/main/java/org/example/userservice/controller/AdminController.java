package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    // Lấy danh sách tất cả users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Thay đổi role: USER / SELLER / ADMIN
    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<String> changeRole(
            @PathVariable String userId,
            @RequestParam String role) {
        userService.changeUserRole(userId, role);
        return ResponseEntity.ok("Cập nhật role thành công");
    }

    // Khóa / mở tài khoản
    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<String> changeStatus(
            @PathVariable String userId,
            @RequestParam String status) {  // ACTIVE / BANNED
        userService.changeUserStatus(userId, status);
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> getUserDetail(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }
}
