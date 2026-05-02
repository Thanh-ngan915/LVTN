package org.example.orderservice.repository;

import org.example.orderservice.entity.ProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductOrderRepository extends JpaRepository<ProductOrder, Integer> {
    List<ProductOrder> findByOrderId(Integer orderId);
    List<ProductOrder> findByProductId(Integer productId);
}
