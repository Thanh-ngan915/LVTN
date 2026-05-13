package com.example.storeservice.repository;

import com.example.storeservice.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, String> {
    boolean existsByCreatedBy(String userId); // kiểm tra user đã có shop chưa
    Optional<Store> findByCreatedBy(String userId);
}
