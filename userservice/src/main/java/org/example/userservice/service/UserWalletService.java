package org.example.userservice.service;

import org.example.userservice.entity.UserWallet;

public interface UserWalletService {
    void refund(String userId, Double amount, String referenceId);
    UserWallet getWallet(String userId);
}