package com.example.storeservice.repository;

import com.example.storeservice.entity.WithdrawalRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalRequestRepository extends JpaRepository<WithdrawalRequest, String> {
    Page<WithdrawalRequest> findByStoreId(String storeId, Pageable pageable);
    Page<WithdrawalRequest> findByStatus(String status, Pageable pageable); // cho admin
}
