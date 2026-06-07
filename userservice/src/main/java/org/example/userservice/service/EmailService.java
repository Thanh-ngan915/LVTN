package org.example.userservice.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String fullName, String resetLink);
}
