package com.example.storeservice.repository;

import com.example.storeservice.entity.CategoryConditionVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryConditionVoucherRepository extends JpaRepository<CategoryConditionVoucher,Integer> {
    List<CategoryConditionVoucher> findByVoucherId(String voucherId);
    void deleteByVoucherId(String voucherId);
}
