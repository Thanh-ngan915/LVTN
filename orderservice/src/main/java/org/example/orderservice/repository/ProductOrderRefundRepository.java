package org.example.orderservice.repository;

import org.example.orderservice.entity.ProductOrderRefund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductOrderRefundRepository extends JpaRepository<ProductOrderRefund, String> {
    List<ProductOrderRefund> findByOrderRefundId(String orderRefundId);
}