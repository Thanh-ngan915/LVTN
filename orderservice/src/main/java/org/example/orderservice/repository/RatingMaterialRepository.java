package org.example.orderservice.repository;

import org.example.orderservice.entity.RatingMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingMaterialRepository extends JpaRepository<RatingMaterial, Integer> {
    List<RatingMaterial> findByRatingId(Integer ratingId);
    List<RatingMaterial> findByRatingReplyId(Integer ratingReplyId);
    List<RatingMaterial> findByRatingIdAndRatingReplyIdIsNull(Integer ratingId);

    // RatingMaterialRepository
    @Query("SELECT COUNT(DISTINCT m.ratingId) FROM RatingMaterial m " +
            "JOIN Rating r ON r.id = m.ratingId " +
            "WHERE r.storeId = :storeId AND m.ratingReplyId IS NULL AND m.url LIKE 'text:%'")
    Long countRatingsWithCommentByStoreId(@Param("storeId") String storeId);
}
