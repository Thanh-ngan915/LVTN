package org.example.orderservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.dto.*;
import org.example.orderservice.entity.*;
import org.example.orderservice.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RatingMaterialRepository ratingMaterialRepository;
    private final RatingReplyRepository ratingReplyRepository;
    private final OrderRepository orderRepository;
    private final UserLocalRepository userLocalRepository;
    private final RestTemplate restTemplate;
    private final SentimentService sentimentService;
    @Value("${store-service.url:http://localhost:8090}")
    private String storeServiceUrl;


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
    public RatingDTO createRating(RatingRequestDTO request, String username) {
        // Kiểm tra order tồn tại
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        List<Rating> existingRatings = ratingRepository.findByOrderId(request.getOrderId());
        if (!existingRatings.isEmpty()) {
            throw new RuntimeException("Bạn đã đánh giá đơn hàng này rồi");
        }

        // Phân tích sentiment TRƯỚC khi mở transaction
        SentimentResultDTO sentiment = sentimentService.analyze(
                request.getComment(), request.getStars()
        );
        log.info("Sentiment result: analyzed={}, isMatch={}, sentiment={}",
                sentiment.isAnalyzed(), sentiment.getIsMatch(), sentiment.getSentiment());

        if (sentiment.isAnalyzed() && !sentiment.getIsMatch()) {
            return RatingDTO.builder()
                    .sentimentResult(sentiment)
                    .build();
        }

        // Chỉ vào transaction khi hợp lệ
        return saveRating(request, username, sentiment);
    }

    // Method @Transactional riêng - chỉ lo việc lưu DB
    @Transactional
    public RatingDTO saveRating(RatingRequestDTO request, String username, SentimentResultDTO sentiment) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

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
            ratingMaterialRepository.save(RatingMaterial.builder()
                    .url("text:" + request.getComment())
                    .ratingId(rating.getId())
                    .ratingReplyId(null)
                    .createdBy(username)
                    .updatedBy(username)
                    .build());
        }

        if (request.getMaterialUrls() != null && !request.getMaterialUrls().isEmpty()) {
            for (String url : request.getMaterialUrls()) {
                ratingMaterialRepository.save(RatingMaterial.builder()
                        .url(url)
                        .ratingId(rating.getId())
                        .ratingReplyId(null)
                        .createdBy(username)
                        .updatedBy(username)
                        .build());
            }
        }

        RatingDTO dto = toRatingDTO(rating);
        dto.setSentimentResult(sentiment);
        return dto;
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

    private StoreDTO getStoreInfo(String storeId) {
        if (storeId == null) return null;
        try {
            String url = storeServiceUrl + "/api/stores/" + storeId;
            StoreProfileResponseDTO response = restTemplate.getForObject(url, StoreProfileResponseDTO.class);
            return (response != null) ? response.getStore() : null;
        } catch (Exception e) {
            log.warn("Không lấy được thông tin shop {}: {}", storeId, e.getMessage());
            return null;
        }
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
        List<RatingMaterial> materials = ratingMaterialRepository.findByRatingReplyId(reply.getId());

        String comment = materials.stream()
                .filter(m -> m.getUrl().startsWith("text:"))
                .map(m -> m.getUrl().substring(5))
                .findFirst().orElse(null);

        List<String> mediaUrls = materials.stream()
                .filter(m -> !m.getUrl().startsWith("text:"))
                .map(RatingMaterial::getUrl)
                .collect(Collectors.toList());

        String userFullName = reply.getCreatedBy();
        String userImage = null;

        // Kiểm tra createdBy có phải user trong hệ thống không
        Optional<UserLocal> userLocal = reply.getCreatedBy() != null
                ? userLocalRepository.findByUsername(reply.getCreatedBy())
                : Optional.empty();

        if (userLocal.isPresent()) {
            // Là khách hàng
            userFullName = userLocal.get().getFullName() != null
                    ? userLocal.get().getFullName()
                    : reply.getCreatedBy();
            userImage = userLocal.get().getImage();
        } else {
            // Không phải user → là shop, lấy tên shop
            Rating parentRating = ratingRepository.findById(reply.getRatingId()).orElse(null);
            if (parentRating != null) {
                StoreDTO storeInfo = getStoreInfo(parentRating.getStoreId());
                if (storeInfo != null) {
                    userFullName = storeInfo.getName();
                    userImage = storeInfo.getImage();
                }
            }
        }

        return RatingReplyDTO.builder()
                .id(reply.getId())
                .ratingId(reply.getRatingId())
                .ratingReplyId(reply.getRatingReplyId())
                .comment(comment)
                .materialUrls(mediaUrls)
                .stars(reply.getStars())
                .isReply(reply.getIsReply())
                .createdBy(reply.getCreatedBy())
                .createdAt(reply.getCreatedAt() != null ? reply.getCreatedAt().toString() : null)
                .userFullName(userFullName)
                .userImage(userImage)
                .build();
    }
}
