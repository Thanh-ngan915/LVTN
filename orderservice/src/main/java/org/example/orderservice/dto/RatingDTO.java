package org.example.orderservice.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingDTO {
    private Integer id;
    private Integer storeId;
    private Integer orderId;
    private Double stars;
    private Boolean isReply;
    private String createdBy;
    private String createdAt;

    // User info (from user_local)
    private String userFullName;
    private String userImage;

    // Materials (images/videos)
    private List<String> materialUrls;

    // Replies
    private List<RatingReplyDTO> replies;
}
