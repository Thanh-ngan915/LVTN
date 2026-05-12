package org.example.orderservice.repository;

import org.example.orderservice.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    List<Voucher> findByStoreIdAndStatusAndEndDateAfter(String storeId, String status, LocalDateTime now);
    Optional<Voucher> findByCode(String code);
    List<Voucher> findByStoreIdIsNullAndStatusAndEndDateAfter(String status, LocalDateTime now);
}
