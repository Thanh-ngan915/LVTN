package org.example.orderservice.dto;

import lombok.*;

import java.util.List;

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
    private String comment;
    private List<String> materialUrls;

    // User info
    private String userFullName;
    private String userImage;
}
