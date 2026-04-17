package com.example.productservice.service;

import com.example.productservice.dto.ProductRequestDTO;
import com.example.productservice.model.Product;
import com.example.productservice.model.ProductVariant;
import com.example.productservice.repository.AttributeRepository;
import com.example.productservice.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private AttributeRepository attributeRepository;

    @Transactional
    public Product saveProduct(ProductRequestDTO dto) {
        // 1. Tạo đối tượng Product từ DTO
        Product product = new Product();
        product.setId(UUID.randomUUID().toString().substring(0, 8)); // Tạo ID ngẫu nhiên 8 ký tự
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPriceAfter(dto.getPrice());
        product.setCurrentQuantity(dto.getQuantity());

        // 2. Xử lý Biến thể (Variants)
        if (dto.getVariants() != null) {
            List<ProductVariant> variants = dto.getVariants().stream().map(vDto -> {
                ProductVariant variant = new ProductVariant();
                variant.setSku(vDto.getSku());
                variant.setPrice(vDto.getPrice());
                variant.setStockQuantity(vDto.getStock());
                variant.setProduct(product); // Nối con vào cha
                return variant;
            }).collect(Collectors.toList());

            product.setVariants(variants);
        }

        // 3. Lưu tất cả xuống DB (Nhờ CascadeType.ALL nên chỉ cần lưu product)
        return productRepository.save(product);
    }
}