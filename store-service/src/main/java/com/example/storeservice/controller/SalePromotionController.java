package com.example.storeservice.controller;

import com.example.storeservice.dto.SalePromotionDTO;
import com.example.storeservice.dto.SalePromotionRequestDTO;
import com.example.storeservice.service.SalePromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores/{storeId}/sale-promotions")
@RequiredArgsConstructor
public class SalePromotionController {

    private final SalePromotionService salePromotionService;

    @PostMapping
    public ResponseEntity<SalePromotionDTO> create(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String storeId,
            @RequestBody SalePromotionRequestDTO request) {
        return ResponseEntity.ok(salePromotionService.createSalePromotion(userId, storeId, request));
    }

    @GetMapping
    public ResponseEntity<List<SalePromotionDTO>> getAll(@PathVariable String storeId) {
        return ResponseEntity.ok(salePromotionService.getSalePromotionsByStore(storeId));
    }

    @GetMapping("/deleted")
    public ResponseEntity<List<SalePromotionDTO>> getDeleted(@PathVariable String storeId) {
        return ResponseEntity.ok(salePromotionService.getDeletedSalePromotions(storeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalePromotionDTO> getById(@PathVariable String storeId, @PathVariable String id) {
        return ResponseEntity.ok(salePromotionService.getSalePromotionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String storeId,
            @PathVariable String id,
            @RequestBody SalePromotionRequestDTO request) {
        try {
            return ResponseEntity.ok(salePromotionService.updateSalePromotion(userId, storeId, id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String storeId,
            @PathVariable String id) {
        salePromotionService.deleteSalePromotion(userId, storeId, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<Void> restore(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String storeId,
            @PathVariable String id) {
        salePromotionService.restoreSalePromotion(userId, storeId, id);
        return ResponseEntity.noContent().build();
    }
}