package org.example.userservice.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String fullName, String resetLink);
    void sendOrderSuccessEmail(String toEmail, String fullName, String orderId, String transactionNo);
}
