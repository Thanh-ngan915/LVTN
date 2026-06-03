package org.example.orderservice.dto;

import lombok.Data;

@Data
public class OrderRefundReviewDTO {
    /** approved | rejected */
    private String status;
    private String note;
}