package org.example.userservice.service;

import org.example.userservice.dto.LoginRequest;
import org.example.userservice.dto.LoginResponse;
import org.example.userservice.dto.RegisterRequest;
import org.example.userservice.dto.RegisterResponse;

public interface AuthService {
    void sendRegistrationLink(String email);

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void forgotPassword(String email);

    void resetPassword(String token, String newPassword);
}
