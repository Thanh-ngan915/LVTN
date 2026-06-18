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
import java.util.Map;
import java.util.stream.Collectors;
import java.sql.Timestamp;
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
    public Page<ProductDTO> getProductsByStore(String storeId, Pageable pageable) {
        return productRepository.findAllActiveByStore(storeId, pageable).map(this::toDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByStoreAndCategory(String storeId, String category, Pageable pageable) {
        return productRepository.findAllActiveByStoreAndCategory(storeId, category, pageable).map(this::toDTO);
    }

    @Override
    public Page<ProductDTO> searchProductsByStore(String storeId, String keyword, Pageable pageable) {
        return productRepository.searchByStoreAndName(storeId, keyword, pageable).map(this::toDTO);
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
                .createdBy(product.getCreatedBy())
                .updatedBy(product.getUpdatedBy())
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

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryShortname())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Product product = Product.builder()
                .name(productDTO.getName())
                .priceBefore(productDTO.getPriceBefore())
                .priceAfter(productDTO.getPriceAfter())
                .initQuantity(productDTO.getInitQuantity())
                .currentQuantity(productDTO.getInitQuantity())
                .description(productDTO.getDescription())
                .storeId(productDTO.getStoreId())
                .categoryEntity(category)
                .status("pending")
                .sold(0)
                .isDelete(false)
                .createdBy(productDTO.getCreatedBy())
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .updatedBy(productDTO.getCreatedBy())
                .updateAt(new Timestamp(System.currentTimeMillis()))
                .build();

        if (productDTO.getImageUrls() != null) {
            if (productDTO.getImageUrls().size() > 5) {
                throw new RuntimeException("Tối đa 5 ảnh cho mỗi sản phẩm");
            }
            java.util.Set<ProductImage> images = productDTO.getImageUrls().stream()
                    .map(url -> ProductImage.builder()
                            .id(java.util.UUID.randomUUID().toString())
                            .url(url)
                            .product(product)
                            .build())
                    .collect(Collectors.toSet());
            product.setImages(images);
        }

        return toDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Integer id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        if (dto.getCategoryShortname() != null) {
            Category category = categoryRepository.findById(dto.getCategoryShortname())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategoryEntity(category);
        }
        product.setName(dto.getName());
        product.setPriceBefore(dto.getPriceBefore());
        product.setPriceAfter(dto.getPriceAfter());
        product.setInitQuantity(dto.getInitQuantity());
        product.setDescription(dto.getDescription());
        product.setUpdatedBy(dto.getUpdatedBy());
        List<String> allowedStatus = List.of("pending", "inactive");
        if (allowedStatus.contains(dto.getStatus())) {
            product.setStatus(dto.getStatus());
        }
        product.setUpdateAt(new Timestamp(System.currentTimeMillis()));
        int sold = product.getSold() != null ? product.getSold() : 0;
        product.setCurrentQuantity(dto.getInitQuantity() - sold);

        if (dto.getImageUrls() != null) {
            if (dto.getImageUrls().size() > 5) {
                throw new RuntimeException("Tối đa 5 ảnh cho mỗi sản phẩm");
            }
            if (product.getImages() == null) {
                product.setImages(new java.util.HashSet<>());
            }
            product.getImages().clear();

            java.util.Set<ProductImage> images = dto.getImageUrls().stream()
                    .map(url -> ProductImage.builder()
                            .id(java.util.UUID.randomUUID().toString())
                            .url(url)
                            .product(product)
                            .build())
                    .collect(Collectors.toSet());

            product.getImages().addAll(images);
        }

        return toDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        product.setIsDelete(true); // soft delete
        product.setUpdateAt(new Timestamp(System.currentTimeMillis()));
        productRepository.save(product);
    }

    @Override
    @Transactional
    public ProductDTO restockProduct(Integer id, Integer additionalQuantity, String updatedBy) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        int currentInit = product.getInitQuantity() != null ? product.getInitQuantity() : 0;
        int currentSold = product.getSold() != null ? product.getSold() : 0;

        product.setInitQuantity(currentInit + additionalQuantity);  // cộng dồn
        product.setCurrentQuantity(currentInit + additionalQuantity - currentSold); // tính lại
        product.setUpdatedBy(updatedBy);
        product.setUpdateAt(new Timestamp(System.currentTimeMillis()));

        return toDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductDTO restoreProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        if (!Boolean.TRUE.equals(product.getIsDelete())) {
            throw new RuntimeException("Sản phẩm chưa bị xóa");
        }
        product.setIsDelete(false);
        product.setStatus("pending"); // về pending, chờ admin duyệt lại
        product.setUpdateAt(new Timestamp(System.currentTimeMillis()));
        return toDTO(productRepository.save(product));
    }

    @Override
    public Page<ProductDTO> getDeletedProductsByStore(String storeId, Pageable pageable) {
        return productRepository.findAllDeletedByStore(storeId, pageable).map(this::toDTO);
    }

    @Override
    public Map<String, Object> getProductStats() {
        long total = productRepository.countAllActive();
        long pending = productRepository.countByStatus("pending");
        long active = productRepository.countByStatus("active");
        long inactive = productRepository.countByStatus("inactive");

        return Map.of(
                "total", total,
                "pending", pending,
                "active", active,
                "inactive", inactive
        );
    }

    @Override
    @Transactional
    public ProductDTO approveProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        if (!"pending".equals(product.getStatus())) {
            throw new RuntimeException("Sản phẩm không ở trạng thái chờ duyệt");
        }
        product.setStatus("active");
        product.setUpdateAt(new Timestamp(System.currentTimeMillis()));
        return toDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductDTO rejectProduct(Integer id, String reason) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        if (!"pending".equals(product.getStatus())) {
            throw new RuntimeException("Sản phẩm không ở trạng thái chờ duyệt");
        }
        product.setStatus("inactive");
        product.setUpdateAt(new Timestamp(System.currentTimeMillis()));
        return toDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductDTO hideProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        product.setStatus("inactive");
        product.setUpdateAt(new Timestamp(System.currentTimeMillis()));
        return toDTO(productRepository.save(product));
    }
}
