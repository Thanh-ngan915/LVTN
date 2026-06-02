package org.example.orderservice.repository;

import org.example.orderservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(String userId);
    List<Order> findByStoreId(String storeId);
    List<Order> findByStoreIdAndStatus(String storeId, String status);
    long countByStoreIdAndStatus(String storeId, String status);
}
