package org.example.orderservice.service;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.entity.*;
import org.example.orderservice.repository.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductOrderRepository productOrderRepository;
    private final DeliveryInformationRepository deliveryInformationRepository;
    private final VoucherRepository voucherRepository;
    private final RatingRepository ratingRepository;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String STORE_SERVICE_URL = "http://localhost:8090/api/vouchers";

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
        float pay = Math.max(0f, total - totalDiscount);

        // 6. Tạo đơn hàng
        Order order = Order.builder()
                .userId(userId)
                .storeId(request.getStoreId())
                .total(total)
                .discount(totalDiscount)
                .pay(pay)
                .voucherId(platformVoucher != null ? platformVoucher.getId() : null)
                .shopVoucherId(shopVoucherDTO != null ? shopVoucherDTO.getId() : null)
                .shopDiscount(shopDiscount)
                .deliveryInformationId(delivery.getId())
                .status("pending")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
                .paymentStatus("pending")
                .build();
        order = orderRepository.save(order);

        // 7. Tạo product order item
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
        DeliveryInformation delivery = deliveryInformationRepository
                .findById(order.getDeliveryInformationId()).orElse(null);
        List<ProductOrder> items = productOrderRepository.findByOrderId(orderId);
        return toOrderResponseDTO(order, delivery, items);
    }

    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        List<OrderResponseDTO> result = new ArrayList<>();
        for (Order order : orders) {
            DeliveryInformation delivery = deliveryInformationRepository
                    .findById(order.getDeliveryInformationId()).orElse(null);
            List<ProductOrder> items = productOrderRepository.findByOrderId(order.getId());
            result.add(toOrderResponseDTO(order, delivery, items));
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

        DeliveryInformation delivery = deliveryInformationRepository
                .findById(order.getDeliveryInformationId()).orElse(null);
        List<ProductOrder> items = productOrderRepository.findByOrderId(orderId);
        return toOrderResponseDTO(order, delivery, items);
    }

    private static final float SHIPPING_FEE = 30000f;

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

        float shippingFee = order.getTotal() >= 500000f ? 0f : SHIPPING_FEE;
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
}
