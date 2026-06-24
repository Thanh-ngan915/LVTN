package com.example.storeservice.service.impl;

import com.example.storeservice.config.JwtTokenProvider;
import com.example.storeservice.dto.SalePromotionDTO;
import com.example.storeservice.dto.StoreDTO;
import com.example.storeservice.dto.StoreProfileResponseDTO;
import com.example.storeservice.dto.VoucherDTO;
import com.example.storeservice.entity.SalePromotion;
import com.example.storeservice.entity.Store;
import com.example.storeservice.entity.StoreSalePromotion;
import com.example.storeservice.entity.Voucher;
import com.example.storeservice.repository.SalePromotionRepository;
import com.example.storeservice.repository.StoreRepository;
import com.example.storeservice.repository.StoreSalePromotionRepository;
import com.example.storeservice.repository.VoucherRepository;
import com.example.storeservice.service.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreServiceImpl implements StoreService {
    private final StoreRepository storeRepository;
    private final VoucherRepository voucherRepository;
    private final StoreSalePromotionRepository storeSalePromotionRepository;
    private final SalePromotionRepository salePromotionRepository;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    @Value("${user-service.url:http://localhost:8085}")
    private String userServiceUrl;

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
    public StoreProfileResponseDTO getStoreById(String storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
                
        List<Voucher> vouchers = voucherRepository.findByStoreId(storeId);
        List<VoucherDTO> voucherDTOs = vouchers.stream().map(this::toVoucherDTO).collect(Collectors.toList());

        List<StoreSalePromotion> storeSalePromotions = storeSalePromotionRepository.findByStoreId(storeId);
        List<SalePromotionDTO> promotionDTOs = storeSalePromotions.stream()
                .map(ssp -> salePromotionRepository.findById(ssp.getSalePromotionId()).orElse(null))
                .filter(Objects::nonNull)
                .map(this::toSalePromotionDTO)
                .collect(Collectors.toList());

        return StoreProfileResponseDTO.builder()
                .store(toDTO(store))
                .vouchers(voucherDTOs)
                .promotions(promotionDTOs)
                .build();
    }

    @Override
    public List<StoreDTO> getAllStores() {
        return storeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StoreDTO approveStore(String storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));

        store.setStatus("active");
        Store saved = storeRepository.save(store);

        try {
            String url = userServiceUrl + "/api/users/admin/approve-store"
                    + "?userId=" + store.getCreatedBy()
                    + "&storeId=" + storeId;

            // Tạo service token và gắn vào header
            String serviceToken = jwtTokenProvider.generateServiceToken();

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceToken);
            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);

            restTemplate.exchange(url, org.springframework.http.HttpMethod.POST, entity, String.class);
        } catch (Exception e) {
            log.error("Failed to notify user-service for store approval: {}", e.getMessage());
            throw new RuntimeException("Duyệt shop thất bại: không thể cập nhật role");
        }

        return toDTO(saved);
    }

    @Override
    @Transactional
    public StoreDTO updateStoreStatus(String storeId, String status) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        store.setStatus(status.toLowerCase());
        store.setUpdatedBy("ADMIN");
        store.setUpdateAt(LocalDateTime.now());
        return toDTO(storeRepository.save(store));
    }

    @Override
    public StoreDTO getStoreByUserId(String userId) {
        Store store = storeRepository.findByCreatedBy(userId)
                .orElseThrow(() -> new RuntimeException("User chưa có shop"));
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
                .createdBy(store.getCreatedBy())
                .updatedBy(store.getUpdatedBy())
                .createdAt(store.getCreatedAt())
                .updateAt(store.getUpdateAt())
                .build();
    }

    private VoucherDTO toVoucherDTO(Voucher voucher) {
        return VoucherDTO.builder()
                .id(voucher.getId())
                .code(voucher.getCode())
                .title(voucher.getTitle())
                .description(voucher.getDescription())
                .initQuantity(voucher.getInitQuantity())
                .currentQuantity(voucher.getCurrentQuantity())
                .status(voucher.getStatus())
                .type(voucher.getType())
                .storeId(voucher.getStoreId())
                .percent(voucher.getPercent())
                .maximum(voucher.getMaximum())
                .startDate(voucher.getStartDate())
                .endDate(voucher.getEndDate())
                .build();
    }

    private SalePromotionDTO toSalePromotionDTO(SalePromotion promotion) {
        return SalePromotionDTO.builder()
                .id(promotion.getId())
                .title(promotion.getTitle())
                .description(promotion.getDescription())
                .type(promotion.getType())
                .status(promotion.getStatus())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .build();
    }

    @Override
    @Transactional
    public StoreDTO updateMyStore(String userId, StoreDTO dto) {
        Store store = storeRepository.findByCreatedBy(userId)
                .orElseThrow(() -> new RuntimeException("Chưa có shop"));
        if (dto.getName() != null)        store.setName(dto.getName());
        if (dto.getImage() != null)       store.setImage(dto.getImage());
        if (dto.getLocation() != null)    store.setLocation(dto.getLocation());
        if (dto.getDescription() != null) store.setDescription(dto.getDescription());
        store.setUpdatedBy(userId);
        store.setUpdateAt(LocalDateTime.now());
        return toDTO(storeRepository.save(store));
    }
}
