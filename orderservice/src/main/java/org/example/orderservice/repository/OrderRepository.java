package org.example.orderservice.repository;

import org.example.orderservice.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @EntityGraph(attributePaths = {"deliveryInformation", "items"})
    Optional<Order> findById(Integer id);

    @EntityGraph(attributePaths = {"deliveryInformation", "items"})
    List<Order> findByUserId(String userId);
}
