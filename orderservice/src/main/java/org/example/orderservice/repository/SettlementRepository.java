package org.example.orderservice.repository;

import org.example.orderservice.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, String> {
    Optional<Settlement> findByOrderId(String orderId);
    List<Settlement> findByStatusAndCreatedAtBefore(String status, LocalDateTime createdAt);
}
