package org.example.orderservice.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyRequestDTO {
    private String comment;
    private String url;
    private Double stars;
    private Integer parentReplyId;
    private List<String> materialUrls;
}
