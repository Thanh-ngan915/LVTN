package com.example.storeservice.controller;

import com.example.storeservice.dto.StoreDTO;
import com.example.storeservice.dto.StoreProfileResponseDTO;
import com.example.storeservice.dto.ProductPromotionDTO;
import com.example.storeservice.entity.SalePromotion;
import com.example.storeservice.entity.ProductPromotion;
import com.example.storeservice.repository.SalePromotionRepository;
import com.example.storeservice.repository.ProductPromotionRepository;
import com.example.storeservice.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;
    private final SalePromotionRepository salePromotionRepository;
    private final ProductPromotionRepository productPromotionRepository;

    @GetMapping("/promotions/active")
    public ResponseEntity<List<ProductPromotionDTO>> getActivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        List<SalePromotion> activePromotions = salePromotionRepository.findAll().stream()
                .filter(sp -> sp.getStatus() != null && sp.getStatus() == 1)
                .filter(sp -> sp.getStartDate() != null && sp.getEndDate() != null)
                .filter(sp -> !now.isBefore(sp.getStartDate()) && !now.isAfter(sp.getEndDate()))
                .collect(Collectors.toList());

        List<ProductPromotionDTO> activeProductPromotions = new ArrayList<>();
        for (SalePromotion sp : activePromotions) {
            List<ProductPromotion> pps = productPromotionRepository.findBySalePromotionIdAndIsDelete(sp.getId(), false);
            for (ProductPromotion pp : pps) {
                activeProductPromotions.add(ProductPromotionDTO.builder()
                        .id(pp.getId())
                        .productId(pp.getProductId())
                        .salePromotionId(pp.getSalePromotionId())
                        .name(pp.getName())
                        .image(pp.getImage())
                        .priceAfter(pp.getPriceAfter())
                        .quantity(pp.getQuantity())
                        .bought(pp.getBought())
                        .isDelete(pp.getIsDelete())
                        .startDate(sp.getStartDate())
                        .endDate(sp.getEndDate())
                        .build());
            }
        }
        return ResponseEntity.ok(activeProductPromotions);
    }

    // Đăng ký shop mới
    @PostMapping("/register")
    public ResponseEntity<StoreDTO> register(
            @RequestParam String userId,
            @RequestBody StoreDTO dto) {
        return ResponseEntity.ok(storeService.registerStore(userId, dto));
    }

    // Lấy thông tin shop của user
    @GetMapping("/my-store")
    public ResponseEntity<StoreDTO> getMyStore(@RequestParam String userId) {
        return ResponseEntity.ok(storeService.getMyStore(userId));
    }

    // Kiểm tra user đã có shop chưa
    @GetMapping("/has-store")
    public ResponseEntity<Boolean> hasStore(@RequestParam String userId) {
        return ResponseEntity.ok(storeService.hasStore(userId));
    }

    // Hiển thị thông tin shop
    @GetMapping("/{storeId}")
    public ResponseEntity<StoreProfileResponseDTO> getStoreById(@PathVariable String storeId) {
        return ResponseEntity.ok(storeService.getStoreById(storeId));
    }

    @GetMapping
    public ResponseEntity<List<StoreDTO>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @PatchMapping("/{storeId}/approve")
    public ResponseEntity<StoreDTO> approveStore(@PathVariable String storeId) {
        return ResponseEntity.ok(storeService.approveStore(storeId));
    }

    @PatchMapping("/{storeId}/status")
    public ResponseEntity<StoreDTO> updateStoreStatus(
            @PathVariable String storeId,
            @RequestParam String status) {
        return ResponseEntity.ok(storeService.updateStoreStatus(storeId, status));
    }

    @PatchMapping("/my-store")
    public ResponseEntity<StoreDTO> updateMyStore(
            @RequestParam String userId,
            @RequestBody StoreDTO dto) {
        return ResponseEntity.ok(storeService.updateMyStore(userId, dto));
    }
}
