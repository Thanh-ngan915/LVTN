package org.example.orderservice.repository;

import org.example.orderservice.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {

    /**
     * Lấy tất cả rating cho một product thông qua productorder → order → rating
     */
    @Query("SELECT r FROM Rating r WHERE r.orderId IN " +
           "(SELECT o.id FROM Order o WHERE o.id IN " +
           "(SELECT po.orderId FROM ProductOrder po WHERE po.productId = :productId))")
    Page<Rating> findByProductId(@Param("productId") Integer productId, Pageable pageable);

    /**
     * Lấy ratings theo productId và số sao
     */
    @Query("SELECT r FROM Rating r WHERE r.orderId IN " +
           "(SELECT o.id FROM Order o WHERE o.id IN " +
           "(SELECT po.orderId FROM ProductOrder po WHERE po.productId = :productId)) " +
           "AND FLOOR(r.stars) = :stars")
    Page<Rating> findByProductIdAndStars(@Param("productId") Integer productId,
                                         @Param("stars") Integer stars,
                                         Pageable pageable);

    /**
     * Đếm tổng số ratings cho một product
     */
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.orderId IN " +
           "(SELECT o.id FROM Order o WHERE o.id IN " +
           "(SELECT po.orderId FROM ProductOrder po WHERE po.productId = :productId))")
    Long countByProductId(@Param("productId") Integer productId);

    /**
     * Tính trung bình sao cho một product
     */
    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.orderId IN " +
           "(SELECT o.id FROM Order o WHERE o.id IN " +
           "(SELECT po.orderId FROM ProductOrder po WHERE po.productId = :productId))")
    Double averageStarsByProductId(@Param("productId") Integer productId);

    /**
     * Đếm rating theo từng mức sao cho một product
     */
    @Query("SELECT FLOOR(r.stars) as star, COUNT(r) as cnt FROM Rating r WHERE r.orderId IN " +
           "(SELECT o.id FROM Order o WHERE o.id IN " +
           "(SELECT po.orderId FROM ProductOrder po WHERE po.productId = :productId)) " +
           "GROUP BY FLOOR(r.stars)")
    List<Object[]> countByProductIdGroupByStar(@Param("productId") Integer productId);

    List<Rating> findByOrderId(Integer orderId);
}
