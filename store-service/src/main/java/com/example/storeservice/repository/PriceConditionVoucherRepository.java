package com.example.storeservice.repository;

import com.example.storeservice.entity.PriceConditionVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriceConditionVoucherRepository extends JpaRepository<PriceConditionVoucher,Integer> {
    Optional<PriceConditionVoucher> findByVoucherId(String voucherId);
    void deleteByVoucherId(String voucherId);
}
