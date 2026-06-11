// WithdrawalRequestDTO.java — trong store-service
package com.example.storeservice.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalRequestDTO {
    private Double amount;
    private String bankAccountNumber;
    private String bankName;
    private String accountHolderName;
}