package org.example.orderservice.service;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.entity.*;
import org.example.orderservice.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RatingMaterialRepository ratingMaterialRepository;
    private final RatingReplyRepository ratingReplyRepository;
    private final OrderRepository orderRepository;
    private final UserLocalRepository userLocalRepository;

    /**
     * Lấy đánh giá theo productId (phân trang)
     */
    public Page<RatingDTO> getRatingsByProductId(Integer productId, Integer filterStar, Pageable pageable) {
        Page<Rating> ratingsPage;
        if (filterStar != null && filterStar >= 1 && filterStar <= 5) {
            ratingsPage = ratingRepository.findByProductIdAndStars(productId, filterStar, pageable);
        } else {
            ratingsPage = ratingRepository.findByProductId(productId, pageable);
        }

        return ratingsPage.map(this::toRatingDTO);
    }

    /**
     * Lấy tóm tắt đánh giá: trung bình sao, tổng số, đếm theo từng mức sao
     */
    public RatingSummaryDTO getRatingSummary(Integer productId) {
        Double avgStars = ratingRepository.averageStarsByProductId(productId);
        Long totalRatings = ratingRepository.countByProductId(productId);
        List<Object[]> starCountsRaw = ratingRepository.countByProductIdGroupByStar(productId);

        Map<Integer, Long> starCounts = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            starCounts.put(i, 0L);
        }
        for (Object[] row : starCountsRaw) {
            Integer star = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            starCounts.put(star, count);
        }

        return RatingSummaryDTO.builder()
                .averageStars(avgStars != null ? avgStars : 0.0)
                .totalRatings(totalRatings != null ? totalRatings : 0L)
                .starCounts(starCounts)
                .build();
    }

    /**
     * Tạo đánh giá mới
     */
    @Transactional
    public RatingDTO createRating(RatingRequestDTO request, String username) {
        // Kiểm tra order tồn tại
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        // Kiểm tra đã đánh giá chưa
        List<Rating> existingRatings = ratingRepository.findByOrderId(request.getOrderId());
        if (!existingRatings.isEmpty()) {
            throw new RuntimeException("Bạn đã đánh giá đơn hàng này rồi");
        }

        // Tạo rating
        Rating rating = Rating.builder()
                .storeId(request.getStoreId() != null ? request.getStoreId() : order.getStoreId())
                .orderId(request.getOrderId())
                .stars(request.getStars() != null ? request.getStars() : 5.0)
                .isReply(false)
                .createdBy(username)
                .updatedBy(username)
                .build();
        rating = ratingRepository.save(rating);

        // Lưu materials (nếu có)
        if (request.getMaterialUrls() != null && !request.getMaterialUrls().isEmpty()) {
            for (String url : request.getMaterialUrls()) {
                RatingMaterial material = RatingMaterial.builder()
                        .url(url)
                        .ratingId(rating.getId())
                        .createdBy(username)
                        .updatedBy(username)
                        .build();
                ratingMaterialRepository.save(material);
            }
        }

        return toRatingDTO(rating);
    }

    /**
     * Reply cho một đánh giá
     */
    @Transactional
    public RatingReplyDTO createReply(Integer ratingId, ReplyRequestDTO request, String username) {
        // Kiểm tra rating tồn tại
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Đánh giá không tồn tại"));

        // Tạo reply
        RatingReply reply = RatingReply.builder()
                .ratingId(ratingId)
                .ratingReplyId(request.getParentReplyId())
                .url(request.getUrl())
                .stars(request.getStars())
                .isReply(true)
                .createdBy(username)
                .updatedBy(username)
                .build();
        reply = ratingReplyRepository.save(reply);

        // Update rating is_reply
        rating.setIsReply(true);
        ratingRepository.save(rating);

        return toRatingReplyDTO(reply);
    }

    /**
     * Convert Rating entity → RatingDTO
     */
    private RatingDTO toRatingDTO(Rating rating) {
        // Lấy materials
        List<RatingMaterial> materials = ratingMaterialRepository.findByRatingId(rating.getId());
        List<String> materialUrls = materials.stream()
                .map(RatingMaterial::getUrl)
                .collect(Collectors.toList());

        // Lấy replies
        List<RatingReply> replies = ratingReplyRepository.findByRatingIdOrderByCreatedAtAsc(rating.getId());
        List<RatingReplyDTO> replyDTOs = replies.stream()
                .map(this::toRatingReplyDTO)
                .collect(Collectors.toList());

        // Lấy user info
        String userFullName = rating.getCreatedBy();
        String userImage = null;
        if (rating.getCreatedBy() != null) {
            Optional<UserLocal> userLocal = userLocalRepository.findByUsername(rating.getCreatedBy());
            if (userLocal.isPresent()) {
                userFullName = userLocal.get().getFullName() != null ? userLocal.get().getFullName() : rating.getCreatedBy();
                userImage = userLocal.get().getImage();
            }
        }

        return RatingDTO.builder()
                .id(rating.getId())
                .storeId(rating.getStoreId())
                .orderId(rating.getOrderId())
                .stars(rating.getStars())
                .isReply(rating.getIsReply())
                .createdBy(rating.getCreatedBy())
                .createdAt(rating.getCreatedAt() != null ? rating.getCreatedAt().toString() : null)
                .userFullName(userFullName)
                .userImage(userImage)
                .materialUrls(materialUrls)
                .replies(replyDTOs)
                .build();
    }

    /**
     * Convert RatingReply entity → RatingReplyDTO
     */
    private RatingReplyDTO toRatingReplyDTO(RatingReply reply) {
        String userFullName = reply.getCreatedBy();
        String userImage = null;
        if (reply.getCreatedBy() != null) {
            Optional<UserLocal> userLocal = userLocalRepository.findByUsername(reply.getCreatedBy());
            if (userLocal.isPresent()) {
                userFullName = userLocal.get().getFullName() != null ? userLocal.get().getFullName() : reply.getCreatedBy();
                userImage = userLocal.get().getImage();
            }
        }

        return RatingReplyDTO.builder()
                .id(reply.getId())
                .ratingId(reply.getRatingId())
                .ratingReplyId(reply.getRatingReplyId())
                .url(reply.getUrl())
                .stars(reply.getStars())
                .isReply(reply.getIsReply())
                .createdBy(reply.getCreatedBy())
                .createdAt(reply.getCreatedAt() != null ? reply.getCreatedAt().toString() : null)
                .userFullName(userFullName)
                .userImage(userImage)
                .build();
    }
}
