package com.example.storeservice.service;

public interface WalletService {
    void creditPendingBalance(String storeId, Double amount, String referenceId);
    void releasePendingToAvailable(String storeId, Double amount, String referenceId);
    void debitAvailableBalance(String storeId, Double amount, String referenceId);
    void completeWithdrawal(String withdrawalRequestId);
    void failWithdrawal(String withdrawalRequestId, String failReason);
}