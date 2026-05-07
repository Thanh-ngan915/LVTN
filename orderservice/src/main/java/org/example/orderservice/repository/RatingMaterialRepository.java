package org.example.orderservice.repository;

import org.example.orderservice.entity.RatingMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingMaterialRepository extends JpaRepository<RatingMaterial, Integer> {
    List<RatingMaterial> findByRatingId(Integer ratingId);
}
