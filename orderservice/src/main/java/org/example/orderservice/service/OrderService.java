package org.example.orderservice.service;

import lombok.RequiredArgsConstructor;
import org.example.orderservice.dto.*;
import org.example.orderservice.entity.*;
import org.example.orderservice.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        int qty = request.getQuantity() != null ? request.getQuantity() : 1;
        float priceAfter = request.getProductPriceAfter() != null ? request.getProductPriceAfter() : 0f;
        float priceBefore = request.getProductPriceBefore() != null ? request.getProductPriceBefore() : priceAfter;
        float total = priceAfter * qty;
        float discount = 0f;

        // 3. Áp dụng voucher nếu có
        Voucher voucher = null;
        if (request.getVoucherId() != null) {
            voucher = voucherRepository.findById(request.getVoucherId()).orElse(null);
            if (voucher != null && "active".equals(voucher.getStatus())) {
                float minOrder = voucher.getMinOrderValue() != null ? voucher.getMinOrderValue() : 0f;
                if (total >= minOrder) {
                    String discountType = voucher.getEffectiveDiscountType();
                    Float discountValue = voucher.getEffectiveDiscountValue();
                    Float maxDiscount = voucher.getEffectiveMaxDiscount();
                    if ("PERCENT".equals(discountType)) {
                        discount = total * (discountValue / 100f);
                        if (maxDiscount != null && discount > maxDiscount) {
                            discount = maxDiscount;
                        }
                    } else { // FIXED
                        discount = discountValue != null ? discountValue : 0f;
                    }
                    // Update voucher used count
                    int usedCount = voucher.getUsedCount() != null ? voucher.getUsedCount() : 0;
                    voucher.setUsedCount(usedCount + 1);
                    if (voucher.getQuantity() != null && voucher.getUsedCount() >= voucher.getQuantity()) {
                        voucher.setStatus("inactive");
                    }
                    voucherRepository.save(voucher);
                }
            }
        }

        float pay = Math.max(0f, total - discount);

        // 4. Tạo đơn hàng
        Order order = Order.builder()
                .userId(userId)
                .storeId(request.getStoreId())
                .total(total)
                .discount(discount)
                .pay(pay)
                .voucherId(voucher != null ? voucher.getId() : null)
                .deliveryInformationId(delivery.getId())
                .status("pending")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
                .paymentStatus("pending")
                .build();
        order = orderRepository.save(order);

        // 5. Tạo product order item
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
        productOrderRepository.save(productOrder);

        return toOrderResponseDTO(order, delivery, List.of(productOrder));
    }

    /**
     * Lấy danh sách voucher của shop
     */
    public List<VoucherDTO> getVouchersByStore(String storeId) {
        List<Voucher> vouchers = voucherRepository
                .findByStoreIdAndStatusAndEndDateAfter(storeId, "active", LocalDateTime.now());
        return vouchers.stream().map(this::toVoucherDTO).collect(Collectors.toList());
    }

    /**
     * Lấy địa chỉ mặc định của user
     */
    public DeliveryInformationDTO getDefaultDelivery(String userId) {
        return deliveryInformationRepository.findByUserIdAndIsDefaultTrue(userId)
                .map(this::toDeliveryDTO)
                .orElse(null);
    }

    /**
     * Lấy danh sách địa chỉ của user
     */
    public List<DeliveryInformationDTO> getDeliveriesByUser(String userId) {
        return deliveryInformationRepository.findByUserId(userId)
                .stream().map(this::toDeliveryDTO).collect(Collectors.toList());
    }

    /**
     * Lấy thông tin đơn hàng theo ID
     */
    public OrderResponseDTO getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        DeliveryInformation delivery = deliveryInformationRepository
                .findById(order.getDeliveryInformationId()).orElse(null);
        List<ProductOrder> items = productOrderRepository.findByOrderId(orderId);
        return toOrderResponseDTO(order, delivery, items);
    }

    /**
     * Lấy danh sách đơn hàng của user
     */
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

    // ---- Helpers ----

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

        // Lookup voucher info if present
        OrderResponseDTO.VoucherInfoDTO voucherInfo = null;
        if (order.getVoucherId() != null) {
            Voucher v = voucherRepository.findById(order.getVoucherId()).orElse(null);
            if (v != null) {
                voucherInfo = OrderResponseDTO.VoucherInfoDTO.builder()
                        .id(v.getId())
                        .code(v.getCode())
                        .name(v.getName() != null ? v.getName() : v.getTitle())
                        .discountType(v.getEffectiveDiscountType())
                        .discountValue(v.getEffectiveDiscountValue())
                        .maxDiscount(v.getEffectiveMaxDiscount())
                        .build();
            }
        }

        // Compute shipping fee (free for orders >= 500000)
        float shippingFee = order.getTotal() >= 500000f ? 0f : SHIPPING_FEE;

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .storeId(order.getStoreId())
                .total(order.getTotal())
                .discount(order.getDiscount())
                .pay(order.getPay())
                .shippingFee(shippingFee)
                .voucherId(order.getVoucherId())
                .deliveryInformationId(order.getDeliveryInformationId())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null)
                .deliveryInformation(delivery != null ? toDeliveryDTO(delivery) : null)
                .voucherInfo(voucherInfo)
                .items(itemDTOs)
                .build();
    }

    private VoucherDTO toVoucherDTO(Voucher v) {
        return VoucherDTO.builder()
                .id(v.getId())
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
