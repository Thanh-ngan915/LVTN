package org.example.orderservice.repository;

import org.example.orderservice.entity.Settlement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, String> {
    Optional<Settlement> findByOrderId(String orderId);
    List<Settlement> findByStatusAndCreatedAtBefore(String status, LocalDateTime createdAt);

    @Query("SELECT s FROM Settlement s WHERE s.createdAt BETWEEN :from AND :to " +
            "AND s.status NOT IN :excluded ORDER BY s.createdAt DESC")
    Page<Settlement> findCompletedBetween(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("excluded") List<String> excluded,
            Pageable pageable);

    @Query("SELECT s FROM Settlement s WHERE s.createdAt BETWEEN :from AND :to " +
            "AND s.status NOT IN :excluded ORDER BY s.createdAt DESC")
    List<Settlement> findAllCompletedBetween(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("excluded") List<String> excluded);

    @Query("SELECT COALESCE(SUM(s.grossAmount), 0) FROM Settlement s " +
            "WHERE s.createdAt BETWEEN :from AND :to AND s.status NOT IN :excluded")
    Double sumGrossAmountBetween(@Param("from") LocalDateTime from,
                                 @Param("to") LocalDateTime to,
                                 @Param("excluded") List<String> excluded);

    @Query("SELECT COALESCE(SUM(s.commissionFee), 0) FROM Settlement s " +
            "WHERE s.createdAt BETWEEN :from AND :to AND s.status NOT IN :excluded")
    Double sumCommissionFeeBetween(@Param("from") LocalDateTime from,
                                   @Param("to") LocalDateTime to,
                                   @Param("excluded") List<String> excluded);

    @Query("SELECT COUNT(s) FROM Settlement s " +
            "WHERE s.createdAt BETWEEN :from AND :to AND s.status NOT IN :excluded")
    Long countCompletedBetween(@Param("from") LocalDateTime from,
                               @Param("to") LocalDateTime to,
                               @Param("excluded") List<String> excluded);
}
