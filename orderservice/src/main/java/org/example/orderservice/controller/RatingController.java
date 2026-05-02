package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.service.RatingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    /**
     * Lấy đánh giá theo sản phẩm (phân trang)
     * GET /api/ratings/product/{productId}?page=0&size=10&star=5
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<RatingDTO>>> getRatingsByProduct(
            @PathVariable Integer productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer star
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RatingDTO> ratingsPage = ratingService.getRatingsByProductId(productId, star, pageable);

        ApiResponse<List<RatingDTO>> response = ApiResponse.<List<RatingDTO>>builder()
                .success(true)
                .message("Ratings retrieved successfully")
                .data(ratingsPage.getContent())
                .page(ratingsPage.getNumber())
                .size(ratingsPage.getSize())
                .totalElements(ratingsPage.getTotalElements())
                .totalPages(ratingsPage.getTotalPages())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy tóm tắt đánh giá cho sản phẩm
     * GET /api/ratings/product/{productId}/summary
     */
    @GetMapping("/product/{productId}/summary")
    public ResponseEntity<ApiResponse<RatingSummaryDTO>> getRatingSummary(
            @PathVariable Integer productId
    ) {
        RatingSummaryDTO summary = ratingService.getRatingSummary(productId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Rating summary retrieved"));
    }

    /**
     * Tạo đánh giá mới
     * POST /api/ratings
     * Header: X-User-Name: username
     */
    @PostMapping
    public ResponseEntity<ApiResponse<RatingDTO>> createRating(
            @RequestBody RatingRequestDTO request,
            @RequestHeader(value = "X-User-Name", defaultValue = "anonymous") String username
    ) {
        try {
            RatingDTO rating = ratingService.createRating(request, username);
            return ResponseEntity.ok(ApiResponse.success(rating, "Đánh giá thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Reply cho một đánh giá
     * POST /api/ratings/{ratingId}/reply
     * Header: X-User-Name: username
     */
    @PostMapping("/{ratingId}/reply")
    public ResponseEntity<ApiResponse<RatingReplyDTO>> createReply(
            @PathVariable Integer ratingId,
            @RequestBody ReplyRequestDTO request,
            @RequestHeader(value = "X-User-Name", defaultValue = "anonymous") String username
    ) {
        try {
            RatingReplyDTO reply = ratingService.createReply(ratingId, request, username);
            return ResponseEntity.ok(ApiResponse.success(reply, "Phản hồi thành công!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
