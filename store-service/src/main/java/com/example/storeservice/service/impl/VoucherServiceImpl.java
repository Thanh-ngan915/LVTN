package com.example.storeservice.service.impl;

import com.example.storeservice.dto.VoucherDTO;
import com.example.storeservice.dto.VoucherRequestDTO;
import com.example.storeservice.entity.*;
import com.example.storeservice.repository.*;
import com.example.storeservice.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final StoreRepository storeRepository;
    private final CategoryConditionVoucherRepository categoryRepo;
    private final PriceConditionVoucherRepository priceRepo;

    @Override
    @Transactional
    public VoucherDTO createVoucher(String userId, String storeId, VoucherRequestDTO request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if(!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền tạo voucher cho shop này");
        }

        if(voucherRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã voucher đã tồn tại");
        }

        if(request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        Voucher voucher = Voucher.builder()
                .code(request.getCode())
                .title(request.getTitle())
                .description(request.getDescription())
                .initQuantity(request.getInitQuantity())
                .type(request.getType())
                .storeId(storeId)
                .percent(request.getPercent())
                .maximum(request.getMaximum())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdBy(userId)
                .build();
        Voucher saved = voucherRepository.save(voucher);

        if(request.getCategoryShortnames() != null && !request.getCategoryShortnames().isEmpty()) {
            for (String cat : request.getCategoryShortnames()) {
                categoryRepo.save(CategoryConditionVoucher.builder().voucherId(saved.getId()).categoryShortname(cat).build());
            }
        }

        if(request.getPriceCondition() != null) {
            priceRepo.save(PriceConditionVoucher.builder()
                    .voucherId(saved.getId())
                    .totalMin(request.getPriceCondition().getTotalMin())
                    .totalMax(request.getPriceCondition().getTotalMax())
                    .priceMin(request.getPriceCondition().getPriceMin())
                    .build());
        }
        return toDTO(saved);
    }


    @Override
    public VoucherDTO getVoucherById(String voucherId) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
        return toDTO(voucher);
    }

    @Override
    @Transactional
    public VoucherDTO updateVoucher(String userId, String storeId, String voucherId, VoucherRequestDTO request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền sửa voucher này");
        }

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        // Kiểm tra code trùng (trừ chính nó)
        if (!voucher.getCode().equals(request.getCode()) && voucherRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã voucher đã tồn tại");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        voucher.setCode(request.getCode());
        voucher.setTitle(request.getTitle());
        voucher.setDescription(request.getDescription());
        int soLuongDaDung = voucher.getInitQuantity() - voucher.getCurrentQuantity();
        int currentQuantityNew = request.getInitQuantity() - soLuongDaDung;
        if (currentQuantityNew < 0) {
            throw new RuntimeException(
                    "Số lượng phát hành mới không được nhỏ hơn số đã sử dụng (" + soLuongDaDung + ")"
            );
        }
        voucher.setInitQuantity(request.getInitQuantity());
        voucher.setCurrentQuantity(currentQuantityNew);
        voucher.setType(request.getType());
        voucher.setPercent(request.getPercent());
        voucher.setMaximum(request.getMaximum());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setUpdatedBy(userId);
        voucher.setUpdateAt(LocalDateTime.now());
        Voucher saved = voucherRepository.save(voucher);

        // Cập nhật category conditions
        categoryRepo.deleteByVoucherId(voucherId);
        if (request.getCategoryShortnames() != null && !request.getCategoryShortnames().isEmpty()) {
            for (String cat : request.getCategoryShortnames()) {
                categoryRepo.save(CategoryConditionVoucher.builder()
                        .voucherId(saved.getId())
                        .categoryShortname(cat)
                        .build());
            }
        }

        // Cập nhật price condition
        priceRepo.deleteByVoucherId(voucherId);
        if (request.getPriceCondition() != null) {
            priceRepo.save(PriceConditionVoucher.builder()
                    .voucherId(saved.getId())
                    .totalMin(request.getPriceCondition().getTotalMin())
                    .totalMax(request.getPriceCondition().getTotalMax())
                    .priceMin(request.getPriceCondition().getPriceMin())
                    .build());
        }

        return toDTO(saved);
    }

    // SAU (soft delete - set status = 0)
    @Override
    @Transactional
    public void deleteVoucher(String userId, String storeId, String voucherId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa voucher này");
        }

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        voucher.setStatus(0);
        voucher.setUpdatedBy(userId);
        voucher.setUpdateAt(LocalDateTime.now());
        voucherRepository.save(voucher);
    }

    @Override
    public void restoreVoucher(String userId, String storeId, String voucherId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền khôi phục voucher này");
        }

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        // Kiểm tra còn hạn không
        if (voucher.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Voucher đã hết hạn, không thể khôi phục");
        }

        voucher.setStatus(1);
        voucher.setUpdatedBy(userId);
        voucher.setUpdateAt(LocalDateTime.now());
        voucherRepository.save(voucher);
    }

    public List<VoucherDTO> getVouchersByStore(String storeId) {
        return voucherRepository.findByStoreIdAndStatus(storeId, 1)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Thêm method lấy voucher đã xóa
    public List<VoucherDTO> getDeletedVouchers(String storeId) {
        return voucherRepository.findByStoreIdAndStatus(storeId, 0)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private VoucherDTO toDTO(Voucher v) {
        // Lấy conditions
        List<String> cats = categoryRepo.findByVoucherId(v.getId())
                .stream().map(CategoryConditionVoucher::getCategoryShortname)
                .collect(Collectors.toList());

        VoucherRequestDTO.PriceConditionDTO priceDTO = priceRepo.findByVoucherId(v.getId())
                .map(p -> VoucherRequestDTO.PriceConditionDTO.builder()
                        .totalMin(p.getTotalMin())
                        .totalMax(p.getTotalMax())
                        .priceMin(p.getPriceMin())
                        .build())
                .orElse(null);

        return VoucherDTO.builder()
                .id(v.getId())
                .code(v.getCode())
                .title(v.getTitle())
                .description(v.getDescription())
                .initQuantity(v.getInitQuantity())
                .currentQuantity(v.getCurrentQuantity())
                .status(v.getStatus())
                .type(v.getType())
                .storeId(v.getStoreId())
                .percent(v.getPercent())
                .maximum(v.getMaximum())
                .startDate(v.getStartDate())
                .endDate(v.getEndDate())
                .categoryShortnames(cats)
                .priceCondition(priceDTO)
                .build();
    }

    @Override
    public List<VoucherDTO> getAllActiveVouchers() {
        return voucherRepository.findByStatus(1).stream()
                .filter(v -> v.getEndDate() != null && v.getEndDate().isAfter(LocalDateTime.now()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
