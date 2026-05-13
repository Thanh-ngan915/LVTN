package com.example.storeservice.service.impl;

import com.example.storeservice.dto.StoreDTO;
import com.example.storeservice.entity.Store;
import com.example.storeservice.repository.StoreRepository;
import com.example.storeservice.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;

    @Override
    @Transactional
    public StoreDTO registerStore(String userId, StoreDTO dto) {
        // Kiểm tra user đã có shop chưa
        if (storeRepository.existsByCreatedBy(userId)) {
            throw new RuntimeException("Bạn đã đăng ký shop rồi");
        }

        Store store = Store.builder()
                .name(dto.getName())
                .image(dto.getImage())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .createdBy(userId)
                .build();

        Store saved = storeRepository.save(store);
        return toDTO(saved);
    }

    @Override
    public StoreDTO getMyStore(String userId) {
        Store store = storeRepository.findByCreatedBy(userId)
                .orElseThrow(() -> new RuntimeException("Chưa có shop"));
        return toDTO(store);
    }

    @Override
    public boolean hasStore(String userId) {
        return storeRepository.existsByCreatedBy(userId);
    }

    @Override
    public StoreDTO getStoreById(String storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        return toDTO(store);
    }
    private StoreDTO toDTO(Store store) {
        return StoreDTO.builder()
                .id(store.getId())
                .name(store.getName())
                .image(store.getImage())
                .location(store.getLocation())
                .description(store.getDescription())
                .status(store.getStatus())
                .build();
    }
}
