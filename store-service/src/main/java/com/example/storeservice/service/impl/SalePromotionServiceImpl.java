package com.example.storeservice.service.impl;

import com.example.storeservice.dto.SalePromotionDTO;
import com.example.storeservice.dto.SalePromotionRequestDTO;
import com.example.storeservice.entity.*;
import com.example.storeservice.repository.*;
import com.example.storeservice.service.SalePromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalePromotionServiceImpl implements SalePromotionService {

    private final SalePromotionRepository salePromotionRepository;
    private final StoreSalePromotionRepository storeSalePromotionRepository;
    private final StoreRepository storeRepository;

    @Override
    @Transactional
    public SalePromotionDTO createSalePromotion(String userId, String storeId, SalePromotionRequestDTO request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền tạo KM cho shop này");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // Tạo SalePromotion
        SalePromotion promotion = SalePromotion.builder()
                .id(UUID.randomUUID().toString())
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .status(1)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdBy(userId)
                .updatedBy(userId)
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();
        SalePromotion saved = salePromotionRepository.save(promotion);

        // Tự động liên kết với store
        storeSalePromotionRepository.save(StoreSalePromotion.builder()
                .id(UUID.randomUUID().toString())
                .salePromotionId(saved.getId())
                .storeId(storeId)
                .status(1)
                .createdBy(userId)
                .updatedBy(userId)
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build());

        return toDTO(saved, storeId);
    }

    @Override
    public List<SalePromotionDTO> getSalePromotionsByStore(String storeId) {
        return storeSalePromotionRepository.findByStoreIdAndStatus(storeId, 1)
                .stream()
                .map(ssp -> salePromotionRepository.findById(ssp.getSalePromotionId())
                        .map(sp -> toDTO(sp, storeId))
                        .orElse(null))
                .collect(Collectors.toList());
    }

    @Override
    public List<SalePromotionDTO> getDeletedSalePromotions(String storeId) {
        return storeSalePromotionRepository.findByStoreIdAndStatus(storeId, 0)
                .stream()
                .map(ssp -> salePromotionRepository.findById(ssp.getSalePromotionId())
                        .map(sp -> toDTO(sp, storeId))
                        .orElse(null))
                .collect(Collectors.toList());
    }

    @Override
    public SalePromotionDTO getSalePromotionById(String id) {
        SalePromotion sp = salePromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KM"));
        StoreSalePromotion ssp = storeSalePromotionRepository
                .findBySalePromotionId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy store liên kết"));
        return toDTO(sp, ssp.getStoreId());
    }

    @Override
    @Transactional
    public SalePromotionDTO updateSalePromotion(String userId, String storeId, String id, SalePromotionRequestDTO request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền sửa KM này");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        SalePromotion sp = salePromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KM"));

        // Không cho sửa nếu đã bắt đầu
        if (LocalDateTime.now().isAfter(sp.getStartDate())) {
            throw new RuntimeException("Không thể sửa chương trình KM đã bắt đầu");
        }

        sp.setTitle(request.getTitle());
        sp.setDescription(request.getDescription());
        sp.setType(request.getType());
        sp.setStartDate(request.getStartDate());
        sp.setEndDate(request.getEndDate());
        sp.setUpdatedBy(userId);
        sp.setUpdateAt(LocalDateTime.now());

        return toDTO(salePromotionRepository.save(sp), storeId);
    }

    @Override
    @Transactional
    public void deleteSalePromotion(String userId, String storeId, String id) {
        checkOwner(userId, storeId);
        SalePromotion sp = salePromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KM"));
        sp.setStatus(0);
        sp.setUpdatedBy(userId);
        sp.setUpdateAt(LocalDateTime.now());
        salePromotionRepository.save(sp);

        storeSalePromotionRepository.findByStoreIdAndSalePromotionId(storeId, id)
                .ifPresent(ssp -> {
                    ssp.setStatus(0);
                    storeSalePromotionRepository.save(ssp);
                });
    }

    @Override
    @Transactional
    public void restoreSalePromotion(String userId, String storeId, String id) {
        checkOwner(userId, storeId);
        SalePromotion sp = salePromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KM"));
        if (sp.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Chương trình KM đã hết hạn, không thể khôi phục");
        }
        sp.setStatus(1);
        sp.setUpdatedBy(userId);
        sp.setUpdateAt(LocalDateTime.now());
        salePromotionRepository.save(sp);

        storeSalePromotionRepository.findByStoreIdAndSalePromotionId(storeId, id)
                .ifPresent(ssp -> {
                    ssp.setStatus(1);
                    storeSalePromotionRepository.save(ssp);
                });
    }

    private void checkOwner(String userId, String storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền thực hiện thao tác này");
        }
    }

    private SalePromotionDTO toDTO(SalePromotion sp, String storeId) {
        return SalePromotionDTO.builder()
                .id(sp.getId())
                .title(sp.getTitle())
                .description(sp.getDescription())
                .type(sp.getType())
                .status(sp.getStatus())
                .startDate(sp.getStartDate())
                .endDate(sp.getEndDate())
                .storeId(storeId)
                .build();
    }
}