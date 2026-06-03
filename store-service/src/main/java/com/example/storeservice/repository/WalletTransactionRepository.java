package com.example.storeservice.repository;

import com.example.storeservice.entity.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, String> {
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(String walletId);
    Page<WalletTransaction> findByWalletId(String walletId, Pageable pageable);
}
