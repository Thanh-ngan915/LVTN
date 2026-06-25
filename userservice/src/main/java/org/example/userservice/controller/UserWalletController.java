package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.entity.UserWallet;
import org.example.userservice.service.UserWalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/wallet")
@RequiredArgsConstructor
public class UserWalletController {

    private final UserWalletService userWalletService;

    /** Order-service gọi khi complaint được APPROVE */
    @PostMapping("/{userId}/refund")
    public ResponseEntity<Void> refund(
            @PathVariable String userId,
            @RequestParam Double amount,
            @RequestParam String referenceId) {
        userWalletService.refund(userId, amount, referenceId);
        return ResponseEntity.ok().build();
    }

    /** Buyer xem số dư ví */
    @GetMapping("/{userId}/balance")
    public ResponseEntity<UserWallet> getBalance(@PathVariable String userId) {
        return ResponseEntity.ok(userWalletService.getWallet(userId));
    }
}