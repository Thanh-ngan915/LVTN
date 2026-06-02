package org.example.orderservice.dto;

import lombok.Data;

@Data
public class SellerOrderUpdateDTO {
    private String status;
    private String note;
}