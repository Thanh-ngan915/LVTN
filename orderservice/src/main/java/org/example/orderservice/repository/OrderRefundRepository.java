package org.example.orderservice.repository;

import org.example.orderservice.entity.OrderRefund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRefundRepository extends JpaRepository<OrderRefund, String> {
    Optional<OrderRefund> findByOrderId(String orderId);
    List<OrderRefund> findByCreatedBy(String createdBy);
    Optional<OrderRefund> findByOrderIdAndStatus(String orderId, String status);
}