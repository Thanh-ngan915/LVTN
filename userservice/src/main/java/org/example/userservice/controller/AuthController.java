package org.example.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.GoogleAuthRequest;
import org.example.userservice.dto.LoginRequest;
import org.example.userservice.dto.LoginResponse;
import org.example.userservice.dto.RegisterRequest;
import org.example.userservice.dto.RegisterResponse;
import org.example.userservice.service.AuthService;
import org.example.userservice.service.GoogleAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
