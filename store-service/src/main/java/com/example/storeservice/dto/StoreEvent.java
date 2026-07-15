package com.example.storeservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreEvent {
    private String action; // CREATE, UPDATE, DELETE
    private String id;
    private String name;
    private String location;
    private String description;
    private String image;
    private String status;
}
