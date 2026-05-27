package com.example.storeservice.repository;

import com.example.storeservice.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher,String> {
    boolean existsByCode(String code);
    List<Voucher> findByStoreId(String storeId);
    List<Voucher> findByStoreIdAndStatus(String storeId, Integer status);
    List<Voucher> findByStatus(Integer status);
}
