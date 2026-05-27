package com.example.storeservice.controller;

import com.example.storeservice.dto.ProductPromotionDTO;
import com.example.storeservice.dto.ProductPromotionRequestDTO;
import com.example.storeservice.service.ProductPromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}/sale-promotions/{salePromotionId}/products")
@RequiredArgsConstructor
public class ProductPromotionController {

    private final ProductPromotionService productPromotionService;

    @PostMapping
    public ResponseEntity<ProductPromotionDTO> addProduct(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("Authorization") String authorization,
            @PathVariable String storeId,
            @PathVariable String salePromotionId,
            @RequestBody ProductPromotionRequestDTO request) {

        String accessToken = authorization.replace("Bearer ", "");
        return ResponseEntity.ok(productPromotionService.addProductToPromotion(
                userId, storeId, salePromotionId, request, accessToken));
    }

    @GetMapping
    public ResponseEntity<List<ProductPromotionDTO>> getProducts(
            @PathVariable String storeId,
            @PathVariable String salePromotionId) {
        return ResponseEntity.ok(productPromotionService.getProductsByPromotion(salePromotionId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeProduct(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String storeId,
            @PathVariable String salePromotionId,
            @PathVariable String id) {
        productPromotionService.removeProductFromPromotion(userId, storeId, id);
        return ResponseEntity.noContent().build();
    }
}