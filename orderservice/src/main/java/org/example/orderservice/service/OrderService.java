package org.example.orderservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.dto.*;
import org.example.orderservice.entity.*;
import org.example.orderservice.repository.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductOrderRepository productOrderRepository;
    private final DeliveryInformationRepository deliveryInformationRepository;
    private final VoucherRepository voucherRepository;
    private final RatingRepository ratingRepository;
    private final OrderFlowRepository orderFlowRepository;
    private final OrderRefundRepository orderRefundRepository;
    private final ProductOrderRefundRepository productOrderRefundRepository;
    private final GhtkService ghtkService;
    @Value("${store.service.url:http://localhost:8090}/api")
    private String STORE_SERVICE_BASE_URL;

    private final RestTemplate restTemplate = new RestTemplate();

    // Có thể override bằng env var STORE_SERVICE_URL khi chạy Docker
    @Value("${store.service.url:http://localhost:8090}/api/vouchers")
    private String STORE_SERVICE_URL;
    private final SettlementRepository settlementRepository;

    /**
     * Tạo đơn hàng mới (Mua ngay)
     */
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request, String userId) {
        // 1. Lưu địa chỉ giao hàng
        DeliveryInformation delivery = DeliveryInformation.builder()
                .userId(userId)
                .recipientName(request.getRecipientName())
                .phone(request.getPhone())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .addressDetail(request.getAddressDetail())
                .isDefault(false)
                .build();
        delivery = deliveryInformationRepository.save(delivery);

        // 2. Tính toán tổng tiền
        float total = 0f;
        List<OrderItemRequestDTO> requestItems = request.getItems();
        if (requestItems != null && !requestItems.isEmpty()) {
            for (OrderItemRequestDTO item : requestItems) {
                int itemQty = item.getQuantity() != null ? item.getQuantity() : 1;
                float itemPriceAfter = item.getProductPriceAfter() != null ? item.getProductPriceAfter() : 0f;
                total += itemPriceAfter * itemQty;
            }
        } else {
            int qty = request.getQuantity() != null ? request.getQuantity() : 1;
            float priceAfter = request.getProductPriceAfter() != null ? request.getProductPriceAfter() : 0f;
            total = priceAfter * qty;
        }

        // 3. Xác định platformVoucherId (tương thích ngược)
        Integer platformVoucherIdToUse = request.getPlatformVoucherId() != null
                ? request.getPlatformVoucherId()
                : request.getVoucherId();

        // 4. Áp dụng Platform Voucher (voucher sàn - local DB)
        float platformDiscount = 0f;
        Voucher platformVoucher = null;
        if (platformVoucherIdToUse != null) {
            platformVoucher = voucherRepository.findById(platformVoucherIdToUse).orElse(null);
            if (platformVoucher != null) {
                if (platformVoucher.getStoreId() != null) {
                    throw new RuntimeException("Voucher '" + platformVoucher.getCode() + "' không phải voucher sàn");
                }
                platformDiscount = applyPlatformVoucher(platformVoucher, total);
            }
        }

        // 5. Áp dụng Shop Voucher (lấy từ API)
        float shopDiscount = 0f;
        StoreVoucherDTO shopVoucherDTO = null;
        if (request.getShopVoucherId() != null && !request.getShopVoucherId().isBlank()) {
            try {
                ResponseEntity<StoreVoucherDTO> response = restTemplate.getForEntity(
                        STORE_SERVICE_URL + "/" + request.getShopVoucherId(), StoreVoucherDTO.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    shopVoucherDTO = response.getBody();

                    if (shopVoucherDTO.getStoreId() == null) {
                        throw new RuntimeException("Voucher '" + shopVoucherDTO.getCode() + "' không phải voucher của shop");
                    }
                    if (!shopVoucherDTO.getStoreId().equals(request.getStoreId())) {
                        throw new RuntimeException("Voucher '" + shopVoucherDTO.getCode() + "' không thuộc shop này");
                    }

                    shopDiscount = calculateApiVoucherDiscount(shopVoucherDTO, total);
                } else {
                    throw new RuntimeException("Voucher shop không hợp lệ");
                }
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi áp dụng voucher shop: " + e.getMessage());
            }
        }

        float totalDiscount = platformDiscount + shopDiscount;

        // 6. Tính phí vận chuyển thực tế qua GHTK
        float shippingFee;
        try {
            ShippingFeeRequestDTO shippingReq = ShippingFeeRequestDTO.builder()
                    .province(request.getProvince())
                    .district(request.getDistrict())
                    .ward(request.getWard())
                    .address(request.getAddressDetail())
                    .storeId(request.getStoreId())
                    .weight(500) // mặc định 500g
                    .value(total)
                    .build();
            ShippingFeeResponseDTO shippingResult = ghtkService.calculateShippingFee(shippingReq);
            shippingFee = shippingResult.getFee() != null ? shippingResult.getFee() : 30_000f;
        } catch (Exception e) {
            log.warn("Không thể tính phí GHTK, dùng phí mặc định: {}", e.getMessage());
            shippingFee = 30_000f;
        }

        float pay = Math.max(0f, total - totalDiscount + shippingFee);

        // 7. Tạo đơn hàng
        Order order = Order.builder()
                .userId(userId)
                .storeId(request.getStoreId())
                .total(total)
                .discount(totalDiscount)
                .pay(pay)
                .shippingFee(shippingFee)
                .voucherId(platformVoucher != null ? platformVoucher.getId() : null)
                .shopVoucherId(shopVoucherDTO != null ? shopVoucherDTO.getId() : null)
                .shopDiscount(shopDiscount)
                .deliveryInformationId(delivery.getId())
                .status("pending")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
                .paymentStatus("pending")
                .livestreamRoomId(request.getLivestreamRoomId())
                .build();
        order = orderRepository.save(order);

        // 8. Tạo product order item
        List<ProductOrder> savedItems = new ArrayList<>();
        if (requestItems != null && !requestItems.isEmpty()) {
            for (OrderItemRequestDTO item : requestItems) {
                int itemQty = item.getQuantity() != null ? item.getQuantity() : 1;
                float itemPriceAfter = item.getProductPriceAfter() != null ? item.getProductPriceAfter() : 0f;
                float itemPriceBefore = item.getProductPriceBefore() != null ? item.getProductPriceBefore() : itemPriceAfter;

                ProductOrder productOrder = ProductOrder.builder()
                        .productId(item.getProductId())
                        .orderId(order.getId())
                        .quantity(itemQty)
                        .priceBefore(itemPriceBefore)
                        .priceAfter(itemPriceAfter)
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .color(item.getColor())
                        .size(item.getSize())
                        .build();
                savedItems.add(productOrderRepository.save(productOrder));
            }
        } else {
            int qty = request.getQuantity() != null ? request.getQuantity() : 1;
            float priceAfter = request.getProductPriceAfter() != null ? request.getProductPriceAfter() : 0f;
            float priceBefore = request.getProductPriceBefore() != null ? request.getProductPriceBefore() : priceAfter;

            ProductOrder productOrder = ProductOrder.builder()
                    .productId(request.getProductId())
                    .orderId(order.getId())
                    .quantity(qty)
                    .priceBefore(priceBefore)
                    .priceAfter(priceAfter)
                    .productName(request.getProductName())
                    .productImage(request.getProductImage())
                    .color(request.getColor())
                    .size(request.getSize())
                    .build();
            savedItems.add(productOrderRepository.save(productOrder));
        }

        return toOrderResponseDTO(order, delivery, savedItems);
    }

    private float applyPlatformVoucher(Voucher voucher, float orderTotal) {
        if (!"active".equals(voucher.getStatus())) return 0f;
        float minOrder = voucher.getMinOrderValue() != null ? voucher.getMinOrderValue() : 0f;
        if (orderTotal < minOrder) return 0f;

        String discountType = voucher.getEffectiveDiscountType();
        Float discountValue = voucher.getEffectiveDiscountValue();
        Float maxDiscount = voucher.getEffectiveMaxDiscount();

        float discount;
        if ("PERCENT".equals(discountType)) {
            discount = orderTotal * (discountValue / 100f);
            if (maxDiscount != null && discount > maxDiscount) {
                discount = maxDiscount;
            }
        } else {
            discount = discountValue != null ? discountValue : 0f;
        }

        int usedCount = voucher.getUsedCount() != null ? voucher.getUsedCount() : 0;
        voucher.setUsedCount(usedCount + 1);
        if (voucher.getQuantity() != null && voucher.getUsedCount() >= voucher.getQuantity()) {
            voucher.setStatus("inactive");
        }
        voucherRepository.save(voucher);

        return discount;
    }

    private float calculateApiVoucherDiscount(StoreVoucherDTO voucherDTO, float orderTotal) {
        // Validation logic for API voucher
        // status=1 means active in store-service
        if (voucherDTO.getStatus() == null || voucherDTO.getStatus() != 1) return 0f;

        float minOrder = 0f;
        if (voucherDTO.getPriceCondition() != null && voucherDTO.getPriceCondition().getTotalMin() != null) {
            minOrder = voucherDTO.getPriceCondition().getTotalMin();
        }

        if (orderTotal < minOrder) return 0f;

        String discountType = "FIXED";
        Float discountValue = voucherDTO.getMaximum() != null ? voucherDTO.getMaximum().floatValue() : 0f;
        Float maxDiscount = null;

        if (voucherDTO.getType() != null && voucherDTO.getType() == 2) {
            discountType = "PERCENT";
            discountValue = voucherDTO.getPercent() != null ? voucherDTO.getPercent().floatValue() : 0f;
            maxDiscount = voucherDTO.getMaximum() != null ? voucherDTO.getMaximum().floatValue() : null;
        }

        float discount;
        if ("PERCENT".equals(discountType)) {
            discount = orderTotal * (discountValue / 100f);
            if (maxDiscount != null && discount > maxDiscount) {
                discount = maxDiscount;
            }
        } else {
            discount = discountValue != null ? discountValue : 0f;
        }
        return discount;
    }

    public List<VoucherDTO> getVouchersByStore(String storeId) {
        // Platform vouchers from local DB
        List<Voucher> platformVouchers = voucherRepository
                .findByStoreIdIsNullAndStatusAndEndDateAfter("active", LocalDateTime.now());

        List<VoucherDTO> result = new ArrayList<>();
        platformVouchers.stream().map(v -> toVoucherDTO(v, true)).forEach(result::add);

        // Shop vouchers from API
        try {
            ResponseEntity<List<StoreVoucherDTO>> response = restTemplate.exchange(
                    STORE_SERVICE_URL + "/store/" + storeId,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<StoreVoucherDTO>>() {}
            );
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                for (StoreVoucherDTO v : response.getBody()) {
                    result.add(convertStoreVoucherToVoucherDTO(v));
                }
            }
        } catch (Exception e) {
            System.err.println("Cannot fetch vouchers from store-service: " + e.getMessage());
        }

        return result;
    }

    private VoucherDTO convertStoreVoucherToVoucherDTO(StoreVoucherDTO v) {
        String discountType = (v.getType() != null && v.getType() == 2) ? "PERCENT" : "FIXED";
        Float discountValue = (v.getType() != null && v.getType() == 2)
            ? (v.getPercent() != null ? v.getPercent().floatValue() : 0f)
            : (v.getMaximum() != null ? v.getMaximum().floatValue() : 0f);

        Float minOrder = (v.getPriceCondition() != null && v.getPriceCondition().getTotalMin() != null)
            ? v.getPriceCondition().getTotalMin() : 0f;

        return VoucherDTO.builder()
                .id(v.getId())
                .code(v.getCode())
                .name(v.getTitle() != null ? v.getTitle() : "Shop Voucher")
                .description(v.getDescription())
                .discountType(discountType)
                .discountValue(discountValue)
                .minOrderValue(minOrder)
                .maxDiscount(v.getMaximum() != null ? v.getMaximum().floatValue() : null)
                .storeId(v.getStoreId())
                .startDate(v.getStartDate())
                .endDate(v.getEndDate())
                .quantity(v.getInitQuantity())
                .usedCount(v.getInitQuantity() != null && v.getCurrentQuantity() != null ? v.getInitQuantity() - v.getCurrentQuantity() : 0)
                .status((v.getStatus() != null && v.getStatus() == 1) ? "active" : "inactive")
                .isPlatform(false)
                .build();
    }

    public DeliveryInformationDTO getDefaultDelivery(String userId) {
        return deliveryInformationRepository.findByUserIdAndIsDefaultTrue(userId)
                .map(this::toDeliveryDTO)
                .orElse(null);
    }

    public List<DeliveryInformationDTO> getDeliveriesByUser(String userId) {
        return deliveryInformationRepository.findByUserId(userId)
                .stream().map(this::toDeliveryDTO).collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        return toOrderResponseDTO(order, order.getDeliveryInformation(), order.getItems());
    }

    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        List<OrderResponseDTO> result = new ArrayList<>();
        for (Order order : orders) {
            result.add(toOrderResponseDTO(order, order.getDeliveryInformation(), order.getItems()));
        }
        return result;
    }

    @Transactional
    public OrderResponseDTO cancelOrder(Integer orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Không có quyền hủy đơn này");
        }
        if (!"pending".equals(order.getStatus())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng đang chờ xác nhận");
        }

        order.setStatus("cancelled");
        order.setUpdateAt(LocalDateTime.now());
        orderRepository.save(order);

        return toOrderResponseDTO(order, order.getDeliveryInformation(), order.getItems());
    }


    private static final float SHIPPING_FEE = 30000f; // Phí mặc định (fallback)

    private OrderResponseDTO toOrderResponseDTO(Order order, DeliveryInformation delivery, List<ProductOrder> items) {
        List<OrderResponseDTO.ProductOrderItemDTO> itemDTOs = items.stream()
                .map(i -> OrderResponseDTO.ProductOrderItemDTO.builder()
                        .productId(i.getProductId())
                        .productName(i.getProductName())
                        .productImage(i.getProductImage())
                        .color(i.getColor())
                        .size(i.getSize())
                        .quantity(i.getQuantity())
                        .priceBefore(i.getPriceBefore())
                        .priceAfter(i.getPriceAfter())
                        .build())
                .collect(Collectors.toList());

        OrderResponseDTO.VoucherInfoDTO voucherInfo = null;
        if (order.getVoucherId() != null) {
            Voucher v = voucherRepository.findById(order.getVoucherId()).orElse(null);
            if (v != null) {
                voucherInfo = OrderResponseDTO.VoucherInfoDTO.builder()
                        .id(String.valueOf(v.getId()))
                        .code(v.getCode())
                        .name(v.getName() != null ? v.getName() : v.getTitle())
                        .discountType(v.getEffectiveDiscountType())
                        .discountValue(v.getEffectiveDiscountValue())
                        .maxDiscount(v.getEffectiveMaxDiscount())
                        .build();
            }
        }

        OrderResponseDTO.VoucherInfoDTO shopVoucherInfo = null;
        if (order.getShopVoucherId() != null && !order.getShopVoucherId().isBlank()) {
            try {
                ResponseEntity<StoreVoucherDTO> response = restTemplate.getForEntity(
                        STORE_SERVICE_URL + "/" + order.getShopVoucherId(), StoreVoucherDTO.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    StoreVoucherDTO v = response.getBody();
                    shopVoucherInfo = OrderResponseDTO.VoucherInfoDTO.builder()
                        .id(v.getId())
                        .code(v.getCode())
                        .name(v.getTitle() != null ? v.getTitle() : "Shop Voucher")
                        .discountType(v.getType() != null && v.getType() == 2 ? "PERCENT" : "FIXED")
                        .discountValue(v.getType() != null && v.getType() == 2 ? (v.getPercent() != null ? v.getPercent().floatValue() : 0f) : (v.getMaximum() != null ? v.getMaximum().floatValue() : 0f))
                        .maxDiscount(v.getMaximum() != null ? v.getMaximum().floatValue() : null)
                        .build();
                }
            } catch (Exception e) {
                // Ignore API failure, just set ID
                shopVoucherInfo = OrderResponseDTO.VoucherInfoDTO.builder()
                        .id(order.getShopVoucherId())
                        .name("Shop Voucher")
                        .build();
            }
        }

        float shippingFee = order.getShippingFee() != null ? order.getShippingFee() : 0f;
        boolean rated = !ratingRepository.findByOrderId(order.getId()).isEmpty();

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .storeId(order.getStoreId())
                .total(order.getTotal())
                .discount(order.getDiscount())
                .pay(order.getPay())
                .shippingFee(shippingFee)
                .voucherId(order.getVoucherId())
                .shopVoucherId(order.getShopVoucherId())
                .shopDiscount(order.getShopDiscount())
                .deliveryInformationId(order.getDeliveryInformationId())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null)
                .deliveryInformation(delivery != null ? toDeliveryDTO(delivery) : null)
                .voucherInfo(voucherInfo)
                .shopVoucherInfo(shopVoucherInfo)
                .items(itemDTOs)
                .rated(rated)
                .build();
    }

    private VoucherDTO toVoucherDTO(Voucher v, boolean isPlatform) {
        return VoucherDTO.builder()
                .id(String.valueOf(v.getId()))
                .code(v.getCode())
                .name(v.getName() != null ? v.getName() : v.getTitle())
                .description(v.getDescription())
                .discountType(v.getEffectiveDiscountType())
                .discountValue(v.getEffectiveDiscountValue())
                .minOrderValue(v.getMinOrderValue() != null ? v.getMinOrderValue() : 0f)
                .maxDiscount(v.getEffectiveMaxDiscount())
                .storeId(v.getStoreId())
                .startDate(v.getStartDate() != null ? v.getStartDate().toString() : null)
                .endDate(v.getEndDate() != null ? v.getEndDate().toString() : null)
                .quantity(v.getQuantity())
                .usedCount(v.getUsedCount() != null ? v.getUsedCount() : 0)
                .status(v.getStatus())
                .isPlatform(isPlatform)
                .build();
    }

    private DeliveryInformationDTO toDeliveryDTO(DeliveryInformation d) {
        return DeliveryInformationDTO.builder()
                .id(d.getId())
                .userId(d.getUserId())
                .recipientName(d.getRecipientName())
                .phone(d.getPhone())
                .province(d.getProvince())
                .district(d.getDistrict())
                .ward(d.getWard())
                .addressDetail(d.getAddressDetail())
                .isDefault(d.getIsDefault())
                .build();
    }

    private String getStoreIdByUserId(String userId) {
        return getStoreIdByUserId(userId, null);
    }

    private String getStoreIdByUserId(String userId, String bearerToken) {
        try {
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("X-User-Id", userId);
            if (bearerToken != null && !bearerToken.isBlank()) {
                headers.set("Authorization", "Bearer " + bearerToken);
            }

            String url = STORE_SERVICE_BASE_URL + "/stores/my-store?userId=" + userId;
            System.out.println("DEBUG → calling: " + url);

            ResponseEntity<StoreDTO> resp = restTemplate.exchange(
                    url, HttpMethod.GET,
                    new org.springframework.http.HttpEntity<>(headers),
                    StoreDTO.class
            );
            if (resp.getStatusCode().is2xxSuccessful()
                    && resp.getBody() != null
                    && resp.getBody().getId() != null) {
                return resp.getBody().getId();
            }
        } catch (Exception e) {
            System.err.println("ERROR getStoreIdByUserId | " + e.getMessage());
            throw new RuntimeException("Không thể xác thực seller: " + e.getMessage());
        }
        throw new RuntimeException("Bạn chưa có shop hoặc không thể xác thực seller");
    }

    // =========================================================================
    // SELLER — danh sách & chi tiết đơn hàng
    // =========================================================================

    public List<OrderResponseDTO> getOrdersBySellerUserId(String userId, String status, String token) {
        String storeId = getStoreIdByUserId(userId, token);
        List<Order> orders = (status != null && !status.isBlank())
                ? orderRepository.findByStoreIdAndStatus(storeId, status)
                : orderRepository.findByStoreId(storeId);

        List<OrderResponseDTO> result = new ArrayList<>();
        for (Order order : orders) {
            DeliveryInformation delivery = deliveryInformationRepository
                    .findById(order.getDeliveryInformationId()).orElse(null);
            List<ProductOrder> items = productOrderRepository.findByOrderId(order.getId());
            result.add(toOrderResponseDTO(order, delivery, items));
        }
        return result;
    }

    public OrderResponseDTO getOrderDetailForSeller(Integer orderId, String userId, String token) {
        String storeId = getStoreIdByUserId(userId, token);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        if (!storeId.equals(order.getStoreId()))
            throw new RuntimeException("Đơn hàng không thuộc shop của bạn");
        DeliveryInformation delivery = deliveryInformationRepository
                .findById(order.getDeliveryInformationId()).orElse(null);
        List<ProductOrder> items = productOrderRepository.findByOrderId(orderId);
        return toOrderResponseDTO(order, delivery, items);
    }

    // =========================================================================
    // SELLER — cập nhật trạng thái đơn
    // =========================================================================

    @Transactional
    public OrderResponseDTO updateOrderStatusBySeller(Integer orderId, SellerOrderUpdateDTO updateDTO, String userId, String token) {
        String storeId = getStoreIdByUserId(userId, token);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        if (!storeId.equals(order.getStoreId()))
            throw new RuntimeException("Đơn hàng không thuộc shop của bạn");

        validateSellerStatusTransition(order.getStatus(), updateDTO.getStatus());

        order.setStatus(updateDTO.getStatus());
        order.setUpdateAt(LocalDateTime.now());
        orderRepository.save(order);
        saveOrderFlow(String.valueOf(orderId), updateDTO.getStatus(), storeId, updateDTO.getNote());

        DeliveryInformation delivery = deliveryInformationRepository
                .findById(order.getDeliveryInformationId()).orElse(null);
        List<ProductOrder> items = productOrderRepository.findByOrderId(orderId);
        return toOrderResponseDTO(order, delivery, items);
    }

    /**
     * Luồng hợp lệ seller được phép đổi:
     *   pending   → confirmed | cancelled
     *   confirmed → shipping
     */
    private void validateSellerStatusTransition(String current, String next) {
        if (next == null || next.isBlank())
            throw new RuntimeException("Trạng thái mới không được để trống");
        boolean valid = switch (current) {
            case "pending"   -> next.equals("confirmed") || next.equals("cancelled");
            case "confirmed" -> next.equals("shipping");
            default -> false;
        };
        if (!valid)
            throw new RuntimeException(
                    "Không thể chuyển trạng thái từ '" + current + "' sang '" + next + "'");
    }

    // =========================================================================
    // SELLER — thống kê
    // =========================================================================

    public SellerOrderStatsDTO getOrderStatsBySellerUserId(String userId, String token) {
        String storeId = getStoreIdByUserId(userId, token);
        List<Order> all = orderRepository.findByStoreId(storeId);
        float revenue = all.stream()
                .filter(o -> "completed".equals(o.getStatus()) && "paid".equals(o.getPaymentStatus()))
                .map(Order::getPay).reduce(0f, Float::sum);
        return SellerOrderStatsDTO.builder()
                .totalRevenue(revenue)
                .totalOrders(all.size())
                .pendingCount(  countByStatus(all, "pending"))
                .confirmedCount(countByStatus(all, "confirmed"))
                .shippingCount( countByStatus(all, "shipping"))
                .deliveredCount(countByStatus(all, "delivered"))
                .completedCount(countByStatus(all, "completed"))
                .cancelledCount(countByStatus(all, "cancelled"))
                .build();
    }

    private long countByStatus(List<Order> orders, String status) {
        return orders.stream().filter(o -> status.equals(o.getStatus())).count();
    }

    // =========================================================================
    // SELLER — lịch sử trạng thái (OrderFlow)
    // =========================================================================

    public List<OrderFlowDTO> getOrderFlow(Integer orderId, String userId, String token) {
        String storeId = getStoreIdByUserId(userId, token);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        if (!storeId.equals(order.getStoreId()))
            throw new RuntimeException("Đơn hàng không thuộc shop của bạn");
        return orderFlowRepository.findByOrderIdOrderByCreatedAtDesc(String.valueOf(orderId))
                .stream().map(f -> OrderFlowDTO.builder()
                        .id(f.getId()).orderId(f.getOrderId()).status(f.getStatus())
                        .note(f.getNote()).createdBy(f.getCreatedBy())
                        .createdAt(f.getCreatedAt() != null ? f.getCreatedAt().toString() : null)
                        .build())
                .collect(Collectors.toList());
    }

    /** Ghi 1 bản ghi OrderFlow mỗi khi trạng thái thay đổi */
    private void saveOrderFlow(String orderId, String status, String createdBy, String note) {
        orderFlowRepository.save(OrderFlow.builder()
                .orderId(orderId)
                .status(status)
                .note(note != null ? note : "")
                .createdBy(createdBy)
                .build());
    }

    // =========================================================================
    // BUYER — tạo yêu cầu hoàn trả
    // =========================================================================

    /**
     * Buyer tạo yêu cầu hoàn trả.
     * Điều kiện: đơn phải ở trạng thái "delivered".
     */
    @Transactional
    public OrderRefundDTO createRefund(OrderRefundRequestDTO request, String userId) {
        Order order = orderRepository.findById(Integer.valueOf(request.getOrderId()))
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        if (!order.getUserId().equals(userId))
            throw new RuntimeException("Không có quyền tạo hoàn trả cho đơn này");
        if (!"delivered".equals(order.getStatus()))
            throw new RuntimeException("Chỉ có thể yêu cầu hoàn trả khi đơn đã giao");
        orderRefundRepository.findByOrderIdAndStatus(request.getOrderId(), "pending")
                .ifPresent(r -> { throw new RuntimeException("Đơn này đã có yêu cầu hoàn trả đang xử lý"); });

        OrderRefund refund = orderRefundRepository.save(OrderRefund.builder()
                .orderId(request.getOrderId())
                .title(request.getTitle())
                .description(request.getDescription())
                .status("pending")
                .createdBy(userId)
                .build());

        List<ProductOrderRefund> refundItems = new ArrayList<>();
        if (request.getProducts() != null) {
            for (OrderRefundRequestDTO.ProductRefundItemDTO item : request.getProducts()) {
                refundItems.add(productOrderRefundRepository.save(ProductOrderRefund.builder()
                        .orderRefundId(refund.getId())
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .description(item.getDescription())
                        .build()));
            }
        }
        return toOrderRefundDTO(refund, refundItems);
    }

    // =========================================================================
    // SELLER — xử lý yêu cầu hoàn trả
    // =========================================================================

    /**
     * Seller duyệt (approved) hoặc từ chối (rejected) yêu cầu hoàn trả.
     * Nếu approved → đơn hàng chuyển sang "refunded".
     */
    @Transactional
    public OrderRefundDTO reviewRefund(String refundId, OrderRefundReviewDTO reviewDTO, String userId, String token) {
        String storeId = getStoreIdByUserId(userId, token);
        OrderRefund refund = orderRefundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu hoàn trả không tồn tại"));
        if (!"pending".equals(refund.getStatus()))
            throw new RuntimeException("Yêu cầu hoàn trả này đã được xử lý rồi");

        Order order = orderRepository.findById(Integer.valueOf(refund.getOrderId()))
                .orElseThrow(() -> new RuntimeException("Đơn hàng liên quan không tồn tại"));
        if (!storeId.equals(order.getStoreId()))
            throw new RuntimeException("Yêu cầu hoàn trả không thuộc shop của bạn");

        String newStatus = reviewDTO.getStatus();
        if (!newStatus.equals("approved") && !newStatus.equals("rejected"))
            throw new RuntimeException("Trạng thái không hợp lệ: chỉ chấp nhận approved hoặc rejected");

        refund.setStatus(newStatus);
        orderRefundRepository.save(refund);

        if ("approved".equals(newStatus)) {
            order.setStatus("refunded");
            order.setUpdateAt(LocalDateTime.now());
            orderRepository.save(order);
            saveOrderFlow(String.valueOf(order.getId()), "refunded", storeId,
                    reviewDTO.getNote() != null ? reviewDTO.getNote() : "Seller chấp nhận hoàn trả");
        }

        List<ProductOrderRefund> items = productOrderRefundRepository.findByOrderRefundId(refundId);
        return toOrderRefundDTO(refund, items);
    }

    /** Seller lấy danh sách yêu cầu hoàn trả của shop */
    public List<OrderRefundDTO> getRefundsByStore(String userId, String status, String token) {
        String storeId = getStoreIdByUserId(userId, token);
        List<String> orderIds = orderRepository.findByStoreId(storeId)
                .stream().map(o -> String.valueOf(o.getId())).collect(Collectors.toList());

        List<OrderRefundDTO> result = new ArrayList<>();
        for (String orderId : orderIds) {
            orderRefundRepository.findByOrderId(orderId).ifPresent(refund -> {
                if (status == null || status.isBlank() || status.equals(refund.getStatus())) {
                    List<ProductOrderRefund> items =
                            productOrderRefundRepository.findByOrderRefundId(refund.getId());
                    result.add(toOrderRefundDTO(refund, items));
                }
            });
        }
        return result;
    }

    // =========================================================================
    // toDTO helpers — Refund & Flow
    // =========================================================================

    private OrderRefundDTO toOrderRefundDTO(OrderRefund refund, List<ProductOrderRefund> items) {
        List<ProductOrderRefundDTO> itemDTOs = items.stream()
                .map(i -> ProductOrderRefundDTO.builder()
                        .id(i.getId()).orderRefundId(i.getOrderRefundId())
                        .productId(i.getProductId()).quantity(i.getQuantity())
                        .description(i.getDescription()).build())
                .collect(Collectors.toList());
        return OrderRefundDTO.builder()
                .id(refund.getId()).orderId(refund.getOrderId())
                .status(refund.getStatus()).title(refund.getTitle())
                .description(refund.getDescription()).createdBy(refund.getCreatedBy())
                .createdAt(refund.getCreatedAt() != null ? refund.getCreatedAt().toString() : null)
                .products(itemDTOs).build();
    }

    @Scheduled(fixedDelay = 30_000)
    @Transactional
    public void autoAdvanceOrderStatus() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(1);

        // shipping → delivered
        List<Order> shippingOrders = orderRepository.findByStatusAndUpdateAtBefore("shipping", cutoff);
        for (Order order : shippingOrders) {
            order.setStatus("delivered");
            order.setUpdateAt(LocalDateTime.now());
            if ("COD".equals(order.getPaymentMethod())) {
                order.setPaymentStatus("paid");
            }
            orderRepository.save(order);
            saveOrderFlow(String.valueOf(order.getId()), "delivered", "system",
                    "Tự động xác nhận giao hàng thành công");
        }

        // delivered → completed
        List<Order> deliveredOrders = orderRepository.findByStatusAndUpdateAtBefore("delivered", cutoff);
        for (Order order : deliveredOrders) {
            order.setStatus("completed");
            order.setUpdateAt(LocalDateTime.now());
            orderRepository.save(order);

            // Tính phí sàn 5% và gọi sang store-service
            double grossAmount = order.getPay();
            double commissionFee = grossAmount * 0.05;
            double netAmount = grossAmount - commissionFee;

            // Lưu settlement record
            Settlement settlement = settlementRepository.save(Settlement.builder()
                    .orderId(String.valueOf(order.getId()))
                    .storeId(order.getStoreId())
                    .grossAmount(grossAmount)
                    .commissionFee(commissionFee)
                    .netAmount(netAmount)
                    .status("PENDING")
                    .createdBy("system")
                    .build());

            // Gọi API sang store-service để cộng pending balance
            try {
                String url = STORE_SERVICE_BASE_URL + "/wallet/store/"
                        + order.getStoreId() + "/credit-pending"
                        + "?amount=" + netAmount
                        + "&referenceId=" + order.getId();
                restTemplate.postForEntity(url, null, Void.class);
                settlement.setStatus("CREDITED");
                settlement.setUpdateAt(LocalDateTime.now());
                settlementRepository.save(settlement);
            } catch (Exception e) {
                log.error("Failed to credit wallet for order {}: {}", order.getId(), e.getMessage());
            }

            saveOrderFlow(String.valueOf(order.getId()), "completed", "system",
                    "Tự động hoàn tất đơn hàng");
        }
    }

    @Scheduled(fixedDelay = 60_000) // chạy mỗi 60 giây
    @Transactional
    public void releasePendingSettlements() {
        // Sau 3 ngày mới release → seller mới rút được tiền
        // Đổi minusDays(3) thành minusMinutes(2) nếu muốn test nhanh
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(2);

        List<Settlement> pendingList = settlementRepository
                .findByStatusAndCreatedAtBefore("CREDITED", cutoff);

        for (Settlement s : pendingList) {
            try {
                String url = STORE_SERVICE_BASE_URL + "/wallet/store/"
                        + s.getStoreId() + "/release-pending"
                        + "?amount=" + s.getNetAmount()
                        + "&referenceId=" + s.getId();
                restTemplate.postForEntity(url, null, Void.class);

                s.setStatus("SETTLED");
                s.setSettledAt(LocalDateTime.now());
                s.setUpdatedBy("system");
                settlementRepository.save(s);

                log.info("Released settlement {} for store {}, amount {}",
                        s.getId(), s.getStoreId(), s.getNetAmount());
            } catch (Exception e) {
                // Giữ nguyên PENDING, vòng sau 60s sẽ retry tự động
                log.error("Failed to release settlement {}: {}", s.getId(), e.getMessage());
            }
        }
    }

    // =========================================================================
    // LIVESTREAM — thống kê đơn hàng
    // =========================================================================

    public java.util.Map<String, Object> getLivestreamStats(Long livestreamRoomId) {
        long totalOrders = orderRepository.countByLivestreamRoomId(livestreamRoomId);
        List<Order> orders = orderRepository.findByLivestreamRoomId(livestreamRoomId);

        // Tính tổng doanh thu của các đơn hàng KHÔNG bị hủy
        float totalRevenue = orders.stream()
                .filter(o -> !"cancelled".equals(o.getStatus()))
                .map(Order::getPay)
                .reduce(0f, Float::sum);

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        return stats;
    }
}
