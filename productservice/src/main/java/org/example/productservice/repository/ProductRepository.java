package org.example.productservice.repository;

import org.example.productservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findByCategoryShortname(String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isDelete = false OR p.isDelete IS NULL")
    @EntityGraph(attributePaths = {"images", "variants"})
    Page<Product> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.isDelete = false OR p.isDelete IS NULL) AND p.categoryShortname = :category")
    @EntityGraph(attributePaths = {"images", "variants"})
    Page<Product> findAllActiveByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.isDelete = false OR p.isDelete IS NULL) AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    @EntityGraph(attributePaths = {"images", "variants"})
    Page<Product> searchByName(@Param("keyword") String keyword, Pageable pageable);
    // ProductRepository.java
    @Query("SELECT p FROM Product p WHERE (p.isDelete = false OR p.isDelete IS NULL) AND p.storeId = :storeId")
    @EntityGraph(attributePaths = {"images", "variants"})
    Page<Product> findAllActiveByStore(@Param("storeId") String storeId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.isDelete = false OR p.isDelete IS NULL) AND p.storeId = :storeId AND p.categoryShortname = :category")
    @EntityGraph(attributePaths = {"images", "variants"})
    Page<Product> findAllActiveByStoreAndCategory(@Param("storeId") String storeId, @Param("category") String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.isDelete = false OR p.isDelete IS NULL) AND p.storeId = :storeId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    @EntityGraph(attributePaths = {"images", "variants"})
    Page<Product> searchByStoreAndName(@Param("storeId") String storeId, @Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isDelete = true AND p.storeId = :storeId")
    @EntityGraph(attributePaths = {"images", "variants"})
    Page<Product> findAllDeletedByStore(@Param("storeId") String storeId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.isDelete = false")
    long countAllActive();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.status = :status AND p.isDelete = false")
    long countByStatus(@Param("status") String status);
}
