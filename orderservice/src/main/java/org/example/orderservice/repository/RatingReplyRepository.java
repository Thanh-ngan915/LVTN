package org.example.orderservice.repository;

import org.example.orderservice.entity.RatingReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingReplyRepository extends JpaRepository<RatingReply, Integer> {
    List<RatingReply> findByRatingIdOrderByCreatedAtAsc(Integer ratingId);
}
