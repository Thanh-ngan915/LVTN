package org.example.orderservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingReplyDTO {
    private Integer id;
    private Integer ratingId;
    private Integer ratingReplyId;
    private String url;
    private Double stars;
    private Boolean isReply;
    private String createdBy;
    private String createdAt;

    // User info
    private String userFullName;
    private String userImage;
}
