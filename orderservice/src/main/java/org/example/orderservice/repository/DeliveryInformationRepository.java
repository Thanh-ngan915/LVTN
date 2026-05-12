package org.example.orderservice.repository;

import org.example.orderservice.entity.DeliveryInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryInformationRepository extends JpaRepository<DeliveryInformation, Integer> {
    List<DeliveryInformation> findByUserId(String userId);
    Optional<DeliveryInformation> findByUserIdAndIsDefaultTrue(String userId);
}
