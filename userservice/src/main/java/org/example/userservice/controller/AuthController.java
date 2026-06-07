package org.example.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.ForgotPasswordRequest;
import org.example.userservice.dto.GoogleAuthRequest;
import org.example.userservice.dto.LoginRequest;
import org.example.userservice.dto.LoginResponse;
import org.example.userservice.dto.RegisterRequest;
import org.example.userservice.dto.RegisterResponse;
import org.example.userservice.dto.ResetPasswordRequest;
import org.example.userservice.service.AuthService;
import org.example.userservice.service.GoogleAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Nhận authorization code từ frontend sau khi Google redirect,
     * trao đổi code lấy user info và trả về JWT token.
     */
    @PostMapping("/google/callback")
    public ResponseEntity<LoginResponse> googleCallback(@RequestBody GoogleAuthRequest request) {
        LoginResponse response = googleAuthService.loginWithGoogle(
                request.getCode(),
                request.getRedirectUri()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Gửi email reset password khi người dùng quên mật khẩu.
     * POST /api/auth/forgot-password
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(Map.of(
                "message", "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
        ));
    }

    /**
     * Đặt lại mật khẩu mới bằng token nhận từ email.
     * POST /api/auth/reset-password
     * Body: { "token": "...", "newPassword": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(Map.of(
                "message", "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại."
        ));
    }
}
