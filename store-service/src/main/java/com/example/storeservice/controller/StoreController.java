package com.example.storeservice.controller;

import com.example.storeservice.dto.StoreDTO;
import com.example.storeservice.dto.StoreProfileResponseDTO;
import com.example.storeservice.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

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
}
