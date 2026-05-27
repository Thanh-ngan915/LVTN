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

        if (request.getComment() != null && !request.getComment().isEmpty()) {
            RatingMaterial commentMaterial = RatingMaterial.builder()
                    .url("text:" + request.getComment())  // ← prefix để phân biệt
                    .ratingId(rating.getId())
                    .ratingReplyId(null)
                    .createdBy(username)
                    .updatedBy(username)
                    .build();
            ratingMaterialRepository.save(commentMaterial);
        }
        // Lưu materials (nếu có)
        if (request.getMaterialUrls() != null && !request.getMaterialUrls().isEmpty()) {
            for (String url : request.getMaterialUrls()) {
                RatingMaterial material = RatingMaterial.builder()
                        .url(url)
                        .ratingId(rating.getId())
                        .ratingReplyId(null)
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
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Đánh giá không tồn tại"));

        if (rating.getIsReply()) {
            throw new RuntimeException("Đánh giá này đã được phản hồi");
        }

        // Tạo reply
        RatingReply reply = RatingReply.builder()
                .ratingId(ratingId)
                .ratingReplyId(request.getParentReplyId())
                .stars(request.getStars())
                .isReply(true)
                .createdBy(username)
                .updatedBy(username)
                .build();
        reply = ratingReplyRepository.save(reply);

        // Lưu comment vào RatingMaterial
        if (request.getComment() != null && !request.getComment().isBlank()) {
            ratingMaterialRepository.save(RatingMaterial.builder()
                    .url("text:" + request.getComment())
                    .ratingId(ratingId)
                    .ratingReplyId(reply.getId())   // ← khác với khách hàng
                    .createdBy(username)
                    .updatedBy(username)
                    .build());
        }

        // Lưu ảnh/video
        if (request.getMaterialUrls() != null) {
            for (String url : request.getMaterialUrls()) {
                ratingMaterialRepository.save(RatingMaterial.builder()
                        .url(url)
                        .ratingId(ratingId)
                        .ratingReplyId(reply.getId())   // ← khác với khách hàng
                        .createdBy(username)
                        .updatedBy(username)
                        .build());
            }
        }

        rating.setIsReply(true);
        ratingRepository.save(rating);

        return toRatingReplyDTO(reply);
    }

    public Page<RatingDTO> getRatingsByStore(String storeId, Boolean pending, Pageable pageable) {
        Page<Rating> page = (pending != null && pending)
                ? ratingRepository.findByStoreIdAndNotReplied(storeId, pageable)
                : ratingRepository.findByStoreId(storeId, pageable);
        return page.map(this::toRatingDTO);
    }

    /**
     * Convert Rating entity → RatingDTO
     */
    private RatingDTO toRatingDTO(Rating rating) {
        // Lấy materials
        List<RatingMaterial> materials = ratingMaterialRepository.findByRatingIdAndRatingReplyIdIsNull(rating.getId());
        String comment = materials.stream()
                .filter(m -> m.getUrl().startsWith("text:"))
                .map(m -> m.getUrl().substring(5))
                .findFirst().orElse(null);

        List<String> mediaUrls = materials.stream()
                .filter(m -> !m.getUrl().startsWith("text:"))
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
                .comment(comment)
                .materialUrls(mediaUrls)
                .replies(replyDTOs)
                .build();
    }

    /**
     * Convert RatingReply entity → RatingReplyDTO
     */
    private RatingReplyDTO toRatingReplyDTO(RatingReply reply) {
        // Lấy materials của reply này
        List<RatingMaterial> materials = ratingMaterialRepository.findByRatingReplyId(reply.getId());

        String comment = materials.stream()
                .filter(m -> m.getUrl().startsWith("text:"))
                .map(m -> m.getUrl().substring(5))
                .findFirst().orElse(null);

        List<String> mediaUrls = materials.stream()
                .filter(m -> !m.getUrl().startsWith("text:"))
                .map(RatingMaterial::getUrl)
                .collect(Collectors.toList());

        // User info
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
                .comment(comment)           // ← thay url bằng comment
                .materialUrls(mediaUrls)    // ← thêm mới
                .stars(reply.getStars())
                .isReply(reply.getIsReply())
                .createdBy(reply.getCreatedBy())
                .createdAt(reply.getCreatedAt() != null ? reply.getCreatedAt().toString() : null)
                .userFullName(userFullName)
                .userImage(userImage)
                .build();
    }
}
