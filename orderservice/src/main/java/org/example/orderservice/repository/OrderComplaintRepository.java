package org.example.orderservice.repository;

import org.example.orderservice.entity.OrderComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderComplaintRepository extends JpaRepository<OrderComplaint, String> {

    List<OrderComplaint> findByBuyerIdOrderByCreatedAtDesc(String buyerId);

    List<OrderComplaint> findByShopIdOrderByCreatedAtDesc(String shopId);

    List<OrderComplaint> findByStatusOrderByCreatedAtDesc(OrderComplaint.ComplaintStatus status);

    boolean existsByOrderIdAndStatus(Integer orderId, OrderComplaint.ComplaintStatus status);

    java.util.Optional<OrderComplaint> findByOrderId(Integer orderId);
}