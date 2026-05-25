package com.example.storeservice.service;

import com.example.storeservice.dto.StoreDTO;
import com.example.storeservice.dto.StoreProfileResponseDTO;

public interface StoreService {
    StoreDTO registerStore(String userId, StoreDTO dto);
    StoreDTO getMyStore(String userId);
    boolean hasStore(String userId);
    StoreProfileResponseDTO getStoreById(String storeId);
}
