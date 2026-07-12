package com.example.storeservice.repository;

import com.example.storeservice.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, String> {
    boolean existsByCreatedBy(String userId); // kiểm tra user đã có shop chưa
    Optional<Store> findByCreatedBy(String userId);

    @Query("SELECT s.id FROM Store s WHERE s.location IN :locations")
    List<String> findStoreIdsByLocations(@Param("locations") List<String> locations);
}
