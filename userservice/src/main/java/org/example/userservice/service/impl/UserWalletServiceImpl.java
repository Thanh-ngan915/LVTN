package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.entity.UserWallet;
import org.example.userservice.repository.UserWalletRepository;
import org.example.userservice.service.UserWalletService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserWalletServiceImpl implements UserWalletService {

    private final UserWalletRepository userWalletRepository;

    private UserWallet getOrCreate(String userId) {
        return userWalletRepository.findByUserId(userId)
                .orElseGet(() -> userWalletRepository.save(
                        UserWallet.builder()
                                .userId(userId)
                                .build()));
    }

    @Override
    @Transactional
    public void refund(String userId, Double amount, String referenceId) {
        UserWallet wallet = getOrCreate(userId);
        Double before = wallet.getAvailableBalance();
        wallet.setAvailableBalance(before + amount);
        wallet.setTotalReceived(wallet.getTotalReceived() + amount);
        userWalletRepository.save(wallet);

        log.info("[REFUND] userId={} amount={} referenceId={} balanceBefore={} balanceAfter={}",
                userId, amount, referenceId, before, wallet.getAvailableBalance());
    }

    @Override
    public UserWallet getWallet(String userId) {
        return getOrCreate(userId);
    }
}