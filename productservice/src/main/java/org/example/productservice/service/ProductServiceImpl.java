package org.example.productservice.service;

import org.example.productservice.dto.CategoryDTO;
import org.example.productservice.dto.ProductDTO;
import org.example.productservice.model.Category;
import org.example.productservice.model.Product;
import org.example.productservice.model.ProductImage;
import org.example.productservice.model.ProductVariant;
import org.example.productservice.repository.CategoryRepository;
import org.example.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAllActive(pageable).map(this::toDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findAllActiveByCategory(category, pageable).map(this::toDTO);
    }

    @Override
    public Page<ProductDTO> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchByName(keyword, pageable).map(this::toDTO);
    }

    @Override
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return toDTO(product);
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toCategoryDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO toDTO(Product product) {
        List<String> imageUrls = product.getImages() != null
                ? product.getImages().stream()
                    .map(ProductImage::getUrl)
                    .collect(Collectors.toList())
                : Collections.emptyList();

        List<ProductDTO.VariantDTO> variants = product.getVariants() != null
                ? product.getVariants().stream()
                    .map(this::toVariantDTO)
                    .collect(Collectors.toList())
                : Collections.emptyList();

        String categoryName = null;
        if (product.getCategoryEntity() != null) {
            categoryName = product.getCategoryEntity().getName();
        }

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .priceBefore(product.getPriceBefore())
                .priceAfter(product.getPriceAfter())
                .initQuantity(product.getInitQuantity())
                .currentQuantity(product.getCurrentQuantity())
                .sold(product.getSold())
                .description(product.getDescription())
                .status(product.getStatus())
                .categoryShortname(product.getCategoryShortname())
                .categoryName(categoryName)
                .storeId(product.getStoreId())
                .rate(product.getRate())
                .imageUrls(imageUrls)
                .variants(variants)
                .build();
    }

    private ProductDTO.VariantDTO toVariantDTO(ProductVariant variant) {
        return ProductDTO.VariantDTO.builder()
                .id(variant.getId())
                .size(variant.getSize())
                .color(variant.getColor())
                .priceBefore(variant.getPriceBefore())
                .priceAfter(variant.getPriceAfter())
                .currentQuantity(variant.getCurrentQuantity())
                .sold(variant.getSold())
                .sku(variant.getSku())
                .build();
    }

    private CategoryDTO toCategoryDTO(Category category) {
        return CategoryDTO.builder()
                .shortname(category.getShortname())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
