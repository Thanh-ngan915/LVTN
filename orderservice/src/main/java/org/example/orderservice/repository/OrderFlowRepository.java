package org.example.orderservice.repository;

import org.example.orderservice.entity.OrderFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderFlowRepository extends JpaRepository<OrderFlow, String> {
    List<OrderFlow> findByOrderIdOrderByCreatedAtDesc(String orderId);
}