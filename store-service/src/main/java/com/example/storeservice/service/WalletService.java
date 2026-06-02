package com.example.storeservice.service;

import com.example.storeservice.entity.Wallet;
import com.example.storeservice.entity.WalletTransaction;
import com.example.storeservice.repository.WalletRepository;
import com.example.storeservice.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    // Order Service gọi vào khi đơn hoàn thành
    @Transactional
    public void creditPendingBalance(String storeId, Double amount, String referenceId) {
        Wallet wallet = walletRepository.findByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for store: " + storeId));

        Double balanceBefore = wallet.getPendingBalance();
        wallet.setPendingBalance(balanceBefore + amount);
        walletRepository.save(wallet);

        WalletTransaction transaction = WalletTransaction.builder()
                .walletId(wallet.getId())
                .type("ORDER_RECEIVED")
                .direction("IN")
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(wallet.getPendingBalance())
                .referenceId(referenceId)
                .referenceType("ORDER")
                .status("COMPLETED")
                .note("Pending from order: " + referenceId)
                .build();

        walletTransactionRepository.save(transaction);
        log.info("Credited pending balance {} for store {}", amount, storeId);
    }

    // Scheduler gọi sau khi hết thời gian hold
    @Transactional
    public void releasePendingToAvailable(String storeId, Double amount) {
        Wallet wallet = walletRepository.findByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for store: " + storeId));

        wallet.setPendingBalance(wallet.getPendingBalance() - amount);
        wallet.setAvailableBalance(wallet.getAvailableBalance() + amount);
        wallet.setTotalEarned(wallet.getTotalEarned() + amount);
        walletRepository.save(wallet);

        log.info("Released pending {} to available for store {}", amount, storeId);
    }

    // Seller yêu cầu rút tiền
    @Transactional
    public void debitAvailableBalance(String storeId, Double amount, String referenceId) {
        Wallet wallet = walletRepository.findByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for store: " + storeId));

        if (wallet.getAvailableBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        Double balanceBefore = wallet.getAvailableBalance();
        wallet.setAvailableBalance(balanceBefore - amount);
        wallet.setReservedBalance(wallet.getReservedBalance() + amount);
        walletRepository.save(wallet);

        WalletTransaction transaction = WalletTransaction.builder()
                .walletId(wallet.getId())
                .type("WITHDRAWAL")
                .direction("OUT")
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(wallet.getAvailableBalance())
                .referenceId(referenceId)
                .referenceType("WITHDRAWAL")
                .status("COMPLETED")
                .note("Withdrawal request: " + referenceId)
                .build();

        walletTransactionRepository.save(transaction);
        log.info("Debited available balance {} for store {}", amount, storeId);
    }
}