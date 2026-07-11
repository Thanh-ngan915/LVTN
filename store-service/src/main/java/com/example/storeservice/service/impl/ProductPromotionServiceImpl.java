package com.example.storeservice.service.impl;

import com.example.storeservice.client.ProductClient;
import com.example.storeservice.dto.*;
import com.example.storeservice.entity.*;
import com.example.storeservice.repository.*;
import com.example.storeservice.service.ProductPromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductPromotionServiceImpl implements ProductPromotionService {

    private final ProductPromotionRepository productPromotionRepository;
    private final SalePromotionRepository salePromotionRepository;
    private final StoreSalePromotionRepository storeSalePromotionRepository;
    private final StoreRepository storeRepository;
    private final ProductClient productClient;

    @Transactional
    public ProductPromotionDTO addProductToPromotion(
            String userId, String storeId, String salePromotionId,
            ProductPromotionRequestDTO request, String accessToken) {

        // Kiểm tra store owner
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền thực hiện thao tác này");
        }

        // Kiểm tra KM thuộc store này không
        storeSalePromotionRepository.findByStoreIdAndSalePromotionId(storeId, salePromotionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương trình KM"));

        // Kiểm tra KM còn hiệu lực không
        SalePromotion promotion = salePromotionRepository.findById(salePromotionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KM"));
        if (promotion.getStatus() == 0) {
            throw new RuntimeException("Chương trình KM không còn hiệu lực");
        }

        // Kiểm tra sản phẩm đã đăng ký KM này chưa
        if (productPromotionRepository.existsByProductIdAndSalePromotionIdAndIsDelete(
                request.getProductId(), salePromotionId, false)) {
            throw new RuntimeException("Sản phẩm đã được đăng ký vào KM này");
        }

        // Kiểm tra trùng lặp thời gian với các KM khác của cùng sản phẩm
        long overlappingCount = productPromotionRepository.countOverlappingPromotions(
                request.getProductId(), promotion.getStartDate(), promotion.getEndDate(), salePromotionId);
        if (overlappingCount > 0) {
            throw new RuntimeException("Sản phẩm đang tham gia một chương trình khuyến mãi khác trong cùng khoảng thời gian");
        }

        // Validate giá KM
        if (request.getPriceAfter() <= 0) {
            throw new RuntimeException("Giá KM phải lớn hơn 0");
        }
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Số lượng phải lớn hơn 0");
        }

        // Lấy thông tin sản phẩm từ Product service
        ProductDTO product = productClient.getProductById(request.getProductId(), accessToken);
        if (!product.getStoreId().equals(storeId)) {
            throw new RuntimeException("Sản phẩm không thuộc store này");
        }
        if (request.getPriceAfter() >= product.getPriceBefore()) {
            throw new RuntimeException("Giá KM phải nhỏ hơn giá gốc");
        }

        ProductPromotion pp = ProductPromotion.builder()
                .id(UUID.randomUUID().toString())
                .productId(request.getProductId())
                .salePromotionId(salePromotionId)
                .name(product.getName())
                .image(product.getImageUrls() != null && !product.getImageUrls().isEmpty() ? product.getImageUrls().get(0) : null)
                .priceAfter(request.getPriceAfter())
                .quantity(request.getQuantity())
                .bought(0)
                .isDelete(false)
                .createdBy(userId)
                .updatedBy(userId)
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();
        return toDTO(productPromotionRepository.save(pp));
    }

    public List<ProductPromotionDTO> getProductsByPromotion(String salePromotionId) {
        return productPromotionRepository
                .findBySalePromotionIdAndIsDelete(salePromotionId, false)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void removeProductFromPromotion(String userId, String storeId, String id) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Shop không tồn tại"));
        if (!store.getCreatedBy().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền thực hiện thao tác này");
        }

        ProductPromotion pp = productPromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm KM"));

        pp.setIsDelete(true);
        pp.setUpdatedBy(userId);
        pp.setUpdateAt(LocalDateTime.now());
        productPromotionRepository.save(pp);
    }

    private ProductPromotionDTO toDTO(ProductPromotion pp) {
        return ProductPromotionDTO.builder()
                .id(pp.getId())
                .productId(pp.getProductId())
                .salePromotionId(pp.getSalePromotionId())
                .name(pp.getName())
                .image(pp.getImage())
                .priceAfter(pp.getPriceAfter())
                .quantity(pp.getQuantity())
                .bought(pp.getBought())
                .isDelete(pp.getIsDelete())
                .build();
    }
}