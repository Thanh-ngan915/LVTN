package com.example.storeservice.service;

import com.example.storeservice.dto.StoreDTO;
import com.example.storeservice.dto.StoreProfileResponseDTO;

import java.util.List;

public interface StoreService {
    StoreDTO registerStore(String userId, StoreDTO dto);
    StoreDTO getMyStore(String userId);
    boolean hasStore(String userId);
    StoreProfileResponseDTO getStoreById(String storeId);
    List<StoreDTO> getAllStores();
    StoreDTO approveStore(String storeId);
    StoreDTO updateStoreStatus(String storeId, String status);
}
