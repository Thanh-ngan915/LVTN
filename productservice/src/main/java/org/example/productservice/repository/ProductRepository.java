package org.example.productservice.repository;

import org.example.productservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Page<Product> findByCategoryShortname(String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isDelete = false OR p.isDelete IS NULL")
    Page<Product> findAllActive(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.isDelete = false OR p.isDelete IS NULL) AND p.categoryShortname = :category")
    Page<Product> findAllActiveByCategory(@Param("category") String category, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (p.isDelete = false OR p.isDelete IS NULL) AND LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByName(@Param("keyword") String keyword, Pageable pageable);
}
