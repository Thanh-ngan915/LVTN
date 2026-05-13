package org.example.productservice.service;

import org.example.productservice.dto.CategoryDTO;
import org.example.productservice.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<ProductDTO> getAllProducts(Pageable pageable);
    Page<ProductDTO> getProductsByCategory(String category, Pageable pageable);
    Page<ProductDTO> searchProducts(String keyword, Pageable pageable);
    ProductDTO getProductById(Integer id);
    List<CategoryDTO> getAllCategories();
    Page<ProductDTO> getProductsByStore(String storeId, Pageable pageable);
    Page<ProductDTO> getProductsByStoreAndCategory(String storeId, String category, Pageable pageable);
    Page<ProductDTO> searchProductsByStore(String storeId, String keyword, Pageable pageable);
    ProductDTO createProduct(ProductDTO dto);
    ProductDTO updateProduct(Integer id, ProductDTO dto);
    void deleteProduct(Integer id);
    ProductDTO restockProduct(Integer id, Integer additionalQuantity, String updatedBy);
    ProductDTO restoreProduct(Integer id);
    Page<ProductDTO> getDeletedProductsByStore(String storeId, Pageable pageable);
}
