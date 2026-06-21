// AdminResolveDTO.java
package org.example.orderservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminResolveDTO {
    private String adminNotes;
    private Boolean isShopFault;  // true → cộng violation points + phạt tiền shop
}