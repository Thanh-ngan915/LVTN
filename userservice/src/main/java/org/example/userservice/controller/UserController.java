package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.PasswordRequest;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Lấy thông tin cá nhân (truyền id trên URL để test nhanh)
    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserDTO> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    // Cập nhật thông tin chung
    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserDTO> updateProfile(@PathVariable String userId, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateProfile(userId, userDTO));
    }

    // Đổi mật khẩu
    @PatchMapping("/{userId}/password")
    public ResponseEntity<String> changePassword(@PathVariable String userId, @RequestBody PasswordRequest request) {
        userService.updatePassword(userId, request);
        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

    // Đổi ảnh đại diện
    @PostMapping("/{userId}/avatar")
    public ResponseEntity<String> updateAvatar(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.updateAvatar(userId, file));
    }

    @PatchMapping("/{userId}/username")
    public ResponseEntity<String> updateUsername(
            @PathVariable String userId,
            @RequestParam String newUsername) {
        userService.updateUserName(userId, newUsername);
        return ResponseEntity.ok("Đổi username thành công!");
    }
}
