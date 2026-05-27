package com.example.storeservice.controller;

import com.example.storeservice.dto.VoucherDTO;
import com.example.storeservice.dto.VoucherRequestDTO;
import com.example.storeservice.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping("/store/{storeId}")
    public ResponseEntity<VoucherDTO> createVoucher(
            @RequestParam String userId,
            @PathVariable String storeId,
            @RequestBody VoucherRequestDTO request) {
        return ResponseEntity.ok(voucherService.createVoucher(userId, storeId, request));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<VoucherDTO>> getByStore(@PathVariable String storeId) {
        return ResponseEntity.ok(voucherService.getVouchersByStore(storeId));
    }

    @GetMapping("/{voucherId}")
    public ResponseEntity<VoucherDTO> getById(@PathVariable String voucherId) {
        return ResponseEntity.ok(voucherService.getVoucherById(voucherId));
    }

    @PutMapping("/store/{storeId}/{voucherId}")
    public ResponseEntity<VoucherDTO> updateVoucher(
            @RequestParam String userId,
            @PathVariable String storeId,
            @PathVariable String voucherId,
            @RequestBody VoucherRequestDTO request) {
        return ResponseEntity.ok(voucherService.updateVoucher(userId, storeId, voucherId, request));
    }

    @DeleteMapping("/store/{storeId}/{voucherId}")
    public ResponseEntity<Void> deleteVoucher(
            @RequestParam String userId,
            @PathVariable String storeId,
            @PathVariable String voucherId) {
        voucherService.deleteVoucher(userId, storeId, voucherId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/store/{storeId}/deleted")
    public ResponseEntity<List<VoucherDTO>> getDeletedVouchers(@PathVariable String storeId) {
        return ResponseEntity.ok(voucherService.getDeletedVouchers(storeId));
    }

    @PutMapping("/store/{storeId}/{voucherId}/restore")
    public ResponseEntity<Void> restoreVoucher(
            @RequestParam String userId,
            @PathVariable String storeId,
            @PathVariable String voucherId) {
        voucherService.restoreVoucher(userId, storeId, voucherId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<VoucherDTO>> getAllActiveVouchers() {
        return ResponseEntity.ok(voucherService.getAllActiveVouchers());
    }
}