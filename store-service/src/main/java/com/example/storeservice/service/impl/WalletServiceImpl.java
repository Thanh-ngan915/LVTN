package com.example.storeservice.service.impl;

import com.example.storeservice.entity.Wallet;
import com.example.storeservice.entity.WalletTransaction;
import com.example.storeservice.entity.WithdrawalRequest;
import com.example.storeservice.repository.WalletRepository;
import com.example.storeservice.repository.WalletTransactionRepository;
import com.example.storeservice.repository.WithdrawalRequestRepository;
import com.example.storeservice.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final WithdrawalRequestRepository withdrawalRequestRepository;
    /**
     * Tìm ví theo storeId, nếu chưa có thì tạo mới tự động.
     * Tránh lỗi khi shop mới chưa có ví mà đã có đơn completed.
     */
    private Wallet getOrCreateWallet(String storeId) {
        return walletRepository.findByStoreId(storeId)
                .orElseGet(() -> {
                    log.info("Wallet not found for store {}, creating new one", storeId);
                    return walletRepository.save(Wallet.builder()
                            .storeId(storeId)
                            .createdBy("system")
                            .build());
                });
    }

    @Override
    @Transactional
    public void creditPendingBalance(String storeId, Double amount, String referenceId) {
        Wallet wallet = getOrCreateWallet(storeId);

        Double balanceBefore = wallet.getPendingBalance();
        wallet.setPendingBalance(balanceBefore + amount);
        walletRepository.save(wallet);

        walletTransactionRepository.save(WalletTransaction.builder()
                .walletId(wallet.getId())
                .type("ORDER_RECEIVED")
                .direction("IN")
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(wallet.getPendingBalance())
                .referenceId(referenceId)
                .referenceType("ORDER")
                .status("COMPLETED")
                .note("Pending từ đơn hàng: " + referenceId)
                .createdBy("system")
                .build());

        log.info("Credited {}(net after commission) to store {}, order {}", amount, storeId, referenceId);
    }

    @Override
    @Transactional
    public void releasePendingToAvailable(String storeId, Double amount, String referenceId) {
        Wallet wallet = getOrCreateWallet(storeId);
        if (wallet.getPendingBalance() < amount) {
            throw new RuntimeException("Pending balance không đủ để release");
        }

        boolean alreadyReleased = walletTransactionRepository
                .existsByReferenceIdAndReferenceType(referenceId, "SETTLEMENT");
        if (alreadyReleased) return;

        Double pendingBefore = wallet.getPendingBalance();
        Double availableBefore = wallet.getAvailableBalance();

        wallet.setPendingBalance(pendingBefore - amount);
        wallet.setAvailableBalance(availableBefore + amount);
        wallet.setTotalEarned(wallet.getTotalEarned() + amount);
        walletRepository.save(wallet);

        walletTransactionRepository.save(WalletTransaction.builder()
                .walletId(wallet.getId())
                .type("ORDER_RECEIVED")
                .direction("IN")
                .amount(amount)
                .balanceBefore(availableBefore)
                .balanceAfter(wallet.getAvailableBalance())
                .referenceId(referenceId)
                .referenceType("SETTLEMENT")
                .status("COMPLETED")
                .note("Release từ pending sang available")
                .createdBy("system")
                .build());

        log.info("Released pending {} to available for store {}", amount, storeId);
    }

    @Override
    @Transactional
    public void debitAvailableBalance(String storeId, Double amount, String referenceId) {
        Wallet wallet = getOrCreateWallet(storeId);

        if (wallet.getAvailableBalance() < amount) {
            throw new RuntimeException("Số dư khả dụng không đủ");
        }

        Double balanceBefore = wallet.getAvailableBalance();
        wallet.setAvailableBalance(balanceBefore - amount);
        wallet.setReservedBalance(wallet.getReservedBalance() + amount);
        walletRepository.save(wallet);

        walletTransactionRepository.save(WalletTransaction.builder()
                .walletId(wallet.getId())
                .type("WITHDRAWAL")
                .direction("OUT")
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(wallet.getAvailableBalance())
                .referenceId(referenceId)
                .referenceType("WITHDRAWAL")
                .status("COMPLETED")
                .note("Yêu cầu rút tiền: " + referenceId)
                .createdBy(storeId)
                .build());

        log.info("Debited available balance {} for store {}", amount, storeId);
    }

    @Override
    @Transactional
    public void completeWithdrawal(String withdrawalRequestId) {
        WithdrawalRequest req = withdrawalRequestRepository.findById(withdrawalRequestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));

        Wallet wallet = walletRepository.findById(req.getWalletId()).orElseThrow();
        wallet.setReservedBalance(wallet.getReservedBalance() - req.getAmount());
        wallet.setTotalWithdrawn(wallet.getTotalWithdrawn() + req.getAmount());
        walletRepository.save(wallet);

        walletTransactionRepository.save(WalletTransaction.builder()
                .walletId(wallet.getId())
                .type("WITHDRAWAL_COMPLETED")
                .direction("OUT")
                .amount(req.getAmount())
                .referenceId(req.getId())
                .referenceType("WITHDRAWAL")
                .status("COMPLETED")
                .note("VNPay đã chuyển khoản. Mã GD: " + req.getVnpayTransactionCode())
                .createdBy("system")
                .build());

        log.info("Withdrawal {} completed for store {}", withdrawalRequestId, req.getStoreId());
    }

    @Override
    @Transactional
    public void failWithdrawal(String withdrawalRequestId, String failReason) {
        WithdrawalRequest req = withdrawalRequestRepository.findById(withdrawalRequestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));

        Wallet wallet = walletRepository.findById(req.getWalletId()).orElseThrow();
        wallet.setReservedBalance(wallet.getReservedBalance() - req.getAmount());
        wallet.setAvailableBalance(wallet.getAvailableBalance() + req.getAmount());
        walletRepository.save(wallet);

        walletTransactionRepository.save(WalletTransaction.builder()
                .walletId(wallet.getId())
                .type("WITHDRAWAL_FAILED")
                .direction("IN")
                .amount(req.getAmount())
                .referenceId(req.getId())
                .referenceType("WITHDRAWAL")
                .status("FAILED")
                .note("VNPay thất bại: " + failReason + ". Đã hoàn tiền.")
                .createdBy("system")
                .build());

        log.info("Withdrawal {} failed, reason: {}", withdrawalRequestId, failReason);
    }
}