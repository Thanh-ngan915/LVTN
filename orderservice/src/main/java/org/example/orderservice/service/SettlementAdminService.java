package org.example.orderservice.service;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.AdminSettlementRowDTO;
import org.example.orderservice.dto.AdminSettlementStatsDTO;
import org.example.orderservice.entity.Settlement;
import org.example.orderservice.repository.SettlementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettlementAdminService {

    private final SettlementRepository settlementRepository;

    // Đơn bị khiếu nại & hoàn tiền không tính vào doanh thu/phí thực thu
    private static final List<String> EXCLUDED_STATUSES = List.of("CANCELLED", "REFUNDED");

    public AdminSettlementStatsDTO getStats(LocalDateTime from, LocalDateTime to) {
        Double revenue = settlementRepository.sumGrossAmountBetween(from, to, EXCLUDED_STATUSES);
        Double fee = settlementRepository.sumCommissionFeeBetween(from, to, EXCLUDED_STATUSES);
        Long count = settlementRepository.countCompletedBetween(from, to, EXCLUDED_STATUSES);

        return AdminSettlementStatsDTO.builder()
                .totalRevenue(revenue != null ? revenue : 0.0)
                .totalCommissionFee(fee != null ? fee : 0.0)
                .totalCompletedOrders(count != null ? count : 0L)
                .build();
    }

    public Page<AdminSettlementRowDTO> getSettlements(LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return settlementRepository
                .findCompletedBetween(from, to, EXCLUDED_STATUSES, pageable)
                .map(this::toRowDTO);
    }

    public List<AdminSettlementRowDTO> getAllSettlements(LocalDateTime from, LocalDateTime to) {
        return settlementRepository.findAllCompletedBetween(from, to, EXCLUDED_STATUSES)
                .stream().map(this::toRowDTO).toList();
    }

    private AdminSettlementRowDTO toRowDTO(Settlement s) {
        double rate = (s.getGrossAmount() != null && s.getGrossAmount() > 0)
                ? (s.getCommissionFee() / s.getGrossAmount()) * 100
                : 0;

        return AdminSettlementRowDTO.builder()
                .orderId(s.getOrderId())
                .storeId(s.getStoreId())
                .completedAt(s.getCreatedAt() != null ? s.getCreatedAt().toString() : null)
                .grossAmount(s.getGrossAmount())
                .commissionRate(rate)
                .commissionFee(s.getCommissionFee())
                .status(s.getStatus())
                .build();
    }
}