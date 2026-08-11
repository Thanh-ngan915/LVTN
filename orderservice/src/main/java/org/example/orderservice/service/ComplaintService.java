// service/ComplaintService.java
package org.example.orderservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.dto.AdminResolveDTO;
import org.example.orderservice.dto.ComplaintRequestDTO;
import org.example.orderservice.dto.ComplaintResponseDTO;
import org.example.orderservice.dto.ComplaintShopReplyDTO;
import org.example.orderservice.entity.OrderComplaint;
import org.example.orderservice.entity.OrderComplaint.ComplaintStatus;
import org.example.orderservice.entity.ShopViolation;
import org.example.orderservice.entity.Settlement;
import org.example.orderservice.repository.OrderComplaintRepository;
import org.example.orderservice.repository.OrderRepository;
import org.example.orderservice.repository.SettlementRepository;
import org.example.orderservice.repository.ShopViolationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final OrderComplaintRepository complaintRepo;
    private final ShopViolationRepository  violationRepo;
    private final OrderRepository          orderRepo;
    private final SettlementRepository     settlementRepo;

    // Dùng cùng URL pattern với OrderService
    @Value("${user.service.url:http://localhost:8085}/api")
    private String USER_SERVICE_BASE_URL;

    @Value("${store.service.url:http://localhost:8086}/api")
    private String STORE_SERVICE_BASE_URL;

    // Dùng RestTemplate field (không @Bean) — giống OrderService
    private final RestTemplate restTemplate = new RestTemplate();

    private static final int   VIOLATION_POINTS = 10;
    private static final float PENALTY_RATE     = 0.05f; // 5% giá trị đơn

    // ── Buyer: tạo khiếu nại ──────────────────────────────────────────────
    @CacheEvict(value = "user_orders", key = "#buyerId")
    public ComplaintResponseDTO createComplaint(String buyerId, ComplaintRequestDTO req) {
        var order = orderRepo.findById(req.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUserId().equals(buyerId))
            throw new RuntimeException("Đây không phải đơn hàng của bạn");

        // Chỉ cho phép khiếu nại khi đơn đã giao hoặc completed
        if (!List.of("delivered", "completed").contains(order.getStatus()))
            throw new RuntimeException("Chỉ có thể khiếu nại đơn hàng đã được giao");

        if (complaintRepo.existsByOrderIdAndStatus(req.getOrderId(), ComplaintStatus.PENDING))
            throw new RuntimeException("Đơn hàng này đang có khiếu nại chờ xử lý");

        var complaint = OrderComplaint.builder()
                .orderId(req.getOrderId())         // Integer — khớp Order.id
                .buyerId(buyerId)
                .shopId(order.getStoreId())         // Order.storeId
                .reason(OrderComplaint.ComplaintReason.valueOf(req.getReason()))
                .description(req.getDescription())
                .images(req.getImages() != null ? req.getImages() : List.of())
                .build();

        // Đổi trạng thái order thành complained
        order.setStatus("complained");
        orderRepo.save(order);

        return toDTO(complaintRepo.save(complaint));
    }

    // ── Buyer: xem khiếu nại của mình ────────────────────────────────────
    public List<ComplaintResponseDTO> getMyComplaints(String buyerId) {
        return complaintRepo.findByBuyerIdOrderByCreatedAtDesc(buyerId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ComplaintResponseDTO getComplaintByOrderId(Integer orderId) {
        return complaintRepo.findByOrderId(orderId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khiếu nại cho đơn hàng này"));
    }

    // ── Admin: xem tất cả PENDING ─────────────────────────────────────────
    public List<ComplaintResponseDTO> getPendingComplaints() {
        return complaintRepo.findByStatusOrderByCreatedAtDesc(ComplaintStatus.PENDING)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Shop: xem khiếu nại của shop ──────────────────────────────────────
    public List<ComplaintResponseDTO> getStoreComplaints(String shopId) {
        return complaintRepo.findByShopIdOrderByCreatedAtDesc(shopId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Shop: phản hồi khiếu nại ──────────────────────────────────────────
    @Transactional
    public ComplaintResponseDTO replyComplaintByShop(String complaintId, String shopId, ComplaintShopReplyDTO req) {
        var complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khiếu nại"));
        
        if (!complaint.getShopId().equals(shopId)) {
            throw new RuntimeException("Khiếu nại này không thuộc về shop của bạn");
        }

        if (complaint.getStatus() != ComplaintStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể phản hồi khiếu nại đang chờ xử lý");
        }

        complaint.setShopReply(req.getShopReply());
        complaint.setShopImages(req.getImages() != null ? req.getImages() : List.of());
        
        return toDTO(complaintRepo.save(complaint));
    }

    // ── Admin: APPROVE ────────────────────────────────────────────────────
    @Transactional
    @CacheEvict(value = "user_orders", key = "#result.buyerId")
    public ComplaintResponseDTO approveComplaint(String complaintId,
                                                 String adminId,
                                                 AdminResolveDTO req) {
        var complaint = findPendingOrThrow(complaintId);
        var order = orderRepo.findById(complaint.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        Float refundAmount = order.getPay(); // Float — khớp Order.pay

        // 1. Cập nhật khiếu nại
        complaint.setStatus(ComplaintStatus.APPROVED);
        complaint.setAdminNotes(req.getAdminNotes());
        complaint.setIsShopFault(req.getIsShopFault());
        complaint.setResolvedBy(adminId);
        complaint.setResolvedAt(LocalDateTime.now());
        complaintRepo.save(complaint);

        // Đổi trạng thái order thành refunded do admin duyệt hoàn tiền
        order.setStatus("refunded");
        orderRepo.save(order);

        // 2. Hoàn tiền cho buyer — gọi wallet của store-service
        //    Dùng cùng pattern restTemplate.postForEntity như OrderService
        try {
            String refundUrl = USER_SERVICE_BASE_URL
                    + "/users/wallet/" + complaint.getBuyerId()
                    + "/refund"
                    + "?amount=" + refundAmount
                    + "&referenceId=" + complaintId;
            restTemplate.postForEntity(refundUrl, null, Void.class);
            log.info("[COMPLAINT APPROVED] Refund OK → buyerId={} amount={} complaintId={}",
                    complaint.getBuyerId(), refundAmount, complaintId);
        } catch (Exception e) {
            // Ghi log lỗi nhưng không rollback complaint — admin cần xử lý thủ công
            log.error("[COMPLAINT APPROVED] Refund FAILED → complaintId={} error={}",
                    complaintId, e.getMessage());
        }

        // 3. Nếu lỗi shop: cộng điểm vi phạm + trừ tiền phạt
        if (Boolean.TRUE.equals(req.getIsShopFault())) {
            float penalty = refundAmount * PENALTY_RATE;

            violationRepo.save(ShopViolation.builder()
                    .shopId(complaint.getShopId())
                    .complaintId(complaintId)
                    .orderId(complaint.getOrderId())   // Integer
                    .violationPoints(VIOLATION_POINTS)
                    .penaltyAmount(penalty)
                    .build());

            // Trừ tiền phạt từ ví shop — cùng pattern với credit-pending
            try {
                String penaltyUrl = STORE_SERVICE_BASE_URL
                        + "/wallet/store/" + complaint.getShopId()
                        + "/deduct"
                        + "?amount=" + penalty
                        + "&referenceId=" + complaintId + "_penalty";
                restTemplate.postForEntity(penaltyUrl, null, Void.class);
                log.info("[COMPLAINT APPROVED] Penalty OK → shopId={} penalty={} points={}",
                        complaint.getShopId(), penalty, VIOLATION_POINTS);
            } catch (Exception e) {
                log.error("[COMPLAINT APPROVED] Penalty FAILED → shopId={} error={}",
                        complaint.getShopId(), e.getMessage());
            }
        }

        // 4. Thu hồi tiền của đơn hàng từ ví của shop (vì tiền đã được hoàn cho buyer)
        Settlement settlement = settlementRepo.findByOrderId(String.valueOf(complaint.getOrderId())).orElse(null);
        if (settlement != null) {
            if ("CREDITED".equals(settlement.getStatus())) {
                // Tiền vẫn đang chờ ở PendingBalance, ta cần gọi store-service để hủy khoản này
                try {
                    String cancelPendingUrl = STORE_SERVICE_BASE_URL
                            + "/wallet/store/" + complaint.getShopId()
                            + "/cancel-pending"
                            + "?amount=" + settlement.getNetAmount()
                            + "&referenceId=" + complaintId;
                    restTemplate.postForEntity(cancelPendingUrl, null, Void.class);
                    log.info("[COMPLAINT APPROVED] Canceled pending balance for shopId={} amount={}",
                            complaint.getShopId(), settlement.getNetAmount());
                    
                    // Đổi trạng thái để Scheduler không tự động chuyển sang AvailableBalance nữa
                    settlement.setStatus("CANCELLED");
                    settlement.setUpdatedBy("admin");
                    settlement.setUpdateAt(LocalDateTime.now());
                    settlementRepo.save(settlement);
                } catch (Exception e) {
                    log.error("[COMPLAINT APPROVED] Cancel pending FAILED → shopId={} error={}",
                            complaint.getShopId(), e.getMessage());
                }
            } else if ("SETTLED".equals(settlement.getStatus())) {
                // Tiền đã sang AvailableBalance, ta cần gọi store-service để trừ trực tiếp
                try {
                    String deductUrl = STORE_SERVICE_BASE_URL
                            + "/wallet/store/" + complaint.getShopId()
                            + "/deduct"
                            + "?amount=" + settlement.getNetAmount()
                            + "&referenceId=" + complaintId + "_reversal";
                    restTemplate.postForEntity(deductUrl, null, Void.class);
                    log.info("[COMPLAINT APPROVED] Deducted settled balance from shopId={} amount={}",
                            complaint.getShopId(), settlement.getNetAmount());
                    
                    settlement.setStatus("REFUNDED");
                    settlement.setUpdatedBy("admin");
                    settlement.setUpdateAt(LocalDateTime.now());
                    settlementRepo.save(settlement);
                } catch (Exception e) {
                    log.error("[COMPLAINT APPROVED] Deduct settled FAILED → shopId={} error={}",
                            complaint.getShopId(), e.getMessage());
                }
            }
        }

        return toDTO(complaint);
    }

    // ── Admin: REJECT → shop giữ tiền, không làm gì thêm ─────────────────
    @Transactional
    @CacheEvict(value = "user_orders", key = "#result.buyerId")
    public ComplaintResponseDTO rejectComplaint(String complaintId,
                                                String adminId,
                                                AdminResolveDTO req) {
        var complaint = findPendingOrThrow(complaintId);

        complaint.setStatus(ComplaintStatus.REJECTED);
        complaint.setAdminNotes(req.getAdminNotes());
        complaint.setIsShopFault(req.getIsShopFault());
        complaint.setResolvedBy(adminId);
        complaint.setResolvedAt(LocalDateTime.now());

        // Đổi trạng thái order lại thành complaint_rejected do admin từ chối
        var order = orderRepo.findById(complaint.getOrderId()).orElse(null);
        if (order != null) {
            order.setStatus("complaint_rejected");
            orderRepo.save(order);
        }

        // Không hoàn tiền — shop giữ nguyên tiền
        log.info("[COMPLAINT REJECTED] complaintId={} shopId={} buyerId={}",
                complaintId, complaint.getShopId(), complaint.getBuyerId());

        return toDTO(complaintRepo.save(complaint));
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    private OrderComplaint findPendingOrThrow(String id) {
        var c = complaintRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khiếu nại"));
        if (c.getStatus() != ComplaintStatus.PENDING)
            throw new RuntimeException("Khiếu nại này đã được xử lý rồi");
        return c;
    }

    private ComplaintResponseDTO toDTO(OrderComplaint entity) {
        return ComplaintResponseDTO.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .buyerId(entity.getBuyerId())
                .shopId(entity.getShopId())
                .reason(entity.getReason().name())
                .description(entity.getDescription())
                .images(entity.getImages())
                .shopReply(entity.getShopReply())
                .shopImages(entity.getShopImages())
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .adminNotes(entity.getAdminNotes())
                .isShopFault(entity.getIsShopFault())
                .resolvedBy(entity.getResolvedBy())
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null)
                .resolvedAt(entity.getResolvedAt() != null ? entity.getResolvedAt().toString() : null)
                .build();
    }
}