package com.example.storeservice.service;

import com.example.storeservice.dto.StoreDTO;

public interface StoreService {
    StoreDTO registerStore(String userId, StoreDTO dto);
    StoreDTO getMyStore(String userId);
    boolean hasStore(String userId);
    StoreDTO getStoreById(String storeId);
}
