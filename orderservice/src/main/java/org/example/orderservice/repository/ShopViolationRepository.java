package org.example.orderservice.repository;

import org.example.orderservice.entity.ShopViolation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopViolationRepository extends JpaRepository<ShopViolation, String> {

    @Query("SELECT COALESCE(SUM(v.violationPoints), 0) FROM ShopViolation v WHERE v.shopId = :shopId")
    Integer sumPointsByShopId(String shopId);
}